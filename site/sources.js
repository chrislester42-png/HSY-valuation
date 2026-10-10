// Sources page (Module 7): every source note in the vault, read from data/notes.js (made by scripts/build_vault.py).
// One row per note, ordered by id; the id is the row's anchor, so every "Source S9" link on the site lands on its row.
// Nothing here is typed by hand.
(function () {
  "use strict";
  const box = document.getElementById("source-list");
  const N = window.NOTES;
  if (!box) return;
  if (!N || !N.notes) { box.textContent = "The vault has not been read yet. Run scripts/build_vault.py."; return; }
  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] == null) continue; if (k === "class") n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }
    (kids || []).forEach((c) => n.append(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  };
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = (s) => {
    s = s == null ? "" : String(s);
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); if (m) return Number(m[3]) + " " + MONTHS[Number(m[2]) - 1] + " " + m[1];
    m = /^(\d{4})-(\d{2})$/.exec(s); if (m) return MONTHS[Number(m[2]) - 1] + " " + m[1];
    return s || "No date";
  };
  const num = (id) => Number(String(id).replace(/\D/g, "")) || 0;
  const all = Object.entries(N.notes);
  const sources = all.filter(([, v]) => v.type === "source" && v.id).sort((a, b) => num(a[1].id) - num(b[1].id));
  const cites = (key) => all.filter(([, v]) => v.type === "atomic" && (v.sources || []).indexOf(key) !== -1).length;

  const rows = sources.map(([key, v]) => {
    const n = cites(key);
    let link;
    if (v.url) {
      let host = v.url; try { host = new URL(v.url).hostname.replace(/^www\./, ""); } catch (e) { /* keep the text */ }
      link = el("a", { href: v.url, target: "_blank", rel: "noopener" }, [host]);
    } else link = el("span", { class: "src-file" }, [v.file || "No link"]);
    return el("tr", { id: v.id }, [
      el("th", { scope: "row", class: "src-id" }, [el("a", { href: "#" + v.id }, [v.id])]),
      el("td", { class: "src-title" }, [el("a", { href: "vault.html#note=" + encodeURIComponent(key) }, [v.title || key])]),
      el("td", { class: "src-pub" }, [v.publisher || ""]),
      el("td", { class: "src-date" + (v.publication_date ? "" : " none") }, [date(v.publication_date)]),
      el("td", { class: "src-link" }, [link]),
      el("td", { class: "src-n", title: n + (n === 1 ? " atomic note cites" : " atomic notes cite") + " this source" }, [String(n)])
    ]);
  });
  const total = sources.reduce((a, [k]) => a + cites(k), 0);
  box.replaceChildren(
    el("p", { class: "src-cap" }, [sources.length + " source notes in the vault, read from data/notes.js on " + date(N.generatedOn) + "."]),
    el("div", { class: "src-wrap" }, [el("table", { class: "src-table" }, [
      el("thead", null, [el("tr", null, ["Id", "Source", "Publisher", "Published", "Link or file", "Notes"].map((h) => el("th", { scope: "col" }, [h])))]),
      el("tbody", null, rows),
      el("tfoot", null, [el("tr", null, [el("td", { colspan: "5" }, ["Atomic notes citing a source"]), el("td", { class: "src-n" }, [String(total)])])])
    ])])
  );
  // The rows exist only now, so jump to the linked one ourselves.
  if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView({ block: "center" }); }
})();
