// The Call section (Module 5). Registers window.sections.theCall.
// Peer multiples and the value per share each implies come from site/data/financials.js (the workbook's Relative
// Valuation tab and the DCF 1-Pager's Relative Valuation block, source S9). Each bull, base, and bear value comes from
// window.valuation with the same inputs the Valuation section gives it (window.valuation.scenarioInputs in dcf.js).
// The words, the memo's weights, and the call come from the theCall object in content.js (the Milestone 5 memo).
// The weight sliders move the weighted value only; nothing here changes the call or the cover's call badge.
(function () {
  "use strict";

  const usd = (x) => (x == null || !isFinite(x) ? "n/a" : "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const usd0 = (x) => "$" + Math.round(x).toLocaleString("en-US");
  const m1 = (x) => Number(x).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  // multiples as the workbook shows them: one decimal when that is exact (13.8x, 25.0x), else two (12.22x)
  const mult = (x) => (x == null || !isFinite(x) ? "n/a" : x.toFixed(Math.abs(Math.round(x * 10) - x * 10) < 1e-9 ? 1 : 2) + "x");
  // premium as +x.x%, discount in brackets, as the memo writes them
  const prem = (d) => (!isFinite(d) ? "n/a" : d < 0 ? "(" + (-100 * d).toFixed(1) + "%)" : "+" + (100 * d).toFixed(1) + "%");
  const signed = (d) => (!isFinite(d) ? "n/a" : (d >= 0 ? "+" : "-") + (100 * Math.abs(d)).toFixed(1) + "%");
  // whole percents that always add to 100 (largest remainder)
  const pcts = (ws) => {
    const raw = ws.map((x) => x * 100), fl = raw.map(Math.floor);
    let left = 100 - fl.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return fl;
  };

  window.sections = window.sections || {};
  window.sections.theCall = function (body, s, F) {
    const ui = window.ui, { el, text, svg } = ui;
    const R = F && F.relative, dcf = F && F.dcf;
    const V = (window.CONTENT && window.CONTENT.valuation) || {};
    if (!R || !R.target || !dcf || typeof window.valuation !== "function" || typeof window.valuation.scenarioInputs !== "function") {
      body.append(el("p", { class: "lede" }, [text("The Relative Valuation tab has not been read yet. Run scripts/workbook_to_data.py.")]));
      return;
    }
    const price = F.company && F.company.price;
    const wb = dcf.workbookResult || {};
    const vaultLink = (note, label) => el("a", { class: "pop-src", href: "vault.html#note=" + encodeURIComponent(note) }, [text(label)]);

    // A small button that opens a pop-out; one open at a time (app.js closes the others).
    let popN = 0;
    const pop = (label, aria, kids, where) => {
      const id = "call-pop-" + (++popN);
      const box = el("div", { class: "pop call-pop " + where, id, hidden: "" }, kids);
      const btn = el("button", { type: "button", class: "why", "data-pop": "", "aria-expanded": "false", "aria-controls": id, "aria-label": aria }, [text(label)]);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = btn.getAttribute("aria-expanded") === "true";
        ui.closePops(btn);
        btn.setAttribute("aria-expanded", String(!open));
        box.hidden = open;
      });
      return el("div", { class: "call-pop-wrap" }, [btn, box]);
    };

    // ---------- 1) Peers: each company's multiples, the summary row, and our premium or discount to it ----------
    const M = R.multiples || [];
    const sum = R.peerSummary || { label: "Average", values: {} };
    const tableRows = [{ name: R.target.name, values: R.target.values, cls: "co" }]
      .concat((R.peers || []).map((p) => ({ name: p.name, values: p.values })))
      .concat([{ name: sum.label, values: sum.values, cls: "sum" }]);
    const tbody = el("tbody", null, tableRows.map((r) => el("tr", { class: r.cls || null }, [el("th", { scope: "row" }, [text(r.name)])]
      .concat(M.map((m) => el("td", null, [text(mult(r.values[m]))]))))));
    tbody.append(el("tr", { class: "diff", title: s.premiumDriver || null }, [el("th", { scope: "row" }, [text("vs. " + sum.label)])]
      .concat(M.map((m) => el("td", null, [text(prem(R.target.values[m] / sum.values[m] - 1))])))));
    const peerTable = el("table", { class: "val-table call-peer-table" }, [
      el("thead", null, [el("tr", null, [el("th", { scope: "col" }, [text("Company")])].concat(M.map((m) => el("th", { scope: "col" }, [text(m)]))))]),
      tbody]);
    const ps = s.peerScreen || {};
    const item = (p) => el("li", null, [el("b", null, [text(p.name + ". ")]), text(p.why || "")]);
    const screenKids = [
      el("h4", null, [text("Kept (" + (ps.kept || []).length + ")")]), el("ul", null, (ps.kept || []).map(item)),
      el("h4", null, [text("Dropped (" + (ps.dropped || []).length + ")")]), el("ul", null, (ps.dropped || []).map(item)),
      el("p", { class: "call-by" }, [text([ps.by, ps.date].filter(Boolean).join(", ") + ". ")].concat(ps.note ? [vaultLink(ps.note, "note")] : []))];
    const peersCard = el("div", { class: "card fin-card call-card" }, [
      el("div", { class: "fin-card-top" }, [el("div", { class: "fin-card-title" }, [text("Peers")]),
        pop("Screen", "Peers kept and dropped from the AI-proposed set", screenKids, "down")]),
      el("div", { class: "call-table-wrap" }, [peerTable])]);

    // ---------- the bull, base, and bear cases, each run through window.valuation ----------
    const allScen = V.scenarios || [];
    const runs = allScen.filter((sc) => !sc.ratesFrom).map((sc) => {
      const r = window.valuation(dcf, window.valuation.scenarioInputs(sc, F, allScen));
      return { name: sc.name, p: r.perpetuity.perShare, x: r.exitMultiple.perShare };
    });
    const memoW = (() => {
      const w = runs.map((r) => Number((s.weights || {})[r.name]) || 0), t = w.reduce((a, b) => a + b, 0);
      return t > 0 ? w.map((x) => x / t) : runs.map(() => 1 / runs.length);
    })();
    let w = memoW.slice();
    const weighted = (ws) => ({ p: runs.reduce((a, r, i) => a + ws[i] * r.p, 0), x: runs.reduce((a, r, i) => a + ws[i] * r.x, 0) });

    // ---------- 2) Range: every value on one dollar axis, the price as a line, the call's band shaded ----------
    const impl = (R.impliedPerShare || []).slice().sort((a, b) => a.perShare - b.perShare);
    const shortName = (l) => (/^P\/E/.test(l) ? "P/E" : l);
    const bars = [
      { label: "DCF, perpetuity", kind: "dcf", value: () => wb.perSharePerpetuity, tip: [["Growth in perpetuity", ""], ["Workbook DCF 1-Pager", "S9"]] },
      { label: "DCF, exit multiple", kind: "dcf", value: () => wb.perShareExitMultiple, tip: [["Exit multiple", mult(dcf.exitMultiple)], ["Workbook DCF 1-Pager", "S9"]] }
    ].concat(impl.map((m) => ({ label: shortName(m.label), kind: "mult", value: () => m.perShare,
      tip: [["Peer " + sum.label.toLowerCase(), mult(m.peerMultiple)], [m.appliedTo.line + ", " + m.appliedTo.year, m1(m.appliedTo.value)], ["Workbook DCF 1-Pager", "S9"]] })))
      .concat([
        { label: "Weighted, perpetuity", kind: "wtd", value: () => weighted(w).p, tip: () => [["Weights", pcts(w).join(" / ")]] },
        { label: "Weighted, exit", kind: "wtd", value: () => weighted(w).x, tip: () => [["Weights", pcts(w).join(" / ")]] }
      ]);
    const axisMax = Math.ceil(Math.max.apply(null, bars.map((b) => b.value()).concat(runs.map((r) => Math.max(r.p, r.x)), [s.avoidAbove || 0, price || 0])) / 100) * 100;
    const chart = el("div", { class: "chart-area call-range", role: "img" }, []);
    const tip = el("div", { class: "tip", hidden: "" }, []);
    let svgNode = null;
    function draw() {
      const W = chart.clientWidth, H = chart.clientHeight;
      if (!W || !H) return;
      const labW = Math.min(146, Math.round(W * 0.36)), top = 38, bottom = 22, right = 58;
      const n = bars.length, rowH = (H - top - bottom) / n, barH = Math.max(8, Math.min(rowH * 0.56, 22));
      const x = (v) => labW + (W - labW - right) * v / axisMax;
      const kids = [];
      for (let t = 0; t <= axisMax; t += 100) {
        kids.push(svg("line", { x1: x(t), x2: x(t), y1: top - 4, y2: H - bottom, class: "c-grid" }));
        const lab = svg("text", { x: x(t), y: H - 6, "text-anchor": "middle", class: "t-x" }); lab.textContent = usd0(t); kids.push(lab);
      }
      if (s.buyBelow != null && s.avoidAbove != null) {
        kids.push(svg("rect", { x: x(s.buyBelow), y: top - 4, width: Math.max(1, x(s.avoidAbove) - x(s.buyBelow)), height: H - bottom - top + 4, class: "c-band" }));
        const bl = svg("text", { x: x(s.buyBelow), y: top - 9, class: "t-band" });
        bl.textContent = usd0(s.buyBelow) + " to " + usd0(s.avoidAbove); kids.push(bl);
      }
      bars.forEach((b, i) => {
        const v = b.value(), y = top + i * rowH + (rowH - barH) / 2;
        const row = svg("rect", { x: 0, y: top + i * rowH, width: W, height: rowH, class: "c-row" });
        row.addEventListener("mouseenter", () => showTip(b, i, rowH, top, x(v), W));
        row.addEventListener("mouseleave", () => { tip.hidden = true; });
        kids.push(row);
        kids.push(svg("rect", { x: labW, y: y.toFixed(1), width: Math.max(0, x(v) - labW).toFixed(1), height: barH.toFixed(1), rx: 3, class: "c-bar-" + b.kind, "pointer-events": "none" }));
        const lt = svg("text", { x: labW - 10, y: (y + barH / 2 + 4).toFixed(1), "text-anchor": "end", class: "t-bar" + (b.kind === "wtd" ? " wtd" : ""), "pointer-events": "none" });
        lt.textContent = b.label; kids.push(lt);
        const vt = svg("text", { x: (x(v) + 6).toFixed(1), y: (y + barH / 2 + 4).toFixed(1), class: "t-val" + (b.kind === "wtd" ? " wtd" : ""), "pointer-events": "none" });
        vt.textContent = usd(v); kids.push(vt);
      });
      if (price) {
        kids.push(svg("line", { x1: x(price), x2: x(price), y1: 16, y2: H - bottom, class: "c-price", "pointer-events": "none" }));
        const pl = svg("text", { x: x(price), y: 11, "text-anchor": "middle", class: "t-price" }); pl.textContent = "Price " + usd(price); kids.push(pl);
      }
      kids.push(svg("line", { x1: labW, x2: W - right, y1: H - bottom + 0.5, y2: H - bottom + 0.5, class: "c-base" }));
      const node = svg("svg", { viewBox: "0 0 " + W + " " + H, "aria-hidden": "true" }, kids);
      if (svgNode) svgNode.replaceWith(node); else chart.prepend(node);
      svgNode = node;
      chart.setAttribute("aria-label", "Value per share: " + bars.map((b) => b.label + " " + usd(b.value())).join("; ") +
        (price ? "; price " + usd(price) : "") + (s.buyBelow != null ? "; buy below " + usd0(s.buyBelow) + ", avoid above " + usd0(s.avoidAbove) : ""));
    }
    function showTip(b, i, rowH, top, xEnd, W) {
      const rows = typeof b.tip === "function" ? b.tip() : b.tip;
      tip.replaceChildren(el("b", null, [text(b.label + ": " + usd(b.value()))]),
        ...rows.map((r) => el("span", null, [el("i", null, [text(r[0])]), text(r[1])])));
      tip.hidden = false;
      const left = Math.max(0, Math.min(xEnd + 10, W - tip.offsetWidth));
      let y = top + (i + 1) * rowH;
      if (y + tip.offsetHeight > chart.clientHeight) y = top + i * rowH - tip.offsetHeight;
      tip.style.left = left + "px"; tip.style.top = Math.max(0, y) + "px";
    }
    chart.append(tip);
    const rec = s.reconciliation || {};
    const recKids = String(rec.full || "").split(/\n\n+/).filter(Boolean).map((para) => {
      const m = para.match(/^(Which [a-z ]+?\.)\s+([\s\S]*)$/);
      return el("p", null, m ? [el("b", null, [text(m[1] + " ")]), text(m[2])] : [text(para)]);
    }).concat(rec.note ? [el("p", { class: "call-by" }, [vaultLink(rec.note, "The memo")])] : []);
    const rangeCard = el("div", { class: "card fin-card call-card" }, [
      el("div", { class: "fin-card-top" }, [el("div", { class: "fin-card-title" }, [text("Range")])]),
      chart,
      el("div", { class: "call-rec" }, [el("p", null, [text(rec.short || "")]), pop("?", "The full reconciliation", recKids, "up")])]);

    // ---------- 3) Weights: one linked slider per case; the weighted value both ways; the check ----------
    const sliders = [], outs = [];
    const rows = runs.map((r, i) => {
      const id = "call-w-" + r.name.toLowerCase().replace(/\W+/g, "-");
      const input = el("input", { type: "range", id, min: "0", max: "100", step: "1", value: String(Math.round(w[i] * 100)), "aria-label": r.name + " weight" });
      input.addEventListener("input", () => setWeight(i, Number(input.value) / 100));
      sliders.push(input);
      outs.push(el("output", { for: id }, []));
      return el("div", { class: "call-w-row call-w-grid" }, [el("label", { for: id }, [text(r.name)]),
        el("span", { class: "ps" }, [text(usd(r.p))]), el("span", { class: "ps" }, [text(usd(r.x))]), outs[i], input]);
    });
    const big = {}, dist = {};
    const hero = (k, label) => {
      big[k] = el("div", { class: "val-big" }, []); dist[k] = el("div", { class: "val-up" }, []);
      return el("div", { class: "val-hero-item" }, [el("div", { class: "val-hero-label" }, [text(label)]), big[k], dist[k]]);
    };
    const reset = el("button", { type: "button", class: "btn" }, [text("Reset")]);
    reset.addEventListener("click", () => { w = memoW.slice(); sync(-1); });
    const dot = el("span", { class: "check-dot" }, []), checkText = el("span", null, []);
    const check = el("p", { class: "check" }, [dot, checkText]);
    const weightsCard = el("div", { class: "card fin-card call-card" }, [
      el("div", { class: "fin-card-top" }, [el("div", { class: "fin-card-title" }, [text("Weights")]), reset]),
      el("div", { class: "drv-cols call-w-grid" }, [el("span", null, []), el("span", null, [text("Perpetuity")]), el("span", null, [text("Multiple")]), el("span", null, [text("Weight")]), el("span", null, [])])
    ].concat(rows, [
      el("div", { class: "call-weighted" }, [el("div", { class: "val-hero call-hero" }, [hero("p", "Perpetuity"), hero("x", "Exit multiple")])]),
      el("div", { class: "drv-foot" }, [check])]));

    // Moving one weight rescales the others in proportion, so the weights always add to 100 percent.
    function setWeight(i, v) {
      v = Math.min(1, Math.max(0, v));
      const others = w.reduce((a, x, j) => (j === i ? a : a + x), 0), rest = 1 - v;
      w = w.map((x, j) => (j === i ? v : others > 1e-12 ? (x / others) * rest : rest / (w.length - 1)));
      sync(i);
    }
    // The check: at the memo's weights, the weighted values to the cent beside the memo's.
    const atMemo = weighted(memoW), mw = s.memoWeighted || {};
    const matches = usd(atMemo.p) === usd(mw.perpetuity) && usd(atMemo.x) === usd(mw.exitMultiple);
    check.title = "At the memo's weights (" + pcts(memoW).join(" / ") + "): site " + usd(atMemo.p) + " and " + usd(atMemo.x) +
      "; memo " + usd(mw.perpetuity) + " and " + usd(mw.exitMultiple) + ".";
    function sync(skip) {
      const shown = pcts(w);
      sliders.forEach((sl, j) => { if (j !== skip) sl.value = String(Math.round(w[j] * 100)); });
      outs.forEach((o, j) => { o.textContent = shown[j] + "%"; });
      const r = weighted(w);
      big.p.textContent = usd(r.p); big.x.textContent = usd(r.x);
      dist.p.textContent = price ? signed(r.p / price - 1) + " vs. " + usd(price) : "";
      dist.x.textContent = price ? signed(r.x / price - 1) + " vs. " + usd(price) : "";
      const moved = w.some((x, j) => Math.abs(x - memoW[j]) > 1e-9);
      dot.classList.toggle("moved", moved || !matches);
      checkText.textContent = moved ? "Weights moved from the memo" : matches ? "Matches the memo" : "Differs from the memo";
      draw();
    }

    body.append(el("div", { class: "call-body" }, [peersCard, rangeCard, weightsCard]));
    sync(-1);
    if ("ResizeObserver" in window) new ResizeObserver(draw).observe(chart);
  };
})();
