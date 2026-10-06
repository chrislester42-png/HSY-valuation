#!/usr/bin/env python3
"""
workbook_to_data.py

Read the team's Q&D workbook and write site/data/financials.js, the file every
interactive section of the site reads its numbers from.

    python3 scripts/workbook_to_data.py                 # finds the one .xlsx in workbook/
    python3 scripts/workbook_to_data.py workbook/QD.xlsx

What it reads
- "Detail Data" tab: rows are found by their label in column A, so the annual
  layout (2024A, 2025A, 2026F, ...) and the quarterly layout (2025A, Q12026A,
  ..., 2026A, ..., 2027F, ...) both work. Only annual columns are exported.
- "WACC calculation" tab, if present: market risk premium, risk-free rate, beta,
  cost of debt, cost of equity, WACC.
- "DCF 1-Pager" tab, if present: discount rate, long-term growth, exit multiple,
  midyear flag, valuation date, the stub fraction, the forecast years it discounts
  (cash flow lines, discount dates, present values), both terminal values, the bridge
  to equity value per share, and its two sensitivity tables, all as the sheet
  calculated them (so the site can prove it matches the workbook).

It reads the values Excel last calculated, so save the workbook from Excel
before running. If a cell shows None here, Excel has not calculated it yet.

It never writes to the workbook.
"""
from __future__ import annotations

import datetime as dt
import json
import re
import sys
from pathlib import Path

try:
    import openpyxl
except ImportError:  # pragma: no cover
    sys.exit("openpyxl is missing. Run: pip install openpyxl")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "data" / "financials.js"

# label in column A (regex, case-insensitive) -> key in the output
ROWS = {
    "revenue": r"^Revenue \(t\)",
    "costOfSales": r"^Cost of Sales",
    "ebit": r"^EBIT \(",
    "netIncome": r"^Net Income \(t\)",
    "interestExpense": r"^Interest Expense",
    "incomeTaxes": r"^Income Taxes",
    "ebitda": r"^EBITDA$",
    "cash": r"^CASH & MKTBLE",
    "totalAssets": r"^Total Assets",
    "currentAssets": r"^Current Assets",
    "currentLiabilities": r"^Current Liabilities",
    "longTermDebt": r"^Long Term Debt",
    "equity": r"^Equity$",
    "cfo": r"^CASH FROM OPERATING",
    "da": r"^Depreciation \+ Amort",
    "changeInNwc": r"^Change in NWC",
    "capex": r"^Capital Expenditures",
    "fcff": r"^Free Cash Flow to the Firm",
    "fcfe": r"^Free Cash Flow to Equity",
    "fcf": r"^FREE CASH FLOW$",
    "dilutedShares": r"^FD Shares",
}

WACC_CELLS = {  # label in column B or C -> key
    "marketRiskPremium": r"Market Risk Premium",
    "riskFree": r"^Rf$",
    "beta": r"^Beta$",
    "costOfEquity": r"^Cost of Equity$",
    "costOfDebt": r"^Cost of Debt$",
    "taxRate": r"^Tax rate$",
    "wacc": r"^WACC$",
}


def find_workbook(arg: str | None) -> Path:
    if arg:
        return Path(arg)
    files = sorted((ROOT / "workbook").glob("*.xlsx"))
    files = [f for f in files if not f.name.startswith("~$")]
    if len(files) != 1:
        sys.exit(f"Expected exactly one .xlsx in workbook/, found {len(files)}. Pass the path explicitly.")
    return files[0]


def header_row(ws) -> tuple[int, list[tuple[int, str]]]:
    """Return (row index, [(col, label)]) for the row holding period labels like 2025A."""
    for r in range(1, 6):
        cells = []
        for c in range(3, 20):
            v = ws.cell(r, c).value
            if isinstance(v, str) and re.fullmatch(r"(Q\d)?\d{4}[AFE]", v.strip()):
                cells.append((c, v.strip()))
        if len(cells) >= 3:
            return r, cells
    sys.exit("Could not find the period header row (labels like 2025A, 2026F) on Detail Data.")


def label_rows(ws, patterns: dict, col: int = 1, value_col: int | None = None) -> dict:
    """Map each pattern to the first row whose label matches. If value_col is given,
    prefer the first matching row that also holds a number in that column, so a
    section header ("Net debt") does not shadow the value row below it."""
    found = {}
    for r in range(1, ws.max_row + 1):
        v = ws.cell(r, col).value
        if not isinstance(v, str):
            continue
        text = v.strip()
        for key, pat in patterns.items():
            if key in found or not re.search(pat, text, re.IGNORECASE):
                continue
            if value_col is not None and num(ws.cell(r, value_col).value) is None:
                continue
            found[key] = r
    return found


def num(v):
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return round(float(v), 6)
    return None



def read_dcf(d, periods) -> dict:
    """The DCF 1-Pager: inputs, the forecast it discounts, both terminal values, the bridge to
    equity value per share, and the two sensitivity tables, all as the sheet calculated them."""
    def val(r, c):
        return d.cell(r, c).value if r else None

    def find(pattern, cols=(2,), rows=None, nth=0):
        """Row and column of the nth cell in the given columns whose text matches pattern."""
        hits = []
        for r in (rows or range(1, d.max_row + 1)):
            for c in cols:
                v = d.cell(r, c).value
                if isinstance(v, str) and re.search(pattern, v.strip(), re.IGNORECASE):
                    hits.append((r, c))
        return hits[nth] if len(hits) > nth else (None, None)

    # Units: the sheet's header may say thousands while the numbers are in millions, so compare
    # the DCF tab's last actual revenue with Detail Data's and scale only if they differ by ~1000.
    rr, _ = find(r"^Revenue$")
    hr, _ = find(r"^Fiscal year ended")
    dscale = 1.0
    if rr and hr:
        for c in range(3, 12):
            lab, v = val(hr, c), num(val(rr, c))
            match = next((p for p in periods if p["label"] == lab), None)
            if v and match and match.get("revenue"):
                dscale = 1000.0 if v / match["revenue"] > 100 else 1.0
                break
    money = lambda v: None if num(v) is None else round(num(v) / dscale, 6)

    # inputs
    wr, wc = find(r"^Discount rate", cols=range(2, 12), rows=range(1, 15))
    mr, mc = find(r"^Midyear", cols=range(2, 12), rows=range(1, 15))
    vd_r, _ = find(r"^Valuation date")
    fy_r, _ = find(r"^Most recent fiscal year end")
    st_r, _ = find(r"^Portion of year 1")
    g_r, _ = find(r"^Long term growth rate$")
    mul_r, mul_c = find(r"^EBITDA multiple$", cols=range(3, 9))
    date = lambda v: v.isoformat()[:10] if isinstance(v, (dt.date, dt.datetime)) else None

    # the forecast it discounts: forecast columns of the FCFF block
    rows = {k: find(p)[0] for k, p in {
        "revenue": r"^Revenue$", "ebitda": r"^EBITDA$", "ebit": r"^EBIT$", "taxRate": r"^Tax rate$",
        "nopat": r"^NOPAT", "da": r"^Depreciation", "changeInNwc": r"^Changes in net working capital",
        "capex": r"^Capital expenditures", "date": r"^Date for discounting",
        "ufcf": r"^Unlevered free cash flows \(UFCF\) stub", "pv": r"^Present value of (of )?unlevered"}.items()}
    years = []
    if hr:
        for c in range(3, 12):
            lab = val(hr, c)
            if not (isinstance(lab, str) and lab.strip().upper().endswith("F")):
                continue
            y = {"label": lab.strip()}
            for k, r in rows.items():
                v = val(r, c)
                y[k] = date(v) if k == "date" else (num(v) if k == "taxRate" else money(v))
            years.append(y)

    # terminal value, both ways: growth in perpetuity in column C, exit multiple beside its labels
    def block(pattern, col):
        r, _ = find(pattern, cols=(2,) if col == 3 else range(3, 9))
        return r
    perp = {k: money(val(block(p, 3), 3)) for k, p in {
        "fcfNextYear": r"FCF x \(1\+g\)", "terminalValue": r"^Terminal value in", "pvTerminalValue": r"^Present value of terminal value",
        "pvStage1": r"^Present value of stage 1", "enterpriseValue": r"^Total enterprise value"}.items()}
    perp["tvShareOfEv"] = num(val(block(r"^Terminal value as % of TEV", 3), 3))
    perp["impliedExitMultiple"] = num(val(block(r"^Implied TV exit EBITDA multiple", 3), 3))
    ec = (mul_c + 4) if mul_c else 9  # the exit-multiple column sits four to the right of its labels
    exitm = {k: money(val(block(p, ec), ec)) for k, p in {
        "terminalEbitda": r"^Terminal year EBITDA", "terminalValue": r"^Terminal value in", "pvTerminalValue": r"^Present value of terminal value",
        "pvStage1": r"^Present value of stage 1", "enterpriseValue": r"^Enterprise value"}.items()}
    exitm["tvShareOfEv"] = num(val(block(r"^Terminal value as % of TEV", ec), ec))
    exitm["impliedGrowth"] = num(val(block(r"^Implied terminal growth rate", ec), ec))

    # bridge to equity value per share (the first "Valuation" block: perpetuity in C, multiple in D)
    nd_r, _ = find(r"^Net debt$", nth=1) if find(r"^Net debt$", nth=1)[0] else find(r"^Net debt$")
    debt_r, _ = find(r"^Debt$")
    cash_r, _ = find(r"^Cash")
    ev_r, _ = find(r"^Enterprise value$")
    eq_r, _ = find(r"^Equity value\s*$")
    sh_r, _ = find(r"^Shares outstanding$")
    ps_r, _ = find(r"^Equity value per share$")

    # sensitivity tables: a corner label, the column inputs on the next row, WACC down the left
    def table(pattern):
        r, c = find(pattern, cols=range(3, 20), rows=range(100, d.max_row + 1))
        if not r:
            return None
        hdr = r + 1
        cols = []
        for cc in range(c, c + 10):
            v = num(val(hdr, cc))
            if v is None:
                break
            cols.append(cc)
        out = {"columns": [num(val(hdr, cc)) for cc in cols], "rows": [], "values": []}
        rr2 = hdr + 1
        while num(val(rr2, c - 1)) is not None and rr2 < hdr + 12:
            out["rows"].append(num(val(rr2, c - 1)))
            out["values"].append([num(val(rr2, cc)) for cc in cols])
            rr2 += 1
        return out

    return {
        "units": "millions of dollars; shares in millions; per-share values in dollars",
        "scaleApplied": "/" + str(int(dscale)),
        "wacc": num(val(wr, wc + 2)) if wr else None,
        "longTermGrowth": num(val(g_r, 3)),
        "exitMultiple": num(val(mul_r, mul_c + 4)) if mul_r else None,
        "midyear": bool(num(val(mr, mc + 2))) if mr and num(val(mr, mc + 2)) is not None else None,
        "valuationDate": date(val(vd_r, 4)),
        "fiscalYearEnd": date(val(fy_r, 4)),
        "stubFraction": num(val(st_r, 4)),
        "years": years,
        "perpetuity": perp,
        "exitMultipleMethod": exitm,
        "debt": money(val(debt_r, 3)),
        "cash": money(val(cash_r, 3)),
        "netDebt": money(val(nd_r, 3)),
        "sharesOut": money(val(sh_r, 3)),
        "workbookResult": {
            "evPerpetuity": money(val(ev_r, 3)), "evExitMultiple": money(val(ev_r, 4)),
            "equityPerpetuity": money(val(eq_r, 3)), "equityExitMultiple": money(val(eq_r, 4)),
            "perSharePerpetuity": num(val(ps_r, 3)), "perShareExitMultiple": num(val(ps_r, 4)),
        },
        "sensitivity": {
            "perShareByGrowthAndWacc": table(r"^Long term growth rate \(g\)"),
            "perShareByMultipleAndWacc": table(r"^Exit EBITDA Multiple$"),
        },
    }

def main() -> None:
    path = find_workbook(sys.argv[1] if len(sys.argv) > 1 else None)
    import zipfile
    with zipfile.ZipFile(path) as _z:
        if 'fullCalcOnLoad="1"' in _z.read("xl/workbook.xml").decode("utf-8"):
            sys.exit(f"{path.name} was filled by scripts/fill_workbook.py and has not been opened and saved in Excel since. "
                     "Open it in Excel, save it, and run this again; until then its formula cells hold old results.")
    wb = openpyxl.load_workbook(path, data_only=True)
    if "Detail Data" not in wb.sheetnames:
        sys.exit("No 'Detail Data' tab in this workbook.")
    ws = wb["Detail Data"]
    front = wb["FrontPage"] if "FrontPage" in wb.sheetnames else None

    hrow, periods = header_row(ws)
    annual = [(c, lab) for c, lab in periods if not lab.startswith("Q")]
    rows = label_rows(ws, ROWS)
    missing = [k for k in ROWS if k not in rows]

    # units: the sheet says millions, but some teams enter thousands
    rev_row = rows.get("revenue")
    first_rev = num(ws.cell(rev_row, annual[0][0]).value) if rev_row else None
    scale = 1000.0 if first_rev and first_rev > 5_000_000 else 1.0

    periods_out = []
    for c, lab in annual:
        entry = {"label": lab, "year": int(lab[:4]), "actual": lab.endswith("A")}
        for key, r in rows.items():
            v = num(ws.cell(r, c).value)
            if v is not None:
                v = v / scale  # shares are entered in the same unit as the dollar rows
            entry[key] = v
        periods_out.append(entry)

    actuals = [p for p in periods_out if p["actual"]]
    forecasts = [p for p in periods_out if not p["actual"]]

    def pct(a, b):
        return round(a / b, 6) if a is not None and b else None

    drivers = {}
    if actuals:
        last = actuals[-1]
        prev = actuals[-2] if len(actuals) > 1 else None
        drivers = {
            "revenueGrowth": pct(last["revenue"] - prev["revenue"], prev["revenue"]) if prev and last.get("revenue") and prev.get("revenue") else None,
            "ebitMargin": pct(last.get("ebit"), last.get("revenue")),
            "ebitdaMargin": pct(last.get("ebitda"), last.get("revenue")),
            # effective tax rate: taxes over pre-tax income (net income plus taxes), not over net income
            "taxRate": pct(last.get("incomeTaxes"), last.get("netIncome") + last.get("incomeTaxes")) if last.get("incomeTaxes") is not None and last.get("netIncome") is not None else None,
            "daPctRevenue": pct(last.get("da"), last.get("revenue")),
            "capexPctRevenue": pct(last.get("capex"), last.get("revenue")),
            "nwcPctRevenue": pct((last.get("currentAssets") or 0) - (last.get("currentLiabilities") or 0), last.get("revenue")) if last.get("currentAssets") is not None else None,
            "baseYear": last["year"],
        }

    company = {}
    if front:
        name = front["A1"].value
        company = {
            "name": str(name).strip() if name else None,
            "ticker": front["C2"].value,
            "exchange": front["F2"].value,
            "price": num(front["C3"].value),
            "priceDate": front["C4"].value.isoformat()[:10] if isinstance(front["C4"].value, (dt.date, dt.datetime)) else None,
        }

    wacc = {}
    if "WACC calculation" in wb.sheetnames:
        w = wb["WACC calculation"]
        # labels sit in column B or C depending on the copy; the value is in the next column
        for col in (2, 3):
            for key, r in label_rows(w, WACC_CELLS, col=col, value_col=col + 1).items():
                wacc.setdefault(key, num(w.cell(r, col + 1).value))

    dcf = {}
    if "DCF 1-Pager" in wb.sheetnames:
        dcf = read_dcf(wb["DCF 1-Pager"], periods_out)

    out = {
        "generatedFrom": path.name,
        "generatedOn": dt.date.today().isoformat(),
        "units": "millions of dollars; shares in millions (or as entered on the sheet)",
        "scaleApplied": scale,
        "company": company,
        "periods": periods_out,
        "drivers": drivers,
        "wacc": wacc,
        "dcf": dcf,
        "missingRows": missing,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "// Generated by scripts/workbook_to_data.py. Do not edit by hand; edit the workbook and rerun.\n"
        "window.FINANCIALS = " + json.dumps(out, indent=2) + ";\n"
    )
    print(f"Wrote {OUT.relative_to(ROOT)} from {path.name}")
    print(f"  periods: {[p['label'] for p in periods_out]}  (scale applied: /{int(scale)})")
    print(f"  actual years: {len(actuals)}, forecast years: {len(forecasts)}")
    if missing:
        print(f"  rows not on this Detail Data tab (fine; the two Q&D layouts name a few rows differently): {', '.join(missing)}")
    if wacc:
        print(f"  WACC tab (used from Module 3): {wacc}")
    if dcf:
        r = dcf["workbookResult"]
        print(f"  DCF tab (used from Module 4): scale {dcf['scaleApplied']}, WACC {dcf['wacc']}, g {dcf['longTermGrowth']}, exit multiple {dcf['exitMultiple']}, "
              f"{len(dcf['years'])} forecast years, per share {r['perSharePerpetuity']} (perpetuity) / {r['perShareExitMultiple']} (exit multiple)")
        for k, t in dcf["sensitivity"].items():
            print(f"    sensitivity {k}: " + (f"{len(t['rows'])} x {len(t['columns'])}" if t else "not found"))


if __name__ == "__main__":
    main()
