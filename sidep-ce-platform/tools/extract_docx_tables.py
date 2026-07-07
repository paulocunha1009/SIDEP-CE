from __future__ import annotations

import json
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
NORTEADORES = ROOT / "norteadores"
OUT = ROOT / "sidep-ce-platform" / "docs" / "norteadores_tabelas.json"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def cell_text(cell: ET.Element) -> str:
    paragraphs = []
    for para in cell.findall(".//w:p", NS):
        text = "".join(node.text or "" for node in para.findall(".//w:t", NS)).strip()
        if text:
            paragraphs.append(text)
    return "\n".join(paragraphs)


def read_tables(path: Path) -> list[list[list[str]]]:
    with zipfile.ZipFile(path) as archive:
        xml = archive.read("word/document.xml")

    root = ET.fromstring(xml)
    tables = []
    for table in root.findall(".//w:tbl", NS):
        rows = []
        for row in table.findall(".//w:tr", NS):
            cells = [cell_text(cell) for cell in row.findall("./w:tc", NS)]
            if any(cells):
                rows.append(cells)
        if rows:
            tables.append(rows)
    return tables


def main() -> None:
    payload = []
    for path in sorted(NORTEADORES.glob("*.docx")):
        payload.append(
            {
                "arquivo": str(path.relative_to(ROOT)),
                "tabelas": read_tables(path),
            }
        )
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()
