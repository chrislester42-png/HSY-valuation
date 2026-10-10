// Valuation section (Module 4). Registers window.sections.valuation.
// Every number is read from site/data/financials.js (the workbook's DCF 1-Pager tab, source S9) or computed
// by window.valuation in dcf.js. Nothing is typed by hand.
(function () {
  "use strict";

  const m1 = (x) => (x == null || !isFinite(x) ? "n/a" : (x < 0 ? "-" : "") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  const usd = (x) => (x == null || !isFinite(x) ? "n/a" : "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const m2 = (x) => (x == null || !isFinite(x) ? "n/a" : x.toFixed(2));
  const pct = (x, d) => (x == null || !isFinite(x) ? "n/a" : (100 * x).toFixed(d == null ? 1 : d) + "%");
  const mult = (x, d) => (x == null || !isFinite(x) ? "n/a" : x.toFixed(d == null ? 1 : d) + "x");
  const signed = (x) => (!isFinite(x) ? "n/a" : (x >= 0 ? "+" : "-") + (100 * Math.abs(x)).toFixed(1) + "%");

  // Sliders: the workbook's value is kept exact in state; the slider only moves it when touched.
  const SLIDERS = [
    { key: "wacc", label: "WACC", min: 4, max: 10, step: 0.01, scale: 100, show: (v) => pct(v, 2) },
    { key: "growth", label: "Perpetual growth", min: 0, max: 5, step: 0.05, scale: 100, show: (v) => pct(v, 2) },
    { key: "multiple", label: "Exit multiple", min: 8, max: 20, step: 0.01, scale: 1, show: (v) => mult(v, 2) }
  ];

  window.sections = window.sections || {};
  window.sections.valuation = function (body, s, F) {
    const ui = window.ui, { el, text } = ui;
    const dcf = F && F.dcf;
    if (!dcf || !dcf.years || !dcf.years.length || typeof window.valuation !== "function") {
      body.append(el("p", { class: "lede" }, [text("The DCF tab has not been read yet. Run scripts/workbook_to_data.py.")]));
      return;
    }
    const price = F.company && F.company.price;
    const nearest = (arr, x) => arr.reduce((best, a, i) => (Math.abs(a - x) < Math.abs(arr[best] - x) ? i : best), 0);
    const defs = { wacc: dcf.wacc, growth: dcf.longTermGrowth, multiple: dcf.exitMultiple };
    let state = Object.assign({}, defs);
    let view = "growth";
    const first = dcf.years[0].label, lastY = dcf.years[dcf.years.length - 1].label;

    // ---------- assumptions card ----------
    const inputs = {}, nows = {};
    const rows = SLIDERS.map((c) => {
      const id = "val-" + c.key;
      const input = el("input", { type: "range", id, min: String(c.min), max: String(c.max), step: String(c.step),
        value: String(defs[c.key] * c.scale), "aria-label": c.label });
      input.addEventListener("input", () => { state[c.key] = Number(input.value) / c.scale; update(); });
      inputs[c.key] = input;
      nows[c.key] = el("output", { class: "drv-now", for: id }, [text(c.show(defs[c.key]))]);
      return el("div", { class: "drv drv-grid val-grid" }, [
        el("div", { class: "drv-name" }, [el("label", { for: id }, [text(c.label)])]),
        el("span", { class: "drv-wb", title: "Workbook, DCF 1-Pager" }, [text(c.show(defs[c.key]))]), nows[c.key], input]);
    });
    const reset = el("button", { type: "button", class: "btn" }, [text("Reset")]);
    reset.addEventListener("click", () => {
      state = Object.assign({}, defs);
      SLIDERS.forEach((c) => { inputs[c.key].value = String(defs[c.key] * c.scale); });
      update();
    });
    const sens = el("p", { class: "val-line val-sens" }, [text(s.mostSensitiveTo || "")]);
    // Trimmed for presenting: what moves value and the terminal value lines open from a small pop-out.
    function morePop() {
      const id = "val-more-pop";
      const box = el("div", { class: "pop val-more-pop", id, hidden: "" }, [sens, tvLine]);
      const btn = el("button", { type: "button", class: "why", "data-pop": "", "aria-expanded": "false", "aria-controls": id }, [text("What moves value")]);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = btn.getAttribute("aria-expanded") === "true";
        window.ui.closePops(btn);
        btn.setAttribute("aria-expanded", String(!open));
        box.hidden = open;
      });
      return el("div", { class: "val-more" }, [btn, box]);
    }
    const tvLine = el("p", { class: "val-line", "aria-live": "polite" }, []);
    const dot = el("span", { class: "check-dot" }, []);
    const checkText = el("span", null, []);
    const assumpCard = el("div", { class: "card fin-card val-card" }, [
      el("div", { class: "fin-card-top" }, [el("div", { class: "fin-card-title" }, [text("Terminal assumptions")]), reset]),
      el("div", { class: "drv-cols drv-grid val-grid" }, [el("span", null, []), el("span", null, [text("Workbook")]), el("span", null, [text("Now")]), el("span", null, [])])
    ].concat(rows, [morePop()]));

    // ---------- value card: per share both ways beside the price, and the bridge ----------
    const heroVal = {}, heroUp = {};
    const hero = (k, label) => {
      heroVal[k] = el("div", { class: "val-big" }, []);
      heroUp[k] = el("div", { class: "val-up" }, []);
      return el("div", { class: "val-hero-item" }, [el("div", { class: "val-hero-label" }, [text(label)]), heroVal[k], heroUp[k]]);
    };
    const priceItem = el("div", { class: "val-hero-item val-price" }, [
      el("div", { class: "val-hero-label" }, [text("Price")]),
      el("div", { class: "val-big" }, [text(usd(price))]),
      el("div", { class: "val-up" }, [text(F.company && F.company.priceDate ? window.fmt.date(F.company.priceDate) : "")])]);
    const heroRow = el("div", { class: "val-hero" }, [hero("p", "Perpetuity"), hero("x", "Exit multiple"), priceItem]);

    const BRIDGE = [
      ["PV of " + first + " to " + lastY, (r) => m1(r.pvStage1)],
      ["PV of terminal value", (r) => m1(r.pvTerminal)],
      ["Enterprise value", (r) => m1(r.enterpriseValue), "sum"],
      ["Less net debt", (r) => m1(-r.netDebt)],
      ["Equity value", (r) => m1(r.equityValue), "sum"],
      ["Per share, " + m1(dcf.sharesOut) + "M sh.", (r) => usd(r.perShare), "total"]
    ];
    const cells = BRIDGE.map(() => ({ p: el("td", null, []), x: el("td", null, []) }));
    const bridge = el("table", { class: "val-table" }, [
      el("thead", null, [el("tr", null, [el("th", { scope: "col" }, [text("$ millions")]), el("th", { scope: "col" }, [text("Perpetuity")]), el("th", { scope: "col" }, [text("Multiple")])])]),
      el("tbody", null, BRIDGE.map((b, i) => el("tr", { class: b[2] || null }, [el("th", { scope: "row" }, [text(b[0])]), cells[i].p, cells[i].x])))]);
    const valueCard = el("div", { class: "card fin-card val-card" }, [
      el("div", { class: "fin-card-top" }, [el("div", { class: "fin-card-title" }, [text("Equity value per share")])]),
      heroRow, el("div", { class: "val-bridge" }, [bridge]),
      el("div", { class: "drv-foot" }, [el("p", { class: "check" }, [dot, checkText])])]);

    // ---------- sensitivity card: the workbook's two tables as heatmaps, recomputed here ----------
    const VIEWS = [
      ["growth", "Growth", "perShareByGrowthAndWacc", "growth", (v) => pct(v), "Perpetual growth", "perpetuity"],
      ["multiple", "Multiple", "perShareByMultipleAndWacc", "multiple", (v) => mult(v), "Exit multiple", "exitMultiple"]
    ].filter((v) => dcf.sensitivity && dcf.sensitivity[v[2]]);
    const SCEN = (s.scenarios || []).length ? s.scenarios : null;
    const segViews = VIEWS.map((v) => [v[0], v[1]]).concat(SCEN ? [["scenarios", "Scenarios"]] : []);
    const seg = el("div", { class: "seg", role: "group", "aria-label": "Sensitivity view" }, segViews.map((v) => {
      const b = el("button", { type: "button", "aria-pressed": String(v[0] === view), "data-view": v[0] }, [text(v[1])]);
      b.addEventListener("click", () => { view = v[0]; seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.view === view))); drawView(); });
      return b;
    }));
    // Recompute every cell once from window.valuation over the workbook's own rows and columns.
    const grids = {};
    let worst = 0;
    VIEWS.forEach((v) => {
      const t = dcf.sensitivity[v[2]];
      const values = t.rows.map((w, i) => t.columns.map((c, j) => {
        const inp = { wacc: w }; inp[v[3]] = c;
        const val = window.valuation(dcf, inp)[v[6]].perShare;
        if (t.values && t.values[i] && t.values[i][j] != null) worst = Math.max(worst, Math.abs(val - t.values[i][j]));
        return val;
      }));
      const ranked = values.reduce((a, r) => a.concat(r), []).filter(isFinite).sort((a, b) => a - b);
      grids[v[0]] = { t, values, ranked };
    });
    const heatWrap = el("div", { class: "val-heat-wrap" }, []);
    const heatNote = el("p", { class: "chart-legend" }, []);
    const sensTitle = el("div", { class: "fin-card-title" }, [text("Sensitivity, $ per share")]);
    const sensCard = el("div", { class: "card fin-card val-card" }, [
      el("div", { class: "fin-card-top" }, [sensTitle, seg]), heatWrap, heatNote]);

    // ---------- bull, base, and bear: each scenario's inputs, run through window.valuation ----------
    const baseRevenue = window.valuation.baseRevenue(F);
    const scenInputs = (sc) => window.valuation.scenarioInputs(sc, F, SCEN);
    const scenRuns = SCEN ? SCEN.map((sc) => { const inp = scenInputs(sc); return { sc, inp, r: window.valuation(dcf, inp) }; }) : [];
    let picked = SCEN ? (SCEN.find((x) => x.name === "Bear") || SCEN[0]).name : null;

    body.append(el("div", { class: "val-body" }, [assumpCard, valueCard, sensCard]));

    function drawView() { if (view === "scenarios") drawScenarios(); else drawHeat(); }
    const ptsOf = (x) => (x > 0 ? "+" : x < 0 ? "-" : "") + (100 * Math.abs(x)).toFixed(1) + " pt";
    function drawScenarios() {
      sensTitle.textContent = "Bull, base, and bear";
      const noteLink = (n) => (n ? el("a", { class: "pop-src", href: "vault.html#note=" + encodeURIComponent(n) }, [text("note")]) : text(""));
      const shiftCell = (run, k) => run.sc.base || run.sc.ratesFrom ? "base" : ptsOf(run.inp[k]);
      const body = scenRuns.map((run) => {
        const btn = el("button", { type: "button", class: "scen-btn", "aria-pressed": String(run.sc.name === picked) }, [text(run.sc.name)]);
        btn.addEventListener("click", () => { picked = run.sc.name; drawScenarios(); });
        const P = run.r.perpetuity, X = run.r.exitMultiple;
        return el("tr", { class: run.sc.name === picked ? "picked" : null }, [el("th", { scope: "row" }, [btn]),
          el("td", null, [text(shiftCell(run, "revenueGrowthShift"))]), el("td", null, [text(shiftCell(run, "ebitdaMarginShift"))]),
          el("td", null, [text(pct(run.r.inputs.wacc, 2))]), el("td", null, [text(pct(run.r.inputs.growth, 1))]),
          el("td", { class: "ps" }, [text(usd(P.perShare))]), el("td", { class: "ps" }, [text(usd(X.perShare))])]);
      });
      const table = el("table", { class: "val-table val-scen" }, [
        el("thead", null, [el("tr", null, ["Scenario", "Growth", "Margin", "WACC", "g", "Perpetuity", "Multiple"].map((h) => el("th", { scope: "col" }, [text(h)])))]),
        el("tbody", null, body)]);
      // the picked row's four inputs and reasons
      const run = scenRuns.find((x) => x.sc.name === picked), R = run.sc.reasons || {}, ys = run.r.years;
      const path = (f) => ys.map(f).map((x) => pct(x)).join(", ");
      const lines = [];
      if (R.all) lines.push(el("li", null, [text(R.all.text + " "), noteLink(R.all.note)]));
      [["revenueGrowth", "Revenue growth " + ptsOf(run.inp.revenueGrowthShift || 0) + " (" + path((y, i) => y.revenueGrowth != null ? y.revenueGrowth : y.revenue / (i ? ys[i - 1].revenue : baseRevenue) - 1) + ")"],
       ["ebitdaMargin", "EBITDA margin " + ptsOf(run.inp.ebitdaMarginShift || 0) + " (" + path((y) => y.ebitdaMargin) + ")"],
       ["wacc", "WACC " + pct(run.r.inputs.wacc, 2)], ["growth", "Perpetual growth " + pct(run.r.inputs.growth, 1)]].forEach(([k, label]) => {
        if (R[k]) lines.push(el("li", null, [el("b", null, [text(label + ". ")]), text(R[k].text + " "), noteLink(R[k].note)]));
      });
      if (run.sc.ratesFrom && run.inp.cell) lines.push(el("li", null, [el("b", null, [text("WACC " + pct(run.inp.wacc) + ", growth " + pct(run.inp.growth) + ". ")]),
        text("Row " + run.inp.cell.row + ", column " + run.inp.cell.col + " of the growth-by-WACC table.")]));
      heatWrap.classList.add("scen");
      heatWrap.title = "Shifts add points to every forecast year. Exit multiple, D&A, capex, and the change in NWC stay at the workbook's.";
      heatWrap.replaceChildren(el("div", { class: "val-scen-wrap" }, [table]), el("ul", { class: "val-reasons", "aria-live": "polite" }, lines));
      const draft = s.scenarioNote ? el("a", { href: "vault.html#note=" + encodeURIComponent(s.scenarioNote) }, [text("the draft")]) : text("the draft");
      heatNote.replaceChildren(text("Estimates (E); the sliders do not move these rows. Inputs, reasons, and formulas: "),
        draft, text("."));
    }
    function drawHeat() {
      const v = VIEWS.find((x) => x[0] === view);
      if (!v) return;
      sensTitle.textContent = "Sensitivity, $ per share";
      heatWrap.classList.remove("scen"); heatWrap.removeAttribute("title");
      const g = grids[view], t = g.t;
      const ni = nearest(t.rows, state.wacc), nj = nearest(t.columns, state[v[3]]);
      const shade = (val) => {
        if (!isFinite(val)) return null;
        const rank = g.ranked.indexOf(val) / Math.max(1, g.ranked.length - 1);
        return "background: rgba(11, 115, 64, " + (0.05 + 0.5 * rank).toFixed(3) + ")";
      };
      const head = el("tr", null, [el("th", { scope: "col", class: "corner" }, [text("WACC")])].concat(
        t.columns.map((c) => el("th", { scope: "col" }, [text(v[4](c))]))));
      const rowsEl = t.rows.map((w, i) => el("tr", null, [el("th", { scope: "row" }, [text(pct(w))])].concat(
        t.columns.map((c, j) => el("td", { style: shade(g.values[i][j]), class: i === ni && j === nj ? "near" : null,
          title: "WACC " + pct(w, 2) + ", " + v[5].toLowerCase() + " " + v[4](c) + ": " + usd(g.values[i][j]) }, [text(m2(g.values[i][j]))])))));
      heatWrap.replaceChildren(el("div", { class: "val-axis" }, [text(v[5] + " across, WACC down")]),
        el("table", { class: "val-heat", "aria-label": "Equity value per share by WACC and " + v[5].toLowerCase() }, [el("thead", null, [head]), el("tbody", null, rowsEl)]));
      // Trimmed for presenting: units and source on the card; how to read the heatmap is in the hover tooltip.
      heatNote.title = "Darker is higher; outlined is nearest the sliders. Recomputed over the workbook's rows and columns: largest gap from the DCF tab " + usd(worst) + ". Valued " + window.fmt.date(dcf.valuationDate) + "; " + first + " counts " + pct(dcf.stubFraction) + " of its cash flow. Workbook DCF 1-Pager (S9).";
      heatNote.replaceChildren(text("$ per share. Workbook DCF 1-Pager, "), el("a", { href: "sources.html#S9" }, [text("S9")]));
    }

    function update() {
      SLIDERS.forEach((c) => { nows[c.key].textContent = c.show(state[c.key]); });
      const r = window.valuation(dcf, state), P = r.perpetuity, X = r.exitMultiple;
      heroVal.p.textContent = usd(P.perShare);
      heroVal.x.textContent = usd(X.perShare);
      heroUp.p.textContent = P.valid && price ? signed(P.perShare / price - 1) + " upside" : "needs growth below WACC";
      heroUp.x.textContent = price ? signed(X.perShare / price - 1) + " upside" : "";
      BRIDGE.forEach((b, i) => { cells[i].p.textContent = b[1](P); cells[i].x.textContent = b[1](X); });
      tvLine.textContent = P.valid
        ? "Terminal value is " + pct(P.tvShareOfEv) + " of enterprise value by growth and " + pct(X.tvShareOfEv) + " by multiple. " +
          pct(state.growth) + " growth implies " + mult(P.impliedExitMultiple) + " EBITDA at exit; " + mult(state.multiple, 2) + " implies " + pct(X.impliedGrowth) + " growth."
        : "Terminal value is " + pct(X.tvShareOfEv) + " of enterprise value by multiple; " + mult(state.multiple, 2) + " implies " + pct(X.impliedGrowth) + " growth.";
      drawView();
    }

    // The check: at the workbook's inputs, both per-share values against the DCF tab's.
    const base = window.valuation(dcf, defs), wb = dcf.workbookResult || {};
    const gp = Math.abs(base.perpetuity.perShare - wb.perSharePerpetuity), gx = Math.abs(base.exitMultiple.perShare - wb.perShareExitMultiple);
    const match = gp < 0.005 && gx < 0.005;
    dot.classList.toggle("moved", !match);
    // Trimmed for presenting: a few words on the card, the full comparison in the hover tooltip.
    checkText.textContent = match ? "Matches the DCF tab" : "Differs from the DCF tab";
    checkText.parentNode.title = "Workbook inputs: site " + usd(base.perpetuity.perShare) + " and " + usd(base.exitMultiple.perShare) +
      ", DCF tab " + usd(wb.perSharePerpetuity) + " and " + usd(wb.perShareExitMultiple) + (match ? ". Match." : ". They differ.");

    update();
  };
})();
