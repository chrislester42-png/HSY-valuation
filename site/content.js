// The words on the site, one object per section. Claude updates one section per module.
// Every number in a Fact traces to an atomic note in research/02 Atomic Notes, and through it to a source note.
// Fact shape: { value: "13.2%", label: "Operating margin, FY2025", source: "S1", tier: "R" | "D" | "E", note: "02 Atomic Notes/FY2025 operating margin 12.3 percent" }
// A section with status "coming" renders as "Coming in Module N". Set status to "live" when it is built.

window.CONTENT = {
  site: {
    companyName: "The Hershey Company",
    ticker: "HSY",
    exchange: "NYSE",
    price: null,            // number, from the workbook FrontPage; leave null until Module 2 if unsure
    priceDate: null,        // "YYYY-MM-DD"
    oneLineThesis: "A mature cash machine whose margins should recover as cocoa falls.",
    team: ["Chris Lester"],   // add the teammate's name here
    updated: "2026-09-28",  // "YYYY-MM-DD", refreshed at each wrap-up
    callBadge: ""           // filled in Module 5, e.g. "Buy below $150, avoid above $190"
  },

  thesis: {
    status: "live", module: 1, title: "Thesis",
    headline: "A mature franchise at its margin trough",
    lede: "Hershey is a mature company: growth is low and price-led, reinvestment is modest, and cash returns are large. Its 2025 margin collapse came from cocoa, not the business, so we value it with a DCF built around margin recovery.",
    stage: "Mature",
    facts: [
      { value: "4.4%", label: "Net sales growth, FY2025", source: "S1", tier: "R", note: "02 Atomic Notes/FY2025 net sales growth 4.4 percent" },
      { value: "12.3%", label: "Operating margin, FY2025", source: "S1", tier: "R", note: "02 Atomic Notes/FY2025 operating margin 12.3 percent" },
      { value: "$2.28B", label: "Operating cash flow, FY2025", source: "S1", tier: "R", note: "02 Atomic Notes/FY2025 operating cash flow 2.28 billion dollars" }
    ],
    blocks: [
      { title: "Life-cycle stage", text: "Mature. Net sales grew 4.4% in FY2025, and 2026 growth is price-led: Q2 confectionery volumes fell about 10% as prices rose about 14%. Capex of $455M ran below D&A of $504M." },
      { title: "What it means for valuation", text: "Stable cash flows and a temporary margin dip make a DCF the anchor. The key input is the operating margin path from 12.3% back toward pre-shock levels. EV to EBITDA on forward estimates is the cross-check." },
      { title: "Why this company", text: "Hershey files full reports with the SEC and holds quarterly earnings calls with published transcripts. Its cash flows are stable enough to anchor a DCF, and the cocoa shock gives the forecast one real question." },
      { title: "Recent developments", text: "Q2 2026 net sales rose 6.6% to $2.79B, and full-year guidance was raised to 4.5% to 5.0% sales growth. Cocoa has fallen more than 70% from late-2024 highs, but hedges delay the benefit." }
    ],
    soWhat: "The value question is how far and how fast margins recover, so our sensitivity work centers on margin.",
    numbersWeStillNeed: [
      "Management's stated FY2027 operating margin target, with the exact quote and date from the Q2 call.",
      "Diluted share count at the latest quarter end, from the Q2 2026 Form 10-Q.",
      "Net debt at June 30, 2026, from the Q2 2026 Form 10-Q, for the valuation bridge in Module 4.",
      "A source for the memo's claim that Damodaran's industry datasets include a food-processing group.",
      "A source for the memo's claim that North America Confectionery is Hershey's single dominant segment."
    ]
  },

  financials: {
    status: "live", module: 2, title: "Financials",
    headline: "Margins rebuild as cocoa costs fall",
    lede: "History comes from Hershey's 10-K filings; the forecast is FactSet consensus run through our workbook. Move the six drivers to see free cash flow respond. At the workbook's settings, year-one FCFF matches the sheet.",
    facts: [
      { value: "$11.69B", label: "Net sales, FY2025", source: "S1", tier: "R", note: "02 Atomic Notes/FY2025 net sales 11.69 billion dollars" },
      { value: "33.5%", label: "Gross margin, FY2025", source: "S1", tier: "R", note: "02 Atomic Notes/FY2025 gross margin 33.5 percent" },
      { value: "3.9%", label: "Capex as share of net sales, FY2025", source: "S1", tier: "D", note: "02 Atomic Notes/FY2025 capex 3.9 percent of net sales" }
    ],
    blocks: [],
    soWhat: "Free cash flow rests on how far the EBIT margin recovers, so that is the slider to test first. Working capital is the second lever, because consensus builds cash into it.",
    // Forecast figures for each driver are computed from data/financials.js by financials.js, never typed here.
    // { driver, key (slider key), assumption, because, source, note (atomic note, optional) }
    driverJustifications: [
      { driver: "Revenue growth", key: "revenueGrowth", assumption: "FactSet consensus, accepted.",
        because: "Net sales grew 4.4% in FY2025 and management guides 4.5% to 5.0% for 2026. Q2 volume fell about 10%, so growth is price-led and should fade toward the category's 2.5% a year.",
        source: "S2", note: "02 Atomic Notes/FY2026 guidance net sales growth 4.5 to 5.0 percent" },
      { driver: "EBIT margin", key: "ebitMargin", assumption: "Consensus EBITDA less the sheet's D&A, accepted.",
        because: "Operating margin fell to 12.3% in FY2025 from 25.9% as cocoa peaked. Cocoa is down more than 70% since, and management guides about 400 basis points of recovery in 2026.",
        source: "S3", note: "02 Atomic Notes/FY2026 margin improvement guided about 400 basis points" },
      { driver: "Tax rate", key: "taxRate", assumption: "Taxes over EBIT, as the workbook's NOPAT row defines it.",
        because: "Consensus taxes over consensus EBIT sit close to FY2025's rate on the same basis, so we accept them. FY2024's rate was lowered by a one-time item and is not a guide.",
        source: "S9" },
      { driver: "D&A", key: "daPct", assumption: "The sheet's formula: FY2025's D&A to capex ratio applied to each year's capex.",
        because: "FY2025 D&A was $504M against capex of $455M. Tying D&A to capex keeps the two moving together as reinvestment changes.",
        source: "S1", note: "02 Atomic Notes/FY2025 depreciation and amortization 504 million dollars" },
      { driver: "Capex", key: "capexPct", assumption: "FactSet consensus, accepted.",
        because: "Capex was 3.9% of net sales in FY2025, down from FY2024 as the ERP and capacity program wound down. Consensus near 4% of revenue fits that run rate.",
        source: "S1", note: "02 Atomic Notes/FY2025 capex 3.9 percent of net sales" },
      { driver: "Net working capital", key: "nwcPct", assumption: "Consensus current assets less current liabilities, accepted.",
        because: "Consensus builds cash inside current assets, so working capital grows faster than revenue and the change in NWC drags on FCFF. We accept it and flag it.",
        source: "S8" }
    ],
    numbersWeStillNeed: [
      "Forecast interest expense: the workbook computes it from the cost of debt on the WACC tab in Module 3. Until then FCFE leaves out the after-tax interest term."
    ]
  },

  vault: {                  // the Knowledge Bank page, site/vault.html: a graph of research/, like the Bloom site's
    status: "live", module: 3, title: "Knowledge Bank",
    // Topic chips across the top of the graph. Each lights up the notes whose tags include one of
    // its tags or whose title contains one of its keywords. Six to eight chips, written in Module 3.
    themes: [
      { label: "Cost of capital", tags: ["cost-of-capital", "wacc", "beta"], kw: ["wacc", "beta", "cost of", "risk premium", "default spread", "treasury yield"] },
      { label: "The bull case", tags: ["guidance"], kw: ["cocoa down", "cocoa below", "margin improvement", "adjusted gross margin", "operating cash flow", "q2 2026 net sales"] },
      { label: "The bear case", tags: ["volume"], kw: ["volume down", "fy2025 net income", "fy2025 operating margin", "fy2025 gross margin", "price increase", "net sales growth 0.3"] },
      { label: "Cocoa cycle", tags: ["cocoa", "commodity"], kw: ["cocoa"] },
      { label: "Margin recovery", tags: ["margin"], kw: ["margin"] },
      { label: "Sales and pricing", tags: ["revenue", "pricing", "volume"], kw: ["price increase", "volume", "chocolate"] },
      { label: "Cash and reinvestment", tags: ["cash-flow", "capex"], kw: ["capex", "capital expenditures", "cash flow", "dividends", "depreciation"] }
    ]
  },

  valuation: {
    status: "live", module: 4, title: "Valuation",
    headline: "DCF puts Hershey at $193 to $219",
    lede: "Our two-stage DCF discounts the consensus forecast at our 6.78% WACC. Both terminal methods value Hershey above its $160.19 price, and about nine-tenths of the value sits beyond 2028, so the sliders test those assumptions.",
    facts: [
      { value: "$218.59", label: "Per share, growth in perpetuity", source: "S9", tier: "D", note: "02 Atomic Notes/Equity value per share 218.59 dollars by growth in perpetuity" },
      { value: "$193.02", label: "Per share, exit multiple", source: "S9", tier: "D", note: "02 Atomic Notes/Equity value per share 193.02 dollars by exit multiple" },
      { value: "92.3%", label: "Terminal value share of EV, growth method", source: "S9", tier: "D", note: "02 Atomic Notes/Terminal value 92.3 and 91.3 percent of enterprise value" }
    ],
    blocks: [],
    soWhat: "Value rests on the spread between WACC and growth. Module 5's peer multiples will tell us which end of $193 to $219 the market supports.",
    mostSensitiveTo: "The spread between WACC and perpetual growth moves value most: half a point of growth is the whole $25.57 gap between our two methods.",
    numbersWeStillNeed: [
      "Diluted share count from the latest 10-Q: the DCF tab's 207.2 million is labelled from a Q1 2020 10-Q, and Milestone 3 used 203.4 million.",
      "A market data source for the $160.19 share price, and which day's close it is (October 2 or October 5, 2026)."
    ],
    // Bull, base, and bear (Module 4). Base is the workbook. Bull and bear shift revenue growth and the EBITDA
    // margin in every forecast year (points added to the workbook's own path) and set the WACC and perpetual growth.
    // Exit multiple, D&A, capex, and the change in NWC stay at the workbook's. Rates only is the base forecast at the
    // WACC and growth on the workbook's growth-by-WACC table nearest the bear case's (worked out by valuation.js).
    // Tier E: proposed by Claude for the team from our memo and the Knowledge Bank; the team accepts or changes them.
    // Full table, inputs, and reasons: research/03 Drafts/Module 4 - Bull base bear.md
    scenarioNote: "03 Drafts/Module 4 - Bull base bear",
    scenarios: [
      { name: "Bull", revenueGrowthShift: 0.010, ebitdaMarginShift: 0.015, wacc: 0.0651, growth: 0.035,
        reasons: {
          revenueGrowth: { text: "Q2 2026 net sales grew 6.6%, above the forecast's 5.2% for FY2026.", note: "02 Atomic Notes/Q2 2026 net sales growth 6.6 percent" },
          ebitdaMargin: { text: "Cocoa is down over 70% from its peak; FY2028 operating margin still ends below FY2024's 25.9%.", note: "02 Atomic Notes/Cocoa down more than 70 percent from late-2024 highs" },
          wacc: { text: "FactSet's beta of 0.34 in place of our adjusted 0.41.", note: "02 Atomic Notes/FactSet beta 0.34" },
          growth: { text: "Net sales grew about 4% a year in FY2023 to FY2025; 3.5% stays below the 5.28% risk-free rate.", note: "02 Atomic Notes/FY2023 net sales growth 7.2 percent" }
        } },
      { name: "Base", base: true,
        reasons: { all: { text: "The workbook: consensus forecast, 6.78% WACC, 3.0% growth, 13.02x exit.", note: "02 Atomic Notes/WACC 6.78 percent" } } },
      { name: "Bear", revenueGrowthShift: -0.015, ebitdaMarginShift: -0.030, wacc: 0.0756, growth: 0.025,
        reasons: {
          revenueGrowth: { text: "Q2 2026 volume fell about 10% as prices rose about 14%; if pricing fades, growth slows.", note: "02 Atomic Notes/Q2 2026 confectionery volume down about 10 percent" },
          ebitdaMargin: { text: "Management guided about 400 basis points of 2026 margin gain; the forecast assumes about twice that.", note: "02 Atomic Notes/FY2026 margin improvement guided about 400 basis points" },
          wacc: { text: "Damodaran's food processing beta of 0.61 in place of our adjusted 0.41.", note: "02 Atomic Notes/Food processing industry beta 0.61" },
          growth: { text: "Chocolate industry growth of about 2.5% a year, the rate our 13.02x exit implies.", note: "02 Atomic Notes/Chocolate industry revenue growth about 2.5 percent a year" }
        } },
      { name: "Rates only", ratesFrom: "Bear",
        reasons: { all: { text: "The base forecast at the growth-by-WACC table's rates nearest the bear case's.", note: "03 Drafts/Module 4 - Bull base bear" } } }
    ]
  },

  theCall: {
    status: "coming", module: 5, title: "The Call",
    headline: "", lede: "",
    scenarios: [],          // { name: "Bear", weight: 0.25, perShare: null, assumptions: "" }
    reconciliation: "",     // forty words or fewer on DCF versus comps
    buyBelow: null, avoidAbove: null
  },

  risks: {
    status: "coming", module: 6, title: "Risks",
    headline: "", lede: "",
    risks: [],              // { risk: "twelve words or fewer", fact: { value: "", label: "", source: "", tier: "" }, ourResponse: "twenty words or fewer" }
    discountRateNote: "",   // one line on how risk shows up in the discount rate
    soWhat: ""
  },

  catalysts: {
    status: "coming", module: 6, title: "Catalysts",
    headline: "", lede: "",
    reflection: "",         // the real options reflection, trimmed to eighty words
    catalysts: [],          // { event: "", when: "", whyItMatters: "", wouldChangeOurView: "", source: "" }
    tripwires: [],          // { condition: "", why: "", whatWeWouldDo: "" }
    earningsScorecard: null // optional, for fun; only if the company reports before Module 8
  },

  process: {
    status: "coming", module: 7, title: "Process",
    headline: "", lede: "",
    catalog: [],            // rows from AI Log.md
    helped: [], misled: [],
    recommendations: []
  }
};
