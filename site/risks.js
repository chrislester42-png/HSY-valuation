// Risks and Catalysts sections (Module 6). Registers window.sections.risks and window.sections.catalysts.
// The words and figures come from the risks and catalysts objects in content.js, filed from
// research/03 Drafts/Module 6 - Research report.md; every figure is a Fact chip that opens its Knowledge Bank note.
// Each risk's bear tag reads its value from the Module 4 Bear scenario (valuation.scenarios in content.js).
// Each tripwire's "ours" number is computed from site/data/financials.js, never typed here.
(function () {
  "use strict";

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pct1 = (x) => (x == null || !isFinite(x) ? "n/a" : (100 * x).toFixed(1) + "%");
  const pct2 = (x) => (x == null || !isFinite(x) ? "n/a" : (100 * x).toFixed(2) + "%");
  const pts = (x) => (x == null || !isFinite(x) ? "n/a" : (x < 0 ? "-" : "+") + (100 * Math.abs(x)).toFixed(1) + " pts");
  // "2026-11-01" becomes "1 Nov 2026"; anything else ("Late Oct 2026") is shown as written.
  const when = (s) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? Number(m[3]) + " " + MONTHS[Number(m[2]) - 1] + " " + m[1] : (s || "");
  };
  const noteHref = (note) => "vault.html#note=" + encodeURIComponent(note);

  // The Module 4 bear inputs a risk can name, with how to show each one.
  const BEAR = {
    revenueGrowth: { label: "Revenue growth", key: "revenueGrowthShift", fmt: pts },
    ebitdaMargin: { label: "EBITDA margin", key: "ebitdaMarginShift", fmt: pts },
    wacc: { label: "WACC", key: "wacc", fmt: pct2 },
    growth: { label: "Perpetual growth", key: "growth", fmt: pct1 }
  };

  // Our own number for a tripwire, from site/data/financials.js.
  function ours(o, F) {
    if (!o || o.from !== "financials" || !F || !F.periods) return null;
    const ps = F.periods, i = ps.findIndex((p) => p.year === o.year), p = ps[i];
    if (!p) return null;
    const where = "site/data/financials.js, " + p.label;
    if (o.line === "ebitMargin") return { value: p.ebit / p.revenue, text: pct1(p.ebit / p.revenue), where: where + " EBIT / revenue" };
    if (o.line === "ebitdaMargin") return { value: p.ebitda / p.revenue, text: pct1(p.ebitda / p.revenue), where: where + " EBITDA / revenue" };
    if (o.line === "revenueGrowth") {
      const prev = ps[i - 1];
      if (!prev) return null;
      const g = p.revenue / prev.revenue - 1;
      return { value: g, text: pct1(g), where: where + " revenue / " + prev.label + " revenue - 1" };
    }
    if (p[o.line] != null) return { value: p[o.line], text: String(p[o.line]), where: where + " " + o.line };
    return null;
  }

  window.sections = window.sections || {};

  // ---------- Risks: four cards in a two-by-two grid ----------
  window.sections.risks = function (body, s) {
    const ui = window.ui, { el, text } = ui;
    const V = (window.CONTENT && window.CONTENT.valuation) || {};
    const bear = (V.scenarios || []).find((sc) => sc.name === "Bear") || {};
    const chip = (f) => el("a", { class: "rk-chip", href: noteHref(f.note), title: (f.label || "") + (f.source ? ". Source " + f.source : "") + ". Opens the note." },
      [el("span", { class: "rk-chip-v" }, [text(f.value)]), ui.tierChip(f.tier)]);

    const cards = (s.risks || []).slice(0, 4).map((r) => {
      const top = el("div", { class: "rk-top" }, [el("span", { class: "rk-dot", "aria-hidden": "true" }, []), el("h3", { class: "rk-claim" }, [text(r.risk)])]);
      const b = BEAR[r.bear];
      let bearTag = null;
      if (b && bear[b.key] != null) {
        const reason = bear.reasons && bear.reasons[r.bear];
        const tag = el(reason && reason.note ? "a" : "span", {
          class: "rk-bear", href: reason && reason.note ? noteHref(reason.note) : null,
          title: "Module 4 bear case moves " + b.label.toLowerCase() + " by " + b.fmt(bear[b.key]) + (reason ? ". " + reason.text : "")
        }, [text("Bear: " + b.label + " " + b.fmt(bear[b.key]))]);
        bearTag = tag;
      }
      const points = el("ul", { class: "rk-points" }, (r.points || []).slice(0, 2).map((pt) => el("li", null, [
        el("span", { class: "rk-date" }, [text(pt.date || "")]),
        el("span", { class: "rk-label" }, [text(pt.text || (pt.fact && pt.fact.label) || "")]),
        pt.fact ? chip(pt.fact) : text("")
      ])));
      const take = el("div", { class: "rk-take" }, [el("span", { class: "rk-take-k" }, [text("Our take")]), el("p", null, [text(r.take || "")])]
        .concat(r.takeNote ? [el("a", { class: "rk-take-src", href: noteHref(r.takeNote), "aria-label": "Note behind our take" }, [text("note")])] : []));
      return el("article", { class: "card rk-card" }, [top, points, el("div", { class: "rk-foot" }, [take].concat(bearTag ? [bearTag] : []))]);
    });
    body.append(el("div", { class: "rk-grid" }, cards));
  };

  // ---------- Catalysts: the dated events, soonest first, and three tripwires ----------
  window.sections.catalysts = function (body, s, F) {
    const ui = window.ui, { el, text } = ui;
    const DIR = { up: "Up", down: "Down", either: "Either" };
    const rows = (s.catalysts || []).slice(0, 6).map((c) => el("tr", null, [
      el("td", { class: "ct-when" }, [text(when(c.when))].concat(c.expected ? [el("span", { class: "ct-exp" }, [text("expected")])] : [])),
      el("th", { scope: "row", class: "ct-event" }, [text(c.event || "")]),
      el("td", { class: "ct-watch" }, [text(c.watch || "")]),
      el("td", null, [el("span", { class: "ct-dir ct-" + (DIR[c.direction] ? c.direction : "either") }, [text(DIR[c.direction] || "Either")])]),
      el("td", { class: "ct-src" }, [c.note || c.source ? ui.sourceLink(c, "ct-chip") : text("")])
    ]));
    const table = el("table", { class: "ct-table" }, [
      el("thead", null, [el("tr", null, ["When", "Event", "What we watch", "Our value", "Source"].map((h) => el("th", { scope: "col" }, [text(h)])))]),
      el("tbody", null, rows)]);
    const tableCard = el("div", { class: "card ct-card" }, [el("div", { class: "ct-table-wrap" }, [table])]);

    const tiles = (s.tripwires || []).slice(0, 3).map((t, i) => {
      const o = ours(t.ours, F);
      const tipId = "ct-tip-" + (i + 1);
      const tip = el("div", { class: "tip ct-tip", id: tipId, role: "tooltip" }, [
        el("b", null, [text(t.condition + " " + t.threshold)]),
        el("span", null, [el("i", null, [text("Threshold")]), text(t.threshold)]),
        el("span", null, [el("i", null, [text(t.ours ? t.ours.label : "Ours")]), text(o ? o.text : "n/a")])
      ].concat(t.latest ? [el("span", null, [el("i", null, [text("Latest, " + t.latest.date)]), text(t.latest.value)])] : [],
        t.published ? [el("span", null, [el("i", null, [text("Published")]), text(t.published)])] : [],
        o ? [el("small", null, [text(o.where)])] : []));
      return el("div", { class: "ct-tile", tabindex: "0", "aria-describedby": tipId }, [
        el("div", { class: "ct-cond" }, [text(t.condition)]),
        el("div", { class: "ct-thr" }, [text(t.threshold)]),
        el("div", { class: "ct-tile-foot" }, [el("span", { class: "ct-act" }, [text(t.action)]), t.note || t.source ? ui.sourceLink(t, "ct-chip") : text("")]),
        tip
      ]);
    });
    body.append(el("div", { class: "ct-body" }, [tableCard, el("div", { class: "ct-tw" }, [el("h3", { class: "ct-tw-title" }, [text("Tripwires")]), el("div", { class: "ct-tiles" }, tiles)])]));
  };
})();
