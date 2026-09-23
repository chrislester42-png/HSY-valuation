# Prompts

Copy, fill the [BLANKS], paste into the Code tab.

## Project kickoff (first thing you type, once)
I am an MBA student in FIN 5370, Advanced Corporate Finance and Valuation, at Texas State. My teammate [NAME] and I are valuing [COMPANY] ([TICKER]) over eight weeks and publishing the result as an interactive valuation site, one section per module: Thesis, Financials, Knowledge Bank, Valuation, The Call, Risks, Catalysts, Process, then Tearsheet, Glossary, and Sources pages. The purpose of the class is to build a defensible valuation from the fundamentals and to use AI to speed the work up without replacing our judgment, so every number on the site must trace to a source and we log every task you help with.

This folder is our project. Read CLAUDE.md and README.md, then explain this project and its rules back to me in under 200 words. Replace [COMPANY] and [TICKER] in CLAUDE.md and site/content.js with our company. Do not change anything else yet. I am new to this tool, so explain what you are doing as you go.

## Module kickoff (first prompt of each module)
We are in Module [N] of FIN 5370. This module's milestone is [MILESTONE NAME]. Our deliverable is done and saved at [FILE]. Read it, read CLAUDE.md, and tell me what you will build for the [SECTION] section and what you need from me. Do not build anything yet.

## Sync (start of every session)
Sync the project.

## Wrap up (end of every session)
Wrap up the session.

## Something broke
[WHAT I SEE]. Here is the error text: [PASTE]. Tell me the most likely cause in plain English, then fix it, and tell me what you changed.

## I cannot find that number
You wrote [NUMBER] for [FACT]. Show me exactly where it comes from: the atomic note, the memo sentence, and the source note. If it is not there, remove it from the site and list it under numbersWeStillNeed.

## Teach me what you did
In plain English, explain what you just built, what each file does, and how I would change [ONE THING] myself.

## Make it ours
Read site/styles.css. Propose three looks for our site, each in three lines: palette (background, ink, accent), a Google Fonts pairing, and one signature detail. No purple gradients, no glow, no emojis. Apply the first to the site so I can react. I will pick one.

## Module 1: kickoff, then build the Thesis section

### Module 1 kickoff
We are in Module 1 of FIN 5370. This module's milestone is Project Milestone 1: Company and Industry Selection Memo. Our deliverable is done and saved at research/03 Drafts/Milestone 1 - Selection Memo.md. Read it, read CLAUDE.md, and tell me what you will build for the Thesis section and what you need from me. Do not build anything yet.

### Build the Thesis section (and the first notes)
Build the Thesis section from research/03 Drafts/Milestone 1 - Selection Memo.md. First the vault: for every source in the memo's sources table, create a source note in research/01 Sources from the source note template, with its id, publisher, date, and url. For every number the memo uses, create one atomic note in research/02 Atomic Notes from the atomic note template: the fact with the exact figure, why it matters, status needs-verification, tier R for figures reported in a filing, and a wiki-link to its source note. Add the new notes to the lists in research/00 Project Home.md. Then the site: update only the thesis object and the site object in site/content.js: set status to live; a headline of eight words or fewer; a lede of forty words or fewer that states our life-cycle stage and what it means for valuation; the stage; three Facts that carry the stage diagnosis, each with value, label, source id, tier, and note set to the atomic note's path; one block per memo heading (Life-cycle stage, What it means for valuation, Why this company, Recent developments), forty words or fewer each; a so-what of twenty words or fewer. In site.oneLineThesis put a twelve-word version of our view, and fill in team and updated. If a claim in the memo has no source, put it under numbersWeStillNeed instead of on the site or in a note. Do not change any other file. Then list the notes you created and open site/index.html in my browser so I can check it.

## Module 2: data pull, kickoff, build, check

### Extract (Claude drafts the table; you type the workbook)
Read research/01 Sources/_files/[10-K FILE]. Build a table for FY[Y-2], FY[Y-1], and FY[Y] with the rows on the Detail Data tab of our workbook: Revenue, Cost of sales, EBIT (operating income), Net income, Interest expense, Income taxes, Cash and marketable securities, Total assets, Current assets, Current liabilities, Long-term debt, Equity, Cash from operations, Depreciation and amortization, Capital expenditures, Diluted shares. State units exactly as reported. For every cell give the statement and the page or section it comes from. If a line is not reported under that name, say which line you used and why. I will type these into the workbook myself.

### Verify
Verify your own table. For each cell, quote the exact row label and figure from the filing. Mark each cell VERIFIED or UNVERIFIED. Change nothing; just report.

### Module 2 kickoff
We are in Module 2 of FIN 5370. This module's milestone is Project Milestone 2: FCFF/FCFE Forecast Model. Our workbook is done and saved at workbook/[FILE].xlsx, and our driver justifications are in research/03 Drafts/Milestone 2 - Driver Justifications.md. Run python3 scripts/workbook_to_data.py and tell me what it found: the periods, the units, and any rows it could not find. Then tell me what you will build for the Financials section and what you need from me. Do not build anything yet.

### Build the Financials section
Build the Financials section. Create site/financials.js that registers window.sections.financials(inner, s, F), and add its script tag to site/index.html in the marked slot before app.js. In it: 1) a history table of the actual years in F.periods: revenue, revenue growth, EBIT, EBIT margin, net income, D&A, capex, net working capital, and FCFF; 2) six sliders (revenue growth, EBIT margin, tax rate, D&A as % of revenue, capex as % of revenue, net working capital as % of revenue) that default to the values implied by the workbook's first forecast year, with a button that resets them; 3) a forecast table for the workbook's forecast years, recomputed live as sliders move: revenue, EBIT, taxes, NOPAT, plus D&A, less capex, less change in NWC, FCFF, less after-tax interest, plus net borrowing, FCFE, using FCFF = EBIT x (1 - t) + D&A - capex - change in NWC and FCFE = FCFF - interest x (1 - t) + net borrowing; 4) a bar chart of FCFF by year in plain HTML; 5) one line comparing year-one FCFF at the base case with the workbook's own FCFF value and saying whether they match; 6) blocks from financials.driverJustifications. Put the model in a pure function window.forecastModel(F, drivers) so I can check it. Then update only the financials object in site/content.js: status live, a headline of eight words or fewer, a lede of forty words or fewer, and driverJustifications taken from research/03 Drafts/Milestone 2 - Driver Justifications.md with a source id on each. Plain JavaScript, no libraries. Touch no other section. Then open site/index.html#financials in my browser.

### The check
Print year-one FCFF at the base case and show the formula chain with every input, so I can check it against the workbook cell. Then do the same for FCFE. If either does not match the workbook, tell me which formula differs and why.
