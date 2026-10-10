// Tearsheet (Module 7): one screen that sums up the site, and prints on one page.
// Every figure is read from content.js and site/data/financials.js, or computed by the valuation engine (dcf.js)
// with the same scenarios and weights The Call uses. Nothing is typed here.
(function () {
  "use strict";
  const C = window.CONTENT || {}, F = window.FINANCIALS || {};
  const root = document.getElementById("tearsheet");
  if (!root) return;

  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] == null) continue; if (k === "class") n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }
    (kids || []).forEach((c) => n.append(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  };
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const when = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ""); return m ? Number(m[3]) + " " + MONTHS[Number(m[2]) - 1] + " " + m[1] : (s || ""); };
  const money = (n) => (n == null || !isFinite(n) ? "n/a" : "$" + Number(n).toFixed(2));
  const away = (v, p) => (v == null || !p ? "" : (v >= p ? "+" : "-") + (100 * Math.abs(v / p - 1)).toFixed(1) + "%");

  const site = C.site || {}, call = C.theCall || {}, V = C.valuation || {}, ts = C.tearsheet || {};
  if (ts.status !== "live") {
    root.append(el("p", { class: "coming" }, ["Coming in Module 7."]));
    return;
  }
  const price = site.price != null ? site.price : F.company && F.company.price;
  const priceDate = site.priceDate || (F.company && F.company.priceDate);

  // The weighted value, run exactly as The Call runs it.
  let wtd = null, matches = false, weightText = "";
  try {
    const scen = V.scenarios || [], w = call.weights || {};
    const used = scen.filter((sc) => w[sc.name] != null);
    const runs = used.map((sc) => {
      const r = window.valuation(F.dcf, window.valuation.scenarioInputs(sc, F, scen));
      return { w: w[sc.name], p: r.perpetuity.perShare, x: r.exitMultiple.perShare };
    });
    wtd = { p: runs.reduce((a, r) => a + r.w * r.p, 0), x: runs.reduce((a, r) => a + r.w * r.x, 0) };
    weightText = used.map((sc) => Math.round(100 * w[sc.name])).join(" / ") + " (" + used.map((sc) => sc.name).join(", ") + ")";
    const mw = call.memoWeighted || {};
    matches = mw.perpetuity != null && money(wtd.p) === money(mw.perpetuity) && money(wtd.x) === money(mw.exitMultiple);
  } catch (e) { wtd = null; }

  const wb = (F.dcf && F.dcf.workbookResult) || {};
  const imp = ((F.relative && F.relative.impliedPerShare) || []).slice().sort((a, b) => a.perShare - b.perShare);
  const lo = imp[0], hi = imp[imp.length - 1];

  const pair = (label, v) => el("div", { class: "ts-pair" }, [
    el("span", { class: "ts-pair-k" }, [label]),
    el("span", { class: "ts-pair-v" }, [money(v)]),
    el("span", { class: "ts-pair-d" }, [away(v, price)])
  ]);
  const tile = (title, href, kids) => el("div", { class: "ts-tile" }, [
    el("div", { class: "ts-tile-top" }, [el("span", { class: "ts-k" }, [title]), el("a", { class: "ts-go", href }, [href.split("#")[1] === "the-call" ? "The Call" : "Valuation"])])
  ].concat(kids));

  // ---------- top: company, price, call ----------
  const top = el("header", { class: "ts-top" }, [
    el("div", { class: "ts-id" }, [
      el("p", { class: "ts-label" }, ["Tearsheet"]),
      el("h1", null, [site.companyName || "", " ", el("span", { class: "ts-tick" }, [[site.exchange, site.ticker].filter(Boolean).join(": ")])]),
      el("p", { class: "ts-thesis" }, [site.oneLineThesis || ""])
    ]),
    el("div", { class: "ts-callbox" }, [
      el("div", { class: "ts-price" }, [el("span", { class: "ts-k" }, ["Price"]), el("b", null, [money(price)]), el("small", null, [priceDate ? "on " + when(priceDate) : ""])]),
      el("div", { class: "ts-call" }, [el("span", { class: "ts-k" }, ["The call"]), el("b", { class: "ts-call-word" }, [call.call || ""]), el("small", null, [site.callBadge || ""])])
    ])
  ]);

  // ---------- values ----------
  const values = el("div", { class: "ts-values" }, [
    tile("Weighted value per share", "index.html#the-call", [
      pair("Growth in perpetuity", wtd && wtd.p), pair("Exit multiple", wtd && wtd.x),
      el("p", { class: "ts-cap", title: "Recomputed here from the scenarios and weights; " + (matches ? "equal to the memo's weighted values to the cent." : "differs from the memo's weighted values.") }, [
        el("i", { class: "ts-dot" + (matches ? "" : " off") }, []), "Weights " + weightText])
    ]),
    tile("DCF value per share", "index.html#valuation", [
      pair("Growth in perpetuity", wb.perSharePerpetuity), pair("Exit multiple", wb.perShareExitMultiple),
      el("p", { class: "ts-cap" }, ["Workbook DCF 1-Pager, S9"])
    ]),
    tile("Peer-implied value per share", "index.html#the-call", [
      el("div", { class: "ts-range" }, [money(lo && lo.perShare), el("span", null, [" to "]), money(hi && hi.perShare)]),
      el("p", { class: "ts-cap" }, [(lo ? lo.label : "") + " to " + (hi ? hi.label : "") + ", peer average multiples"])
    ])
  ]);

  // ---------- risks, catalysts, tripwires ----------
  const risks = ((C.risks && C.risks.risks) || []).slice(0, 2).map((r) => el("li", null, [
    el("a", { class: "ts-item", href: "index.html#risks" }, [r.risk]), el("span", { class: "ts-sub" }, [r.take || ""])
  ]));
  const cats = ((C.catalysts && C.catalysts.catalysts) || []).slice(0, 2).map((c) => el("li", null, [
    el("span", { class: "ts-when" }, [when(c.when) + (c.expected ? ", expected" : "")]),
    el("a", { class: "ts-item", href: "index.html#catalysts" }, [c.event]), el("span", { class: "ts-sub" }, ["Watch: " + (c.watch || "")])
  ]));
  const wires = ((C.catalysts && C.catalysts.tripwires) || []).slice(0, 3).map((t) => el("li", null, [
    el("span", { class: "ts-item" }, [t.condition + " ", el("b", null, [t.threshold])]), el("span", { class: "ts-sub ts-act" }, [t.action || ""])
  ]));
  const col = (title, href, list) => el("section", { class: "ts-col" }, [
    el("h2", null, [el("a", { href }, [title])]), el("ul", { class: "ts-list" }, list)]);
  const grid = el("div", { class: "ts-grid" }, [
    col("Top risks", "index.html#risks", risks),
    col("Next catalysts", "index.html#catalysts", cats),
    col("Tripwires", "index.html#catalysts", wires)
  ]);

  const printBtn = el("button", { type: "button", class: "btn ts-print" }, ["Print"]);
  printBtn.addEventListener("click", () => window.print());
  const foot = el("footer", { class: "ts-foot" }, [
    el("span", null, ["Every figure read from content.js and site/data. Updated " + when(site.updated) + ". Educational use only."]),
    printBtn
  ]);

  root.replaceChildren(top, values, grid, foot);
})();
