# FIN 5370 valuation site starter

This folder is your team's project for FIN 5370. It holds your research, your workbook, and the interactive valuation site you publish each module.

## Open it

1. Click **Use this template** on GitHub, name the repo after your company, and add your teammate as a collaborator.
2. In GitHub Desktop, clone the repo to your computer.
3. In Claude Desktop, open the **Code** tab and pick the cloned folder.
4. Open Obsidian, choose Open folder as vault, and pick the `research` folder inside the repo.
5. Paste the kickoff prompt from `PROMPTS.md` in Claude.

## What goes where

| Folder or file | What it holds |
|---|---|
| `research/` | Your Obsidian vault: Project Home, one note per source, one note per fact, your memos in 03 Drafts, questions, templates. Claude writes the notes; Obsidian is how you read them. Becomes the Knowledge Bank page in Module 3 |
| `workbook/` | Your team's Q&D workbook (.xlsx). The site's numbers come from here |
| `scripts/workbook_to_data.py` | Reads the workbook and writes `site/data/financials.js` |
| `site/` | The published site. Netlify serves this folder as-is |
| `AI Log.md` | Every time Claude helps, one row. Feeds your Module 7 memo |
| `CLAUDE.md` | The rules Claude follows in this folder. Read it once |

## The site's sections, in order

On the main page: Thesis (Module 1) · Financials (Module 2) · Valuation (Module 4) · The Call (Module 5) · Risks and Catalysts, two sections (Module 6) · Process (Module 7). Its own page: Knowledge Bank (Module 3), the sourced inputs and the research notes behind every number. Tearsheet, Glossary, and Sources pages (Module 8).

## Publishing

Netlify deploys from the `site` folder of your GitHub repo. Every push goes live within a minute. Claude does the commit and push when you say "wrap up."
