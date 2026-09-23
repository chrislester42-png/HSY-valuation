// Renders the site from content.js and data/financials.js. Plain JavaScript, no build step.
(function () {
  const C = window.CONTENT || {};
  const F = window.FINANCIALS || null;
  const site = C.site || {};

  // ---------- helpers ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, attrs, children) => {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
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
    m: (x) => (x == null ? "" : Number(x).toLocaleString("en-US", { maximumFractionDigits: 0 })) };

  const bind = (name, value) => document.querySelectorAll('[data-bind="' + name + '"]').forEach((n) => { n.textContent = value; });

  const tierChip = (tier) => {
    if (!tier) return text("");
    const names = { R: "Reported", D: "Derived", E: "Estimate" };
    return el("span", { class: "tier tier-" + tier, title: names[tier] || tier }, [text(tier)]);
  };
  const factCard = (f) => el("div", { class: "fact" }, [
    el("span", { class: "value" }, [text(f.value), tierChip(f.tier)]),
    el("span", { class: "label" }, [text(f.label)]),
    f.note ? el("a", { class: "source", href: "vault.html#note=" + encodeURIComponent(f.note) }, [text(f.source ? "Source " + f.source : "See the note")])
           : (f.source ? el("a", { class: "source", href: "sources.html#" + f.source }, [text("Source " + f.source)]) : text(""))
  ]);
  window.ui = { el, text, tierChip, factCard };

  // ---------- header, hero, footer ----------
  const price = site.price != null ? site.price : (F && F.company && F.company.price);
  const priceDate = site.priceDate || (F && F.company && F.company.priceDate);
  bind("ticker", site.ticker || "");
  bind("companyName", site.companyName || "");
  bind("exchangeTicker", [site.exchange, site.ticker].filter(Boolean).join(": "));
  bind("priceLine", price != null ? fmtMoney(price) + " on " + fmtDate(priceDate) : "Price to come");
  bind("oneLineThesis", site.oneLineThesis || "One-line thesis appears here after Module 1.");
  bind("team", (site.team || []).join(" and "));
  bind("footerLeft", (site.companyName || "") + " · FIN 5370 · Texas State University · educational use only, not investment advice");
  bind("footerRight", site.updated ? "Updated " + fmtDate(site.updated) : "");
  document.title = (site.companyName || "Valuation site") + (site.ticker ? " (" + site.ticker + ")" : "");
  const badge = $('[data-bind="callBadge"]');
  if (badge && site.callBadge) { badge.textContent = site.callBadge; badge.hidden = false; }

  // ---------- generic section renderer ----------
  function renderSection(id, key) {
    const sec = $("#" + id);
    if (!sec) return;
    const inner = $(".section-inner", sec);
    const s = C[key] || {};
    inner.innerHTML = "";
    inner.append(el("p", { class: "section-label" }, [text((s.title || key) + " · Module " + (s.module || sec.dataset.module))]));
    if (s.status !== "live") {
      inner.append(el("h2", { class: "headline" }, [text(s.title || key)]));
      inner.append(el("p", { class: "coming" }, [text("Coming in Module " + (s.module || sec.dataset.module) + ".")]));
      return;
    }
    if (s.headline) inner.append(el("h2", { class: "headline" }, [text(s.headline)]));
    if (s.lede) inner.append(el("p", { class: "lede" }, [text(s.lede)]));
    if (s.facts && s.facts.length) inner.append(el("div", { class: "facts" }, s.facts.map(factCard)));
    if (s.blocks && s.blocks.length) inner.append(el("div", { class: "blocks" }, s.blocks.map((b) =>
      el("div", { class: "block" }, [el("h3", null, [text(b.title)]), el("p", null, [text(b.text)])]))));
    if (s.soWhat) inner.append(el("p", { class: "so-what" }, [text(s.soWhat)]));
    // Section-specific renderers registered by later modules (window.sections.financials, etc.)
    const custom = window.sections && window.sections[key];
    if (typeof custom === "function") custom(inner, s, F);
    if (s.numbersWeStillNeed && s.numbersWeStillNeed.length) {
      inner.append(el("details", { class: "still-need" }, [
        el("summary", null, [text("Numbers we still need (" + s.numbersWeStillNeed.length + ")")]),
        el("ul", null, s.numbersWeStillNeed.map((n) => el("li", null, [text(n)])))
      ]));
    }
  }
  window.sections = window.sections || {};
  const order = [["thesis", "thesis"], ["financials", "financials"], ["vault", "vault"], ["valuation", "valuation"],
                 ["the-call", "theCall"], ["risks", "risks"], ["catalysts", "catalysts"], ["process", "process"]];
  order.forEach(([id, key]) => renderSection(id, key));

  // ---------- nav highlight ----------
  const links = Array.from(document.querySelectorAll(".nav a[href^='#']"));
  const targets = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    targets.forEach((t) => io.observe(t));
  }
})();
