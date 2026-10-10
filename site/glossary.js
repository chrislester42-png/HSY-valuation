// Glossary page (Module 7): the terms in the glossary object of content.js, alphabetically, each linking to the
// section that uses it. Section names are read from the top bar's nav, so nothing here is typed by hand.
(function () {
  "use strict";
  const list = document.querySelector("dl.glossary");
  const G = (window.CONTENT && window.CONTENT.glossary) || {};
  if (!list) return;
  if (G.status !== "live" || !(G.terms || []).length) return;
  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] == null) continue; if (k === "class") n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }
    (kids || []).forEach((c) => n.append(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  };
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const name = (id) => { const a = document.querySelector('.nav a[href="index.html#' + id + '"]'); return a ? a.textContent : id; };
  const terms = G.terms.slice().sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
  const coming = document.querySelector(".page .coming");
  if (coming) coming.textContent = terms.length + " terms used on this site, in plain language.";
  list.replaceChildren(...terms.flatMap((t) => [
    el("dt", { id: slug(t.term) }, [t.term]),
    el("dd", null, [el("span", null, [t.definition + " "]), el("a", { class: "gl-sec", href: "index.html#" + t.section }, [name(t.section)])])
  ]));
  if (location.hash) { const x = document.getElementById(location.hash.slice(1)); if (x) x.scrollIntoView(); }
})();
