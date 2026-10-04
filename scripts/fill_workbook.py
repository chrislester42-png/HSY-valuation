#!/usr/bin/env python3
"""
fill_workbook.py

Type values into input cells of the team's Q&D workbook without opening Excel and
without disturbing anything else in the file.

    python3 scripts/fill_workbook.py workbook/QD-HSY.xlsx fill.json
    python3 scripts/fill_workbook.py workbook/QD-HSY.xlsx fill.json --dry-run

fill.json maps sheet name -> cell -> value:

    {"FrontPage":   {"A1": "The Hershey Company", "C2": "HSY", "C3": 173.32, "C4": "2026-10-04"},
     "Detail Data": {"C5": 11202.3, "D5": 11692.6}}

A number is written as a number, text as text, and a YYYY-MM-DD string as an Excel date.

How it works, and why it is safe
- An .xlsx file is a zip of XML files. This script rewrites only the XML of the sheets
  you name, cell by cell, and copies every other part (charts, images, styles, comments,
  the other sheets) through byte for byte. It uses only the Python standard library.
- It refuses to write into a cell that holds a formula, and writes nothing at all if any
  requested cell is a formula cell.
- It refuses to run while the workbook is open in Excel (Excel leaves a ~$ lock file).
- It marks the workbook "recalculate on open". Formula cells keep their OLD results until
  you open the workbook in Excel and save it. scripts/workbook_to_data.py refuses to run
  until you have done that, so stale results never reach the site.

Never edit the workbook with openpyxl or any library that re-saves the whole file: that
drops the charts and images.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import tempfile
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

CELL = r'<c r="{ref}"(?P<attrs>[^>]*?)(?:/>|>(?P<body>.*?)</c>)'


def col_index(ref: str) -> int:
    n = 0
    for ch in re.match(r"[A-Z]+", ref).group(0):
        n = n * 26 + (ord(ch) - 64)
    return n


def split_ref(ref: str) -> tuple[str, int]:
    m = re.fullmatch(r"([A-Z]{1,3})([0-9]{1,7})", ref)
    if not m:
        raise ValueError(f"'{ref}' is not a cell address like C5")
    return m.group(1), int(m.group(2))


def render(ref: str, style: str, value) -> str:
    s = f' s="{style}"' if style else ""
    if isinstance(value, bool):
        raise ValueError(f"{ref}: true/false values are not supported")
    if isinstance(value, (int, float)):
        return f'<c r="{ref}"{s}><v>{repr(float(value)) if isinstance(value, float) else value}</v></c>'
    if isinstance(value, str):
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
            serial = (dt.date.fromisoformat(value) - dt.date(1899, 12, 30)).days
            return f'<c r="{ref}"{s}><v>{serial}</v></c>'
        return f'<c r="{ref}"{s} t="inlineStr"><is><t xml:space="preserve">{escape(value)}</t></is></c>'
    raise ValueError(f"{ref}: unsupported value {value!r}")


def patch_sheet(xml: str, cells: dict, sheet: str, errors: list) -> tuple[str, int]:
    written = 0
    for ref, value in cells.items():
        ref = ref.upper().strip()
        try:
            col, rownum = split_ref(ref)
        except ValueError as e:
            errors.append(f"{sheet}: {e}"); continue
        m = re.search(CELL.format(ref=ref), xml, re.S)
        if m:
            if m.group("body") and "<f" in m.group("body"):
                errors.append(f"{sheet}!{ref} holds a formula; it was not changed"); continue
            st = re.search(r'\bs="(\d+)"', m.group("attrs"))
            try:
                new = render(ref, st.group(1) if st else "", value)
            except ValueError as e:
                errors.append(f"{sheet}: {e}"); continue
            xml = xml[:m.start()] + new + xml[m.end():]
            written += 1
            continue
        # the cell does not exist yet: put it in its row, in column order
        try:
            new = render(ref, "", value)
        except ValueError as e:
            errors.append(f"{sheet}: {e}"); continue
        row = re.search(r'<row r="%d"(?P<attrs>[^>]*?)(?P<close>/>|>(?P<body>.*?)</row>)' % rownum, xml, re.S)
        if row is None:
            later = [r for r in re.finditer(r'<row r="(\d+)"', xml) if int(r.group(1)) > rownum]
            pos = later[0].start() if later else xml.index("</sheetData>")
            xml = xml[:pos] + f'<row r="{rownum}">{new}</row>' + xml[pos:]
        elif row.group("close") == "/>":
            xml = xml[:row.start()] + f'<row r="{rownum}"{row.group("attrs")}>{new}</row>' + xml[row.end():]
        else:
            body_start = row.start("body")
            body = row.group("body")
            after = [c for c in re.finditer(r'<c r="([A-Z]+)%d"' % rownum, body) if col_index(c.group(1)) > col_index(col)]
            pos = body_start + (after[0].start() if after else len(body))
            xml = xml[:pos] + new + xml[pos:]
        written += 1
    return xml, written


def sheet_paths(z: zipfile.ZipFile) -> dict:
    wb = z.read("xl/workbook.xml").decode("utf-8")
    rels = z.read("xl/_rels/workbook.xml.rels").decode("utf-8")
    targets = {}
    for rel in re.findall(r"<Relationship [^>]*>", rels):
        rid = re.search(r'Id="([^"]+)"', rel).group(1)
        targets[rid] = re.search(r'Target="([^"]+)"', rel).group(1)
    out = {}
    for tag in re.findall(r"<sheet [^>]*>", wb):
        name = re.search(r'name="([^"]*)"', tag).group(1).replace("&amp;", "&")
        rid = re.search(r'r:id="([^"]+)"', tag).group(1)
        t = targets[rid]
        out[name] = t.lstrip("/") if t.startswith("/") else "xl/" + t
    return out


def mark_recalc(wb_xml: str) -> str:
    m = re.search(r"<calcPr\b[^>]*?/?>", wb_xml)
    if m:
        tag = re.sub(r'\s+fullCalcOnLoad="[^"]*"', "", m.group(0))
        tag = tag[:-2] + ' fullCalcOnLoad="1"/>' if tag.endswith("/>") else tag[:-1] + ' fullCalcOnLoad="1">'
        return wb_xml[:m.start()] + tag + wb_xml[m.end():]
    for nxt in ("<oleSize", "<customWorkbookViews", "<pivotCaches", "<smartTagPr", "<smartTagTypes", "<webPublishing",
                "<fileRecoveryPr", "<webPublishObjects", "<extLst", "</workbook>"):
        i = wb_xml.find(nxt)
        if i != -1:
            return wb_xml[:i] + '<calcPr fullCalcOnLoad="1"/>' + wb_xml[i:]
    return wb_xml


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    if len(args) != 2:
        sys.exit(__doc__)
    path, fill = Path(args[0]), json.loads(Path(args[1]).read_text())
    if not path.exists():
        sys.exit(f"No such workbook: {path}")
    if (path.parent / ("~$" + path.name)).exists():
        sys.exit(f"{path.name} is open in Excel. Close it in Excel first (save if Excel asks), then run this again.")

    errors, report, changed = [], [], {}
    with zipfile.ZipFile(path) as z:
        paths = sheet_paths(z)
        for sheet, cells in fill.items():
            if sheet not in paths:
                errors.append(f"No sheet named '{sheet}'. Sheets: {', '.join(paths)}"); continue
            xml, n = patch_sheet(z.read(paths[sheet]).decode("utf-8"), cells, sheet, errors)
            changed[paths[sheet]] = xml.encode("utf-8")
            report.append(f"  {sheet}: {n} cells")
        if errors:
            print("Nothing was written, because:")
            for e in errors:
                print("  -", e)
            sys.exit(1)
        if dry:
            print("Dry run. Would write:"); print("\n".join(report)); return
        changed["xl/workbook.xml"] = mark_recalc(z.read("xl/workbook.xml").decode("utf-8")).encode("utf-8")
        fd, tmp = tempfile.mkstemp(suffix=".xlsx", dir=str(path.parent)); os.close(fd)
        with zipfile.ZipFile(tmp, "w") as out:
            for info in z.infolist():
                data = changed.get(info.filename, None)
                out.writestr(info, z.read(info.filename) if data is None else data, compress_type=info.compress_type)
    os.replace(tmp, path)
    print(f"Wrote into {path.name}:"); print("\n".join(report))
    print("Charts, images, formulas, and every other sheet were copied through unchanged.")
    print("NEXT: open the workbook in Excel and save it. Excel recalculates on open; until you save,")
    print("the formula cells hold their old results and scripts/workbook_to_data.py will refuse to run.")


if __name__ == "__main__":
    main()
