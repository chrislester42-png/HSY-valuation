// Process section (Module 7). Registers window.sections.process.
// The words come from the process object in content.js, filed from
// research/03 Drafts/Milestone 6 - AI Use Evaluation Memo.md. Every count comes from window.AILOG
// (site/data/ailog.js, made by scripts/ai_log_to_data.py from AI Log.md); no count is typed here.
(function () {
  "use strict";

  const VERDICT = { held: "Held up", mixed: "Mixed", misled: "Misled" };
  const noteHref = (note) => "vault.html#note=" + encodeURIComponent(note);

  window.sections = window.sections || {};

  window.sections.process = function (body, s) {
    const ui = window.ui, { el, text } = ui;
    const A = window.AILOG;
    if (!A || !A.rows || !A.summary) {
      body.append(el("p", { class: "lede" }, [text("The AI Log has not been read yet. Run scripts/ai_log_to_data.py.")]));
      return;
    }
    const byModule = A.summary.byModule || {};
    const rowsFor = (m) => A.rows.filter((r) => (r.modules || []).indexOf(m) !== -1);
    const card = (cls, title, kids) => el("section", { class: "card pr-card " + cls }, [el("h3", { class: "pr-title" }, [text(title)])].concat(kids));

    // ---------- 1) By module: one row per module; hover says how it was verified, a click opens its log rows ----------
    const popId = "pr-pop";
    const pop = el("div", { class: "pop pr-pop", id: popId, hidden: "", role: "region", "aria-label": "AI Log rows" }, []);
    const fillPop = (m) => {
      const mine = rowsFor(m.module);
      const b = byModule[String(m.module)] || {};
      const split = [["helped", "helped"], ["misled", "misled"], ["didNotHelp", "did not help"], ["other", "other"]]
        .filter(([k]) => b[k]).map(([k, w]) => b[k] + " " + w).join(", ");
      pop.replaceChildren(
        el("div", { class: "pr-pop-head" }, [
          el("h4", null, [text("Module " + m.module + ": " + mine.length + (mine.length === 1 ? " log row" : " log rows"))]),
          el("span", { class: "pr-pop-sum" }, [text(split)])
        ]),
        el("p", { class: "pr-pop-ver" }, [text(m.verified || "")]),
        el("ol", { class: "pr-log" }, mine.map((r) => el("li", null, [
          el("span", { class: "pr-log-task" }, [text(r.task)]),
          el("span", { class: "pr-log-v pr-k-" + r.kind }, [text(r.verdict)])
        ]))),
        m.note ? el("a", { class: "pop-src", href: noteHref(m.note) }, [text("Open the note")]) : text("")
      );
      pop.scrollTop = 0;
    };

    const mods = el("ol", { class: "pr-mods" }, (s.modules || []).slice(0, 6).map((m) => {
      const n = (byModule[String(m.module)] || {}).rows || 0;
      const tipId = "pr-tip-" + m.module;
      const btn = el("button", { type: "button", class: "pr-row", "data-pop": "", "aria-expanded": "false",
        "aria-controls": popId, "aria-describedby": tipId }, [
        el("span", { class: "pr-num" }, [text(String(m.module))]),
        el("span", { class: "pr-main" }, [
          el("span", { class: "pr-task" }, [text(m.task)]),
          el("span", { class: "pr-chips" }, [
            el("span", { class: "pr-verdict pr-v-" + m.verdict }, [text(VERDICT[m.verdict] || m.verdict)])
          ].concat(m.failure ? [el("span", { class: "pr-fail" }, [text(m.failure)])] : []))
        ]),
        el("span", { class: "pr-count" }, [el("b", null, [text(String(n))]), text(n === 1 ? " row" : " rows")])
      ]);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = btn.getAttribute("aria-expanded") === "true";
        ui.closePops(btn);
        if (open) { btn.setAttribute("aria-expanded", "false"); pop.hidden = true; return; }
        fillPop(m);
        btn.setAttribute("aria-expanded", "true");
        pop.hidden = false;
      });
      const tip = el("span", { class: "tip pr-tip", id: tipId, role: "tooltip" }, [el("b", null, [text("How we verified")]), text(m.verified || "")]);
      return el("li", null, [btn, tip]);
    }));
    const logNote = s.logNote ? noteHref(s.logNote) : null;
    const cap = el("p", { class: "pr-cap" }, [text(A.summary.rows + " AI Log rows, Modules " + (A.summary.modules || []).join(", ") + ". ")]
      .concat(logNote ? [el("a", { href: logNote }, [text("Source S24")])] : []));

    // ---------- 2) Failure modes ----------
    const fails = el("ul", { class: "pr-fails" }, (s.failures || []).slice(0, 4).map((f) => el("li", null, [
      el("div", { class: "pr-fail-top" }, [el("span", { class: "pr-fail" }, [text(f.mode)]), el("span", { class: "pr-mod" }, [text("Module " + f.module)])]),
      el("p", { class: "pr-ex" }, [text(f.example + " ")].concat(f.note ? [el("a", { class: "pr-note", href: noteHref(f.note) }, [text("note")])] : []))
    ])));

    // ---------- 3) What we will change ----------
    const recs = el("ol", { class: "pr-recs" }, (s.recommendations || []).slice(0, 4).map((r, i) => el("li", null, [
      el("span", { class: "pr-rec-n" }, [text(String(i + 1))]),
      el("div", null, [el("p", { class: "pr-rec" }, [text(r.text)]), el("span", { class: "pr-from" }, [text("From: " + r.from)])])
    ])));

    body.append(el("div", { class: "pr-body" }, [
      card("pr-by", "By module", [mods, cap, pop]),
      card("pr-fm", "Failure modes", [fails]),
      card("pr-ch", "Changes", [recs])
    ]));
  };
})();
