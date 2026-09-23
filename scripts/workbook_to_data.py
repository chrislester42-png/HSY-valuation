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
  midyear flag, valuation date, net debt, diluted shares, and the sheet's own
  per-share results (so the site can prove it matches the workbook).

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

WACC_CELLS = {  # label in column B -> key
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


def main() -> None:
    path = find_workbook(sys.argv[1] if len(sys.argv) > 1 else None)
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
            "taxRate": pct(last.get("incomeTaxes"), last.get("netIncome")) if last.get("incomeTaxes") is not None and last.get("netIncome") else None,
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
        wr = label_rows(w, WACC_CELLS, col=2)
        for key, r in wr.items():
            wacc[key] = num(w.cell(r, 3).value)

    dcf = {}
    if "DCF 1-Pager" in wb.sheetnames:
        d = wb["DCF 1-Pager"]
        labels = label_rows(d, {
            "growth": r"^Long term growth rate",
            "netDebt": r"^Net debt$",
            "sharesOut": r"^Shares outstanding$",
            "perShare": r"^Equity value per share",
            "ev": r"^Enterprise value$",
        }, col=2, value_col=3)
        labels.update(label_rows(d, {
            "fiscalYearEnd": r"^Most recent fiscal year end",
            "valuationDate": r"^Valuation date",
        }, col=2))
        def cell(r, c):
            return d.cell(r, c).value if r else None
        wacc_lab = None
        for r in range(1, 15):
            for c in range(1, 12):
                v = d.cell(r, c).value
                if isinstance(v, str) and v.startswith("Discount rate"):
                    wacc_lab = (r, c)
        mult = None
        for r in range(1, d.max_row + 1):
            v = d.cell(r, 5).value
            if isinstance(v, str) and v.strip() == "EBITDA multiple":
                mult = num(d.cell(r, 9).value)
                break
        midyear = None
        for r in range(1, 15):
            v = d.cell(r, 6).value
            if isinstance(v, str) and v.startswith("Midyear"):
                midyear = num(d.cell(r, 8).value)
        vd = cell(labels.get("valuationDate"), 4)
        fy = cell(labels.get("fiscalYearEnd"), 4)
        # the 1-Pager states its own units in row 3 ("$ and shares in thousands"); export in millions like Detail Data
        unit_note = " ".join(str(d.cell(r, 2).value) for r in range(1, 5) if isinstance(d.cell(r, 2).value, str)).lower()
        dscale = 1000.0 if "thousand" in unit_note else 1.0
        def money(v):
            return None if num(v) is None else num(v) / dscale
        dcf = {
            "wacc": num(d.cell(wacc_lab[0], wacc_lab[1] + 2).value) if wacc_lab else None,
            "longTermGrowth": num(cell(labels.get("growth"), 3)),
            "exitMultiple": mult,
            "midyear": bool(midyear) if midyear is not None else None,
            "valuationDate": vd.isoformat()[:10] if isinstance(vd, (dt.date, dt.datetime)) else None,
            "fiscalYearEnd": fy.isoformat()[:10] if isinstance(fy, (dt.date, dt.datetime)) else None,
            "netDebt": money(cell(labels.get("netDebt"), 3)),
            "sharesOut": money(cell(labels.get("sharesOut"), 3)),
            "workbookResult": {
                "evPerpetuity": money(cell(labels.get("ev"), 3)),
                "evExitMultiple": money(cell(labels.get("ev"), 4)),
                "perSharePerpetuity": num(cell(labels.get("perShare"), 3)),
                "perShareExitMultiple": num(cell(labels.get("perShare"), 4)),
            },
        }

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
        print(f"  rows not found on Detail Data (fine if the sheet does not have them): {', '.join(missing)}")
    if wacc:
        print(f"  WACC tab: {wacc}")
    if dcf:
        print(f"  DCF tab: wacc={dcf['wacc']} g={dcf['longTermGrowth']} multiple={dcf['exitMultiple']} per share={dcf['workbookResult']}")


if __name__ == "__main__":
    main()
