# Project Milestone 3: Cost of Capital Memo

> Markdown copy of `Milestone 3 - Cost of Capital Memo.docx`, saved 2026-10-05 so it opens in Obsidian. Each number links to its atomic note; the .docx is the text we submit. Filing note: the Hamada beta of 0.35 comes from a WACC tab cell (C24) with a misplaced bracket; see [[02 Atomic Notes/Hamada beta 0.35 cross-check|its note]].

**Company:** The Hershey Company (NYSE: HSY). **Team:** Chris Lester. **Date:** 2026-10-05.

**Conclusion:** Hershey's weighted average cost of capital is [[02 Atomic Notes/WACC 6.78 percent|6.78 percent]]: a [[02 Atomic Notes/Cost of equity 7.11 percent|7.11 percent]] cost of equity on [[02 Atomic Notes/Equity weight 87.4 percent|87.4 percent]] of the capital and a [[02 Atomic Notes/After-tax cost of debt 4.49 percent|4.49 percent]] after-tax cost of debt on [[02 Atomic Notes/Debt weight 12.6 percent|12.6 percent]]. No size, private-firm, or country risk adjustment applies. The inputs are on the WACC calculation tab of our Q&D workbook ([[01 Sources/S9 Team Q&D workbook for Hershey|S9]]), and each one below is tagged Reported (R), Derived (D), or Estimate (E).

## 1. Cost of equity: 7.11 percent

Cost of equity = risk-free rate + beta x equity risk premium = [[02 Atomic Notes/10-year Treasury yield 5.28 percent on 2 October 2026|5.28%]] + [[02 Atomic Notes/Adjusted beta 0.4102|0.4102]] x [[02 Atomic Notes/US equity risk premium 4.46 percent January 2026|4.46%]] = [[02 Atomic Notes/Cost of equity 7.11 percent|7.11%]].

**Risk-free rate, [[02 Atomic Notes/10-year Treasury yield 5.28 percent on 2 October 2026|5.28 percent]] (R).** The 10-year US Treasury par yield on October 2, 2026 ([[01 Sources/S13 US Treasury daily par yield curve 2026|S13]]). Our cash flows are in US dollars, so a US Treasury rate is the default-free rate that matches them.

**Equity risk premium, [[02 Atomic Notes/US equity risk premium 4.46 percent January 2026|4.46 percent]] (R).** Damodaran's total equity risk premium for the United States, January 2026 ([[01 Sources/S12 Damodaran country risk premiums January 2026|S12]]). It is his implied premium for the S&P 500 and already includes the US country default spread of [[02 Atomic Notes/US country default spread 0.23 percent January 2026|0.23 percent]].

**Beta, [[02 Atomic Notes/Adjusted beta 0.4102|0.4102]] (E).** We ran a regression of Hershey's monthly excess returns on the S&P 500's (SPY), with BIL as the risk-free return, over the 60 months from September 2021 to August 2026 ([[01 Sources/S14 Yahoo Finance monthly prices for HSY SPY and BIL|S14]]). The raw beta is [[02 Atomic Notes/HSY raw regression beta 0.1153 over 60 months|0.1153]] (D). Its standard error is [[02 Atomic Notes/Regression beta standard error 0.195 and R-squared 0.006|0.195]] and the R-squared is [[02 Atomic Notes/Regression beta standard error 0.195 and R-squared 0.006|0.006]], so the raw figure cannot be told apart from zero. We therefore use the adjusted beta, (2/3) x 0.1153 + (1/3) x 1 = 0.4102, which pulls a noisy estimate toward the market average of 1. This is our judgment (Chris Lester). A defensive consumer staple should have a low beta, but not one near zero.

**Cross-checks on the WACC tab.** Hamada's method gives [[02 Atomic Notes/Hamada beta 0.35 cross-check|0.35]] (D): Damodaran's food processing average beta of [[02 Atomic Notes/Food processing industry beta 0.61|0.61]], at a [[02 Atomic Notes/Food processing industry debt to equity 43.73 percent|43.73 percent]] debt-to-equity ratio and a [[02 Atomic Notes/Food processing industry tax rate 10.37 percent|10.37 percent]] tax rate ([[01 Sources/S10 Damodaran betas by sector January 2026|S10]]), unlevered and then relevered at Hershey's debt-to-equity of [[02 Atomic Notes/Hershey debt to equity 14.37 percent|14.37 percent]] and our [[02 Atomic Notes/WACC tax rate 22.96 percent|22.96 percent]] tax rate. FactSet's beta is [[02 Atomic Notes/FactSet beta 0.34|0.34]] (R) ([[01 Sources/S8 FactSet consensus estimates for Hershey|S8]]). All three methods put Hershey far below the market's beta of 1, as a defensive consumer staple should be. We use the adjusted regression beta, the highest of the three, which keeps the cost of equity conservative.

## 2. Cost of debt: 5.83 percent before tax, 4.49 percent after tax

**Interest coverage, [[02 Atomic Notes/FY2025 interest coverage 7.58|7.58]] (D).** FY2025 operating income of 1,441.5 divided by net interest expense of 190.2 ([[01 Sources/S1 Hershey Form 10-K FY2025|S1]], pages 27 and 53).

**Synthetic rating and spread, [[02 Atomic Notes/Synthetic rating Aa2 AA with 0.55 percent default spread|Aa2/AA and 0.55 percent]] (R).** For large non-financial firms, Damodaran's table maps coverage between 6.5 and 8.5 to Aa2/AA with a 0.55 percent default spread (January 2026) ([[01 Sources/S11 Damodaran ratings coverage and default spreads January 2026|S11]]).

**Pre-tax cost of debt, [[02 Atomic Notes/Pre-tax cost of debt 5.83 percent|5.83 percent]] (D).** 5.28% + 0.55%. Hershey's notes due 2028 to 2035, sold in February 2025, carry coupons of [[02 Atomic Notes/Hershey notes due 2028 to 2035 carry 4.55 to 5.10 percent coupons|4.55 to 5.10 percent]], so the estimate is in line with what the company actually pays ([[01 Sources/S1 Hershey Form 10-K FY2025|S1]]).

**Tax rate, [[02 Atomic Notes/WACC tax rate 22.96 percent|22.96 percent]] (D).** FY2025 income taxes of 330.9 divided by operating income of 1,441.5 ([[01 Sources/S1 Hershey Form 10-K FY2025|S1]]). **After-tax cost of debt: 5.83% x (1 - 0.2296) = [[02 Atomic Notes/After-tax cost of debt 4.49 percent|4.49 percent]] (D).**

## 3. WACC: 6.78 percent

| | Value | Weight | Tier | Note |
| --- | --- | --- | --- | --- |
| Market value of equity | 32,582.6 (203.4 million diluted shares x 160.19 dollars, close on October 2, 2026) | 87.4% | D | [[02 Atomic Notes/Equity weight 87.4 percent]] |
| Debt | 4,681 (long-term debt, December 31, 2025) | 12.6% | R | [[02 Atomic Notes/Debt weight 12.6 percent]] |
| Total capital | 37,263.6 | 100% | D | Workbook, WACC calculation tab (S9) |

WACC = 87.4% x 7.11% + 12.6% x 4.49% = [[02 Atomic Notes/WACC 6.78 percent|6.78 percent]] (D). Dollars are in millions ([[01 Sources/S9 Team Q&D workbook for Hershey|S9]], [[01 Sources/S1 Hershey Form 10-K FY2025|S1]]).

**Book value for debt ([[02 Atomic Notes/Debt valued at book value 4,681 million dollars|E]]).** We use the book value of long-term debt as the estimate of its market value. Hershey's long-term debt is fixed-rate notes, so book value is a reasonable stand-in (Chris Lester).

## 4. Risk adjustments: none

- **Size.** At a 32.6 billion dollar market capitalization, Hershey is a large-cap company. A small-cap premium does not apply.
- **Private firm.** Hershey trades on the NYSE, so no illiquidity or marketability discount applies.
- **Country.** United States net sales were [[02 Atomic Notes/FY2025 US net sales 10.25 billion dollars|10,251.6]] of [[02 Atomic Notes/FY2025 net sales 11.69 billion dollars|11,692.6]] in FY2025, or [[02 Atomic Notes/FY2025 US share of net sales 87.7 percent|87.7 percent]] ([[01 Sources/S1 Hershey Form 10-K FY2025|S1]], page 93). The International segment was [[02 Atomic Notes/FY2025 International segment net sales 941.6 million dollars|941.6, or 8.1 percent]] ([[01 Sources/S1 Hershey Form 10-K FY2025|S1]], page 29). The US equity risk premium we use already contains the [[02 Atomic Notes/US country default spread 0.23 percent January 2026|US country spread]] ([[01 Sources/S12 Damodaran country risk premiums January 2026|S12]]). Only the remaining [[02 Atomic Notes/No country risk adjustment for 12.3 percent non-US sales|12.3 percent]] of sales could carry a higher country premium, and we judge that too small to change the WACC (E, Chris Lester), so we do not adjust. We take the same position, a single US premium, in this module's discussion of blended country risk.

## 5. How we verified each input

We asked Claude to find each input on the WACC tab in its primary source and show us where it appears. The table lists what it found.

| Input | Check | Result |
| --- | --- | --- |
| Regression beta 0.1153 | Reran the 60-month regression with the same method (yfinance, statsmodels) | Matches for September 2021 to August 2026 |
| Equity risk premium 4.46% | Damodaran country premium table, US row (S12) | Matches |
| Industry beta, D/E, tax rate | Damodaran betas by sector, Food Processing row (S10) | 0.61, 43.73%, 10.37% match |
| Default spread 0.55% | Damodaran ratings table, coverage 6.5 to 8.5 (S11) | Matches |
| Risk-free rate 5.28% | Treasury daily par yield curve, October 2, 2026 (S13) | Matches the 10-year yield |
| Interest coverage 7.58 | FY2025 operating income and net interest expense in the 10-K (S1) | Matches |

## Inputs for the Knowledge Bank

| Input | Value | Tier | Source | Note |
| --- | --- | --- | --- | --- |
| Risk-free rate (10-year Treasury, 2026-10-02) | 5.28% | R | S13 | [[02 Atomic Notes/10-year Treasury yield 5.28 percent on 2 October 2026]] |
| Equity risk premium (US, January 2026) | 4.46% | R | S12 | [[02 Atomic Notes/US equity risk premium 4.46 percent January 2026]] |
| Raw regression beta (60 months) | 0.1153 | D | S14 | [[02 Atomic Notes/HSY raw regression beta 0.1153 over 60 months]] |
| Adjusted beta | 0.4102 | E (Chris Lester) | S14 | [[02 Atomic Notes/Adjusted beta 0.4102]] |
| Hamada beta, cross-check | 0.35 | D | S10 | [[02 Atomic Notes/Hamada beta 0.35 cross-check]] |
| FactSet beta, cross-check | 0.34 | R | S8 | [[02 Atomic Notes/FactSet beta 0.34]] |
| Cost of equity | 7.11% | D | S9 | [[02 Atomic Notes/Cost of equity 7.11 percent]] |
| Interest coverage, FY2025 | 7.58 | D | S1 | [[02 Atomic Notes/FY2025 interest coverage 7.58]] |
| Synthetic rating and default spread | Aa2/AA, 0.55% | R | S11 | [[02 Atomic Notes/Synthetic rating Aa2 AA with 0.55 percent default spread]] |
| Pre-tax cost of debt | 5.83% | D | S9 | [[02 Atomic Notes/Pre-tax cost of debt 5.83 percent]] |
| Tax rate | 22.96% | D | S1 | [[02 Atomic Notes/WACC tax rate 22.96 percent]] |
| After-tax cost of debt | 4.49% | D | S9 | [[02 Atomic Notes/After-tax cost of debt 4.49 percent]] |
| Equity weight | 87.4% | D | S9 | [[02 Atomic Notes/Equity weight 87.4 percent]] |
| Debt weight | 12.6% | D | S1, S9 | [[02 Atomic Notes/Debt weight 12.6 percent]] |
| WACC | 6.78% | D | S9 | [[02 Atomic Notes/WACC 6.78 percent]] |
| US share of net sales, FY2025 | 87.7% | D | S1 | [[02 Atomic Notes/FY2025 US share of net sales 87.7 percent]] |

## Sources

| id | Source | Publisher | Date | Link | Note |
| --- | --- | --- | --- | --- | --- |
| S1 | The Hershey Company Form 10-K for fiscal 2025, accession 0001628280-26-008586 | SEC EDGAR | 2026-02-17 | https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/hsy-20251231.htm | [[01 Sources/S1 Hershey Form 10-K FY2025]] |
| S8 | FactSet consensus estimates and beta for Hershey | FactSet | 2026-10-04 | FactSet terminal (licensed; not linked) | [[01 Sources/S8 FactSet consensus estimates for Hershey]] |
| S9 | Team Q&D workbook for Hershey, WACC calculation tab | FIN 5370 HSY team | 2026-10-05 | workbook/QD-HSY.xlsx | [[01 Sources/S9 Team Q&D workbook for Hershey]] |
| S10 | Betas by Sector (US) | Aswath Damodaran, NYU Stern | January 2026 | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html | [[01 Sources/S10 Damodaran betas by sector January 2026]] |
| S11 | Ratings, Interest Coverage Ratios and Default Spread | Aswath Damodaran, NYU Stern | January 2026 | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ratings.html | [[01 Sources/S11 Damodaran ratings coverage and default spreads January 2026]] |
| S12 | Country Default Spreads and Risk Premiums | Aswath Damodaran, NYU Stern | 2026-01-05 | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html | [[01 Sources/S12 Damodaran country risk premiums January 2026]] |
| S13 | Daily Treasury Par Yield Curve Rates, 2026 | US Department of the Treasury | 2026-10-02 | https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value=2026 | [[01 Sources/S13 US Treasury daily par yield curve 2026]] |
| S14 | Monthly adjusted prices for HSY, SPY, and BIL, September 2021 to August 2026, pulled with yfinance | Yahoo Finance | accessed 2026-10-05 | https://finance.yahoo.com/quote/HSY/history | [[01 Sources/S14 Yahoo Finance monthly prices for HSY SPY and BIL]] |

## Numbers we still need

- The closing share price of 160.19 dollars on October 2, 2026. With 203.4 million diluted shares it gives the 32,582.6 market value of equity. The workbook holds the market value, but no source note records the price. Add a source (for example Yahoo Finance's HSY history for October 2, 2026) and an atomic note.
