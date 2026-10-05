---
type: source
id: S9
project: "The Hershey Company (HSY)"
tags: [source]
publisher: "FIN 5370 HSY team (Chris Lester)"
author: "Chris Lester"
publication-date: "2026-10-04"
date-accessed: 2026-10-04
url:
file: "workbook/QD-HSY.xlsx"
---

# Team Q&D workbook for Hershey (QD-HSY.xlsx)

## What it is
Dr. Payne's filled Q&D workbook for Hershey, received 2026-10-05 and used as she sent it (it replaced the team's own filled copy, kept in the repo history at tag `m2-done`): FY2024 and FY2025 actuals and FY2026 to FY2028 forecasts on the Detail Data tab, dollars in millions.

## Key takeaways
- The only source of the financial numbers on the site. `scripts/workbook_to_data.py` reads it and writes `site/data/financials.js`, which the Financials, Valuation, and The Call sections read.
- Actual columns come from the FY2025 and FY2024 Forms 10-K through the SEC's XBRL company facts ([[01 Sources/S1 Hershey Form 10-K FY2025]]); every cell is listed with tag, form, filing date, and accession number in [[03 Drafts/Module 2 - Data pull]], and a person checked each one on [[03 Drafts/Module 2 - Data verification]].
- Forecast columns come from the FactSet consensus export ([[01 Sources/S8 FactSet consensus estimates for Hershey]]); formula rows (EBIT, D&A, NOPAT, change in NWC, FCFF, FCFE, interest) are the sheet's own, as Dr. Payne's copy has them; the Data pull note lists what differs from the team's earlier copy.
- Driver choices behind the forecast are argued in [[03 Drafts/Milestone 2 - Driver Justifications]].
- The WACC and DCF tabs are filled in Modules 3 and 4; until then forecast interest expense reads 0.

## Direct quotes
> None. The file is a spreadsheet.

## Atomic notes derived from this source
- None yet. Site numbers from this workbook trace through `site/data/financials.js` and the Data pull note.
