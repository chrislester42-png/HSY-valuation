// Financials section (Module 2). Registers window.sections.financials and window.forecastModel.
// Every number here is read or computed from site/data/financials.js (the team workbook, source S9).
// Nothing is typed by hand: rerun scripts/workbook_to_data.py after the workbook changes.
(function () {
  "use strict";

  const actualsOf = (F) => F.periods.filter((p) => p.actual);
  const forecastsOf = (F) => F.periods.filter((p) => !p.actual);
  const nwcOf = (p) => (p.currentAssets == null || p.currentLiabilities == null ? null : p.currentAssets - p.currentLiabilities);
  const div = (a, b) => (a == null || b == null || b === 0 ? null : a / b);

  // Driver defaults: the workbook's first forecast year. The tax rate follows the workbook's
  // NOPAT row (NOPAT = EBIT less the income tax line), so it is taxes over EBIT.
  function defaultDrivers(F) {
    const base = actualsOf(F).slice(-1)[0];
    const f1 = forecastsOf(F)[0];
    return {
      revenueGrowth: div(f1.revenue, base.revenue) - 1,
      ebitMargin: div(f1.ebit, f1.revenue),
      taxRate: div(f1.incomeTaxes, f1.ebit),
      daPct: div(f1.da, f1.revenue),
      capexPct: div(f1.capex, f1.revenue),
      nwcPct: div(nwcOf(f1), f1.revenue)
    };
  }

  // Pure model: one set of drivers applied to every forecast year.
  // FCFF = EBIT x (1 - t) + D&A - capex - change in NWC
  // FCFE = FCFF - interest x (1 - t) + net borrowing
  // Interest expense and long-term debt come from the workbook (interest reads 0 until Module 3).
  function forecastModel(F, d) {
    const base = actualsOf(F).slice(-1)[0];
    let prevRevenue = base.revenue, prevNwc = nwcOf(base), prevDebt = base.longTermDebt;
    const years = forecastsOf(F).map((p) => {
      const revenue = prevRevenue * (1 + d.revenueGrowth);
      const ebit = revenue * d.ebitMargin;
      const taxes = ebit * d.taxRate;
      const nopat = ebit - taxes;
      const da = revenue * d.daPct;
      const capex = revenue * d.capexPct;
      const nwc = revenue * d.nwcPct;
      const changeInNwc = nwc - prevNwc;
      const fcff = nopat + da - capex - changeInNwc;
      const interest = p.interestExpense || 0;
      const afterTaxInterest = interest * (1 - d.taxRate);
      const netBorrowing = (p.longTermDebt != null && prevDebt != null) ? p.longTermDebt - prevDebt : 0;
      const fcfe = fcff - afterTaxInterest + netBorrowing;
      const row = { label: p.label, year: p.year, revenue, revenueGrowth: d.revenueGrowth, ebit, ebitMargin: d.ebitMargin,
        taxes, taxRate: d.taxRate, nopat, da, capex, nwc, changeInNwc, fcff, interest, afterTaxInterest, netBorrowing, fcfe,
        workbookFcff: p.fcff, workbookFcfe: p.fcfe };
      prevRevenue = revenue; prevNwc = nwc; prevDebt = p.longTermDebt;
      return row;
    });
    return { baseYear: base.label, drivers: Object.assign({}, d), years };
  }
  forecastModel.defaults = defaultDrivers;
  window.forecastModel = forecastModel;

  // ---------- formatting ----------
  const m1 = (x) => (x == null || isNaN(x) ? "n/a" : (x < 0 ? "-" : "") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  const p1 = (x) => (x == null || isNaN(x) ? "n/a" : (100 * x).toFixed(1) + "%");

  const SLIDERS = [
    { key: "revenueGrowth", label: "Revenue growth", min: -5, max: 15 },
    { key: "ebitMargin", label: "EBIT margin", min: 5, max: 35 },
    { key: "taxRate", label: "Tax rate (taxes / EBIT)", min: 10, max: 40 },
    { key: "daPct", label: "D&A, % of revenue", min: 1, max: 8 },
    { key: "capexPct", label: "Capex, % of revenue", min: 1, max: 8 },
    { key: "nwcPct", label: "NWC, % of revenue", min: -5, max: 20 }
  ];

  // FY actual value of each driver, defined the same way as the slider
  function actualDriver(F, key) {
    const acts = actualsOf(F), last = acts[acts.length - 1], prev = acts[acts.length - 2];
    switch (key) {
      case "revenueGrowth": return prev ? div(last.revenue, prev.revenue) - 1 : null;
      case "ebitMargin": return div(last.ebit, last.revenue);
      case "taxRate": return div(last.incomeTaxes, last.ebit);
      case "daPct": return div(last.da, last.revenue);
      case "capexPct": return div(last.capex, last.revenue);
      case "nwcPct": return div(nwcOf(last), last.revenue);
    }
    return null;
  }

  function table(ui, caption, cols, rows) {
    const { el, text } = ui;
    const head = el("tr", null, [el("th", { scope: "col" }, [text("$ millions")])].concat(
      cols.map((c) => el("th", { scope: "col", class: "num" }, [text(c)]))));
    const body = rows.map((r) => el("tr", r.total ? { class: "total" } : null,
      [el("th", { scope: "row" }, [text(r.label)])].concat(r.values.map((v) => el("td", { class: "num" }, [text(v)])))));
    return el("div", { class: "table-wrap" }, [el("table", null, [
      el("caption", { class: "section-label" }, [text(caption)]),
      el("thead", null, [head]), el("tbody", null, body)])]);
  }

  function historyTable(ui, F) {
    const acts = actualsOf(F);
    const all = F.periods;
    const prevOf = (p) => all[all.indexOf(p) - 1];
    const prevNwc = (p) => (prevOf(p) ? nwcOf(prevOf(p)) : null);
    const R = (label, fn, total) => ({ label, total, values: acts.map(fn) });
    return table(ui, "History: actual years, from the 10-K", acts.map((p) => p.label), [
      R("Revenue", (p) => m1(p.revenue)),
      R("Revenue growth", (p) => (prevOf(p) ? p1(div(p.revenue, prevOf(p).revenue) - 1) : "n/a")),
      R("Gross margin", (p) => p1(div(p.revenue - p.costOfSales, p.revenue))),
      R("EBIT", (p) => m1(p.ebit)),
      R("EBIT margin", (p) => p1(div(p.ebit, p.revenue))),
      R("Income taxes", (p) => m1(p.incomeTaxes)),
      R("Tax rate (taxes / EBIT)", (p) => p1(div(p.incomeTaxes, p.ebit))),
      R("Net income", (p) => m1(p.netIncome)),
      R("D&A", (p) => m1(p.da)),
      R("Capex", (p) => m1(p.capex)),
      R("Net working capital", (p) => m1(nwcOf(p))),
      R("NWC, % of revenue", (p) => p1(div(nwcOf(p), p.revenue))),
      R("Change in NWC", (p) => (p.changeInNwc != null ? m1(p.changeInNwc) : (prevNwc(p) != null ? m1(nwcOf(p) - prevNwc(p)) : "n/a"))),
      R("FCFF", (p) => m1(p.fcff), true)
    ]);
  }

  function forecastTable(ui, model) {
    const ys = model.years;
    const R = (label, key, fmt, total) => ({ label, total, values: ys.map((y) => fmt(y[key])) });
    return table(ui, "Forecast: recomputed from the sliders", ys.map((y) => y.label), [
      R("Revenue", "revenue", m1),
      R("Revenue growth", "revenueGrowth", p1),
      R("EBIT", "ebit", m1),
      R("EBIT margin", "ebitMargin", p1),
      R("Taxes on EBIT", "taxes", m1),
      R("NOPAT", "nopat", m1),
      R("Plus D&A", "da", m1),
      R("Less capex", "capex", m1),
      R("Net working capital", "nwc", m1),
      R("Less change in NWC", "changeInNwc", m1),
      R("FCFF", "fcff", m1, true),
      R("Interest expense (workbook)", "interest", m1),
      R("Less after-tax interest", "afterTaxInterest", m1),
      R("Plus net borrowing (workbook)", "netBorrowing", m1),
      R("FCFE", "fcfe", m1, true)
    ]);
  }

  function fcffChart(ui, F, model) {
    const { el, text } = ui;
    const last = actualsOf(F).slice(-1)[0];
    const points = [{ label: last.label, value: last.fcff, actual: true }]
      .concat(model.years.map((y) => ({ label: y.label, value: y.fcff, actual: false })));
    const max = Math.max.apply(null, points.map((p) => Math.abs(p.value || 0)).concat([1]));
    return el("div", null, [
      el("p", { class: "section-label" }, [text("FCFF, $ millions (" + last.label + " from the workbook, forecast from the sliders)")]),
      el("div", { class: "bars", role: "img", "aria-label": "FCFF by year: " + points.map((p) => p.label + " " + m1(p.value)).join(", ") },
        points.map((p) => el("div", { class: "bar" }, [
          el("small", { class: "num" }, [text(m1(p.value))]),
          el("div", { class: "bar-fill", style: "height:" + Math.max(0, 100 * (p.value || 0) / max).toFixed(1) + "%" +
            (p.actual ? ";background:var(--muted)" : "") }, []),
          el("span", { class: "bar-label" }, [text(p.label)])
        ])))
    ]);
  }

  function compareLine(model) {
    const y1 = model.years[0];
    const gap = y1.fcff - y1.workbookFcff;
    const same = Math.abs(gap) < 0.05;
    return "Year-one FCFF (" + y1.label + "): $" + m1(y1.fcff) + "M here versus $" + m1(y1.workbookFcff) + "M in the workbook. " +
      (same ? "They match." : "Difference: " + (gap > 0 ? "+" : "") + m1(gap) + "M, from the sliders you moved.");
  }

  function justificationBlocks(ui, F, s) {
    const { el, text, factCard } = ui;
    const list = s.driverJustifications || [];
    if (!list.length) return null;
    const defs = defaultDrivers(F);
    const lastA = actualsOf(F).slice(-1)[0].label, f1 = forecastsOf(F)[0].label;
    return el("div", { class: "blocks" }, list.map((j) => {
      const kids = [el("h3", null, [text(j.driver)])];
      if (j.key && defs[j.key] != null) kids.push(el("p", { class: "section-label" },
        [text(lastA + " " + p1(actualDriver(F, j.key)) + " · " + f1 + " workbook " + p1(defs[j.key]))]));
      if (j.assumption) kids.push(el("p", null, [el("strong", null, [text(j.assumption)])]));
      if (j.because) kids.push(el("p", null, [text(j.because)]));
      if (j.note) kids.push(el("a", { class: "source", href: "vault.html#note=" + encodeURIComponent(j.note) }, [text(j.source ? "Source " + j.source : "See the note")]));
      else if (j.source) kids.push(el("a", { class: "source", href: "sources.html#" + j.source }, [text("Source " + j.source)]));
      return el("div", { class: "block" }, kids);
    }));
  }

  window.sections = window.sections || {};
  window.sections.financials = function (inner, s, F) {
    const ui = window.ui, { el, text } = ui;
    if (!F || !F.periods || !actualsOf(F).length || !forecastsOf(F).length) {
      inner.append(el("p", { class: "coming" }, [text("The workbook data has not been generated yet. Run scripts/workbook_to_data.py.")]));
      return;
    }
    const soWhat = inner.querySelector(".so-what"); // moved to the end, after the model
    const defs = defaultDrivers(F);
    let drivers = Object.assign({}, defs);

    inner.append(historyTable(ui, F));

    // sliders
    const outputs = {}, inputs = {};
    const controls = el("div", { class: "controls" }, SLIDERS.map((c) => {
      const id = "fin-" + c.key;
      const input = el("input", { type: "range", id, min: String(c.min), max: String(c.max), step: "0.1", value: (100 * defs[c.key]).toFixed(1) });
      const out = el("output", { for: id }, [text(p1(defs[c.key]))]);
      input.addEventListener("input", () => { drivers[c.key] = Number(input.value) / 100; update(); });
      inputs[c.key] = input; outputs[c.key] = out;
      return el("div", { class: "control" }, [
        el("label", { for: id }, [text(c.label + " "), out]),
        input,
        el("small", { class: "section-label" }, [text("Workbook " + p1(defs[c.key]))])
      ]);
    }));
    const reset = el("button", { type: "button", class: "btn" }, [text("Reset to workbook")]);
    reset.addEventListener("click", () => {
      drivers = Object.assign({}, defs);
      SLIDERS.forEach((c) => { inputs[c.key].value = (100 * defs[c.key]).toFixed(1); });
      update();
    });
    inner.append(el("h3", null, [text("Forecast drivers")]), controls, reset);

    const forecastHolder = el("div", null, []);
    const chartHolder = el("div", null, []);
    const compare = el("p", { class: "so-what", "aria-live": "polite" }, []);
    inner.append(forecastHolder, chartHolder, compare);
    inner.append(el("p", { class: "section-label" }, [text(
      "Dollars in millions. Actuals: Forms 10-K through SEC XBRL (S1). Forecast inputs: FactSet consensus (S8) through the team workbook (S9). " +
      "Interest reads 0 until the WACC tab is filled in Module 3.")]));

    const just = justificationBlocks(ui, F, s);
    if (just) inner.append(el("h3", null, [text("Why these drivers")]), just);
    if (soWhat) inner.append(soWhat);

    function update() {
      SLIDERS.forEach((c) => { outputs[c.key].textContent = p1(drivers[c.key]); });
      const model = forecastModel(F, drivers);
      forecastHolder.replaceChildren(forecastTable(ui, model));
      chartHolder.replaceChildren(fcffChart(ui, F, model));
      compare.textContent = compareLine(model);
    }
    update();
  };
})();
