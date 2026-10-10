// Financials section (Module 2). Registers window.sections.financials and window.forecastModel.
// Every number here is read or computed from site/data/financials.js (the team workbook, source S9).
// Nothing is typed by hand: rerun scripts/workbook_to_data.py after the workbook changes.
(function () {
  "use strict";

  const actualsOf = (F) => F.periods.filter((p) => p.actual);
  const forecastsOf = (F) => F.periods.filter((p) => !p.actual);
  const nwcOf = (p) => (p.currentAssets == null || p.currentLiabilities == null ? null : p.currentAssets - p.currentLiabilities);
  const div = (a, b) => (a == null || b == null || b === 0 ? null : a / b);
  const KEYS = ["revenueGrowth", "ebitMargin", "taxRate", "daPct", "capexPct", "nwcPct"];

  // Each forecast year's drivers as the workbook implies them. The tax rate follows the workbook's
  // NOPAT row (NOPAT = EBIT less the income tax line), so it is taxes over EBIT.
  function impliedDrivers(F) {
    const all = F.periods;
    return forecastsOf(F).map((p) => {
      const prev = all[all.indexOf(p) - 1];
      return {
        revenueGrowth: div(p.revenue, prev.revenue) - 1,
        ebitMargin: div(p.ebit, p.revenue),
        taxRate: div(p.incomeTaxes, p.ebit),
        daPct: div(p.da, p.revenue),
        capexPct: div(p.capex, p.revenue),
        nwcPct: div(nwcOf(p), p.revenue)
      };
    });
  }
  // The sliders hold year one's drivers.
  function defaultDrivers(F) { return Object.assign({}, impliedDrivers(F)[0]); }

  // Pure model. Each forecast year starts from its own workbook-implied drivers; the sliders hold
  // year one's values and move every year by the same amount, so at the defaults every year's FCFF
  // equals the workbook's.
  // FCFF = EBIT x (1 - t) + D&A - capex - change in NWC
  // FCFE = FCFF - interest x (1 - t) + net borrowing   (interest and long-term debt from the workbook)
  function forecastModel(F, d) {
    const base = actualsOf(F).slice(-1)[0];
    const implied = impliedDrivers(F), d0 = implied[0];
    d = d || d0;
    let prevRevenue = base.revenue, prevNwc = nwcOf(base), prevDebt = base.longTermDebt;
    const years = forecastsOf(F).map((p, i) => {
      const k = {};
      KEYS.forEach((key) => { k[key] = implied[i][key] + (d[key] - d0[key]); });
      const revenue = prevRevenue * (1 + k.revenueGrowth);
      const ebit = revenue * k.ebitMargin;
      const taxes = ebit * k.taxRate;
      const nopat = ebit - taxes;
      const da = revenue * k.daPct;
      const capex = revenue * k.capexPct;
      const nwc = revenue * k.nwcPct;
      const changeInNwc = nwc - prevNwc;
      const fcff = nopat + da - capex - changeInNwc;
      const interest = p.interestExpense || 0;
      const afterTaxInterest = interest * (1 - k.taxRate);
      const netBorrowing = (p.longTermDebt != null && prevDebt != null) ? p.longTermDebt - prevDebt : 0;
      const fcfe = fcff - afterTaxInterest + netBorrowing;
      const row = { label: p.label, year: p.year, revenue, revenueGrowth: k.revenueGrowth, ebit, ebitMargin: k.ebitMargin,
        taxes, taxRate: k.taxRate, nopat, da, capex, nwc, changeInNwc, fcff, interest, afterTaxInterest, netBorrowing, fcfe,
        workbookFcff: p.fcff, workbookFcfe: p.fcfe };
      prevRevenue = revenue; prevNwc = nwc; prevDebt = p.longTermDebt;
      return row;
    });
    return { baseYear: base.label, drivers: Object.assign({}, d), years };
  }
  forecastModel.defaults = defaultDrivers;
  forecastModel.implied = impliedDrivers;
  window.forecastModel = forecastModel;

  // ---------- formatting ----------
  const m1 = (x) => (x == null || isNaN(x) ? "n/a" : (x < 0 ? "-" : "") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  const m0 = (x) => (x == null || isNaN(x) ? "n/a" : Math.round(x).toLocaleString("en-US"));
  const p1 = (x) => (x == null || isNaN(x) ? "n/a" : (100 * x).toFixed(1) + "%");

  const SLIDERS = [
    { key: "revenueGrowth", label: "Revenue growth", title: "Revenue growth", min: -5, max: 15 },
    { key: "ebitMargin", label: "EBIT margin", title: "EBIT margin", min: 5, max: 35 },
    { key: "taxRate", label: "Tax rate", title: "Tax rate (taxes / EBIT)", min: 10, max: 40 },
    { key: "daPct", label: "D&A", title: "D&A, % of revenue", min: 1, max: 8 },
    { key: "capexPct", label: "Capex", title: "Capex, % of revenue", min: 1, max: 8 },
    { key: "nwcPct", label: "NWC", title: "Net working capital, % of revenue", min: -5, max: 20 }
  ];

  // Every year on one axis: actual years from the workbook, forecast years from the model.
  function series(F, model) {
    const acts = actualsOf(F).map((p) => ({ label: p.label, actual: true, revenue: p.revenue, ebit: p.ebit,
      ebitMargin: div(p.ebit, p.revenue), fcff: p.fcff, fcfe: p.fcfe }));
    return acts.concat(model.years.map((y) => ({ label: y.label, actual: false, revenue: y.revenue, ebit: y.ebit,
      ebitMargin: y.ebitMargin, fcff: y.fcff, fcfe: y.fcfe })));
  }

  window.sections = window.sections || {};
  window.sections.financials = function (body, s, F) {
    const ui = window.ui, { el, text, svg } = ui;
    if (!F || !F.periods || !actualsOf(F).length || !forecastsOf(F).length) {
      body.append(el("p", { class: "lede" }, [text("The workbook data has not been generated yet. Run scripts/workbook_to_data.py.")]));
      return;
    }
    const defs = defaultDrivers(F);
    let drivers = Object.assign({}, defs);
    let model = forecastModel(F, drivers);
    let view = "revenue";
    const nActual = actualsOf(F).length;

    // ---------- chart card ----------
    const VIEWS = [["revenue", "Revenue", "Revenue and EBIT margin"], ["fcf", "Free cash flow", "Free cash flow, FCFF and FCFE"], ["table", "Table", "Every year, $ millions"]];
    const title = el("div", { class: "fin-card-title" }, []);
    const seg = el("div", { class: "seg", role: "group", "aria-label": "Chart view" }, VIEWS.map(([k, label]) => {
      const b = el("button", { type: "button", "aria-pressed": String(k === view), "data-view": k }, [text(label)]);
      b.addEventListener("click", () => { view = k; seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.view === view))); draw(); });
      return b;
    }));
    const area = el("div", { class: "chart-area" }, []);
    const tip = el("div", { class: "tip", hidden: "" }, []);
    // Trimmed for presenting: units and sources on the card; how the years are sourced is in the hover tooltip.
    const legend = el("p", { class: "chart-legend", title: "Actual years: Forms 10-K via SEC XBRL (S1). Forecast years: FactSet consensus in our workbook (S8, S9), moved by the drivers." }, [
      text("$ millions. "), el("a", { href: "sources.html#S1" }, [text("S1")]), text(", "),
      el("a", { href: "sources.html#S8" }, [text("S8")]), text(", "),
      el("a", { href: "sources.html#S9" }, [text("S9")])]);
    const chartCard = el("div", { class: "card fin-card chart-card" }, [
      el("div", { class: "fin-card-top" }, [title, seg]), area, legend]);

    // ---------- driver card ----------
    const just = {};
    (s.driverJustifications || []).forEach((j) => { if (j.key) just[j.key] = j; });
    const inputs = {}, nows = {};
    const rows = SLIDERS.map((c) => {
      const id = "fin-" + c.key, popId = "why-" + c.key;
      const input = el("input", { type: "range", id, min: String(c.min), max: String(c.max), step: "0.1",
        value: (100 * defs[c.key]).toFixed(1), "aria-label": c.title });
      input.addEventListener("input", () => { drivers[c.key] = Number(input.value) / 100; update(); });
      inputs[c.key] = input;
      nows[c.key] = el("output", { class: "drv-now", for: id }, [text(p1(defs[c.key]))]);
      const name = el("div", { class: "drv-name" }, [el("label", { for: id, title: c.title }, [text(c.label)])]);
      const row = el("div", { class: "drv drv-grid" }, [name, el("span", { class: "drv-wb", title: "Workbook, " + model.years[0].label }, [text(p1(defs[c.key]))]), nows[c.key], input]);
      const j = just[c.key];
      if (j) {
        const pop = el("div", { class: "pop", id: popId, hidden: "" }, [el("h4", null, [text(j.driver || c.title)])]);
        if (j.assumption) pop.append(el("p", null, [el("strong", null, [text(j.assumption)])]));
        if (j.because) pop.append(el("p", null, [text(j.because)]));
        pop.append(ui.sourceLink(j, "pop-src"));
        const btn = el("button", { type: "button", class: "why", "data-pop": "", "aria-expanded": "false", "aria-controls": popId, "aria-label": "Why this " + c.label + " driver" }, [text("why")]);
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const open = btn.getAttribute("aria-expanded") === "true";
          ui.closePops(btn);
          btn.setAttribute("aria-expanded", String(!open));
          pop.hidden = open;
        });
        name.append(btn);
        row.append(pop);
      }
      return row;
    });
    const dot = el("span", { class: "check-dot" }, []);
    const checkText = el("span", { "aria-live": "polite" }, []);
    const reset = el("button", { type: "button", class: "btn" }, [text("Reset")]);
    reset.addEventListener("click", () => {
      drivers = Object.assign({}, defs);
      SLIDERS.forEach((c) => { inputs[c.key].value = (100 * defs[c.key]).toFixed(1); });
      update();
    });
    const driverCard = el("div", { class: "card fin-card drv-card" }, [
      el("div", { class: "fin-card-top" }, [el("div", { class: "fin-card-title" }, [text("Forecast drivers")])]),
      el("div", { class: "drv-cols drv-grid" }, [el("span", null, [text("Year one, " + model.years[0].label)]), el("span", null, [text("Workbook")]), el("span", null, [text("Now")]), el("span", null, [])])
    ].concat(rows, [el("div", { class: "drv-foot" }, [el("p", { class: "check" }, [dot, checkText]), reset])]));

    body.append(el("div", { class: "fin-body" }, [chartCard, driverCard]));

    // ---------- drawing ----------
    function showTip(d, cx, W) {
      tip.replaceChildren(el("b", null, [text(d.label + (d.actual ? ", actual" : ", forecast"))]),
        el("span", null, [el("i", null, [text("Revenue")]), text(m1(d.revenue))]),
        el("span", null, [el("i", null, [text("EBIT margin")]), text(p1(d.ebitMargin))]),
        el("span", null, [el("i", null, [text("FCFF")]), text(m1(d.fcff))]),
        el("span", null, [el("i", null, [text("FCFE")]), text(m1(d.fcfe))]));
      tip.hidden = false;
      const w = tip.offsetWidth;
      tip.style.left = (cx + 14 + w > W ? cx - 14 - w : cx + 14) + "px";
      tip.style.top = "8px";
    }
    function txt(attrs, str) { const t = svg("text", attrs); t.textContent = str; return t; }

    function frame(data, W, H, bottom) {
      // forecast wash and divider, shared by both chart views (the site's signature detail)
      const n = data.length, colW = W / n, kids = [];
      const x0 = nActual * colW;
      kids.push(svg("rect", { x: x0, y: 0, width: W - x0, height: H - bottom, class: "c-wash" }));
      kids.push(svg("line", { x1: x0, x2: x0, y1: 0, y2: H - bottom, class: "c-div" }));
      kids.push(txt({ x: x0 + 8, y: 12, class: "t-fore" }, "FORECAST"));
      kids.push(svg("line", { x1: 0, x2: W, y1: H - bottom + 0.5, y2: H - bottom + 0.5, class: "c-base" }));
      data.forEach((d, i) => kids.push(txt({ x: i * colW + colW / 2, y: H - 6, "text-anchor": "middle", class: "t-x" }, d.label)));
      return { colW, kids };
    }
    function hoverLayer(data, W, H, colW, kids) {
      const hl = svg("rect", { x: 0, y: 0, width: colW, height: H - 24, class: "c-hover", visibility: "hidden" });
      kids.splice(1, 0, hl);
      data.forEach((d, i) => {
        const r = svg("rect", { x: i * colW, y: 0, width: colW, height: H, fill: "transparent" });
        r.addEventListener("pointerenter", () => { hl.setAttribute("x", i * colW); hl.setAttribute("visibility", "visible"); showTip(d, i * colW + colW / 2, W); });
        r.addEventListener("pointerleave", () => { hl.setAttribute("visibility", "hidden"); tip.hidden = true; });
        kids.push(r);
      });
    }

    function drawRevenue(data, W, H) {
      const bottom = 24, { colW, kids } = frame(data, W, H, bottom);
      const bandTop = 24, bandH = Math.max(48, H * 0.22), barsTop = bandTop + bandH + 34;
      const barW = Math.min(colW * 0.5, 64);
      const maxRev = Math.max.apply(null, data.map((d) => d.revenue || 0));
      const showVals = colW >= 64;
      data.forEach((d, i) => {
        const h = Math.max(0, (H - bottom - barsTop) * (d.revenue || 0) / maxRev), x = i * colW + (colW - barW) / 2, y = H - bottom - h;
        kids.push(svg("rect", { x, y, width: barW, height: h, class: d.actual ? "c-actual" : "c-fore" }));
        if (showVals) kids.push(txt({ x: x + barW / 2, y: y - 6, "text-anchor": "middle", class: "t-val" }, m1(d.revenue)));
      });
      // EBIT margin as a line with labelled points, in its own band above the bars
      const ms = data.map((d) => d.ebitMargin).filter((v) => v != null);
      let lo = Math.min.apply(null, ms), hi = Math.max.apply(null, ms);
      if (hi - lo < 0.01) { lo -= 0.005; hi += 0.005; }
      const yOf = (v) => bandTop + 20 + (bandH - 20) * (1 - (v - lo) / (hi - lo));
      kids.push(txt({ x: 0, y: 12, class: "t-note" }, "EBIT margin"));
      const pts = data.map((d, i) => [i * colW + colW / 2, d.ebitMargin == null ? null : yOf(d.ebitMargin)]).filter((p) => p[1] != null);
      kids.push(svg("polyline", { points: pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "), class: "c-margin" }));
      data.forEach((d, i) => {
        if (d.ebitMargin == null) return;
        const cx = i * colW + colW / 2, cy = yOf(d.ebitMargin);
        kids.push(svg("circle", { cx, cy, r: 3.5, class: "c-margin-pt" }));
        kids.push(txt({ x: cx, y: cy - 9, "text-anchor": "middle", class: "t-val c-margin-lab" }, p1(d.ebitMargin)));
      });
      hoverLayer(data, W, H, colW, kids);
      return kids;
    }

    function drawFcf(data, W, H) {
      const bottom = 24, { colW, kids } = frame(data, W, H, bottom);
      const top = 40, barW = Math.min(colW * 0.28, 40), gap = 6;
      const vals = data.reduce((a, d) => a.concat([d.fcff, d.fcfe]), []).filter((v) => v != null);
      const hi = Math.max(0, Math.max.apply(null, vals)), lo = Math.min(0, Math.min.apply(null, vals));
      const scale = (H - bottom - top - (lo < 0 ? 18 : 0)) / (hi - lo || 1);
      const zero = top + hi * scale;
      if (lo < 0) kids.push(svg("line", { x1: 0, x2: W, y1: zero, y2: zero, class: "c-base" }));
      const showVals = colW >= 84;
      data.forEach((d, i) => {
        const cx = i * colW + colW / 2;
        [["fcff", -1, false], ["fcfe", 1, true]].forEach(([k, side, light]) => {
          const x = side < 0 ? cx - gap / 2 - barW : cx + gap / 2;
          const v = d[k];
          if (v == null) { kids.push(txt({ x: x + barW / 2, y: zero - 6, "text-anchor": "middle", class: "t-note" }, "n/a")); return; }
          const y = v >= 0 ? zero - v * scale : zero, h = Math.abs(v) * scale;
          kids.push(svg("rect", { x, y, width: barW, height: Math.max(h, 1), class: (d.actual ? "c-actual" : "c-fore") + (light ? " c-light" : "") }));
          if (showVals) kids.push(txt({ x: x + barW / 2, y: v >= 0 ? y - 6 : y + h + 12, "text-anchor": "middle", class: "t-val" }, m0(v)));
        });
      });
      kids.push(txt({ x: 0, y: 12, class: "t-note" }, "Solid FCFF, light FCFE"));
      hoverLayer(data, W, H, colW, kids);
      return kids;
    }

    function drawTable(data) {
      const head = el("tr", null, [el("th", { scope: "col" }, [text("")])].concat(
        data.map((d) => el("th", { scope: "col", class: d.actual ? null : "f" }, [text(d.label)]))));
      const R = (label, key, f) => el("tr", null, [el("th", { scope: "row" }, [text(label)])].concat(
        data.map((d) => el("td", { class: d.actual ? null : "f" }, [text(f(d[key]))]))));
      return el("div", { class: "fin-table-wrap" }, [el("table", { class: "fin-table" }, [
        el("thead", null, [head]),
        el("tbody", null, [R("Revenue", "revenue", m1), R("EBIT", "ebit", m1), R("EBIT margin", "ebitMargin", p1),
          R("FCFF", "fcff", m1), R("FCFE", "fcfe", m1)])])]);
    }

    function draw() {
      const data = series(F, model);
      title.textContent = VIEWS.find((v) => v[0] === view)[2];
      tip.hidden = true;
      if (view === "table") { area.replaceChildren(drawTable(data)); return; }
      const W = area.clientWidth, H = area.clientHeight;
      if (!W || !H) return;
      const kids = view === "fcf" ? drawFcf(data, W, H) : drawRevenue(data, W, H);
      area.setAttribute("aria-label", title.textContent + ": " + data.map((d) => d.label + " revenue " + m1(d.revenue) + ", FCFF " + m1(d.fcff)).join("; "));
      area.replaceChildren(svg("svg", { viewBox: "0 0 " + W + " " + H, role: "img" }, kids), tip);
    }

    function update() {
      SLIDERS.forEach((c) => { nows[c.key].textContent = p1(drivers[c.key]); });
      model = forecastModel(F, drivers);
      const y1 = model.years[0], gap = y1.fcff - y1.workbookFcff, same = Math.abs(gap) < 0.05;
      dot.classList.toggle("moved", !same);
      // Trimmed for presenting: a few words on the card, the full comparison in the hover tooltip.
      checkText.textContent = same ? "Matches the workbook" : (gap > 0 ? "+" : "-") + "$" + m1(Math.abs(gap)) + "M from the workbook";
      checkText.parentNode.title = same
        ? "Year-one FCFF (" + y1.label + ") is $" + m1(y1.fcff) + "M, matching the workbook."
        : "Year-one FCFF (" + y1.label + ") is $" + m1(y1.fcff) + "M, " + (gap > 0 ? "+" : "-") + m1(Math.abs(gap)) + " from the workbook's $" + m1(y1.workbookFcff) + "M.";
      draw();
    }
    update();
    if ("ResizeObserver" in window) new ResizeObserver(() => draw()).observe(area);
  };
})();
