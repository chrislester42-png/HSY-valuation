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
Dr. Payne's filled Q&D workbook for Hershey, used as she sent it: FY2024 and FY2025 actuals and FY2026 to FY2028 forecasts on the Detail Data tab, dollars in millions, and the WACC calculation tab. The Module 2 copy (received 2026-10-05) replaced the team's own filled copy, kept in the repo history at tag `m2-done`; on 2026-10-05 it was replaced again by her Module 3 copy ("Q&D worksheet HSY video 3"), which is the same file with the WACC calculation tab filled.

## Key takeaways
- The only source of the financial numbers on the site. `scripts/workbook_to_data.py` reads it and writes `site/data/financials.js`, which the Financials, Valuation, and The Call sections read.
- Actual columns come from the FY2025 and FY2024 Forms 10-K through the SEC's XBRL company facts ([[01 Sources/S1 Hershey Form 10-K FY2025]]); every cell is listed with tag, form, filing date, and accession number in [[03 Drafts/Module 2 - Data pull]], and a person checked each one on [[03 Drafts/Module 2 - Data verification]].
- Forecast columns come from the FactSet consensus export ([[01 Sources/S8 FactSet consensus estimates for Hershey]]); formula rows (EBIT, D&A, NOPAT, change in NWC, FCFF, FCFE, interest) are the sheet's own, as Dr. Payne's copy has them; the Data pull note lists what differs from the team's earlier copy.
- Driver choices behind the forecast are argued in [[03 Drafts/Milestone 2 - Driver Justifications]].
- The WACC calculation tab (Module 3) gives a WACC of 6.78 percent; its inputs are argued and tagged in [[03 Drafts/Milestone 3 - Cost of Capital Memo]]. Forecast interest expense now reads the cost of debt from it (253.8 in FY2026), so the sheet's FCFE changed. The DCF 1-Pager is Module 4.
- The DCF 1-Pager tab (Module 4) values Hershey at 218.59 dollars a share by growth in perpetuity and 193.02 by exit multiple, at the 6.78 percent WACC, 3.0 percent growth, and 13.02x; its inputs and results are filed from [[03 Drafts/Milestone 4 - DCF Valuation Memo]].
- Since 2026-10-07 the workbook is Dr. Payne's final copy ("Q&D worksheet HSY Module 5"), kept for every remaining module: the same Detail Data, WACC, and DCF valuation, plus the Relative Valuation tab (Hershey, Mondelez, Lindt, and Tootsie Roll on EV/EBITDA, P/E, and EV/Sales, with the peer average) and the DCF 1-Pager's Relative Valuation block (each peer average multiple applied to Hershey's FY2028 forecast). The FrontPage Capital Allocation and #REF! cells carry the team's fixes, as in the Module 4 copy.

## Direct quotes
> None. The file is a spreadsheet.

## Atomic notes derived from this source
- Site numbers from this workbook trace through `site/data/financials.js` and the Data pull note.
- [[02 Atomic Notes/Hershey debt to equity 14.37 percent]]
- [[02 Atomic Notes/Hamada beta 0.35 cross-check]]
- [[02 Atomic Notes/Cost of equity 7.11 percent]]
- [[02 Atomic Notes/Pre-tax cost of debt 5.83 percent]]
- [[02 Atomic Notes/After-tax cost of debt 4.49 percent]]
- [[02 Atomic Notes/Equity weight 87.4 percent]]
- [[02 Atomic Notes/Debt weight 12.6 percent]]
- [[02 Atomic Notes/WACC 6.78 percent]]
- [[02 Atomic Notes/Perpetual growth rate 3.0 percent]]
- [[02 Atomic Notes/Exit multiple 13.02x 2028 EBITDA]]
- [[02 Atomic Notes/Valuation date 5 October 2026 with 23.9 percent stub]]
- [[02 Atomic Notes/Terminal value by growth in perpetuity 52,410.9 million dollars]]
- [[02 Atomic Notes/Terminal value by exit multiple 46,275.7 million dollars]]
- [[02 Atomic Notes/Terminal value 92.3 and 91.3 percent of enterprise value]]
- [[02 Atomic Notes/Implied exit multiple 14.7x at 3.0 percent growth]]
- [[02 Atomic Notes/Implied growth 2.5 percent at 13.02x exit multiple]]
- [[02 Atomic Notes/Present value of 2026 to 2028 cash flows 3,792.3 million dollars]]
- [[02 Atomic Notes/Net debt 3,755.1 million dollars]]
- [[02 Atomic Notes/Diluted shares 207.2 million]]
- [[02 Atomic Notes/Equity value per share 218.59 dollars by growth in perpetuity]]
- [[02 Atomic Notes/Equity value per share 193.02 dollars by exit multiple]]
- [[02 Atomic Notes/Perpetuity and exit multiple values differ by 25.57 dollars a share]]
- [[02 Atomic Notes/HSY share price 160.19 dollars on 5 October 2026]]
- [[02 Atomic Notes/DCF values 36.5 and 20.5 percent above share price]]
- [[02 Atomic Notes/Hershey multiples 13.8x EBITDA, 23.4x earnings, 3.05x sales]]
- [[02 Atomic Notes/Mondelez multiples 12.22x EBITDA, 21.34x earnings, 2.36x sales]]
- [[02 Atomic Notes/Lindt multiples 19.08x EBITDA, 23.79x earnings, 4.16x sales]]
- [[02 Atomic Notes/Tootsie Roll multiples 25.31x EBITDA, 29.87x earnings, 3.74x sales]]
- [[02 Atomic Notes/Peer average multiples 18.87x EBITDA, 25.0x earnings, 3.42x sales]]
- [[02 Atomic Notes/Hershey discount to peer average 26.9, 6.4, and 10.8 percent]]
- [[02 Atomic Notes/Hershey premium to Mondelez 12.9, 9.7, and 29.2 percent]]
- [[02 Atomic Notes/Peer multiples imply 213.50 to 323.76 dollars a share]]
- [[02 Atomic Notes/Peer multiple values 33.3 to 102.1 percent above share price]]
- [[02 Atomic Notes/Peer screen kept 3 of 8 AI-proposed comparables]]
- [[02 Atomic Notes/Scenario weights 25, 50, and 25 percent]]
- [[02 Atomic Notes/Bull case values 311.15 and 212.70 dollars a share]]
- [[02 Atomic Notes/Bear case values 124.84 and 158.38 dollars a share]]
- [[02 Atomic Notes/Probability-weighted value 218.29 and 189.28 dollars a share]]
- [[02 Atomic Notes/Weighted values 36.3 and 18.2 percent above share price]]
- [[02 Atomic Notes/Call is Buy below 189 and avoid above 218 dollars]]
