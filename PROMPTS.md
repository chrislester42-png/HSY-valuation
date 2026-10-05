# Prompts

Copy, fill the [BLANKS], paste into your project in the Cowork tab.

## Project kickoff (first thing you type, once)
I am an MBA student in FIN 5370, Advanced Corporate Finance and Valuation, at Texas State. My teammate [NAME] and I are valuing [COMPANY] ([TICKER]) over eight weeks and publishing the result as an interactive valuation site, one section per module: Thesis, Financials, Knowledge Bank, Valuation, The Call, Risks, Catalysts, Process, then Tearsheet, Glossary, and Sources pages. The purpose of the class is to build a defensible valuation from the fundamentals and to use AI to speed the work up without replacing our judgment, so every number on the site must trace to a source and we log every task you help with.

This folder is our project. Read CLAUDE.md and README.md, then explain this project and its rules back to me in under 200 words. Replace [COMPANY] and [TICKER] in CLAUDE.md and site/content.js with our company. Do not change anything else yet. I am new to this tool, so explain what you are doing as you go.

## Module kickoff (first prompt of each module)
We are in Module [N] of FIN 5370. This module's milestone is [MILESTONE NAME]. Our deliverable is done and saved at [FILE]. Read it, read CLAUDE.md, and tell me what you will build for the [SECTION] section and what you need from me. Do not build anything yet.

## File the memo into the vault (every module, after the module kickoff and before any build prompt)
File this module's memo into the vault before we build anything. The memo is research/03 Drafts/[FILE] (.docx or .md). If it is a .docx, first save a markdown copy beside it with the same name so it opens in Obsidian. For every source the memo cites that has no source note yet, create one in research/01 Sources from the source note template, with the next unused id, publisher, date, and url. For every number or dated fact the memo uses that has no atomic note yet, create one in research/02 Atomic Notes from the atomic note template: the fact with the exact figure, why it matters, status needs-verification, a tier (R for a figure reported in a filing or dataset, D for one we calculated, with the formula, E for a judgment call, naming who made it), and a wiki-link to its source note. If a fact already has a note, link to that note instead of making a second one. Numbers that come straight from the workbook need no note; they trace to the workbook. In the markdown copy of the memo, link each number to its note. Add the new notes to the lists in research/00 Project Home.md. If a claim has no source, do not make a note; list it under "Numbers we still need" and tell me. Change nothing on the site. Then list the notes you created and the ones you reused, and remind me to open each new note in Obsidian, check the figure against its source, and set its status to confirmed.

## Sync (start of every session)
Sync the project: run git pull in this project folder, then tell me in plain English what my teammate changed since my last session. If there is a merge conflict, stop and explain it.

## Wrap up (end of every session)
Wrap up the session: follow the wrap-up steps in CLAUDE.md (AI Log rows, converter if the workbook changed, one-line commit, then git push, and tell me honestly whether the push succeeded).

## Something broke
[WHAT I SEE]. Here is the error text: [PASTE]. Tell me the most likely cause in plain English, then fix it, and tell me what you changed.

## I cannot find that number
You wrote [NUMBER] for [FACT]. Show me exactly where it comes from: the atomic note, the memo sentence, and the source note. If it is not there, remove it from the site and list it under numbersWeStillNeed.

## Teach me what you did
In plain English, explain what you just built, what each file does, and how I would change [ONE THING] myself.

## Make it ours (Module 3, once three sections are live; the design pass)
Make the site ours. Read skills/design-taste/SKILL.md in this folder and apply it as a "Redesign - Preserve": audit first (its Section 11.B), then its modernisation levers 1 to 3 only (typography, spacing and rhythm, color), its forbidden AI tells (Section 9), and the pre-flight items in Section 14 that apply to a plain page. Our rules override the skill wherever they conflict: this site is plain HTML, CSS, and JavaScript with no build step, so no frameworks, no Tailwind, no npm packages, no motion libraries; fonts only from Google Fonts; CSS transitions only, nothing that moves content on scroll. This is a research report, not a landing page: its data tables and calculators stay as they are, and the skill's landing-page rules do not apply to them. Change only site/styles.css and the shared header, nav, and footer markup in site/index.html, vault.html, tearsheet.html, glossary.html, and sources.html. Do not change any number, section id, nav label, Fact chip, slider, or table. Before touching files, propose two directions in three lines each: palette (background, ink, one accent), a Google Fonts pairing, and one signature detail. I will pick one. Then apply it, open site/index.html and site/vault.html in my browser, and list every file you changed.

## Check the design pass (after Make it ours, and again in Module 8)
Run the skill's pre-flight (skills/design-taste/SKILL.md, Section 14) on what you changed, listing each item that applies and its result. Then: 1) run git diff and confirm no number, section id, nav label, Fact chip, or slider changed; 2) check every page in site/ at 390 and 1280 pixels wide for overflow and for text smaller than 14 pixels; 3) confirm every text color has at least 4.5 to 1 contrast against its background; 4) confirm there is no em-dash anywhere in site/. Fix what fails, styling only, and tell me what you fixed.

## Final polish (Module 8)
Final polish. Read skills/design-taste/SKILL.md, Sections 9 and 14, and audit every page in site/ against them under our rules (plain CSS, no packages, no motion libraries, tables stay tables). List what fails. Fix styling and spacing only; change no number, no structure, no words. Then run the check-the-design-pass prompt.

## Module 1: kickoff, then build the Thesis section

### Module 1 kickoff
We are in Module 1 of FIN 5370. This module's milestone is Project Milestone 1: Company and Industry Selection Memo. Our deliverable is done and saved in research/03 Drafts as Milestone 1 - Selection Memo (.docx or .md). Read it, read CLAUDE.md, and tell me what you will build for the Thesis section and what you need from me. Do not build anything yet.

### Build the Thesis section (and the first notes)
Build the Thesis section from the memo in research/03 Drafts, Milestone 1 - Selection Memo (.docx or .md). If it is a .docx, first save a markdown copy beside it with the same name so it opens in Obsidian. Then the vault: for every source in the memo's sources table, create a source note in research/01 Sources from the source note template, with its id, publisher, date, and url. For every number the memo uses, create one atomic note in research/02 Atomic Notes from the atomic note template: the fact with the exact figure, why it matters, status needs-verification, tier R for figures reported in a filing, and a wiki-link to its source note. Add the new notes to the lists in research/00 Project Home.md. Then the site: update only the thesis object and the site object in site/content.js: set status to live; a headline of eight words or fewer; a lede of forty words or fewer that states our life-cycle stage and what it means for valuation; the stage; three Facts that carry the stage diagnosis, each with value, label, source id, tier, and note set to the atomic note's path; one block per memo heading (Life-cycle stage, What it means for valuation, Why this company, Recent developments), forty words or fewer each; a so-what of twenty words or fewer. In site.oneLineThesis put a twelve-word version of our view, and fill in team and updated. If a claim in the memo has no source, put it under numbersWeStillNeed instead of on the site or in a note. Do not change any other file. Then list the notes you created and open site/index.html in my browser so I can check it.

## Module 2a: SEC actuals into the Q&D workbook with the Python script (Detail Data tab only)

### Module 2 kickoff
We are in Module 2 of FIN 5370. This module's milestone is Project Milestone 2: FCFF/FCFE Forecast Model. Dr. Payne's Q&D workbook is saved at workbook/[FILE].xlsx with its Detail Data tab still empty and the date set on FrontPage. Read CLAUDE.md, the workbook, and the header of scripts/fill_detail_data_from_edgar.py. Then tell me which rows on Detail Data are inputs and which are formulas, which years the column headers show, and what the script will and will not fill. I type the forecast columns by hand from FactSet, so leave columns E to G alone. Do not change anything yet.

### Pull the actuals from the SEC (dry run first)
Run python3 scripts/fill_detail_data_from_edgar.py workbook/[FILE].xlsx --ticker [TICKER] --contact "[NAME EMAIL]" --dry-run and show me its table: the fiscal years it found for columns C and D, every cell with its tag and filing, and the cells it leaves for me to type. Write nothing yet.

### Write the actuals into the workbook and make my verification form
The workbook is closed in Excel. Run the same command again without --dry-run and with --report "research/03 Drafts/Module 2 - Data pull.md". Then make my verification form: run python3 scripts/verification_form.py with --filing naming the form, fiscal year, and accession number of the 10-K the script's table shows for column D. Tell me how many cells the script typed, which cells it left for me with where in the 10-K to look for each, and where the form is saved. Do not fill those cells or the form yourself; I check the filing and fill the form in Word. Do not touch columns E to G, and remind me to open the workbook in Excel and save it so the formulas recalculate.

### Read my verification form (after you filled it in Word and saved)
I filled in research/03 Drafts/Module 2 - Data verification.docx. Read it and save a markdown copy beside it with the same name. For every row I marked N, or where I typed a figure for a blank cell, show me the workbook value beside the figure I typed, then put my figure in the workbook with scripts/fill_workbook.py and note the correction in research/03 Drafts/Module 2 - Data pull.md with "corrected by hand from the filing" and the page. List any rows I left unchecked. Then tell me how many figures are checked, how many were corrected, and whether I need to open the workbook in Excel and save it.

### Check my forecast columns (after you typed them by hand from FactSet and saved in Excel)
I typed the forecast columns of Detail Data (E to G) by hand from FactSet's consensus estimates and saved the workbook in Excel. Read the Detail Data tab without changing it. List any forecast input cell that is still blank, and any figure that looks mistyped against the actual columns: a different scale (thousands where the sheet is in millions), a flipped sign, or a change of more than half from the year before. Then read back the sheet's FCFF and FCFE rows for each forecast year. Create a source note in research/01 Sources from the source note template for the consensus figures: publisher FactSet, today's date, and the screen I used ([SCREEN]). No FactSet file or table goes in the repo. Change nothing in the workbook.

### Where did that number come from
You wrote [NUMBER] in cell [CELL] of Detail Data. Show me the row in research/03 Drafts/Module 2 - Data pull.md it came from, with the filing and the accession number. If it is not there, say so and blank the cell.

## Module 2b: from the workbook to the Financials section

Before the converter kickoff, run **File the memo into the vault** on research/03 Drafts/Milestone 2 - Driver Justifications, so every figure in the justifications that is not a workbook number has a note behind it.

### Converter kickoff
We are in Module 2 of FIN 5370, building the Financials section. Our workbook is filled, and has been opened and saved in Excel since the last fill, at workbook/[FILE].xlsx, and our driver justifications are in research/03 Drafts/Milestone 2 - Driver Justifications.md. Run python3 scripts/workbook_to_data.py and tell me what it found: the periods, the scale it applied, and any rows it could not find. Ignore what it prints about the WACC and DCF tabs; those come in later modules. Then tell me what you will build for the Financials section and what you need from me. Do not build anything yet.

### Build the Financials section
Build the Financials section. Create site/financials.js that registers window.sections.financials(inner, s, F), and add its script tag to site/index.html in the marked slot before app.js. In it: 1) a history table of the actual years in F.periods: revenue, revenue growth, EBIT, EBIT margin, net income, D&A, capex, net working capital, and FCFF; 2) six sliders (revenue growth, EBIT margin, tax rate, D&A as % of revenue, capex as % of revenue, net working capital as % of revenue) that default to the values implied by the workbook's first forecast year, the tax rate defined the way the workbook's NOPAT row defines it so the base case reproduces the workbook, with a button that resets them; 3) a forecast table for the workbook's forecast years, recomputed live as sliders move: revenue, EBIT, taxes, NOPAT, plus D&A, less capex, less change in NWC, FCFF, less after-tax interest, plus net borrowing, FCFE, using FCFF = EBIT x (1 - t) + D&A - capex - change in NWC and FCFE = FCFF - interest x (1 - t) + net borrowing; 4) a bar chart of FCFF by year in plain HTML; 5) one line comparing year-one FCFF at the base case with the workbook's own FCFF value and saying whether they match; 6) blocks from financials.driverJustifications. Put the model in a pure function window.forecastModel(F, drivers) so I can check it. Then update only the financials object in site/content.js: status live, a headline of eight words or fewer, a lede of forty words or fewer, and driverJustifications taken from research/03 Drafts/Milestone 2 - Driver Justifications.md with a source id on each. Add a source note for the workbook in research/01 Sources if there is none. Plain JavaScript, no libraries. Touch no other section. Then open site/index.html#financials in my browser.

### The check
Print year-one FCFF at the base case and show the formula chain with every input, so I can check it against the workbook cell. Then do the same for FCFE. If either does not match the workbook, tell me which formula differs and why.
