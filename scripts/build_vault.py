#!/usr/bin/env python3
"""Bake the research/ vault into site/data/notes.js for the Knowledge Bank page.

Run from the project folder:

    python3 scripts/build_vault.py

It reads every note in research/ (Project Home, Sources, Atomic Notes, Drafts,
Final Deliverables, Questions, Templates, Daily), parses each note's frontmatter and its
[[wiki-links]], turns the body into simple HTML, and writes one file:

    site/data/notes.js   window.NOTES = { generatedOn, counts, notes: { id: {...} }, links: [...] }

Each note carries: title, type (source, atomic, draft, final, question, map,
template, daily),
path, html, and from its frontmatter: id (S1, S2, ...), tier (R, D, E), status,
tags, publisher, publication date, url, file; plus the notes it links to and
the notes that link to it. site/vault.js draws it as a graph, the way Obsidian's
graph view does; nothing reads the vault live.

Generated file: never edit site/data/notes.js by hand. Rerun this script after
any note changes (wrap-up does it for you). Standard library only.
README files and anything under _files are skipped.
"""
import datetime as dt
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VAULT = os.path.join(ROOT, "research")
OUT = os.path.join(ROOT, "site", "data", "notes.js")

TYPE_BY_FOLDER = {
    "01 Sources": "source",
    "02 Atomic Notes": "atomic",
    "03 Drafts": "draft",
    "04 Final Deliverables": "final",
    "05 Questions": "question",
    "06 Templates": "template",
    "07 Daily": "daily",
}
SKIP_DIRS = {"_files", ".obsidian", ".git", ".trash"}
FIELDS = ["id", "tier", "status", "publisher", "author", "publication-date",
          "date-accessed", "date-created", "url", "file"]
WIKILINK = re.compile(r"\[\[([^\]\|#]+)(?:#[^\]\|]*)?(?:\|([^\]]+))?\]\]")


def note_type(rel):
    if rel == "00 Project Home.md":
        return "map"
    return TYPE_BY_FOLDER.get(rel.split("/")[0], "other")


def collect():
    files = []
    for root, dirs, names in os.walk(VAULT):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS and not d.startswith("."))
        for n in sorted(names):
            if not n.lower().endswith(".md") or n.lower() == "readme.md" or n.startswith("."):
                continue
            ab = os.path.join(root, n)
            files.append((os.path.relpath(ab, VAULT).replace(os.sep, "/"), ab))
    return files


def split_frontmatter(text):
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[3:end].strip("\n"), text[end + 4:].lstrip("\n")
    return "", text


def fm_value(fm, key):
    m = re.search(r"^" + re.escape(key) + r":[ \t]*(.*)$", fm, re.MULTILINE)
    if not m:
        return ""
    return m.group(1).strip().strip('"').strip("'")


def fm_tags(fm):
    m = re.search(r"^tags:\s*\[(.*?)\]", fm, re.MULTILINE)
    if m:
        return [t.strip().strip('"').strip("'") for t in m.group(1).split(",") if t.strip()]
    tags = []
    m = re.search(r"^tags:[ \t]*$", fm, re.MULTILINE)
    if m:  # one tag per line: "  - cocoa"
        for line in fm[m.end():].splitlines()[1:]:
            item = re.match(r"^\s*-\s+(.+)$", line)
            if not item:
                break
            tags.append(item.group(1).strip().strip('"').strip("'"))
    return tags


def main():
    if not os.path.isdir(VAULT):
        sys.exit("No research/ folder here. Run this from the project folder.")
    files = collect()
    ids = {rel[:-3]: rel for rel, _ in files}
    by_name = {}
    for nid in ids:
        by_name.setdefault(os.path.basename(nid), nid)

    def resolve(target):
        t = target.strip().strip("/")
        if t.lower().endswith(".md"):
            t = t[:-3]
        if t in ids:
            return t
        return by_name.get(os.path.basename(t))

    def inline(s):
        def link(m):
            rid = resolve(m.group(1))
            label = (m.group(2) or os.path.basename(m.group(1).strip())).strip()
            if rid:
                return "\x00" + rid + "\x01" + label + "\x02"
            return label
        s = html.escape(WIKILINK.sub(link, s), quote=False)
        s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
        s = re.sub(r"(?<![\*\w])\*(?!\s)(.+?)(?<!\s)\*(?![\*\w])", r"<em>\1</em>", s)
        s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
        s = re.sub(r"\[([^\]]+)\]\((https?://[^\)\s]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
        s = re.sub(r"(?<![\"'>=])(https?://[^\s<]+)", r'<a href="\1" target="_blank" rel="noopener">\1</a>', s)
        s = re.sub(r"\x00(.+?)\x01(.+?)\x02",
                   lambda m: '<a class="wl" href="#note=' + html.escape(m.group(1), quote=True).replace(" ", "%20")
                   + '" data-note="' + html.escape(m.group(1), quote=True) + '">' + m.group(2) + "</a>", s)
        return s

    def to_html(body):
        out, lst, table = [], None, []

        def flush():
            nonlocal lst, table
            if lst:
                out.append("</" + lst + ">")
                lst = None
            if table:
                rows = [r for r in table if not re.match(r"^\|?\s*:?-{2,}", r)]
                cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
                head = "".join("<th>" + inline(c) + "</th>" for c in cells[0])
                body_rows = "".join("<tr>" + "".join("<td>" + inline(c) + "</td>" for c in r) + "</tr>" for r in cells[1:])
                out.append("<table><thead><tr>" + head + "</tr></thead><tbody>" + body_rows + "</tbody></table>")
                table = []

        for line in body.splitlines():
            st = line.strip()
            if st.startswith("|"):
                if lst:
                    out.append("</" + lst + ">")
                    lst = None
                table.append(st)
                continue
            if table:
                flush()
            if not st:
                flush()
                continue
            h = re.match(r"^(#{1,6})\s+(.*)$", st)
            if h:
                flush()
                lvl = min(len(h.group(1)) + 1, 6)  # the page owns h1
                out.append("<h%d>%s</h%d>" % (lvl, inline(h.group(2)), lvl))
                continue
            m = re.match(r"^([-*+]|\d+\.)\s+(.*)$", st)
            if m:
                kind = "ol" if m.group(1)[0].isdigit() else "ul"
                if lst != kind:
                    flush()
                    out.append("<" + kind + ">")
                    lst = kind
                out.append("<li>" + inline(m.group(2)) + "</li>")
                continue
            if st.startswith(">"):
                flush()
                out.append("<blockquote>" + inline(st.lstrip("> ")) + "</blockquote>")
                continue
            if re.match(r"^(---|\*\*\*|___)$", st):
                flush()
                continue
            flush()
            out.append("<p>" + inline(st) + "</p>")
        flush()
        return "\n".join(out)

    notes, links = {}, set()
    for rel, ab in files:
        nid = rel[:-3]
        with open(ab, encoding="utf-8", errors="replace") as f:
            text = f.read()
        fm, body = split_frontmatter(text)
        title = os.path.basename(nid)
        for line in body.splitlines():
            if line.startswith("# "):
                title = line[2:].strip()
                body = body.replace(line, "", 1)
                break
        typ = note_type(rel)
        targets = set()
        for m in WIKILINK.finditer(text):
            r = resolve(m.group(1))
            if r and r != nid:
                targets.add(r)
                links.add((nid, r))
        sources = sorted(r for r in (resolve(m.group(1)) for m in WIKILINK.finditer(fm)) if r)
        n = {"title": title, "type": typ, "path": "research/" + rel, "tags": fm_tags(fm),
             "sources": sources, "linksTo": sorted(targets), "html": to_html(body)}
        for k in FIELDS:
            v = fm_value(fm, k)
            if v:
                n[k.replace("-", "_")] = v
        if typ == "source" and not n.get("id"):
            m = re.match(r"^(S\d+)\b", os.path.basename(nid))
            if m:
                n["id"] = m.group(1)
        notes[nid] = n

    for nid in notes:
        notes[nid]["linkedFrom"] = sorted(s for s, t in links if t == nid)

    counts = {}
    for n in notes.values():
        counts[n["type"]] = counts.get(n["type"], 0) + 1
    tiers = {}
    for n in notes.values():
        if n["type"] == "atomic":
            tiers[n.get("tier", "none")] = tiers.get(n.get("tier", "none"), 0) + 1
    statuses = {}
    for n in notes.values():
        if n["type"] == "atomic":
            statuses[n.get("status", "none")] = statuses.get(n.get("status", "none"), 0) + 1

    data = {"generatedOn": dt.date.today().isoformat(), "counts": counts, "tiers": tiers,
            "statuses": statuses, "notes": notes,
            "links": [{"from": s, "to": t} for s, t in sorted(links)]}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/build_vault.py from research/. Do not edit by hand; rerun the script.\n")
        f.write("window.NOTES = " + json.dumps(data, indent=1, ensure_ascii=False) + ";\n")

    print("Wrote site/data/notes.js from research/")
    print("  notes by type: " + ", ".join("%s %d" % (k, v) for k, v in sorted(counts.items())))
    print("  atomic notes by tier: " + ", ".join("%s %d" % (k, v) for k, v in sorted(tiers.items())))
    print("  atomic notes by status: " + ", ".join("%s %d" % (k, v) for k, v in sorted(statuses.items())))
    print("  links: %d" % len(links))
    broken = sorted({(rel[:-3], m.group(1).strip()) for rel, ab in files
                     for m in WIKILINK.finditer(open(ab, encoding="utf-8", errors="replace").read())
                     if not resolve(m.group(1)) and m.group(1).strip() not in ("01 Sources/", "02 Atomic Notes/")})
    if broken:
        print("  links that point at no note (fix the name in the note, then rerun):")
        for src, tgt in broken:
            print("    %s -> [[%s]]" % (src, tgt))
    no_source = sorted(nid for nid, n in notes.items() if n["type"] == "atomic" and not n["sources"])
    if no_source:
        print("  atomic notes with no source note in their frontmatter:")
        for nid in no_source:
            print("    " + nid)
    no_tier = sorted(nid for nid, n in notes.items() if n["type"] == "atomic" and n.get("tier") not in ("R", "D", "E"))
    if no_tier:
        print("  atomic notes with no tier (R, D, or E):")
        for nid in no_tier:
            print("    " + nid)


if __name__ == "__main__":
    main()
