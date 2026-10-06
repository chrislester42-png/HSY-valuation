# Project Milestone 4: DCF Valuation with Sensitivity Analysis

> Markdown copy of `Milestone 4 - DCF Valuation Memo.docx`, saved 2026-10-05 so it opens in Obsidian. Each number links to its atomic note; the .docx is the text we submit. Numbers from the workbook ([[01 Sources/S9 Team Q&D workbook for Hershey|S9]]) that the memo does not list as inputs, such as the forecast lines and the sensitivity table cells, trace to the workbook and have no note. Filing notes: the DCF tab labels its [[02 Atomic Notes/Diluted shares 207.2 million|207.2 million diluted shares]] as from a Q1 2020 10-Q, and the Milestone 3 memo used 203.4 million; the [[02 Atomic Notes/HSY share price 160.19 dollars on 5 October 2026|160.19 dollar share price]] is dated October 5 here and October 2 in the Milestone 3 memo. Both notes say what to check.

**Company:** The Hershey Company (NYSE: HSY). **Team:** Chris Lester. **Date:** 2026-10-05.

**Conclusion:** Our discounted cash flow model values Hershey at **[[02 Atomic Notes/Equity value per share 218.59 dollars by growth in perpetuity|$218.59 per share]]** with a growth-in-perpetuity terminal value and **[[02 Atomic Notes/Equity value per share 193.02 dollars by exit multiple|$193.02 per share]]** with an exit-multiple terminal value, against a share price of [[02 Atomic Notes/HSY share price 160.19 dollars on 5 October 2026|$160.19 on October 5, 2026]]: [[02 Atomic Notes/DCF values 36.5 and 20.5 percent above share price|36.5 percent and 20.5 percent above the market]]. Both figures come from the DCF 1-Pager tab of our Q&D workbook ([[01 Sources/S9 Team Q&D workbook for Hershey|S9]]), built on our Module 2 forecast and discounted at our Module 3 WACC of [[02 Atomic Notes/WACC 6.78 percent|6.78 percent]]. About [[02 Atomic Notes/Terminal value 92.3 and 91.3 percent of enterprise value|nine-tenths]] of the value sits in the terminal value, so the growth rate and the discount rate decide the answer.

## 1. Stage structure: two stages

Hershey is a mature company (our Module 1 diagnosis), so a two-stage model fits: an explicit forecast for FY2026 to FY2028, then stable growth. A transition stage would add nothing. Revenue growth in the forecast is already 5.2 percent in FY2026 and 2.5 and 2.6 percent in FY2027 and FY2028, close to the [[02 Atomic Notes/Perpetual growth rate 3.0 percent|3.0 percent]] we assume forever after.

| $ millions                       | 2026F (stub) | 2027F    | 2028F    |
| -------------------------------- | ------------ | -------- | -------- |
| Revenue                          | 12,296.5     | 12,603.5 | 12,931.9 |
| EBITDA                           | 3,035.1      | 3,393.8  | 3,554.2  |
| Unlevered free cash flow counted | 378.4        | 1,908.0  | 1,923.8  |
| Present value at 6.78%           | 372.5        | 1,759.1  | 1,660.7  |

The forecast is FactSet consensus run through our workbook (Module 2) ([[01 Sources/S8 FactSet consensus estimates for Hershey|S8]], [[01 Sources/S9 Team Q&D workbook for Hershey|S9]]). The valuation date is [[02 Atomic Notes/Valuation date 5 October 2026 with 23.9 percent stub|October 5, 2026]], so the model counts only the [[02 Atomic Notes/Valuation date 5 October 2026 with 23.9 percent stub|23.9 percent]] of FY2026’s cash flow that falls after it (the stub year). Each cash flow is discounted from its fiscal year end back to the valuation date at our Module 3 WACC of [[02 Atomic Notes/WACC 6.78 percent|6.78 percent]]. The tax rate on EBIT is 28.5 percent in FY2026, stepping down half a point a year. The three years together are worth [[02 Atomic Notes/Present value of 2026 to 2028 cash flows 3,792.3 million dollars|$3,792.3 million]] today.

## 2. Terminal value, two ways

| $ millions                                             | Growth in perpetuity | Exit multiple                 |
| ------------------------------------------------------ | -------------------- | ----------------------------- |
| Assumption                                             | g = 3.0%             | 13.02x 2028 EBITDA of 3,554.2 |
| Terminal value in 2028                                 | 52,410.9             | 46,275.7                      |
| Present value of terminal value                        | 45,244.6             | 39,948.3                      |
| Plus present value of 2026 to 2028                     | 3,792.3              | 3,792.3                       |
| Enterprise value                                       | 49,037.0             | 43,740.6                      |
| Terminal value as share of enterprise value            | 92.3%                | 91.3%                         |
| Less net debt (long-term debt 4,681.0 less cash 925.9) | 3,755.1              | 3,755.1                       |
| Equity value                                           | 45,281.9             | 39,985.5                      |
| Diluted shares (millions)                              | 207.2                | 207.2                         |
| **Equity value per share**                             | **$218.59**          | **$193.02**                   |

Notes for this table: [[02 Atomic Notes/Perpetual growth rate 3.0 percent|growth]], [[02 Atomic Notes/Exit multiple 13.02x 2028 EBITDA|multiple]], [[02 Atomic Notes/Terminal value by growth in perpetuity 52,410.9 million dollars|terminal value by growth]], [[02 Atomic Notes/Terminal value by exit multiple 46,275.7 million dollars|terminal value by multiple]], [[02 Atomic Notes/Present value of 2026 to 2028 cash flows 3,792.3 million dollars|present value of 2026 to 2028]], [[02 Atomic Notes/Terminal value 92.3 and 91.3 percent of enterprise value|terminal value share]], [[02 Atomic Notes/Net debt 3,755.1 million dollars|net debt]], [[02 Atomic Notes/Diluted shares 207.2 million|diluted shares]], [[02 Atomic Notes/Equity value per share 218.59 dollars by growth in perpetuity|per share by growth]], [[02 Atomic Notes/Equity value per share 193.02 dollars by exit multiple|per share by multiple]].

**Growth in perpetuity.** The 2028 free cash flow of 1,923.8, grown [[02 Atomic Notes/Perpetual growth rate 3.0 percent|3.0 percent]], is 1,981.5 in 2029; divided by the WACC less growth (6.78 - 3.00 = 3.78 percent) it gives a terminal value of [[02 Atomic Notes/Terminal value by growth in perpetuity 52,410.9 million dollars|52,410.9]]. A stable growth rate must stay below the risk-free rate, [[02 Atomic Notes/10-year Treasury yield 5.28 percent on 2 October 2026|5.28 percent]] (Module 3), and 3.0 percent does.

**Exit multiple.** [[02 Atomic Notes/Exit multiple 13.02x 2028 EBITDA|13.02 times]] 2028 EBITDA gives [[02 Atomic Notes/Terminal value by exit multiple 46,275.7 million dollars|46,275.7]]. The multiple sits between Hershey’s current EV/EBITDA of 11.7x ([[01 Sources/S9 Team Q&D workbook for Hershey|S9]], FrontPage) and the [[02 Atomic Notes/Implied exit multiple 14.7x at 3.0 percent growth|14.7x]] the perpetuity method implies.

**Why they differ, by [[02 Atomic Notes/Perpetuity and exit multiple values differ by 25.57 dollars a share|$25.57 a share]].** Each method implies the other’s input. Growing at 3.0 percent forever is the same as selling Hershey in 2028 for 14.7 times EBITDA; selling it for 13.02 times is the same as growing at [[02 Atomic Notes/Implied growth 2.5 percent at 13.02x exit multiple|2.5 percent]] forever. The gap is about half a point of perpetual growth, worth $25.57 a share. We report both and treat $193 to $219 as the DCF range; Module 5’s peer multiples will tell us which end the market supports.

## 3. Sensitivity: the terminal assumptions move value most

The workbook’s two data tables recompute equity value per share as the inputs change ([[01 Sources/S9 Team Q&D workbook for Hershey|S9]]).

**Growth and WACC.** At a 6.0 percent WACC, moving perpetual growth from 2.0 to 4.0 percent moves the value from $208.21 to $424.18. At 3.0 percent growth, moving the WACC from 7.0 to 5.0 percent moves it from $205.61 to $429.40. Every cell depends on the spread between the WACC and growth, which sits in the denominator of the terminal value.

**Exit multiple and WACC.** At a 6.0 percent WACC, moving the multiple from 12.0x to 14.0x moves the value from $181.08 to $211.19, about $15 a share for each turn of EBITDA. The WACC matters far less here, because the multiple method does not divide by the WACC less growth.

**Margin.** The workbook’s tables do not move the margin, so we test it in a bull, base, and bear table built on our site (Section 4).

**What moves the needle.** The spread between WACC and perpetual growth. About half a point of growth ([[02 Atomic Notes/Implied growth 2.5 percent at 13.02x exit multiple|2.5 percent]] instead of [[02 Atomic Notes/Perpetual growth rate 3.0 percent|3.0]]) is the entire [[02 Atomic Notes/Perpetuity and exit multiple values differ by 25.57 dollars a share|$25.57]] gap between our two methods; the same half point on the WACC moves the value by more than the exit multiple’s whole 12x to 14x range.

## 4. Bull, base, and bear, built with AI and checked by hand

We build a bull, base, and bear table on the Valuation section of our site with Claude, across revenue growth, EBITDA margin, the WACC, and perpetual growth, and check two of its cells ourselves before relying on it: a Rates only row (our forecast at a WACC and growth rate on the workbook’s sensitivity table), looked up in that table, and the bear case by growth in perpetuity, rebuilt step by step in a blank sheet of a copy of the workbook. The table, the two checks, and any correction are recorded in our vault (research/03 Drafts/Module 4 - Bull base bear) and in our AI Log.

## Inputs for the Knowledge Bank

| Input                                    | Value                            | Tier             | Source | Note |
| ---------------------------------------- | -------------------------------- | ---------------- | ------ | --- |
| WACC (Module 3)                          | 6.78%                            | D                | S9     | [[02 Atomic Notes/WACC 6.78 percent]] |
| Perpetual growth rate                    | 3.0%                             | E (Chris Lester) | S9     | [[02 Atomic Notes/Perpetual growth rate 3.0 percent]] |
| Exit EV/EBITDA multiple                  | 13.02x                           | E (Chris Lester) | S9     | [[02 Atomic Notes/Exit multiple 13.02x 2028 EBITDA]] |
| Valuation date and stub fraction         | October 5, 2026; 23.9% of FY2026 | D                | S9     | [[02 Atomic Notes/Valuation date 5 October 2026 with 23.9 percent stub]] |
| Present value of 2026 to 2028 cash flows | 3,792.3                          | D                | S9     | [[02 Atomic Notes/Present value of 2026 to 2028 cash flows 3,792.3 million dollars]] |
| Terminal value, growth in perpetuity     | 52,410.9                         | D                | S9     | [[02 Atomic Notes/Terminal value by growth in perpetuity 52,410.9 million dollars]] |
| Terminal value, exit multiple            | 46,275.7                         | D                | S9     | [[02 Atomic Notes/Terminal value by exit multiple 46,275.7 million dollars]] |
| Terminal value share of enterprise value | 92.3% and 91.3%                  | D                | S9     | [[02 Atomic Notes/Terminal value 92.3 and 91.3 percent of enterprise value]] |
| Implied exit multiple at 3.0% growth     | 14.7x                            | D                | S9     | [[02 Atomic Notes/Implied exit multiple 14.7x at 3.0 percent growth]] |
| Implied growth at 13.02x                 | 2.5%                             | D                | S9     | [[02 Atomic Notes/Implied growth 2.5 percent at 13.02x exit multiple]] |
| Net debt                                 | 3,755.1                          | D                | S1, S9 | [[02 Atomic Notes/Net debt 3,755.1 million dollars]] |
| Diluted shares                           | 207.2 million                    | R                | S9     | [[02 Atomic Notes/Diluted shares 207.2 million]] |
| Equity value per share, perpetuity       | $218.59                          | D                | S9     | [[02 Atomic Notes/Equity value per share 218.59 dollars by growth in perpetuity]] |
| Equity value per share, exit multiple    | $193.02                          | D                | S9     | [[02 Atomic Notes/Equity value per share 193.02 dollars by exit multiple]] |
| Share price, October 5, 2026             | $160.19                          | R                | S9     | [[02 Atomic Notes/HSY share price 160.19 dollars on 5 October 2026]] |

## Sources

| id | Source                                                                        | Publisher         | Date       | Link                                                                              |
| -- | ----------------------------------------------------------------------------- | ----------------- | ---------- | --------------------------------------------------------------------------------- |
| [[01 Sources/S1 Hershey Form 10-K FY2025]] | The Hershey Company Form 10-K for fiscal 2025, accession 0001628280-26-008586 | SEC EDGAR         | 2026-02-17 | https://www.sec.gov/Archives/edgar/data/47111/000162828026008586/hsy-20251231.htm |
| [[01 Sources/S8 FactSet consensus estimates for Hershey]] | FactSet consensus estimates for Hershey                                       | FactSet           | 2026-10-04 | FactSet terminal (licensed; not linked)                                           |
| [[01 Sources/S9 Team Q&D workbook for Hershey]] | Team Q&D workbook for Hershey, DCF 1-Pager tab                               | FIN 5370 HSY team | 2026-10-05 | workbook/QD-HSY.xlsx                                                              |

## Numbers we still need

  - None.
