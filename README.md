# FIN 5370 valuation site starter

This folder is your team's project for FIN 5370. It holds your research, your workbook, and the interactive valuation site you publish each module.

## Open it

1. Click **Use this template** on GitHub, name the repo after your company, and add your teammate as a collaborator.
2. In GitHub Desktop, clone the repo to your computer.
3. In Claude Desktop, Cowork tab, Create a project, click Use a folder and pick the cloned folder. For the description paste: FIN 5370 team valuation site for [Company]. At the start of every chat, read CLAUDE.md in this folder and follow its rules. "Sync the project" and "wrap up the session" are defined there.
4. Open Obsidian, choose Open folder as vault, and pick the `research` folder inside the repo.
5. Paste the kickoff prompt from `PROMPTS.md` in Claude.

## What goes where

| Folder or file | What it holds |
|---|---|
| `research/` | Your Obsidian vault: Project Home, one note per source, one note per fact, your memos in 03 Drafts, questions, templates. Claude writes the notes; Obsidian is how you read them. Becomes the Knowledge Bank page in Module 3 |
| `workbook/` | Your team's Q&D workbook (.xlsx). The site's numbers come from here |
| `scripts/workbook_to_data.py` | Reads the workbook and writes `site/data/financials.js` |
| `scripts/build_vault.py` | Reads the `research/` vault and writes `site/data/notes.js`, which the Knowledge Bank page reads (Module 3) |
| `site/` | The published site. Netlify serves this folder as-is |
| `AI Log.md` | Every time Claude helps, one row. Feeds your Module 7 memo |
| `CLAUDE.md` | The rules Claude follows in this folder. Read it once |
| `skills/` | The taste skill (`design-taste`) and the brief for the Module 3 redesign (`site-design/DESIGN.md`) |

## The site's sections, in order

On the main page: Thesis (Module 1) · Financials (Module 2) · Valuation (Module 4) · The Call (Module 5) · Risks and Catalysts, two sections (Module 6) · Process (Module 7). Its own page: Knowledge Bank (Module 3), the sourced inputs and the research notes behind every number. Glossary and Sources pages (Module 7). Module 7 ends with a final clean-up, and the site is ready to present.

## Publishing

Netlify deploys from the `site` folder of your GitHub repo. Every push goes live within a minute. Claude does the commit when you paste the wrap-up prompt from PROMPTS.md, and writes the commit message itself, one line describing the change.

**In GitHub Desktop, never type in the Summary box.** That box is for a new commit, and Claude has already made the commit. If Desktop shows "Push origin" with a number in the top bar, click it. If the Summary box is greyed out and the Changes list is empty, that is normal: there is nothing left to commit, only to push.
