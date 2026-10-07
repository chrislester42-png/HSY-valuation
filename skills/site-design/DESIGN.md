# Site design brief: the presentation redesign (Module 3)

Read this with `skills/design-taste/SKILL.md` (the taste skill). This brief says what the site must become; the taste skill says how to do it without the usual AI tells. Where they conflict, this brief and `CLAUDE.md` win: this site is plain HTML, CSS, and JavaScript with no build step, so no React, no Tailwind, no npm packages, no motion libraries, and fonts only from Google Fonts.

## Design read

Reading this as: a visual overhaul of an equity research report that a team presents on a projector to faculty and classmates, keeping its content and structure, in a minimal research-report language (the Bloom Energy site is the reference), built in native CSS with a sans and mono pairing and restrained motion.

Dials (taste skill, Section 1): DESIGN_VARIANCE 5, MOTION_INTENSITY 3, VISUAL_DENSITY 5. Mode (Section 11.A): Redesign - Overhaul of the visuals; content, section ids, nav labels, and every number are preserved.

## The one rule that shapes everything

Each section on the main page is one screen, like a slide. A presenter must never scroll inside a section to show all of it.

- Every live section is exactly the viewport height minus the top bar (`height: calc(100svh - var(--bar-h))`, with a `100vh` fallback), checked at 1440 x 900 and at 1280 x 720 (a projector). If it does not fit, cut words, never the type size: move secondary text into a pop-out or a hover tooltip (see "Say less" below).
- Inside a section: a head (headline, lede, the facts), a body (the section's main content), and a foot (the so-what, and "numbers we still need" as a small pop-out that opens upward and never grows the section).
- Sections not built yet collapse to a thin band (title and "Coming in Module N"), not a blank screen.
- On slide-size screens, the arrow keys, Page Up, Page Down, and the space bar move to the previous or next live section, ignored while typing in a field or moving a slider. Scroll snap is `proximity`, on screens at least 900 wide and 600 tall.
- Below 900 pixels wide (or 600 tall), sections grow to fit their content and stack to one column. Nothing scrolls sideways at 390 pixels.

## Say less: a slide, not a page

A team presents the whole site in about thirty minutes, so each section is a slide a presenter can talk over in three or four minutes. The reference is the Bloom Energy site: a short headline, two lines of lede, a row of big numbers with tiny captions, then one or two cards. Nothing on the slide explains how to read it; the presenter does that. The long version of every sentence stays in the memo and the Knowledge Bank, which the page links to; the page shows the short version.

| Element | Budget on the slide |
|---|---|
| Headline | 8 words or fewer, a claim |
| Lede | 25 words or fewer, two lines at 1280 pixels |
| Facts (stat row) | at most 4; the value, its tier chip, a label of 5 words or fewer, the source chip |
| Text blocks (Thesis) | at most 4, each a title and 20 words or fewer |
| Card title | one line, names the thing ("Sensitivity", "The weights"), no sentence |
| Caption under a chart or table | one line of 10 words or fewer: units and sources only ("$ millions. S1, S8, S9") |
| Check line | a dot and 6 words or fewer ("Matches the workbook"); the full comparison in its hover tooltip |
| So-what (the foot) | one line, 20 words or fewer |
| Anything else (reasons, how a chart is computed, what a slider does, notes on method) | not on the slide: a hover tooltip, a small "?" pop-out, or the Knowledge Bank note |

Visible prose on a section, not counting numbers, table cells, axis labels, and buttons, stays near 80 words. Type never shrinks to make room: body text at least 14 pixels and secondary text at least 12 at 1280 by 720.

## Tokens

One palette for the whole site, defined once in `:root` in `site/styles.css`. The Knowledge Bank uses the same tokens, so a palette change restyles every page.

| Token | Default | Use |
|---|---|---|
| `--bg`, `--bg-deep`, `--surface` | `#f4f4f4`, `#ededed`, `#ffffff` | page, pressed areas, cards (alternate sections on `--surface`) |
| `--ink`, `--ink-2`, `--fg-dim`, `--fg-mute` | `#0a0a0a`, `#404040`, `#525252`, `#5f5f5f` | text, strongest to weakest; never pure `#000` |
| `--line`, `--line-strong` | `rgba(10,10,10,0.08)`, `0.16` | hairlines |
| `--accent`, `--accent-soft` | `#0b7340`, `rgba(11,115,64,0.12)` | the one accent: links, active nav, forecast bars, the check dot |
| `--reported`, `--derived`, `--estimate` | `#2b7a4b`, `#93600f`, `#9b3d3d` | tier chips only (R, D, E) and the margin line |
| `--sans`, `--mono` | Geist, Geist Mono (Google Fonts) | all text; mono for labels, axis ticks, and small figures |
| `--radius` | 14px | every container; controls are full pills; no other radius |

Every text colour, the accent included, passes 4.5 to 1 against `--bg`, `--bg-deep`, and `--surface`; check a new palette before using it. A team may change the palette and the font pairing (the two directions the prompt proposes), but keeps one accent, one radius system, and the token names.

## The pages, section by section

- **Top bar** (52px, one line at 1280 pixels): the company name with its ticker in mono, the nav as small pill links (the active section tinted with `--accent-soft`), and the price in mono at the right, hidden below 1380 pixels so the nav never wraps. Nav labels and links do not change.
- **Cover** (the hero, one screen): left, a single small label ("FIN 5370 equity research"), the company name, the one-line thesis, the team. Right, one card: exchange and ticker, price and its date, life-cycle stage, the call (or "Coming in Module 5"), and a small revenue bar chart for every year in `data/financials.js` (actual years in `--ink`, forecast years in `--accent`, values above the bars). At most four text elements on the left; no scroll cue.
- **Text sections** (Thesis and any section without its own renderer): head with headline and lede on the left and the facts on the right as a stat row (no boxes: value, tier chip, label, source link, separated by hairlines); the blocks as columns with a hairline on top, no boxes; content centred vertically in the slide.
- **Financials:** head as above. Body is two cards side by side, about 1.7 to 1:
  - **Chart card:** a toggle with three views, "Revenue", "Free cash flow", "Table". Revenue: bars for every year (actual dark, forecast in the accent), the EBIT margin as a line with labelled points in its own band above the bars, a dashed divider and a "FORECAST" tick where the forecast starts. Free cash flow: FCFF and FCFE side by side per year. Table: five rows (revenue, EBIT, EBIT margin, FCFF, FCFE), every year. Hovering a year shows its figures in a dark tooltip. Charts are plain SVG drawn by `financials.js` at the card's real size and redrawn on resize. A one-line legend under the chart names the sources.
  - **Driver card:** the six sliders as compact rows (label, a "why" pop-out, the workbook's value in mono, the current value in the accent, the slider), a Reset button, and the check line with a dot (accent when year-one FCFF matches the workbook, `--derived` when the sliders moved it). The "why" pop-out holds that driver's justification and its source link from `financials.driverJustifications`. The old driver cards and the long tables go.
  - **The model:** `window.forecastModel(F, drivers)` keeps its name and return shape. Each forecast year starts from that year's drivers as the workbook implies them (revenue growth, EBIT margin, taxes over EBIT, D&A, capex, and NWC as shares of revenue); the sliders hold year one's values and move every year by the same amount. At the defaults every forecast year's FCFF equals the workbook's. FCFF = EBIT x (1 - t) + D&A - capex - change in NWC; FCFE = FCFF - interest x (1 - t) + net borrowing.
- **Knowledge Bank** (`vault.html`): keeps its graph, chips, legend, and reading pane. `vault.html` loads `styles.css` before `vault.css`, and `vault.css` drops its own colour and font variables so it reads the shared tokens; if the new palette leaves any Knowledge Bank text below 4.5 to 1, fix it in `vault.css` with the shared tokens.
- **Tearsheet, Glossary, Sources:** the same top bar, fonts, and tokens; a centred reading column.
- **Fonts:** one Google Fonts link in the head of every page (index, vault, tearsheet, glossary, sources) for the chosen pairing.

## The taste skill, applied

Use these parts of `skills/design-taste/SKILL.md`: Section 0 (state the design read above), 4.1 (type), 4.2 (one accent, one palette), 4.4 (one radius system, cards only where they group), 4.5 (press state on every button; no wrapped button labels), 4.7 (hero discipline, one-line nav, at most one small uppercase label per three sections, no split headers without a reason), 9 (every AI tell, especially 9.G: zero em-dashes), 11 (redesign protocol: audit first, preserve ids and labels), and the items in 14 that apply to a plain page. Ignore its React, Tailwind, GSAP, dark-mode, and landing-page sections: this is a research report, and its tables, sliders, and charts are content.

## Never changes

Any number; any section id; any nav label or link; any Fact (value, label, source, tier, note); the content of `content.js` and `data/*.js`; the Knowledge Bank's graph and chips. The redesign changes how things look and where they sit, not what they say. The one exception is the "Trim for presenting" prompt (Module 7), which may shorten words, including Fact labels, to the "Say less" budgets; it never changes a number or a Fact's value, tier, source, or note.

## The check

1. Every live section fits one screen at 1440 x 900 and 1280 x 720: the section's content is no taller than the section.
2. Nothing scrolls sideways at 390 pixels; the nav is one line at 1280.
3. At the default sliders, year-one FCFF matches the workbook, and so does every forecast year's FCFF.
4. Text has at least 4.5 to 1 contrast against its background.
5. Zero em-dashes in `site/`.
6. `git diff` shows no change to a number, a section id, a nav label, a Fact, `content.js`, or `data/`.
7. Say less: each live section is within the budgets above; list each section's visible prose word count.
