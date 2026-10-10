# Project Milestone 6: AI Use Evaluation Memo

> Markdown copy of `Milestone 6 - AI Use Evaluation Memo.docx`, saved 2026-10-09 so it opens in Obsidian. Each number links to its atomic note; the .docx is the text we submit. Filing notes, from comparing the memo with AI Log.md: the memo calls Modules 1, 5, and 6 mixed, while every log row for those modules says Helped; the Module 5 peer proposal (2026-10-07) and the Module 4 unit error have no log row; the log says Claude (Code tab), not a person, made the 38 of 38 check and set the 22 Module 1 notes to confirmed; 22 plus 7 Module 1 notes is 29 of 31. [[02 Atomic Notes/AI Log 45 tasks, 43 helped, 1 misled, 1 did not help|The AI Log note]] and [[02 Atomic Notes/22 of 31 Module 1 facts confirmed, 7 cite a page without the figure|the Module 1 check note]] say what to check.

**Company:** The Hershey Company (NYSE: HSY). **Team:** Chris Lester. **Date:** 2026-10-09.

**Conclusion:** Across Modules 1 to 6 we logged [[02 Atomic Notes/AI Log 45 tasks, 43 helped, 1 misled, 1 did not help|45 AI-assisted tasks: 43 helped, 1 misled, and 1 did not help]] ([[01 Sources/S24 Team AI Log|S24]]). Claude was most useful where its work could be checked against a fixed source: it [[02 Atomic Notes/SEC pull filled 32 actual-year workbook cells|filled 32 workbook cells]] from SEC filings that a line-by-line check found [[02 Atomic Notes/38 of 38 actual-year figures match the FY2025 10-K|38 of 38 correct]], and it rebuilt our DCF to within a cent of the workbook in [[02 Atomic Notes/50 of 50 sensitivity cells match the DCF tab within a cent|all 50 sensitivity cells]]. It was least reliable where its output only looked checked. [[02 Atomic Notes/22 of 31 Module 1 facts confirmed, 7 cite a page without the figure|Seven of the 31 facts]] it filed in Module 1 cite a page that does not show the figure, and three times a number came out wrong without any warning: [[02 Atomic Notes/Converter tax rate 37.5 percent before the fix, 27.3 after|a tax rate]], a unit scale, and a commit that swept a licensed file into our public repository. Our main change before we present: no figure goes on the site until a person has confirmed its note.

## 1. The catalog: one AI-assisted task from every module

| Module | Tool | Task | What it produced | Note |
|---|---|---|---|---|
| 1 | Claude, Cowork tab | Filed the selection memo into the vault and built the Thesis section | 7 source notes, 31 atomic notes, the Thesis section live | [[02 Atomic Notes/Module 1 filing made 7 source notes and 31 atomic notes]] |
| 2 | Claude, Cowork and Code tabs, with our SEC script | Pulled the actual years into the Q&D workbook from SEC filings | 32 cells filled from the SEC's XBRL data; a verification form | [[02 Atomic Notes/SEC pull filled 32 actual-year workbook cells]] |
| 3 | Claude, Cowork tab | Checked our WACC inputs against the memo and tagged each one | Every input with its tier; 5 inputs the memo did not tag | [[02 Atomic Notes/Module 3 check found 5 WACC inputs the memo did not tag]] |
| 4 | Claude, Cowork tab | Built the DCF engine, the two sensitivity tables, and the bull, base, and bear table | $218.59 and $193.02 per share; 50 table cells; three scenarios | [[02 Atomic Notes/Equity value per share 218.59 dollars by growth in perpetuity]], [[02 Atomic Notes/Equity value per share 193.02 dollars by exit multiple]], [[02 Atomic Notes/50 of 50 sensitivity cells match the DCF tab within a cent]] |
| 5 | Claude, Code tab | Proposed comparable companies for the peer screen | Eight candidates; we kept three | [[02 Atomic Notes/Peer screen kept 3 of 8 AI-proposed comparables]] |
| 6 | Claude, with web search | Ran one research brief on Hershey's risks and catalysts | 10 searches, 13 pages, 9 new sources, 39 notes | [[02 Atomic Notes/Research run used 10 of 10 searches and 13 of 15 pages]], [[02 Atomic Notes/Research run added 9 sources and 39 notes]] |

## 2. Evaluation: what held up, what did not, and why

**Module 1, the Thesis facts. Verdict: mixed.** Claude turned the memo into [[02 Atomic Notes/Module 1 filing made 7 source notes and 31 atomic notes|31 notes]], each with a source, quickly and in the right format. When a second pass in Module 2 checked them against their sources, [[02 Atomic Notes/22 of 31 Module 1 facts confirmed, 7 cite a page without the figure|22 held: 16 recomputed from the FY2025 10-K and 6 matched to the FactSet export. Seven could not be confirmed]] because the cited page did not show the figure ([[01 Sources/S24 Team AI Log|S24]]). *Failure mode: mismatched citation.* The figures were plausible and the sources were real, but the link between them had not been checked. They stay marked needs-verification on the site.

**Module 2, the data pull. Verdict: held up, with three failures around it.** The pull itself held up. Our script, run by Claude, [[02 Atomic Notes/SEC pull filled 32 actual-year workbook cells|filled 32 cells]] from the SEC's XBRL data, and a line-by-line comparison with the FY2025 Form 10-K found [[02 Atomic Notes/38 of 38 actual-year figures match the FY2025 10-K|38 of 38 filing-based figures correct (pages 53, 55, 56, and 97)]] ([[01 Sources/S1 Hershey Form 10-K FY2025|S1]], [[01 Sources/S24 Team AI Log|S24]]). Three things went wrong around it:

- *Capability limit.* Claude first tried to type into Excel by screen control. Excel ignored the clicks and nothing was written. A tested script replaced it.
- *Silent calculation error.* Our converter computed the tax rate as taxes over net income, [[02 Atomic Notes/Converter tax rate 37.5 percent before the fix, 27.3 after|37.5 percent, instead of taxes over pre-tax income, 27.3 percent]]. Nothing flagged it. Claude caught it the next time it ran the converter, the same day, by recomputing the rate from the workbook values ([[01 Sources/S24 Team AI Log|S24]]).
- *Overreach on a routine command.* A commit that added every file swept the licensed FactSet export into our public repository. We removed it and told git to ignore it, but it remains in the history.

**Module 3, the input check. Verdict: held up.** It added real value. Asked to list every WACC input and its tier, Claude found [[02 Atomic Notes/Module 3 check found 5 WACC inputs the memo did not tag|five inputs the memo had not tagged]] (the industry beta, the industry debt-to-equity and tax rate, the unlevered beta, and Hershey's debt-to-equity). We confirmed each by reading the WACC tab directly.

**Module 4, the sensitivity build. Verdict: held up.** The arithmetic held. The engine gives [[02 Atomic Notes/Equity value per share 218.59 dollars by growth in perpetuity|$218.59]] and [[02 Atomic Notes/Equity value per share 193.02 dollars by exit multiple|$193.02]] at the workbook's inputs, and [[02 Atomic Notes/50 of 50 sensitivity cells match the DCF tab within a cent|all 50 sensitivity cells match the DCF tab within a cent]]. Two things to note:

- *Silent unit error.* While we built the converter, it trusted the DCF tab's units note, which says thousands, and divided every DCF figure by a thousand, although the figures are in millions. Nothing warned us; we caught it by comparing the converter's revenue with the Detail Data tab, and the converter now makes that comparison itself (scripts/workbook_to_data.py, the scale check at the top of read_dcf). This happened while we prepared the converter, outside a logged session, so it has no row in our AI Log; we have added that to our recommendations.
- *Our own gap.* Claude's bull and bear inputs are estimates, and the "Checked by hand" table in our Module 4 note is still blank. The hand check was rebuilt independently in Python ([[02 Atomic Notes/Bear case values 124.84 and 158.38 dollars a share|$124.84]] and [[02 Atomic Notes/Bull case values 311.15 and 212.70 dollars a share|$212.70]]) but has not yet been signed by a person.

**Module 5, the peer screen. Verdict: mixed.** Claude's [[02 Atomic Notes/Peer screen kept 3 of 8 AI-proposed comparables|eight candidates]] included two private companies, Mars and Ferrero, which have no share price and so no market multiples. It also proposed Nestlé, whose confectionery is a small part of a far larger business. *Failure mode: comparability blind spot.* It matched on industry label, not on what a multiple needs. We kept Mondelez, Lindt, and Tootsie Roll; the proposal and our reasons are in our Milestone 5 memo, section 2 ([[01 Sources/S25 Team Milestone 5 Relative Valuation and Reconciliation Memo|S25]]). The build that followed was exact: [[02 Atomic Notes/Probability-weighted value 218.29 and 189.28 dollars a share|the weighted values]] match our memo to the cent.

**Module 6, the research run. Verdict: mixed.** This replaced the options brainstorm when the module changed. The run kept to its budget ([[02 Atomic Notes/Research run used 10 of 10 searches and 13 of 15 pages|10 of 10 searches, 13 of 15 pages]]) and left out a tariff cost it had seen only in a headline, which is the behaviour we asked for. *Failure mode: incomplete retrieval.* The page reader returned [[02 Atomic Notes/Page reader returned quotes of about 125 characters|quotes of about 125 characters]], as our research report records ([[01 Sources/S26 Team Module 6 research report|S26]]), so long sentences arrived in fragments, and it dropped the column headings of the [[02 Atomic Notes/ICCO daily cocoa price 5,718.24 dollars a ton on 8 October 2026|ICCO price table]], so that figure is tier partial until we read the page ourselves. [[02 Atomic Notes/Research run added 9 sources and 39 notes|All 39 notes from the run]] are still needs-verification.

## 3. The finding that surprised us most

[[02 Atomic Notes/Most surprising AI finding, real source, plausible figure, wrong link|The seven Module 1 facts.]] Each note looked finished: an exact figure, a tier, a link to a real source. Nothing about the format said "unchecked", and we had read the notes. Only a second pass that opened each cited page found that the figure was not there. We had expected an AI to fail by inventing a source. Instead, the source was real and the figure was plausible; only the link between them was wrong. That is harder to see, because a reviewer reading the note has no reason to doubt it.

## 4. What we will change before we present

1. **No figure on the site until its note is confirmed.** Before the final presentation we will list every Fact whose note is still needs-verification and confirm or remove each one, starting with the [[02 Atomic Notes/Research run added 9 sources and 39 notes|39 research notes]]. This follows from the Module 1 and Module 6 findings.
2. **Every number the AI computes is checked against one it did not compute.** Each script's output gets one independent comparison before we use it, the way the per-share value is now checked against the DCF tab and revenue against Detail Data. This follows from the tax rate and the unit scale in Modules 2 and 4.
3. **State the screen before asking for candidates.** For any list the AI proposes, we give it the test first (for peers: listed, priced, and mostly confectionery) and ask it to show which test each candidate passes. This follows from Module 5.
4. **Commit files by name, never all at once, and log every AI session.** Licensed data stays outside the repository, and work done outside a logged session gets a row the same day. This follows from Module 2 and the unlogged unit error in Module 4.

## Inputs for the Knowledge Bank

| Input | Value | Tier | Source | Note |
|---|---|---|---|---|
| AI tasks logged, Modules 1 to 6 | 45: 43 helped, 1 misled, 1 did not help | D | S24 | [[02 Atomic Notes/AI Log 45 tasks, 43 helped, 1 misled, 1 did not help]] |
| Module 1 facts confirmed against their sources | 22 of 31; 7 cite a page that does not show the figure | D | S24 | [[02 Atomic Notes/22 of 31 Module 1 facts confirmed, 7 cite a page without the figure]] |
| Actual-year workbook figures matching the FY2025 10-K | 38 of 38 | D | S1, S24 | [[02 Atomic Notes/38 of 38 actual-year figures match the FY2025 10-K]] |
| Converter tax rate before and after the fix | 37.5% (taxes over net income) and 27.3% (taxes over pre-tax income) | D | S24 | [[02 Atomic Notes/Converter tax rate 37.5 percent before the fix, 27.3 after]] |
| Sensitivity cells matching the DCF tab | 50 of 50, within a cent | D | S9, S24 | [[02 Atomic Notes/50 of 50 sensitivity cells match the DCF tab within a cent]] |
| Peer candidates proposed and kept | 8 proposed, 3 kept | D | S25 | [[02 Atomic Notes/Peer screen kept 3 of 8 AI-proposed comparables]] |
| Module 6 research budget used | 10 of 10 searches, 13 of 15 pages | D | S24 | [[02 Atomic Notes/Research run used 10 of 10 searches and 13 of 15 pages]] |
| Our most surprising finding | Real source, plausible figure, wrong link | E (Chris Lester) | This memo | [[02 Atomic Notes/Most surprising AI finding, real source, plausible figure, wrong link]] |

## Sources

| id | Source | Publisher | Date | Link |
|---|---|---|---|---|
| S1 | The Hershey Company Form 10-K for fiscal 2025, accession 0001628280-26-008586 | SEC EDGAR | 2026-02-17 | [[01 Sources/S1 Hershey Form 10-K FY2025]] |
| S9 | Team Q&D workbook for Hershey | FIN 5370 HSY team | 2026-10-07 | [[01 Sources/S9 Team Q&D workbook for Hershey]] |
| S24 | Team AI Log | FIN 5370 HSY team | 2026-10-09 | [[01 Sources/S24 Team AI Log]] |
| S25 | Team Milestone 5 Relative Valuation and Reconciliation Memo | FIN 5370 HSY team | 2026-10-07 | [[01 Sources/S25 Team Milestone 5 Relative Valuation and Reconciliation Memo]] |
| S26 | Team Module 6 research report | FIN 5370 HSY team | 2026-10-09 | [[01 Sources/S26 Team Module 6 research report]] |

## Numbers we still need

- The Module 4 unit error (the converter divided every DCF figure by a thousand): no source records that it happened. The converter's scale check shows the guard exists, not the error. No note made.
