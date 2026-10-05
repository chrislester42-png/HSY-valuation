// Knowledge Bank page (vault.html): an Obsidian-style graph of the research/ vault.
// Ported from the Bloom Energy site's VaultExplorer. Plain JavaScript, canvas, no libraries.
// Reads window.NOTES (data/notes.js, baked by scripts/build_vault.py) and the topic chips in
// window.CONTENT.vault.themes (content.js). Teams change content.js, not this file.
(function () {
  "use strict";
  const C = window.CONTENT || {};
  const site = C.site || {};
  const V = C.vault || {};
  const DATA = window.NOTES || null;
  const $ = (id) => document.getElementById(id);

  /* ---- node-type palette (tuned for the light warm-gray stage) ---------- */
  const TYPE_META = {
    atomic:   { color: "#0b7340", label: "Atomic note" },
    source:   { color: "#2563eb", label: "Source" },
    question: { color: "#d97706", label: "Open question" },
    draft:    { color: "#7c3aed", label: "Draft" },
    map:      { color: "#db2777", label: "Map / home" },
    final:    { color: "#0a0a0a", label: "Deliverable" },
    daily:    { color: "#0891b2", label: "Daily note" },
    template: { color: "#94a3b8", label: "Template" },
    other:    { color: "#9ca3af", label: "Other" }
  };
  const metaOf = (ty) => TYPE_META[ty] || TYPE_META.other;
  const TIER_NAME = { R: "Reported", D: "Derived", E: "Estimate" };

  /* ---- topic chips from content.js: each matches on tag or title keyword -- */
  const THEMES = (V.themes || []).filter((t) => t && t.label);

  // header text
  const ticker = site.ticker && site.ticker !== "[TICKER]" ? site.ticker : "";
  document.querySelectorAll('[data-bind="companyName"]').forEach((n) => { n.textContent = site.companyName || "Our company"; });
  document.querySelectorAll('[data-bind="tickerDot"]').forEach((n) => { n.textContent = ticker ? "· " + ticker : ""; });
  document.title = "Knowledge Bank" + (site.companyName ? ": " + site.companyName + " research vault" : "");

  const msg = $("kb-msg");
  if (!DATA || !DATA.notes) {
    msg.textContent = "No vault data yet. Run python3 scripts/build_vault.py in the project folder, then reload.";
    return;
  }

  /* ---- graph from the baked notes ---------------------------------------- */
  const notes = DATA.notes;
  const ids = Object.keys(notes);
  const linkPairs = [];
  const seen = new Set();
  (DATA.links || []).forEach((l) => {
    if (!notes[l.from] || !notes[l.to] || l.from === l.to) return;
    const key = l.from < l.to ? l.from + "\u0000" + l.to : l.to + "\u0000" + l.from;
    if (seen.has(key)) return;
    seen.add(key);
    linkPairs.push([l.from, l.to]);
  });
  const deg = {};
  ids.forEach((id) => { deg[id] = 0; });
  linkPairs.forEach(([a, b]) => { deg[a]++; deg[b]++; });
  const counts = {};
  ids.forEach((id) => { const ty = notes[id].type; counts[ty] = (counts[ty] || 0) + 1; });
  $("kb-sub").textContent = ids.length + " notes, " + linkPairs.length + " links";

  const N = ids.length;
  const order = ids.slice().sort((a, b) => deg[b] - deg[a] || notes[a].title.localeCompare(notes[b].title));
  const nodes = order.map((id, i) => {
    const a = (i / Math.max(N, 1)) * Math.PI * 2;
    const rad = 230 + Math.random() * 40;
    const n = notes[id];
    return { id: id, title: n.title, type: n.type, tags: n.tags || [], deg: deg[id],
      x: Math.cos(a) * rad + (Math.random() - 0.5) * 18, y: Math.sin(a) * rad + (Math.random() - 0.5) * 18,
      vx: 0, vy: 0, r: 3.2 + Math.sqrt(deg[id]) * 1.7 };
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const links = linkPairs.map(([a, b]) => ({ s: byId.get(a), t: byId.get(b) }));
  const adj = new Map(nodes.map((n) => [n.id, new Set()]));
  links.forEach(({ s, t }) => { adj.get(s.id).add(t.id); adj.get(t.id).add(s.id); });

  /* ---- one integration step of the force sim ----------------------------- */
  function stepPhysics(k) {
    const REPULSION = 1200, SPRING = 0.045, TARGET = 70, GRAVITY = 0.016, DAMP = 0.82, MAX_R = 1050, VMAX = 28;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 0.01) { d2 = 0.01; dx = Math.random(); dy = Math.random(); }
        const rep = (REPULSION * k) / d2;
        const d = Math.sqrt(d2);
        const fx = (dx / d) * rep, fy = (dy / d) * rep;
        a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
      }
    }
    for (const { s, t } of links) {
      const dx = t.x - s.x, dy = t.y - s.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = (d - TARGET) * SPRING * k;
      const fx = (dx / d) * f, fy = (dy / d) * f;
      s.vx += fx; s.vy += fy; t.vx -= fx; t.vy -= fy;
    }
    for (const n of nodes) {
      n.vx += -n.x * GRAVITY * k;
      n.vy += -n.y * GRAVITY * k;
      if (n.fx !== undefined) { n.x = n.fx; n.y = n.fy; n.vx = 0; n.vy = 0; continue; }
      n.vx *= DAMP; n.vy *= DAMP;
      const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (sp > VMAX) { n.vx = (n.vx / sp) * VMAX; n.vy = (n.vy / sp) * VMAX; }
      n.x += n.vx; n.y += n.vy;
      const dist = Math.sqrt(n.x * n.x + n.y * n.y);
      if (dist > MAX_R) { n.x = (n.x / dist) * MAX_R; n.y = (n.y / dist) * MAX_R; n.vx *= 0.5; n.vy *= 0.5; }
    }
  }
  // pre-warm headless so the graph opens near-settled
  let warm = 1;
  for (let s = 0; s < 320; s++) { stepPhysics(warm); warm *= 0.99; }

  /* ---- state ------------------------------------------------------------- */
  const state = { alpha: 0.12, hover: null, sel: null, q: "", types: new Set(), theme: null, themeSet: null,
    cam: { x: 0, y: 0, scale: 1 }, dpr: 1 };

  const canvas = $("kb-canvas");
  const stage = $("kb-stage");
  const ctx = canvas.getContext("2d");
  msg.hidden = true;
  $("kb-legend").hidden = false;
  $("kb-hint").hidden = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.dpr = dpr;
    canvas.width = stage.clientWidth * dpr;
    canvas.height = stage.clientHeight * dpr;
    canvas.style.width = stage.clientWidth + "px";
    canvas.style.height = stage.clientHeight + "px";
  }
  resize();
  state.cam = { x: stage.clientWidth / 2, y: stage.clientHeight / 2, scale: stage.clientWidth < 720 ? 0.6 : 1 };
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener("resize", resize);

  /* ---- draw ---------------------------------------------------------------- */
  function draw() {
    const c = ctx, cam = state.cam;
    const focus = state.sel || state.hover;
    const focusSet = focus ? adj.get(focus) : null;
    const q = state.q, types = state.types, typeOn = types.size > 0, themeSet = state.themeSet;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.scale(state.dpr, state.dpr);
    c.translate(cam.x, cam.y);
    c.scale(cam.scale, cam.scale);

    const dimmed = (id) => (focus ? !(id === focus || (focusSet && focusSet.has(id))) : false);
    const filteredOut = (n) => (typeOn && !types.has(n.type)) || (q && !n.title.toLowerCase().includes(q));

    c.lineWidth = 1 / cam.scale;
    for (const { s, t } of links) {
      const related = focus && (s.id === focus || t.id === focus);
      const inTheme = !themeSet || (themeSet.has(s.id) && themeSet.has(t.id));
      if (focus && !related) c.strokeStyle = "rgba(10,10,10,0.03)";
      else if (related) c.strokeStyle = "rgba(11,115,64,0.45)";
      else if (!inTheme) c.strokeStyle = "rgba(10,10,10,0.03)";
      else c.strokeStyle = "rgba(10,10,10,0.10)";
      c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(t.x, t.y); c.stroke();
    }

    const labelEvery = cam.scale > 1.9;
    for (const n of nodes) {
      const m = metaOf(n.type);
      const isFocus = n.id === focus;
      const dim = dimmed(n.id) || filteredOut(n) || (!!themeSet && !themeSet.has(n.id) && !isFocus);
      c.beginPath();
      c.arc(n.x, n.y, n.r + (isFocus ? 2 : 0), 0, Math.PI * 2);
      c.fillStyle = dim ? "rgba(10,10,10,0.10)" : m.color;
      c.globalAlpha = dim ? 0.35 : 1;
      c.fill();
      if (isFocus) { c.lineWidth = 2 / cam.scale; c.strokeStyle = "#0a0a0a"; c.stroke(); }
      c.globalAlpha = 1;
      const showLabel = !dim && (isFocus || (focusSet && focusSet.has(n.id)) || labelEvery ||
        (q && n.title.toLowerCase().includes(q)));
      if (showLabel) {
        c.font = (isFocus ? "600 " : "") + (11 / cam.scale) + 'px "Geist", ui-sans-serif, system-ui, -apple-system, sans-serif';
        c.fillStyle = "rgba(10,10,10,0.78)";
        c.textAlign = "center";
        c.textBaseline = "top";
        const label = n.title.length > 42 ? n.title.slice(0, 41) + "…" : n.title;
        c.fillText(label, n.x, n.y + n.r + 2 / cam.scale);
      }
    }
    c.restore();
  }

  function tick() {
    if (state.alpha > 0.005) { stepPhysics(state.alpha); state.alpha *= 0.985; }
    draw();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---- pointer: zoom, pan, drag, click ------------------------------------ */
  const toWorld = (sx, sy) => {
    const rect = canvas.getBoundingClientRect(), cam = state.cam;
    return { x: (sx - rect.left - cam.x) / cam.scale, y: (sy - rect.top - cam.y) / cam.scale };
  };
  const hit = (sx, sy) => {
    const w = toWorld(sx, sy);
    let best = null, bestD = Infinity;
    for (const n of nodes) {
      const dx = n.x - w.x, dy = n.y - w.y, d = dx * dx + dy * dy, rr = (n.r + 6) * (n.r + 6);
      if (d < rr && d < bestD) { best = n; bestD = d; }
    }
    return best;
  };
  let dragNode = null, panning = false, moved = 0;
  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    moved = 0;
    const n = hit(e.clientX, e.clientY);
    if (n) { dragNode = n; state.alpha = Math.max(state.alpha, 0.4); n.fx = n.x; n.fy = n.y; }
    else panning = true;
  });
  canvas.addEventListener("pointermove", (e) => {
    moved += Math.abs(e.movementX) + Math.abs(e.movementY);
    if (dragNode) {
      const w = toWorld(e.clientX, e.clientY);
      dragNode.fx = w.x; dragNode.fy = w.y; dragNode.x = w.x; dragNode.y = w.y;
      state.alpha = Math.max(state.alpha, 0.25);
    } else if (panning) {
      state.cam.x += e.movementX; state.cam.y += e.movementY;
    } else {
      const h = hit(e.clientX, e.clientY);
      state.hover = h ? h.id : null;
      canvas.style.cursor = state.hover ? "pointer" : "grab";
    }
  });
  canvas.addEventListener("pointerup", (e) => {
    if (dragNode) { dragNode.fx = undefined; dragNode.fy = undefined; }
    if (moved < 5) { const n = hit(e.clientX, e.clientY); select(n ? n.id : null); }
    dragNode = null; panning = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
  });
  canvas.addEventListener("pointerleave", () => { state.hover = null; });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const cam = state.cam, rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const wx = (mx - cam.x) / cam.scale, wy = (my - cam.y) / cam.scale;
    cam.scale = Math.max(0.25, Math.min(5, cam.scale * Math.exp(-e.deltaY * 0.0014)));
    cam.x = mx - wx * cam.scale; cam.y = my - wy * cam.scale;
  }, { passive: false });

  /* ---- reading pane -------------------------------------------------------- */
  const pane = $("kb-pane");
  function el(tag, cls, text) { const x = document.createElement(tag); if (cls) x.className = cls; if (text != null) x.textContent = text; return x; }
  function linkList(title, list) {
    const box = el("div", "kb-list");
    box.append(el("div", "kb-list-h", title));
    list.forEach((id) => {
      const n = notes[id];
      const b = el("button", "kb-link");
      const dot = el("span", "kb-dot"); dot.style.background = metaOf(n ? n.type : "other").color; dot.style.width = dot.style.height = "8px";
      b.append(dot, el("span", null, n ? n.title : id));
      b.addEventListener("click", () => openNote(id));
      box.append(b);
    });
    return box;
  }
  function select(id) {
    state.sel = id;
    state.alpha = Math.max(state.alpha, 0.3);
    $("kb-hint").hidden = !!id || window.innerWidth < 720;
    if (!id) { pane.hidden = true; if (location.hash) history.replaceState(null, "", location.pathname); return; }
    const n = notes[id], m = metaOf(n.type);
    const type = $("kb-type");
    type.textContent = "";
    const d = el("span", "kb-dot"); d.style.background = m.color; d.style.width = d.style.height = "8px";
    type.append(d, document.createTextNode(m.label));
    type.style.background = m.color + "1a"; type.style.color = m.color;
    const tier = $("kb-tier");
    tier.hidden = !TIER_NAME[n.tier];
    if (TIER_NAME[n.tier]) { tier.className = "kb-tier " + n.tier; tier.textContent = n.tier + " · " + TIER_NAME[n.tier]; }
    const status = $("kb-status");
    status.hidden = !n.status || n.type === "source";
    if (n.status) { status.className = "kb-status " + n.status; status.textContent = n.status.replace(/-/g, " "); }
    $("kb-path").textContent = n.path;
    $("kb-note-title").textContent = n.title;
    $("kb-note").innerHTML = n.html;
    const lists = $("kb-lists");
    lists.innerHTML = "";
    if (n.sources && n.sources.length) lists.append(linkList("Cites these sources", n.sources));
    if (n.linkedFrom && n.linkedFrom.length) lists.append(linkList("Referenced by (" + n.linkedFrom.length + ")", n.linkedFrom));
    if (n.tags && n.tags.length) {
      const tg = el("div", "kb-tags");
      n.tags.forEach((t) => tg.append(el("span", "kb-tag", "#" + t)));
      lists.append(tg);
    }
    pane.hidden = false;
    pane.querySelector(".kb-pane-body").scrollTop = 0;
  }
  function focusNode(id) {
    const n = byId.get(id);
    if (!n) return;
    const cam = state.cam;
    cam.scale = Math.max(cam.scale, 1.4);
    requestAnimationFrame(() => {
      cam.x = stage.clientWidth / 2 - n.x * cam.scale;
      cam.y = stage.clientHeight / 2 - n.y * cam.scale;
    });
  }
  function openNote(id) {
    if (!byId.get(id)) return;
    select(id);
    focusNode(id);
  }
  $("kb-close").addEventListener("click", () => select(null));
  $("kb-note").addEventListener("click", (e) => {
    const a = e.target.closest("a.wl");
    if (a && a.dataset.note) { e.preventDefault(); openNote(a.dataset.note); }
  });

  // Deep link: vault.html#note=<note path> opens that note (the Fact chips on the main page link here)
  function fromHash() {
    const m = location.hash.match(/^#note=(.+)$/);
    if (!m) return;
    let id = decodeURIComponent(m[1]).replace(/^research\//, "").replace(/\.md$/, "");
    if (!notes[id]) {
      const base = id.split("/").pop();
      id = ids.find((x) => x.split("/").pop() === base) || id;
    }
    if (notes[id]) openNote(id);
  }
  fromHash();
  window.addEventListener("hashchange", fromHash);

  /* ---- search -------------------------------------------------------------- */
  $("kb-search").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); });

  /* ---- topic chips ----------------------------------------------------------- */
  const themesBox = $("kb-themes");
  function themeSetFor(th) {
    const tags = new Set((th.tags || []).map((t) => String(t).toLowerCase()));
    const kws = (th.kw || []).map((k) => String(k).toLowerCase());
    const notesList = new Set(th.notes || []);
    const s = new Set();
    for (const n of nodes) {
      const tagHit = n.tags.some((t) => tags.has(String(t).toLowerCase()));
      const kwHit = kws.some((k) => n.title.toLowerCase().includes(k));
      if (tagHit || kwHit || notesList.has(n.id)) s.add(n.id);
    }
    return s;
  }
  function renderThemes() {
    themesBox.innerHTML = "";
    THEMES.forEach((th, i) => {
      const b = el("button", "kb-chip" + (state.theme === i ? " on" : ""), th.label);
      b.addEventListener("click", () => {
        state.theme = state.theme === i ? null : i;
        state.themeSet = state.theme == null ? null : themeSetFor(THEMES[state.theme]);
        state.alpha = Math.max(state.alpha, 0.03);
        renderThemes();
      });
      themesBox.append(b);
    });
    if (state.theme != null) {
      const clr = el("button", "kb-chip clear", "Clear");
      clr.addEventListener("click", () => { state.theme = null; state.themeSet = null; renderThemes(); });
      themesBox.append(clr);
    }
  }
  renderThemes();

  /* ---- legend: node type filter -------------------------------------------- */
  const legend = $("kb-legend-items");
  function renderLegend() {
    legend.innerHTML = "";
    Object.keys(TYPE_META).filter((ty) => counts[ty] > 0).forEach((ty) => {
      const m = TYPE_META[ty];
      const on = state.types.size === 0 || state.types.has(ty);
      const b = el("button", "kb-legend-item" + (on ? "" : " off"));
      const dot = el("span", "kb-dot"); dot.style.background = m.color;
      b.append(dot, document.createTextNode(m.label + " "), el("span", "kb-count", String(counts[ty])));
      b.addEventListener("click", () => {
        if (state.types.has(ty)) state.types.delete(ty); else state.types.add(ty);
        renderLegend();
      });
      legend.append(b);
    });
  }
  renderLegend();

  // for checking from the console or a script
  window.vaultGraph = { nodes: nodes, links: links, counts: counts, themes: THEMES, themeSetFor: themeSetFor, openNote: openNote };
})();
