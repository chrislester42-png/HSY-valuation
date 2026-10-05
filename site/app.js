// Renders the site from content.js and data/financials.js. Plain JavaScript, no build step.
// Each live section is one screen, like a slide: a head (headline, lede, facts), a body, and a foot
// (the so-what and the "numbers we still need" pop-out). Sections not built yet are a thin band.
(function () {
  const C = window.CONTENT || {};
  const F = window.FINANCIALS || null;
  const site = C.site || {};

  // ---------- helpers ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, attrs, children) => {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (attrs[k] == null) continue;
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    (children || []).forEach((c) => node.append(c));
    return node;
  };
  const SVGNS = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs, children) => {
    const node = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    (children || []).forEach((c) => node.append(c));
    return node;
  };
  const text = (s) => document.createTextNode(s == null ? "" : String(s));
  const fmtMoney = (n) => (n == null ? "" : "$" + Number(n).toFixed(2));
  const fmtDate = (s) => {
    if (!s) return "";
    const d = new Date(s + "T00:00:00");
    return isNaN(d) ? s : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };
  window.fmt = { money: fmtMoney, date: fmtDate,
    pct: (x, d) => (x == null ? "" : (100 * x).toFixed(d == null ? 1 : d) + "%"),
    m: (x) => (x == null ? "" : Number(x).toLocaleString("en-US", { maximumFractionDigits: 0 })),
    m1: (x) => (x == null || isNaN(x) ? "n/a" : (x < 0 ? "-" : "") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })) };

  const bind = (name, value) => document.querySelectorAll('[data-bind="' + name + '"]').forEach((n) => { n.textContent = value; });

  const tierChip = (tier) => {
    if (!tier) return text("");
    const names = { R: "Reported", D: "Derived", E: "Estimate" };
    return el("span", { class: "tier tier-" + tier, title: names[tier] || tier }, [text(tier)]);
  };
  const sourceLink = (f, cls) => f.note
    ? el("a", { class: cls, href: "vault.html#note=" + encodeURIComponent(f.note) }, [text(f.source ? "Source " + f.source : "See the note")])
    : (f.source ? el("a", { class: cls, href: "sources.html#" + f.source }, [text("Source " + f.source)]) : text(""));
  // A Fact as a stat: value and tier chip, label, source link. No box; hairlines separate stats.
  const factCard = (f) => el("div", { class: "stat" }, [
    el("div", { class: "stat-value" }, [text(f.value), tierChip(f.tier)]),
    el("div", { class: "stat-label" }, [text(f.label)]),
    sourceLink(f, "stat-src")
  ]);
  // Pop-outs: one open at a time; Escape or a click outside closes them.
  const closePops = (except) => {
    document.querySelectorAll("details.need[open]").forEach((d) => { if (d !== except) d.open = false; });
    document.querySelectorAll('[data-pop][aria-expanded="true"]').forEach((b) => {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      const p = document.getElementById(b.getAttribute("aria-controls")); if (p) p.hidden = true;
    });
  };
  document.addEventListener("click", (e) => { if (!e.target.closest(".need, [data-pop], .pop")) closePops(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePops(); });
  window.ui = { el, text, svg, tierChip, factCard, sourceLink, closePops };

  // ---------- top bar, cover, footer ----------
  const price = site.price != null ? site.price : (F && F.company && F.company.price);
  const priceDate = site.priceDate || (F && F.company && F.company.priceDate);
  bind("ticker", site.ticker || "");
  bind("companyName", site.companyName || "");
  bind("exchangeTicker", [site.exchange, site.ticker].filter(Boolean).join(": "));
  bind("priceLine", price != null ? fmtMoney(price) + " on " + fmtDate(priceDate) : "Price to come");
  bind("priceValue", price != null ? fmtMoney(price) : "Price to come");
  bind("priceDate", price != null && priceDate ? "on " + fmtDate(priceDate) : "");
  document.querySelectorAll('[data-bind="barPrice"]').forEach((n) => {
    n.replaceChildren();
    if (price != null) n.append(text((site.ticker || "") + " "), el("b", null, [text(fmtMoney(price))]), text(priceDate ? " on " + fmtDate(priceDate) : ""));
  });
  bind("oneLineThesis", site.oneLineThesis || "One-line thesis appears here after Module 1.");
  bind("team", (site.team || []).join(" and "));
  const thesis = C.thesis || {};
  bind("stage", thesis.status === "live" && thesis.stage ? thesis.stage : "Coming in Module 1");
  bind("callBadge", site.callBadge || "Coming in Module 5");
  bind("footerLeft", (site.companyName || "") + ". FIN 5370, Texas State University. Educational use only, not investment advice.");
  bind("footerRight", site.updated ? "Updated " + fmtDate(site.updated) : "");
  document.title = (site.companyName || "Valuation site") + (site.ticker ? " (" + site.ticker + ")" : "");

  // Cover chart: revenue for every year in data/financials.js; actual years in ink, forecast in the accent.
  function drawCoverChart() {
    const box = $("#cover-chart");
    if (!box || !F || !F.periods) return;
    const W = box.clientWidth, H = box.clientHeight;
    if (!W || !H) return;
    const ps = F.periods.filter((p) => p.revenue != null);
    const max = Math.max.apply(null, ps.map((p) => p.revenue));
    const top = 18, bottom = 20, n = ps.length, colW = W / n, barW = Math.min(colW * 0.56, 64);
    const kids = [];
    ps.forEach((p, i) => {
      const h = (H - top - bottom) * p.revenue / max, x = i * colW + (colW - barW) / 2, y = H - bottom - h;
      kids.push(svg("rect", { x: x.toFixed(1), y: y.toFixed(1), width: barW.toFixed(1), height: h.toFixed(1), class: p.actual ? "c-actual" : "c-fore" }));
      const v = svg("text", { x: (x + barW / 2).toFixed(1), y: (y - 5).toFixed(1), "text-anchor": "middle", class: "t-val" });
      v.textContent = Number(p.revenue).toLocaleString("en-US", { maximumFractionDigits: 0 });
      const l = svg("text", { x: (x + barW / 2).toFixed(1), y: H - 4, "text-anchor": "middle", class: "t-x" });
      l.textContent = p.label;
      kids.push(v, l);
    });
    kids.push(svg("line", { x1: 0, x2: W, y1: H - bottom + 0.5, y2: H - bottom + 0.5, class: "c-base" }));
    box.setAttribute("aria-label", "Revenue by year, $ millions: " + ps.map((p) => p.label + " " + Math.round(p.revenue)).join(", "));
    box.replaceChildren(svg("svg", { viewBox: "0 0 " + W + " " + H, "aria-hidden": "true" }, kids));
  }
  drawCoverChart();
  if ("ResizeObserver" in window && $("#cover-chart")) new ResizeObserver(drawCoverChart).observe($("#cover-chart"));

  // ---------- section renderer ----------
  // A section script registers window.sections[key] = function (body, s, F) and fills the body.
  // Sections without one get the text layout: the blocks as columns under the head.
  window.sections = window.sections || {};
  let liveCount = 0;
  function renderSection(id, key) {
    const sec = $("#" + id);
    if (!sec) return;
    const inner = $(".section-inner", sec);
    const s = C[key] || {};
    const module = s.module || sec.dataset.module;
    inner.replaceChildren();
    if (s.status !== "live") {
      sec.classList.add("band");
      inner.append(el("h2", { class: "band-title" }, [text(s.title || key)]),
        el("p", { class: "band-note" }, [text("Coming in Module " + module + ".")]));
      return;
    }
    sec.classList.add("live");
    if (liveCount++ % 2 === 0) sec.classList.add("alt");

    const headText = el("div", { class: "s-head-text" }, []);
    if (s.headline) headText.append(el("h2", null, [text(s.headline)]));
    if (s.lede) headText.append(el("p", { class: "lede" }, [text(s.lede)]));
    const head = el("div", { class: "s-head" }, [headText]);
    if (s.facts && s.facts.length) head.append(el("div", { class: "stats", style: "--n:" + s.facts.length }, s.facts.map(factCard)));
    inner.append(head);

    const body = el("div", { class: "s-body" }, []);
    inner.append(body);
    const custom = window.sections[key];
    if (typeof custom === "function") {
      inner.classList.add("custom");
      custom(body, s, F);
    } else {
      inner.classList.add("text");
      if (s.blocks && s.blocks.length) body.append(el("div", { class: "blocks", style: "--n:" + Math.min(s.blocks.length, 4) },
        s.blocks.map((b) => el("div", { class: "block" }, [el("h3", null, [text(b.title)]), el("p", null, [text(b.text)])]))));
    }

    const need = s.numbersWeStillNeed || [];
    if (s.soWhat || need.length) {
      const foot = el("div", { class: "s-foot" }, []);
      if (s.soWhat) foot.append(el("p", { class: "so-what" }, [text(s.soWhat)]));
      if (need.length) {
        const d = el("details", { class: "need" }, [
          el("summary", null, [text("Numbers we still need (" + need.length + ")")]),
          el("div", { class: "pop" }, [el("ul", null, need.map((n) => el("li", null, [text(n)])))])
        ]);
        d.addEventListener("toggle", () => { if (d.open) closePops(d); });
        foot.append(d);
      }
      inner.append(foot);
    }
  }
  const order = [["thesis", "thesis"], ["financials", "financials"], ["vault", "vault"], ["valuation", "valuation"],
                 ["the-call", "theCall"], ["risks", "risks"], ["catalysts", "catalysts"], ["process", "process"]];
  order.forEach(([id, key]) => renderSection(id, key));

  // ---------- nav highlight ----------
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href.startsWith("#") && href.split("#")[0].toLowerCase() === here) a.classList.add("active");
  });
  const links = Array.from(document.querySelectorAll(".nav a[href^='#']"));
  const targets = links.map((a) => $(a.getAttribute("href"))).filter(Boolean).concat($("#hero") ? [$("#hero")] : []);
  if ("IntersectionObserver" in window && links.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((t) => io.observe(t));
  }

  // ---------- slide keys: arrows, Page Up/Down, space move between the cover and live sections ----------
  const slideScreen = window.matchMedia("(min-width: 900px) and (min-height: 600px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.addEventListener("keydown", (e) => {
    if (!document.body.classList.contains("deck") || !slideScreen.matches) return;
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t.closest && t.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
    const k = e.key, space = k === " " || k === "Spacebar";
    if (space && t.closest && t.closest("button, summary, a")) return;
    let dir = 0;
    if (k === "ArrowDown" || k === "PageDown" || (space && !e.shiftKey)) dir = 1;
    else if (k === "ArrowUp" || k === "PageUp" || (space && e.shiftKey)) dir = -1;
    if (!dir) return;
    const bar = $(".topbar") ? $(".topbar").offsetHeight : 0;
    const stops = [$("#hero")].concat(Array.from(document.querySelectorAll(".section.live"))).filter(Boolean);
    const tops = stops.map((s) => s.getBoundingClientRect().top - bar);
    let target = null;
    if (dir > 0) target = stops.find((s, i) => tops[i] > 4);
    else for (let i = stops.length - 1; i >= 0; i--) if (tops[i] < -4) { target = stops[i]; break; }
    if (!target) return;
    e.preventDefault();
    closePops();
    target.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "start" });
  });
})();
