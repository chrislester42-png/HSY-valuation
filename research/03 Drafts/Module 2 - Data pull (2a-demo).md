# Module 2: Data pull from SEC EDGAR, HERSHEY CO (HSY)

Source: SEC XBRL company facts, https://data.sec.gov/api/xbrl/companyfacts/CIK0000047111.json, read 2026-10-05 by scripts/fill_detail_data_from_edgar.py. Workbook: `workbook/2a-demo/QD-HSY.xlsx`, tab Detail Data. Dollars and shares in millions.

## Actual columns

| Cell | Row | Fiscal year end | Value | XBRL tag | Form | Filing date | Accession number | Link |
|---|---|---|---|---|---|---|---|---|
| C5 | Revenue (t) - Current FY | 2024-12-31 | 11202.3 | RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C6 | Revenue (t-1) - Previous FY | 2023-12-31 | 11165.0 | RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C15 | Cost of Sales | 2024-12-31 | 5901.4 | CostOfGoodsAndServicesSold | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C16 | EBIT (aka Pre-Tax Income / Oper Inc) | 2024-12-31 | 2898.2 | OperatingIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C17 | Net Income (t) - Current FY | 2024-12-31 | 2221.2 | NetIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C18 | Net Income (t-1) - Previous FY | 2023-12-31 | 1861.8 | NetIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C19 | Interest Expense | 2024-12-31 | 165.7 | InterestIncomeExpenseNonoperatingNet (sign flipped) | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C20 | Income Taxes | 2024-12-31 | 252.7 | IncomeTaxExpenseBenefit | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C28 | CASH & MKTBLE SECURITIES | 2024-12-31 | 730.7 | CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C30 | Total Assets | 2024-12-31 | 12946.9 | Assets | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C31 | Current Assets | 2024-12-31 | 3759.5 | AssetsCurrent | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C32 | Current Liabilities | 2024-12-31 | 3929.5 | LiabilitiesCurrent | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C34 | Long Term Debt | 2024-12-31 | 3190.2 | LongTermDebtAndCapitalLeaseObligations | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C35 | Equity | 2024-12-31 | 4714.7 | StockholdersEquity | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C38 | Depreciation + Amortization | 2024-12-31 | 455.3 | DepreciationDepletionAndAmortization | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C40 | Capital Expenditures (PPE) | 2024-12-31 | 605.9 | PaymentsToAcquirePropertyPlantAndEquipment | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| C21 | EBITDA | 2024-12-31 | 3353.5 | derived: EBIT + Depreciation and Amortization |  |  |  |  |
| D5 | Revenue (t) - Current FY | 2025-12-31 | 11692.6 | RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D6 | Revenue (t-1) - Previous FY | 2024-12-31 | 11202.3 | RevenueFromContractWithCustomerExcludingAssessedTax | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D15 | Cost of Sales | 2025-12-31 | 7769.9 | CostOfGoodsAndServicesSold | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D16 | EBIT (aka Pre-Tax Income / Oper Inc) | 2025-12-31 | 1441.5 | OperatingIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D17 | Net Income (t) - Current FY | 2025-12-31 | 883.3 | NetIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D18 | Net Income (t-1) - Previous FY | 2024-12-31 | 2221.2 | NetIncomeLoss | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D19 | Interest Expense | 2025-12-31 | 190.2 | InterestIncomeExpenseNonoperatingNet (sign flipped) | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D20 | Income Taxes | 2025-12-31 | 330.9 | IncomeTaxExpenseBenefit | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D28 | CASH & MKTBLE SECURITIES | 2025-12-31 | 925.9 | CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D30 | Total Assets | 2025-12-31 | 13741.3 | Assets | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D31 | Current Assets | 2025-12-31 | 3588.9 | AssetsCurrent | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D32 | Current Liabilities | 2025-12-31 | 3011.9 | LiabilitiesCurrent | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D34 | Long Term Debt | 2025-12-31 | 4681.2 | LongTermDebtAndCapitalLeaseObligations | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D35 | Equity | 2025-12-31 | 4636.8 | StockholdersEquity | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D38 | Depreciation + Amortization | 2025-12-31 | 503.7 | DepreciationDepletionAndAmortization | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D40 | Capital Expenditures (PPE) | 2025-12-31 | 454.6 | PaymentsToAcquirePropertyPlantAndEquipment | 10-K | 2026-02-17 | 0001628280-26-008586 | [filing index](https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/0001628280-26-008586-index.htm) |
| D21 | EBITDA | 2025-12-31 | 1945.2 | derived: EBIT + Depreciation and Amortization |  |  |  |  |

## Left for a person to type from the 10-K

| Cell | Row | Fiscal year end | Where to look |
|---|---|---|---|
| C7 | FD EPS (t) - Current FY | 2024-12-31 | the income statement, or the earnings per share note (companies with two share classes report it only there) |
| C8 | FD EPS (t-1) - Previous FY | 2023-12-31 | the income statement, or the earnings per share note (companies with two share classes report it only there) |
| C9 | FD Shares outstanding (M) | 2024-12-31 | the earnings per share note: weighted-average diluted shares |
| D7 | FD EPS (t) - Current FY | 2025-12-31 | the income statement, or the earnings per share note (companies with two share classes report it only there) |
| D8 | FD EPS (t-1) - Previous FY | 2024-12-31 | the income statement, or the earnings per share note (companies with two share classes report it only there) |
| D9 | FD Shares outstanding (M) | 2025-12-31 | the earnings per share note: weighted-average diluted shares |

Every figure above is unverified until a person has found it in the filing.
