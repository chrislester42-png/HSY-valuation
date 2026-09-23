// The words on the site, one object per section. Claude updates one section per module.
// Every number in a Fact traces to an atomic note in research/02 Atomic Notes, and through it to a source note.
// Fact shape: { value: "13.2%", label: "Operating margin, FY2025", source: "S1", tier: "R" | "D" | "E", note: "02 Atomic Notes/FY2025 operating margin 12.3 percent" }
// A section with status "coming" renders as "Coming in Module N". Set status to "live" when it is built.

window.CONTENT = {
  site: {
    companyName: "The Hershey Company",
    ticker: "HSY",
    exchange: "[EXCHANGE]",
    price: null,            // number, from the workbook FrontPage; leave null until Module 2 if unsure
    priceDate: null,        // "YYYY-MM-DD"
    oneLineThesis: "",      // twelve words or fewer, written in Module 1
    team: ["[TEAMMATE ONE]", "[TEAMMATE TWO]"],
    updated: "",            // "YYYY-MM-DD", refreshed at each wrap-up
    callBadge: ""           // filled in Module 5, e.g. "Buy below $150, avoid above $190"
  },

  thesis: {
    status: "coming", module: 1, title: "Thesis",
    headline: "",           // eight words or fewer
    lede: "",               // the memo's argument in forty words or fewer
    stage: "",              // "Mature", "High growth", "Start-up", or "Decline"
    facts: [],              // three Facts that carry the stage diagnosis
    blocks: [               // one block per memo heading, forty words or fewer each
      // { title: "Life-cycle stage", text: "" },
      // { title: "What it means for valuation", text: "" },
      // { title: "Why this company", text: "" },
      // { title: "Recent developments", text: "" }
    ],
    soWhat: "",             // one sentence, twenty words or fewer
    numbersWeStillNeed: []
  },

  financials: {
    status: "coming", module: 2, title: "Financials",
    headline: "", lede: "", facts: [], blocks: [], soWhat: "",
    driverJustifications: [] // { driver: "Revenue growth", assumption: "3.0%", because: "", source: "" }
  },

  vault: {                  // rendered on vault.html, its own page, like the Bloom site's Knowledge Bank
    status: "coming", module: 3, title: "Knowledge Bank",
    headline: "", lede: "",
    inputs: [],             // cost of capital inputs: { input: "Beta", value: "0.35", tier: "D", formula: "", source: "S4", note: "" }
    soWhat: ""
    // Module 3 also bakes research/ into data/notes.js and adds the note explorer below the inputs table
  },

  valuation: {
    status: "coming", module: 4, title: "Valuation",
    headline: "", lede: "", blocks: [], soWhat: "",
    mostSensitiveTo: ""     // one sentence naming the assumption that moves value most
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
