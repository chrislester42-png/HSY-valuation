#!/usr/bin/env python3
"""
fill_detail_data_from_edgar.py  (annual Q&D layout)

Pull a company's last two reported fiscal years from the SEC's free XBRL "company facts"
feed and type them into the actual columns (C and D) of the Detail Data tab of the team's
Q&D workbook. Forecast columns (E to G) are never touched: those you type by hand.

    python3 scripts/fill_detail_data_from_edgar.py workbook/QD-HSY.xlsx --ticker HSY \\
        --contact "Your Name you@txstate.edu" --dry-run
    python3 scripts/fill_detail_data_from_edgar.py workbook/QD-HSY.xlsx --ticker HSY \\
        --contact "Your Name you@txstate.edu" --report "research/03 Drafts/Module 2 - Data pull.md"

--contact is required by the SEC's fair-access rule: every automated caller names itself.
--dry-run prints what would be written and writes nothing.
--report also saves the table of cells, tags, and filings as a markdown note.
--latest-fy-end YYYY-MM-DD picks an older fiscal year for column D (default: the newest 10-K).

What it does
- Finds the company's annual periods from its Forms 10-K and takes the newest as column D,
  the one before as column C, and the one before that for the two "(t-1)" rows.
- For each input row it tries a short list of standard XBRL tags and uses the first one the
  company reported for that period, taking the value from the most recently filed 10-K.
- Prints every cell with its tag, form, filing date, and accession number, so each figure
  can be checked against the filing.
- Writes through scripts/fill_workbook.py, so charts, images, formulas, and the other tabs
  are copied through unchanged. A cell that holds a formula is skipped, never overwritten.

What it does not do
- It does not guess. A row with no matching tag is left blank and listed under
  "Left for a person to type", with the place in the 10-K to look.
- It does not verify. Every figure it types is still yours to check against the filing
  (scripts/verification_form.py makes the form).

This is the annual-layout version of Dr. Payne's fill_detail_data_from_edgar.py. The
original was written for the quarterly layout (columns C to M) and must not be run on the
annual workbook: its row and column map point at different cells.

After it runs: open the workbook in Excel and save it, so the formulas recalculate.
Standard library only.
"""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import json
import re
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import fill_workbook as fw  # noqa: E402

SHEET = "Detail Data"
M = 1_000_000

# row -> (concept, which year, words the row label must contain)
# year: 0 = newest fiscal year, 1 = the year before, 2 = two years before
ROWS = {
    5: ("revenue", 0, "revenue (t)"),
    6: ("revenue", 1, "revenue (t-1)"),
    7: ("eps", 0, "eps (t)"),
    8: ("eps", 1, "eps (t-1)"),
    9: ("shares", 0, "shares"),
    15: ("cogs", 0, "cost of sales"),
    16: ("ebit", 0, "ebit"),
    17: ("net_income", 0, "net income (t)"),
    18: ("net_income", 1, "net income (t-1)"),
    19: ("interest", 0, "interest"),
    20: ("taxes", 0, "income taxes"),
    21: ("ebitda", 0, "ebitda"),
    28: ("cash", 0, "cash"),
    30: ("assets", 0, "total assets"),
    31: ("current_assets", 0, "current assets"),
    32: ("current_liabilities", 0, "current liabilities"),
    34: ("ltd", 0, "long term debt"),
    35: ("equity", 0, "equity"),
    38: ("da", 0, "depreciation"),
    40: ("capex", 0, "capital expenditures"),
}

# concept -> (kind, unit, scale, decimals, [tags in order of preference])
# A tag written as "-Tag" is reported as a negative number for an expense, so its sign is flipped.
CONCEPTS = {
    "revenue": ("duration", "USD", M, 1, ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax",
                                          "RevenueFromContractWithCustomerIncludingAssessedTax", "SalesRevenueNet"]),
    "eps": ("duration", "USD/shares", 1, 2, ["EarningsPerShareDiluted"]),
    "shares": ("duration", "shares", M, 1, ["WeightedAverageNumberOfDilutedSharesOutstanding"]),
    "cogs": ("duration", "USD", M, 1, ["CostOfGoodsAndServicesSold", "CostOfRevenue", "CostOfGoodsSold",
                                       "CostOfGoodsAndServicesSoldExcludingDepreciation"]),
    "ebit": ("duration", "USD", M, 1, ["OperatingIncomeLoss"]),
    "net_income": ("duration", "USD", M, 1, ["NetIncomeLoss", "ProfitLoss"]),
    "interest": ("duration", "USD", M, 1, ["-InterestIncomeExpenseNonoperatingNet", "InterestExpenseNonoperating",
                                           "InterestExpense", "InterestExpenseDebt", "-InterestIncomeExpenseNet"]),
    "taxes": ("duration", "USD", M, 1, ["IncomeTaxExpenseBenefit"]),
    "cash": ("instant", "USD", M, 1, ["CashAndCashEquivalentsAtCarryingValue",
                                      "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents"]),
    "sti": ("instant", "USD", M, 1, ["MarketableSecuritiesCurrent", "ShortTermInvestments",
                                     "AvailableForSaleSecuritiesDebtSecuritiesCurrent"]),
    "assets": ("instant", "USD", M, 1, ["Assets"]),
    "current_assets": ("instant", "USD", M, 1, ["AssetsCurrent"]),
    "current_liabilities": ("instant", "USD", M, 1, ["LiabilitiesCurrent"]),
    "ltd": ("instant", "USD", M, 1, ["LongTermDebtNoncurrent", "LongTermDebtAndCapitalLeaseObligations",
                                     "LongTermNotesPayable"]),
    "equity": ("instant", "USD", M, 1, ["StockholdersEquity",
                                        "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"]),
    "da": ("duration", "USD", M, 1, ["DepreciationDepletionAndAmortization", "DepreciationAmortizationAndAccretionNet",
                                     "DepreciationAndAmortization"]),
    "capex": ("duration", "USD", M, 1, ["PaymentsToAcquirePropertyPlantAndEquipment",
                                        "PaymentsToAcquireProductiveAssets"]),
}

WHERE_TO_LOOK = {
    "eps": "the income statement, or the earnings per share note (companies with two share classes report it only there)",
    "shares": "the earnings per share note: weighted-average diluted shares",
    "interest": "the income statement: interest expense",
    "ltd": "the balance sheet: long-term debt, excluding the current portion",
    "cash": "the balance sheet: cash and cash equivalents",
    "da": "the cash flow statement: depreciation and amortization",
    "capex": "the cash flow statement: purchases of property, plant and equipment",
    "cogs": "the income statement: cost of sales",
}

ANNUAL_FORMS = ("10-K", "10-K/A", "20-F", "40-F")


def get(url: str, contact: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": f"FIN 5370 student project {contact}",
                                               "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=60) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
    return json.loads(raw)


def day(s: str) -> dt.date:
    return dt.date.fromisoformat(s)


def annual_facts(facts: dict, tag: str, unit: str) -> dict:
    """end date -> newest-filed annual fact for a duration tag."""
    out = {}
    for f in facts.get(tag, {}).get("units", {}).get(unit, []):
        if f.get("form") not in ANNUAL_FORMS or "start" not in f:
            continue
        if not 350 <= (day(f["end"]) - day(f["start"])).days <= 380:
            continue
        if f["end"] not in out or f["filed"] > out[f["end"]]["filed"]:
            out[f["end"]] = f
    return out


def instant_facts(facts: dict, tag: str, unit: str) -> dict:
    """end date -> newest-filed annual-report fact for a balance sheet tag."""
    out = {}
    for f in facts.get(tag, {}).get("units", {}).get(unit, []):
        if f.get("form") not in ANNUAL_FORMS or "start" in f:
            continue
        if f["end"] not in out or f["filed"] > out[f["end"]]["filed"]:
            out[f["end"]] = f
    return out


def lookup(facts: dict, concept: str, end: str):
    """Return (value in sheet units, tag label, fact) or None."""
    kind, unit, scale, places, tags = CONCEPTS[concept]
    for t in tags:
        flip = t.startswith("-")
        tag = t.lstrip("-")
        table = annual_facts(facts, tag, unit) if kind == "duration" else instant_facts(facts, tag, unit)
        if end in table:
            f = table[end]
            v = (-f["val"] if flip else f["val"]) / scale
            if flip and v < 0:
                continue  # a net figure that is income, not expense: try the next tag
            return round(v, places), tag + (" (sign flipped)" if flip else ""), f
    return None


# ---- reading the workbook (labels, the FrontPage date, which cells are formulas) ----

def shared_strings(z: zipfile.ZipFile) -> list:
    if "xl/sharedStrings.xml" not in z.namelist():
        return []
    xml = z.read("xl/sharedStrings.xml").decode("utf-8")
    return ["".join(re.findall(r"<t[^>]*>([^<]*)</t>", si)) for si in re.findall(r"<si>(.*?)</si>", xml, re.S)]


def cell(xml: str, ref: str):
    m = re.search(rf'<c r="{ref}"([^>]*?)(/>|>(.*?)</c>)', xml, re.S)
    if not m:
        return None, None, False
    return m.group(1), m.group(3) or "", "<f" in (m.group(3) or "")


def cell_text(xml: str, ref: str, strings: list) -> str:
    attrs, body, _ = cell(xml, ref)
    if attrs is None:
        return ""
    v = re.search(r"<v>([^<]*)</v>", body)
    if 't="s"' in attrs and v:
        return strings[int(v.group(1))]
    if 't="inlineStr"' in attrs:
        return "".join(re.findall(r"<t[^>]*>([^<]*)</t>", body))
    return v.group(1) if v else ""


def unescape(s: str) -> str:
    return s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')


def main() -> None:
    ap = argparse.ArgumentParser(description="Fill Detail Data columns C and D from SEC EDGAR (annual Q&D layout).")
    ap.add_argument("workbook")
    ap.add_argument("--ticker", required=True)
    ap.add_argument("--contact", required=True, help='your name and email, e.g. "Jane Doe jd@txstate.edu"')
    ap.add_argument("--latest-fy-end", help="fiscal year end for column D, YYYY-MM-DD (default: newest 10-K)")
    ap.add_argument("--report", help="also save the table as a markdown note at this path")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    path = Path(a.workbook)
    if not path.exists():
        sys.exit(f"No such workbook: {path}")
    if (path.parent / ("~$" + path.name)).exists():
        sys.exit(f"{path.name} is open in Excel. Close it in Excel first (save if Excel asks), then run this again.")

    # 1. the workbook: is this the annual layout, and which target cells are formulas
    with zipfile.ZipFile(path) as z:
        paths = fw.sheet_paths(z)
        if SHEET not in paths:
            sys.exit(f"No '{SHEET}' tab in {path.name}. Tabs: {', '.join(paths)}")
        xml = z.read(paths[SHEET]).decode("utf-8")
        strings = shared_strings(z)
    wrong = []
    for row, (_, _, words) in ROWS.items():
        label = unescape(cell_text(xml, f"A{row}", strings)).lower()
        if words not in label:
            wrong.append(f"  row {row}: expected a label containing '{words}', found '{label or '(empty)'}'")
    if wrong:
        print("This does not look like the annual Q&D layout, so nothing was written:")
        print("\n".join(wrong))
        sys.exit(1)

    # 2. the company
    tick = a.ticker.upper()
    print(f"Looking up {tick} at the SEC...")
    tickers = get("https://www.sec.gov/files/company_tickers.json", a.contact)
    hit = next((v for v in tickers.values() if v["ticker"].upper() == tick), None)
    if not hit:
        sys.exit(f"The SEC has no company with ticker {tick}.")
    cik = int(hit["cik_str"])
    data = get(f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik:010d}.json", a.contact)
    facts = {}
    for taxonomy in ("us-gaap", "ifrs-full"):
        facts.update(data.get("facts", {}).get(taxonomy, {}))
    print(f"{data.get('entityName', hit['title'])} (CIK {cik:010d}): {len(facts)} tags in the feed.")

    # 3. the fiscal years: every annual period the company has reported net income or revenue for
    ends = set()
    for tag in CONCEPTS["net_income"][4] + CONCEPTS["revenue"][4]:
        ends |= set(annual_facts(facts, tag, "USD"))
    ends = sorted(ends)
    if a.latest_fy_end:
        if a.latest_fy_end not in ends:
            sys.exit(f"No annual period ends on {a.latest_fy_end}. Fiscal year ends on file: {', '.join(ends[-6:])}")
        ends = [e for e in ends if e <= a.latest_fy_end]
    if len(ends) < 3:
        sys.exit(f"Need three fiscal years on file, found {len(ends)}.")
    y0, y1, y2 = ends[-1], ends[-2], ends[-3]
    years = {"D": [y0, y1], "C": [y1, y2]}  # column -> [its year, the year before]
    print(f"Column C = fiscal year ended {y1}.  Column D = fiscal year ended {y0}.  (t-1) rows reach back to {y2}.")

    # 4. look everything up
    fill, table, missing, skipped = {}, [], [], []
    for col in ("C", "D"):
        got, ebitda_cell = {}, None
        for row, (concept, back, _) in ROWS.items():
            ref = f"{col}{row}"
            label = unescape(cell_text(xml, f"A{row}", strings))
            end = years[col][back]
            if cell(xml, ref)[2]:
                skipped.append(f"  {ref} {label}: holds a formula, left alone")
                continue
            if concept == "ebitda":
                ebitda_cell = (ref, label, end)
                continue
            r = lookup(facts, concept, end)
            if concept == "cash" and r:
                extra = lookup(facts, "sti", end)
                if extra:
                    r = (round(r[0] + extra[0], 1), f"{r[1]} + {extra[1]}", r[2])
            if not r:
                missing.append((ref, label, end, WHERE_TO_LOOK.get(concept, "the 10-K")))
                continue
            v, tag, f = r
            fill[ref] = v
            if back == 0:
                got[concept] = v
            table.append((ref, label, end, v, tag, f["form"], f["filed"], f["accn"]))
        if ebitda_cell and "ebit" in got and "da" in got:
            ref, label, end = ebitda_cell
            v = round(got["ebit"] + got["da"], 1)
            fill[ref] = v
            table.append((ref, label, end, v, "derived: EBIT + Depreciation and Amortization", "", "", ""))

    # 5. report
    def link(accn: str) -> str:
        return f"https://www.sec.gov/Archives/edgar/data/{cik}/{accn.replace('-', '')}/{accn}-index.htm" if accn else ""

    print(f"\n{'Cell':<5} {'Row':<38} {'FY end':<11} {'Value':>10}  Tag, form, filed, accession")
    for ref, label, end, v, tag, form, filed, accn in table:
        src = f"{tag}, {form}, filed {filed}, {accn}" if accn else tag
        print(f"{ref:<5} {label[:38]:<38} {end:<11} {v:>10,.2f}  {src}")
    if missing:
        print("\nLeft for a person to type (the feed has no standard tag for these):")
        for ref, label, end, where in missing:
            print(f"  {ref} {label}, fiscal year ended {end}: see {where}")
    if skipped:
        print("\nSkipped:")
        print("\n".join(skipped))

    if a.report:
        lines = [f"# Module 2: Data pull from SEC EDGAR, {data.get('entityName', tick)} ({tick})", "",
                 f"Source: SEC XBRL company facts, https://data.sec.gov/api/xbrl/companyfacts/CIK{cik:010d}.json, "
                 f"read {dt.date.today().isoformat()} by scripts/fill_detail_data_from_edgar.py. "
                 f"Workbook: `{path.as_posix()}`, tab Detail Data. Dollars and shares in millions.", "",
                 "## Actual columns", "",
                 "| Cell | Row | Fiscal year end | Value | XBRL tag | Form | Filing date | Accession number | Link |",
                 "|---|---|---|---|---|---|---|---|---|"]
        for ref, label, end, v, tag, form, filed, accn in table:
            lines.append(f"| {ref} | {label} | {end} | {v} | {tag} | {form} | {filed} | {accn} | "
                         f"{'[filing index](' + link(accn) + ')' if accn else ''} |")
        lines += ["", "## Left for a person to type from the 10-K", "", "| Cell | Row | Fiscal year end | Where to look |",
                  "|---|---|---|---|"]
        lines += [f"| {ref} | {label} | {end} | {where} |" for ref, label, end, where in missing] or ["| none | | | |"]
        lines += ["", "Every figure above is unverified until a person has found it in the filing."]
        if not a.dry_run:
            Path(a.report).parent.mkdir(parents=True, exist_ok=True)
            Path(a.report).write_text("\n".join(lines) + "\n")
            print(f"\nSaved the table to {a.report}")

    if a.dry_run:
        print(f"\nDry run: {len(fill)} cells would be written, {len(missing)} left for a person. Nothing was changed.")
        return
    if not fill:
        sys.exit("Nothing to write.")

    # 6. write through fill_workbook.py (charts, images, formulas untouched)
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as t:
        json.dump({SHEET: fill}, t)
    print()
    sys.stdout.flush()
    done = subprocess.run([sys.executable, str(HERE / "fill_workbook.py"), str(path), t.name])
    Path(t.name).unlink(missing_ok=True)
    if done.returncode:
        sys.exit(done.returncode)
    print(f"\n{len(fill)} cells typed from the SEC feed; {len(missing)} left for a person to type.")
    print("Every figure is unverified until you have found it in the filing.")


if __name__ == "__main__":
    main()
