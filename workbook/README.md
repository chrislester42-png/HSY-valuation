Put Dr. Payne's Q&D workbook here: one file, named like `QD [TICKER].xlsx`.

- Set the date on FrontPage first. It drives the year headers on Detail Data.
- Dollars in millions to one decimal, shares in millions, as the row labels say.
- Claude fills it with `scripts/fill_workbook.py`, which changes only the cells it is told to and leaves the charts, images, and formulas alone. Close the workbook in Excel before a fill.
- After every fill, open it in Excel and save. Excel recalculates on open; the converter reads the results Excel saved and refuses to run on a workbook that has not been saved since the fill.
- Actual columns come from SEC EDGAR, forecast columns from the FactSet consensus export saved in `research/01 Sources/_files`.
- Module 2 fills Detail Data only. The WACC and DCF tabs come in Modules 3 and 4.
