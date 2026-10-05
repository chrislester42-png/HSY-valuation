# Module 2: Data pull, Hershey (HSY)

Team: Chris Lester. Date: 2026-10-04. Workbook: `workbook/QD-HSY.xlsx`, tab Detail Data. Dollars in millions to one decimal.

Source: SEC XBRL company facts for The Hershey Company (CIK 0000047111), https://data.sec.gov/api/xbrl/companyfacts/CIK0000047111.json, read 2026-10-04. Form 10-K values only, each fiscal year taken from that year's original 10-K, never a later restatement. Written into the workbook with `scripts/fill_workbook.py`. Column C is FY2024 and column D is FY2025 once FrontPage C4 holds a 2026 date; the t-1 rows (6 and 18) hold the year before.

## Actual columns

| Cell | Row | Fiscal year | Value | XBRL tag | Form | Filing date | Accession number | Link |
|---|---|---|---|---|---|---|---|---|
| C5 | Revenue (t) - Current FY | FY2024 | 11202.3 | us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D5 | Revenue (t) - Current FY | FY2025 | 11692.6 | us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C6 | Revenue (t-1) - Previous FY | FY2023 | 11165.0 | us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2024-02-20 | 0000047111-24-000009 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711124000009/0000047111-24-000009-index.htm) |
| D6 | Revenue (t-1) - Previous FY | FY2024 | 11202.3 | us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| C15 | Cost of Sales | FY2024 | 5901.4 | us-gaap:CostOfGoodsAndServicesSold | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D15 | Cost of Sales | FY2025 | 7769.9 | us-gaap:CostOfGoodsAndServicesSold | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C16 | EBIT (aka Pre-Tax Income / Oper Inc) | FY2024 | 2898.2 | us-gaap:OperatingIncomeLoss | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D16 | EBIT (aka Pre-Tax Income / Oper Inc) | FY2025 | 1441.5 | us-gaap:OperatingIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C17 | Net Income (t) - Current FY | FY2024 | 2221.2 | us-gaap:NetIncomeLoss | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D17 | Net Income (t) - Current FY | FY2025 | 883.3 | us-gaap:NetIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C18 | Net Income (t-1) - Previous FY | FY2023 | 1861.8 | us-gaap:NetIncomeLoss | 10-K | 2024-02-20 | 0000047111-24-000009 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711124000009/0000047111-24-000009-index.htm) |
| D18 | Net Income (t-1) - Previous FY | FY2024 | 2221.2 | us-gaap:NetIncomeLoss | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| C19 | Interest Expense | FY2024 | 165.7 | us-gaap:InterestIncomeExpenseNonoperatingNet (sign flipped) | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D19 | Interest Expense | FY2025 | 190.2 | us-gaap:InterestIncomeExpenseNonoperatingNet (sign flipped) | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C20 | Income Taxes | FY2024 | 252.7 | us-gaap:IncomeTaxExpenseBenefit | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D20 | Income Taxes | FY2025 | 330.9 | us-gaap:IncomeTaxExpenseBenefit | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C28 | CASH & MKTBLE SECURITIES | FY2024 | 730.7 | us-gaap:CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D28 | CASH & MKTBLE SECURITIES | FY2025 | 925.9 | us-gaap:CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C30 | Total Assets | FY2024 | 12946.9 | us-gaap:Assets | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D30 | Total Assets | FY2025 | 13741.3 | us-gaap:Assets | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C31 | Current Assets | FY2024 | 3759.5 | us-gaap:AssetsCurrent | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D31 | Current Assets | FY2025 | 3588.9 | us-gaap:AssetsCurrent | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C32 | Current Liabilities | FY2024 | 3929.5 | us-gaap:LiabilitiesCurrent | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D32 | Current Liabilities | FY2025 | 3011.9 | us-gaap:LiabilitiesCurrent | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C34 | Long Term Debt | FY2024 | 3190.2 | us-gaap:LongTermDebtAndCapitalLeaseObligations | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D34 | Long Term Debt | FY2025 | 4681.2 | us-gaap:LongTermDebtAndCapitalLeaseObligations | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C35 | Equity | FY2024 | 4714.7 | us-gaap:StockholdersEquity | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D35 | Equity | FY2025 | 4636.8 | us-gaap:StockholdersEquity | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C38 | Depreciation + Amortization | FY2024 | 455.3 | us-gaap:DepreciationDepletionAndAmortization | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D38 | Depreciation + Amortization | FY2025 | 503.7 | us-gaap:DepreciationDepletionAndAmortization | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C40 | Capital Expenditures (PPE) | FY2024 | 605.9 | us-gaap:PaymentsToAcquirePropertyPlantAndEquipment | 10-K | 2025-02-18 | 0000047111-25-000014 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000004711125000014/0000047111-25-000014-index.htm) |
| D40 | Capital Expenditures (PPE) | FY2025 | 454.6 | us-gaap:PaymentsToAcquirePropertyPlantAndEquipment | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |

## How each figure was chosen

- EBIT (row 16) is GAAP operating income, `OperatingIncomeLoss`.
- Interest Expense (row 19) is the income statement line "Interest expense, net", tagged `InterestIncomeExpenseNonoperatingNet` and reported as a negative number; the sign is flipped so the sheet shows a positive expense. Gross interest expense (`InterestExpense`) is 174.3 for FY2024 and 224.8 for FY2025, if the team prefers the gross figure.
- Cash (row 28) uses `CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents`, the only cash tag Hershey files at year end. Hershey reports no marketable securities.
- Long Term Debt (row 34) is the balance sheet's long-term debt line excluding the current portion, tagged `LongTermDebtAndCapitalLeaseObligations`.
- Equity (row 35) is total stockholders' equity, `StockholdersEquity`.
- Depreciation + Amortization (row 38) is `DepreciationDepletionAndAmortization` from the cash flow statement.
- Capital Expenditures (row 40) is purchases of property, plant and equipment, `PaymentsToAcquirePropertyPlantAndEquipment`.

## Left blank for a person to type from the 10-K

| Cell | Row | Why blank |
|---|---|---|
| C9, D9 | FD Shares outstanding (M) | The XBRL feed carries no weighted-average diluted share count for Hershey. Type it from the earnings per share note of each 10-K. |
| (no cell) | Cash from Operating Activities | Detail Data has no row for it. For reference only, `NetCashProvidedByUsedInOperatingActivities` is 2,531.6 for FY2024 and 2,277.4 for FY2025 (same filings as above). |

Not part of this fill, still blank: C7, D7, C8, D8 (FD EPS; the feed carries no diluted EPS for Hershey) and C21, D21 (EBITDA; the filings do not report it).

## Forecast columns

Source: FactSet consensus export, source note [[01 Sources/S8 FactSet consensus estimates for Hershey]] (S8), file `research/01 Sources/_files/download (3).xlsx`, valuation data as of 02 Oct '26, saved 2026-10-04. Fiscal-year columns Dec '26E to Dec '28E only; the export has no quarter columns. Values rounded to one decimal from the export's figures. Written with `scripts/fill_workbook.py` on 2026-10-04.

| Cell | Row | Fiscal year | Value | Export row | Export figure | Source note |
|---|---|---|---|---|---|---|
| E5 | Revenue (t) - Current FY | FY2026 | 12296.5 | Income Statement (M) > Sales | 12296.5 | S8 |
| F5 | Revenue (t) - Current FY | FY2027 | 12603.5 | Income Statement (M) > Sales | 12603.5 | S8 |
| G5 | Revenue (t) - Current FY | FY2028 | 12931.9 | Income Statement (M) > Sales | 12931.9 | S8 |
| E15 | Cost of Sales | FY2026 | 7240.4 | Income Statement (M) > Cost of Sales | 7240.35 | S8 |
| F15 | Cost of Sales | FY2027 | 7074.5 | Income Statement (M) > Cost of Sales | 7074.45 | S8 |
| G15 | Cost of Sales | FY2028 | 7220.6 | Income Statement (M) > Cost of Sales | 7220.58 | S8 |
| E17 | Net Income (t) - Current FY | FY2026 | 1710.5 | Income Statement (M) > Net Income - GAAP | 1710.45 | S8 |
| F17 | Net Income (t) - Current FY | FY2027 | 1988.8 | Income Statement (M) > Net Income - GAAP | 1988.82 | S8 |
| G17 | Net Income (t) - Current FY | FY2028 | 2108.4 | Income Statement (M) > Net Income - GAAP | 2108.4 | S8 |
| E20 | Income Taxes | FY2026 | 597.7 | Income Statement (M) > Tax Expense | 597.737 | S8 |
| F20 | Income Taxes | FY2027 | 689.8 | Income Statement (M) > Tax Expense | 689.812 | S8 |
| G20 | Income Taxes | FY2028 | 707.8 | Income Statement (M) > Tax Expense | 707.8 | S8 |
| E21 | EBITDA | FY2026 | 3035.1 | Income Statement (M) > EBITDA | 3035.06 | S8 |
| F21 | EBITDA | FY2027 | 3393.8 | Income Statement (M) > EBITDA | 3393.81 | S8 |
| G21 | EBITDA | FY2028 | 3554.2 | Income Statement (M) > EBITDA | 3554.16 | S8 |
| E28 | CASH & MKTBLE SECURITIES | FY2026 | 1451.5 | Balance Sheet (M) > Cash and Cash Equivalents | 1451.5 | S8 |
| F28 | CASH & MKTBLE SECURITIES | FY2027 | 1635.5 | Balance Sheet (M) > Cash and Cash Equivalents | 1635.5 | S8 |
| G28 | CASH & MKTBLE SECURITIES | FY2028 | 1909.5 | Balance Sheet (M) > Cash and Cash Equivalents | 1909.5 | S8 |
| E30 | Total Assets | FY2026 | 13983.3 | Balance Sheet (M) > Total Assets | 13983.3 | S8 |
| F30 | Total Assets | FY2027 | 14093.3 | Balance Sheet (M) > Total Assets | 14093.3 | S8 |
| G30 | Total Assets | FY2028 | 14406.0 | Balance Sheet (M) > Total Assets | 14406 | S8 |
| E31 | Current Assets | FY2026 | 4123.0 | Balance Sheet (M) > Current Assets | 4123 | S8 |
| F31 | Current Assets | FY2027 | 4242.0 | Balance Sheet (M) > Current Assets | 4242 | S8 |
| G31 | Current Assets | FY2028 | 4541.0 | Balance Sheet (M) > Current Assets | 4541 | S8 |
| E32 | Current Liabilities | FY2026 | 3261.5 | Balance Sheet (M) > Current Liabilities | 3261.5 | S8 |
| F32 | Current Liabilities | FY2027 | 3192.5 | Balance Sheet (M) > Current Liabilities | 3192.5 | S8 |
| G32 | Current Liabilities | FY2028 | 3195.5 | Balance Sheet (M) > Current Liabilities | 3195.5 | S8 |
| E34 | Long Term Debt | FY2026 | 4693.7 | Balance Sheet (M) > Long-Term Debt | 4693.67 | S8 |
| F34 | Long Term Debt | FY2027 | 4627.0 | Balance Sheet (M) > Long-Term Debt | 4627 | S8 |
| G34 | Long Term Debt | FY2028 | 4560.3 | Balance Sheet (M) > Long-Term Debt | 4560.33 | S8 |
| E35 | Equity | FY2026 | 4780.2 | Balance Sheet (M) > Shareholder Equity | 4780.18 | S8 |
| F35 | Equity | FY2027 | 5081.8 | Balance Sheet (M) > Shareholder Equity | 5081.75 | S8 |
| G35 | Equity | FY2028 | 5441.8 | Balance Sheet (M) > Shareholder Equity | 5441.82 | S8 |
| E40 | Capital Expenditures (PPE) | FY2026 | 440.8 | Cash Flow (M) > Capital Expenditures | 440.815 | S8 |
| F40 | Capital Expenditures (PPE) | FY2027 | 503.9 | Cash Flow (M) > Capital Expenditures | 503.945 | S8 |
| G40 | Capital Expenditures (PPE) | FY2028 | 513.5 | Cash Flow (M) > Capital Expenditures | 513.495 | S8 |

Every mapped row had a figure for all three years, so no forecast input cell is blank.

The EBITDA row used is FactSet's headline "EBITDA". The export also carries EBITDA GAAP (3,076.7, 3,429.1, 3,525.5) and EBITDA Non-GAAP (3,057.2, 3,404.7, 3,553.4).

Formula rows left to the sheet: Revenue (t-1), FD EPS, FD Shares (held at the FY2025 count), EBIT (EBITDA less D&A), Net Income (t-1), Interest Expense (WACC tab, Module 3), D&A, NOPAT, change in NWC, FCFF, FCFE.

## Added 2026-10-04: the remaining Detail Data inputs and the FrontPage

Typed with `scripts/fill_workbook.py` after video 2a. Each figure names where it came from; the person still checks them on the verification form.

| Cell | Row | Year | Value | Source |
|---|---|---|---|---|
| C9 | FD Shares outstanding (M) | FY2024 | 203.5 | FY2025 Form 10-K, Note 16 Earnings Per Share, page 97: total weighted-average shares, diluted, Common Stock, 203,487 thousand (S1) |
| D9 | FD Shares outstanding (M) | FY2025 | 203.4 | same note: 203,379 thousand (S1) |
| C7 | FD EPS (t) | FY2024 | 10.92 | same note: Earnings Per Share, diluted, Common Stock (S1) |
| D7 | FD EPS (t) | FY2025 | 4.34 | same note (S1) |
| C8 | FD EPS (t-1) | FY2023 | 9.06 | same note (S1) |
| D8 | FD EPS (t-1) | FY2024 | 10.92 | same note (S1) |
| C21 | EBITDA | FY2024 | 3,353.5 | Derived: EBIT 2,898.2 plus D&A 455.3. The filing does not report EBITDA |
| D21 | EBITDA | FY2025 | 1,945.2 | Derived: EBIT 1,441.5 plus D&A 503.7 |

FrontPage: price 159.46 is the close on 2026-10-02 as shown on the FactSet company screen; S&P 500 a year earlier 6,715.35 (close 2025-10-02) and current 7,722.72 (close 2026-10-02) are FRED series SP500; most recent quarter reported is 2QFY26 (the third quarter is expected 2026-10-22). The S&P 500 targets and index earnings in C8, C9 and F7 to F9 are Dr. Payne's template values, unchanged. The text boxes (description, segments, unit economics, catalysts, moat, strengths, risks) are drawn from the Milestone 1 memo and the FY2025 Form 10-K and carry their source ids. The four peers (Mondelez, Nestle, Lindt and Spruengli, General Mills) are provisional until the Module 5 peer screen.

Still empty by design: C37, D37, C39, D39, C41, D41, C42, D42. Dr. Payne's template computes NOPAT, change in NWC, FCFF, and FCFE for the forecast years only.

Two template formulas to raise with Dr. Payne, not changed here: the forecast FD EPS row divides revenue by shares (E7:G7), so the FrontPage P/E on forward years reads 2.6x; the FCFE row adds after-tax interest (E42:G42), which will show once Module 3 fills the cost of debt.
