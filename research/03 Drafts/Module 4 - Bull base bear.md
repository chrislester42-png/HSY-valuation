# Module 4: Bull, base, and bear, Hershey (HSY)

Team: Chris Lester. Date: 2026-10-05. Engine: `window.valuation` in `site/dcf.js`, run on the workbook's DCF 1-Pager tab as `scripts/workbook_to_data.py` read it into `site/data/financials.js` ([[01 Sources/S9 Team Q&D workbook for Hershey|S9]]). Dollars in millions; per-share values in dollars. The workbook was not changed.

Base is the workbook. Bull and bear change four things: revenue growth in every forecast year, the EBITDA margin in every forecast year, the WACC, and perpetual growth. Rates only is the base forecast, unchanged, at the WACC and perpetual growth rate on the workbook's growth-by-WACC sensitivity table nearest the bear case's. The site shows this table as the Scenarios view of the Valuation section; the scenarios live in the `valuation` object of `site/content.js`.

**Who made the estimates.** The bull and bear inputs are Estimates (tier E), proposed by Claude at the team's request from our Milestone 4 memo and the Knowledge Bank. Chris Lester accepts or changes them; until then they are a starting point, not the team's view.

## The table

| Scenario | Revenue growth shift | Revenue growth FY2026, FY2027, FY2028 | EBITDA margin shift | EBITDA margin FY2026, FY2027, FY2028 | WACC | Perpetual growth | Exit multiple | Per share, growth in perpetuity | Per share, exit multiple | Versus $160.19 (perpetuity, multiple) |
|---|---|---|---|---|---|---|---|---|---|---|
| Bull | +1.0 pt | 6.2%, 3.5%, 3.6% | +1.5 pt | 26.2%, 28.4%, 29.0% | 6.51% | 3.5% | 13.02x | $311.15 | $212.70 | +94.2%, +32.8% |
| Base | none (base) | 5.2%, 2.5%, 2.6% | none (base) | 24.7%, 26.9%, 27.5% | 6.78% | 3.0% | 13.02x | $218.59 | $193.02 | +36.5%, +20.5% |
| Bear | -1.5 pt | 3.7%, 1.0%, 1.1% | -3.0 pt | 21.7%, 23.9%, 24.5% | 7.56% | 2.5% | 13.02x | $124.84 | $158.38 | -22.1%, -1.1% |
| Rates only | none (base) | 5.2%, 2.5%, 2.6% | none (base) | 24.7%, 26.9%, 27.5% | 7.00% | 2.5% | 13.02x | $181.89 | $192.08 | +13.5%, +19.9% |

Held at the workbook's values in every row: the exit multiple (13.02x), D&A, capex, and the change in net working capital (in dollars, as the DCF tab holds them), each year's tax rate on EBIT, the valuation date and stub, net debt, and diluted shares.

## How a scenario is carried

1. Revenue: the last actual year's revenue, FY2025's 11,692.6 (from `F.periods`), grows at each year's workbook growth rate plus the shift: FY2026 = 11,692.6 x (1 + workbook growth + shift), and so on.
2. EBITDA = revenue x (that year's workbook EBITDA margin + the shift).
3. EBIT = EBITDA - D&A (D&A in the workbook's dollars). The DCF tab gets D&A the same way, as EBITDA less EBIT.
4. Tax on EBIT = EBIT x that year's tax rate (28.5%, 28.0%, 27.5%); NOPAT = EBIT - tax.
5. Unlevered free cash flow = NOPAT + D&A + change in NWC + capex (the last two negative, as on the sheet); FY2026 counts 23.9% of it (the stub).
6. From there it is the DCF tab: each cash flow discounted to 2026-10-05 at the scenario's WACC over actual days / 365; terminal value by growth in perpetuity (last cash flow x (1 + g) / (WACC - g)) and by exit multiple (FY2028 EBITDA x 13.02), each discounted from 2028-12-31; enterprise value less net debt of 3,755.1, divided by 207.2 million diluted shares.

With both shifts zero the engine uses the workbook's own lines, so the Base row and every slider and heatmap result are unchanged from before this build.

## Every input, with its reason

### Bull

- **Revenue growth +1.0 pt every year (6.2%, 3.5%, 3.6%).** Q2 2026 net sales grew 6.6%, above the forecast's 5.2% for FY2026. ([[02 Atomic Notes/Q2 2026 net sales growth 6.6 percent|note]])
- **EBITDA margin +1.5 pt every year (26.2%, 28.4%, 29.0%; operating margin 22.2%, 24.1%, 24.7%).** Cocoa is down over 70% from its peak; FY2028 operating margin still ends below FY2024's 25.9%. ([[02 Atomic Notes/Cocoa down more than 70 percent from late-2024 highs|note]])
- **WACC 6.51%.** FactSet's beta of 0.34 in place of our adjusted 0.41. ([[02 Atomic Notes/FactSet beta 0.34|note]])
- **Perpetual growth 3.5%.** Net sales grew about 4% a year in FY2023 to FY2025; 3.5% stays below the 5.28% risk-free rate. ([[02 Atomic Notes/FY2023 net sales growth 7.2 percent|note]])
- WACC formula: 87.4% x (5.28% + 0.34 x 4.46%) + 12.6% x 4.49% = 6.51%. Same weights, risk-free rate, equity risk premium, and after-tax cost of debt as the WACC tab; only the beta changes ([[02 Atomic Notes/Equity weight 87.4 percent|weights]], [[02 Atomic Notes/10-year Treasury yield 5.28 percent on 2 October 2026|risk-free]], [[02 Atomic Notes/US equity risk premium 4.46 percent January 2026|premium]], [[02 Atomic Notes/After-tax cost of debt 4.49 percent|cost of debt]]). The same formula with our 0.4102 beta gives 6.78%.
- Growth reason in full: net sales grew [[02 Atomic Notes/FY2023 net sales growth 7.2 percent|7.2%]], [[02 Atomic Notes/FY2024 net sales growth 0.3 percent|0.3%]], and [[02 Atomic Notes/FY2025 net sales growth 4.4 percent|4.4%]] in FY2023 to FY2025, an average of 4.0%; 3.5% stays below the [[02 Atomic Notes/10-year Treasury yield 5.28 percent on 2 October 2026|5.28% risk-free rate]].
- Margin reason in full: with the shift, FY2028's operating margin is 24.7%, still below [[02 Atomic Notes/FY2024 operating margin 25.9 percent|FY2024's 25.9%]].

### Base

- **All four inputs: the workbook.** Revenue growth 5.2%, 2.5%, 2.6%; EBITDA margin 24.7%, 26.9%, 27.5%; WACC 6.78% ([[02 Atomic Notes/WACC 6.78 percent|note]]); perpetual growth 3.0% ([[02 Atomic Notes/Perpetual growth rate 3.0 percent|note]]).

### Bear

- **Revenue growth -1.5 pt every year (3.7%, 1.0%, 1.1%).** Q2 2026 volume fell about 10% as prices rose about 14%; if pricing fades, growth slows. ([[02 Atomic Notes/Q2 2026 confectionery volume down about 10 percent|note]])
- **EBITDA margin -3.0 pt every year (21.7%, 23.9%, 24.5%; operating margin 17.7%, 19.4%, 19.9%).** Management guided about 400 basis points of 2026 margin gain; the forecast assumes about twice that. ([[02 Atomic Notes/FY2026 margin improvement guided about 400 basis points|note]])
- **WACC 7.56%.** Damodaran's food processing beta of 0.61 in place of our adjusted 0.41. ([[02 Atomic Notes/Food processing industry beta 0.61|note]])
- **Perpetual growth 2.5%.** Chocolate industry growth of about 2.5% a year, the rate our 13.02x exit implies. ([[02 Atomic Notes/Chocolate industry revenue growth about 2.5 percent a year|note]])
- WACC formula: 87.4% x (5.28% + 0.61 x 4.46%) + 12.6% x 4.49% = 7.56%. Only the beta changes; 0.61 is Damodaran's food processing industry beta as published (levered at the industry's own debt), used here as a stress, not as Hershey's beta.
- Revenue reason in full: confectionery volume fell about 10% in Q2 2026 ([[02 Atomic Notes/Q2 2026 confectionery volume down about 10 percent|note]]) while prices rose about 14% ([[02 Atomic Notes/Q2 2026 price increase about 14 percent|note]]). The shift puts FY2026 growth at 3.7%, below the 4.5% to 5.0% guidance ([[02 Atomic Notes/FY2026 guidance net sales growth 4.5 to 5.0 percent|note]]), and FY2027 and FY2028 near 1%.
- Margin reason in full: the workbook's EBITDA margin rises from 16.6% in FY2025 to 24.7% in FY2026, about 8 points, against about 400 basis points of guided improvement ([[02 Atomic Notes/FY2026 margin improvement guided about 400 basis points|note]]; the note does not say which margin). Hedges and inventory delay the cocoa benefit ([[02 Atomic Notes/Cocoa down more than 70 percent from late-2024 highs|note]]). Even with the shift, FY2026 operating margin is 17.7%, up from [[02 Atomic Notes/FY2025 operating margin 12.3 percent|12.3% in FY2025]].
- Growth reason in full: [[02 Atomic Notes/Chocolate industry revenue growth about 2.5 percent a year|industry growth of about 2.5%]] and the [[02 Atomic Notes/Implied growth 2.5 percent at 13.02x exit multiple|2.5% our exit multiple implies]].

### Rates only

- **Revenue growth and EBITDA margin: the base forecast, unchanged.**
- **WACC 7.0% and perpetual growth 2.5%.** The bear case uses 7.56% and 2.5%. The nearest point on the workbook's growth-by-WACC table (DCF 1-Pager, rows 115 to 119, columns E to I) is row 1 of 5 (WACC 7.0%, the table's highest WACC) and column 2 of 5 (growth 2.5%). It isolates what the bear case's rates alone do to value.

## What it shows

- Bull and bear are not symmetric: the bear case moves revenue and margin further (1.5 and 3.0 points down against 1.0 and 1.5 up) because the two risks to the thesis in the Knowledge Bank, falling volume and a slower margin recovery than consensus, both point down.
- Rates only gives $181.89 by growth in perpetuity against the bear case's $124.84: the bear case's rates explain part of its drop and its weaker forecast the rest.
- By exit multiple the range is narrower ($158.38 to $212.70) than by growth in perpetuity ($124.84 to $311.15), for the reason the memo gives: the multiple method does not divide by WACC less growth.

## Checked by hand

Two cells of the table, each rebuilt step by step in a spare sheet of a copy of the workbook, so the check does not lean on the site's code. A match within a cent confirms the engine carries a scenario the way the DCF tab would; a miss shows which step differs. Step 2 starts from the workbook's own growth, so the base path is reproduced first and the shift added on top.

| Cell                                                 | How it is checked                             | Site's value | My value | Matched | Checked by | Date |
| ---------------------------------------------------- | --------------------------------------------- | ------------ | -------- | ------- | ---------- | ---- |
| Bear, equity value per share by growth in perpetuity | Rebuilt by hand in a spare sheet, steps below | $124.84      |          |         |            |      |
| Bull, equity value per share by exit multiple        | Rebuilt by hand in a spare sheet, steps below | $212.70      |          |         |            |      |

### Steps

#### Bear case, per share by growth in perpetuity (site: $124.84)

**Inputs.** Workbook cells are on the DCF 1-Pager tab. Scenario inputs come from the `scenarios` list in `site/content.js` and are not in the workbook.

| Input | FY2026 | FY2027 | FY2028 | Where it comes from |
|---|---|---|---|---|
| FY2025 revenue (the base) | 11,692.6 | | | D17 (reads Detail Data D5) |
| Workbook revenue | 12,296.5 | 12,603.5 | 12,931.9 | E17, F17, G17 |
| Workbook EBITDA | 3,035.1 | 3,393.8 | 3,554.2 | E19, F19, G19 |
| D&A (held in dollars) | 488.409503 | 558.324747 | 568.961615 | E28, F28, G28 |
| Tax rate on EBIT | 28.5% | 28.0% | 27.5% | E25, F25, G25 |
| Change in NWC (held) | -284.5 | -188.0 | -296.0 | E29, F29, G29 |
| Capex (held) | -440.8 | -503.9 | -513.5 | E30, F30, G30 |
| Discount date | 2026-12-31 | 2027-12-31 | 2028-12-31 | E41, F41, G41 |

| Single input | Value | Where it comes from |
|---|---|---|
| Valuation date | 2026-10-05 | D9 (reads FrontPage C4) |
| Stub fraction | 0.2388888889 | D10, =YEARFRAC(D9, D7) |
| Revenue growth shift | -1.5% | scenario (content.js) |
| EBITDA margin shift | -3.0% | scenario (content.js) |
| WACC | 7.56% | scenario (content.js); the workbook's is H6 |
| Perpetual growth | 2.5% | scenario (content.js); the workbook's is C46 |
| Net debt | 3,755.1 | C69 |
| Diluted shares (millions) | 207.154374 | I65 |

**Steps.** Keep full precision in every cell (type formulas, not rounded results); the numbers below are rounded for reading only.

| Step | Line | How | FY2026 | FY2027 | FY2028 |
|---|---|---|---|---|---|
| 1 | Workbook revenue growth | this year's revenue / last year's - 1 (E17/D17 - 1, F17/E17 - 1, G17/F17 - 1) | 5.1648% | 2.4966% | 2.6056% |
| 2 | Scenario revenue growth | step 1 + the shift | 3.6648% | 0.9966% | 1.1056% |
| 3 | Revenue | last year's revenue (FY2025: 11,692.6) x (1 + step 2) | 12,121.11 | 12,241.92 | 12,377.27 |
| 4 | Workbook EBITDA margin | EBITDA / revenue (E19/E17, F19/F17, G19/G17) | 24.6826% | 26.9274% | 27.4840% |
| 5 | Scenario EBITDA margin | step 4 + the shift | 21.6826% | 23.9274% | 24.4840% |
| 6 | EBITDA | step 3 x step 5 | 2,628.18 | 2,929.18 | 3,030.45 |
| 7 | EBIT | step 6 - D&A | 2,139.77 | 2,370.85 | 2,461.48 |
| 8 | Tax on EBIT | step 7 x tax rate | 609.83 | 663.84 | 676.91 |
| 9 | NOPAT | step 7 - step 8 | 1,529.93 | 1,707.01 | 1,784.58 |
| 10 | Unlevered free cash flow | step 9 + D&A + change in NWC + capex | 1,293.04 | 1,573.44 | 1,544.04 |
| 11 | Cash flow counted | FY2026: step 10 x stub fraction; later years: step 10 | 308.89 | 1,573.44 | 1,544.04 |
| 12 | Years to discount | (discount date - valuation date) / 365 = 87, 452, 818 days / 365 | 0.238356 | 1.238356 | 2.241096 |
| 13 | Discount factor | (1 + WACC) ^ step 12 | 1.017523 | 1.094448 | 1.177423 |
| 14 | Present value | step 11 / step 13 | 303.57 | 1,437.66 | 1,311.37 |

| Step | Line | How | Value |
|---|---|---|---|
| 15 | Present value of FY2026 to FY2028 | sum of step 14 | 3,052.60 |
| 16 | FY2029 cash flow | FY2028 step 11 x (1 + perpetual growth) = 1,544.04 x 1.025 | 1,582.64 |
| 17 | Terminal value in 2028 | step 16 / (WACC - perpetual growth) = 1,582.64 / (7.56% - 2.5%) | 31,277.45 |
| 18 | Present value of terminal value | step 17 / FY2028 step 13 (1.177423) | 26,564.33 |
| 19 | Enterprise value | step 15 + step 18 | 29,616.93 |
| 20 | Equity value | step 19 - net debt (3,755.1) | 25,861.83 |
| 21 | Equity value per share | step 20 / diluted shares (207.154374) | $124.84 |

#### Bull case, per share by exit multiple (site: $212.70)

**Inputs.** Workbook cells are on the DCF 1-Pager tab. Scenario inputs come from the `scenarios` list in `site/content.js` and are not in the workbook.

| Input | FY2026 | FY2027 | FY2028 | Where it comes from |
|---|---|---|---|---|
| FY2025 revenue (the base) | 11,692.6 | | | D17 (reads Detail Data D5) |
| Workbook revenue | 12,296.5 | 12,603.5 | 12,931.9 | E17, F17, G17 |
| Workbook EBITDA | 3,035.1 | 3,393.8 | 3,554.2 | E19, F19, G19 |
| D&A (held in dollars) | 488.409503 | 558.324747 | 568.961615 | E28, F28, G28 |
| Tax rate on EBIT | 28.5% | 28.0% | 27.5% | E25, F25, G25 |
| Change in NWC (held) | -284.5 | -188.0 | -296.0 | E29, F29, G29 |
| Capex (held) | -440.8 | -503.9 | -513.5 | E30, F30, G30 |
| Discount date | 2026-12-31 | 2027-12-31 | 2028-12-31 | E41, F41, G41 |

| Single input | Value | Where it comes from |
|---|---|---|
| Valuation date | 2026-10-05 | D9 (reads FrontPage C4) |
| Stub fraction | 0.2388888889 | D10, =YEARFRAC(D9, D7) |
| Revenue growth shift | +1.0% | scenario (content.js) |
| EBITDA margin shift | +1.5% | scenario (content.js) |
| WACC | 6.51% | scenario (content.js); the workbook's is H6 |
| Exit multiple | 13.02x | I47 (unchanged in every scenario) |
| Net debt | 3,755.1 | C69 |
| Diluted shares (millions) | 207.154374 | I65 |

**Steps.** Keep full precision in every cell (type formulas, not rounded results); the numbers below are rounded for reading only.

| Step | Line | How | FY2026 | FY2027 | FY2028 |
|---|---|---|---|---|---|
| 1 | Workbook revenue growth | this year's revenue / last year's - 1 (E17/D17 - 1, F17/E17 - 1, G17/F17 - 1) | 5.1648% | 2.4966% | 2.6056% |
| 2 | Scenario revenue growth | step 1 + the shift | 6.1648% | 3.4966% | 3.6056% |
| 3 | Revenue | last year's revenue (FY2025: 11,692.6) x (1 + step 2) | 12,413.43 | 12,847.48 | 13,310.71 |
| 4 | Workbook EBITDA margin | EBITDA / revenue (E19/E17, F19/F17, G19/G17) | 24.6826% | 26.9274% | 27.4840% |
| 5 | Scenario EBITDA margin | step 4 + the shift | 26.1826% | 28.4274% | 28.9840% |
| 6 | EBITDA | step 3 x step 5 | 3,250.16 | 3,652.21 | 3,857.97 |
| 7 | EBIT | step 6 - D&A | 2,761.75 | 3,093.88 | 3,289.01 |
| 8 | Tax on EBIT | step 7 x tax rate | 787.10 | 866.29 | 904.48 |
| 9 | NOPAT | step 7 - step 8 | 1,974.65 | 2,227.60 | 2,384.53 |
| 10 | Unlevered free cash flow | step 9 + D&A + change in NWC + capex | 1,737.76 | 2,094.02 | 2,143.99 |
| 11 | Cash flow counted | FY2026: step 10 x stub fraction; later years: step 10 | 415.13 | 2,094.02 | 2,143.99 |
| 12 | Years to discount | (discount date - valuation date) / 365 = 87, 452, 818 days / 365 | 0.238356 | 1.238356 | 2.241096 |
| 13 | Discount factor | (1 + WACC) ^ step 12 | 1.015146 | 1.081232 | 1.151820 |
| 14 | Present value | step 11 / step 13 | 408.94 | 1,936.70 | 1,861.40 |

| Step | Line | How | Value |
|---|---|---|---|
| 15 | Present value of FY2026 to FY2028 | sum of step 14 | 4,207.04 |
| 16 | FY2028 EBITDA | FY2028 step 6 | 3,857.97 |
| 17 | Terminal value in 2028 | step 16 x 13.02 | 50,230.81 |
| 18 | Present value of terminal value | step 17 / FY2028 step 13 (1.151820) | 43,609.96 |
| 19 | Enterprise value | step 15 + step 18 | 47,817.00 |
| 20 | Equity value | step 19 - net debt (3,755.1) | 44,061.90 |
| 21 | Equity value per share | step 20 / diluted shares (207.154374) | $212.70 |

## Related
- [[03 Drafts/Milestone 4 - DCF Valuation Memo]]
- [[01 Sources/S9 Team Q&D workbook for Hershey]]
