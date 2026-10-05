Put Dr. Payne's Q&D workbook here: one file, named like `QD [TICKER].xlsx`. The blank workbook is not in this repo; Dr. Payne provides it in the course's Module 2 materials.

- Set the date on FrontPage first. It drives the year headers on Detail Data.
- Dollars in millions to one decimal, shares in millions, as the row labels say.
- Scripts write through `scripts/fill_workbook.py`, which changes only the cells it is told to and leaves the charts, images, and formulas alone. Close the workbook in Excel before a fill.
- After every fill, open it in Excel and save. Excel recalculates on open; the converter reads the results Excel saved and refuses to run on a workbook that has not been saved since the fill.
- Actual columns (C and D) come from SEC EDGAR: `python3 scripts/fill_detail_data_from_edgar.py workbook/[FILE].xlsx --ticker [TICKER] --contact "Your Name you@txstate.edu"`. Run it with `--dry-run` first. It lists any cell the SEC feed cannot supply; type those from the 10-K.
- Forecast columns (E to G) you type by hand from FactSet's consensus estimates. No FactSet file goes in this repo.
- Module 2 fills Detail Data only. The WACC and DCF tabs come in Modules 3 and 4.
