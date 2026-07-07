from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
from html.parser import HTMLParser
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
NORTEADORES = ROOT / "norteadores"
OUT = ROOT / "sidep-ce-platform" / "docs" / "norteadores_extraidos.json"

KEYWORDS = [
    "compet",
    "descritor",
    "matriz",
    "quest",
    "tri",
    "banco de itens",
    "avali",
    "diagn",
]


def read_docx(path: Path) -> str:
    with zipfile.ZipFile(path) as archive:
        xml = archive.read("word/document.xml")

    root = ET.fromstring(xml)
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs: list[str] = []
    for para in root.findall(".//w:p", ns):
      texts = [node.text or "" for node in para.findall(".//w:t", ns)]
      text = "".join(texts).strip()
      if text:
          paragraphs.append(text)
    return "\n".join(paragraphs)

def read_pptx(path: Path) -> str:
    texts: list[str] = []
    with zipfile.ZipFile(path) as archive:
        slide_names = sorted(name for name in archive.namelist() if name.startswith("ppt/slides/slide") and name.endswith(".xml"))
        for name in slide_names:
            root = ET.fromstring(archive.read(name))
            for node in root.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/main}t"):
                if node.text:
                    texts.append(node.text.strip())
    return "\n".join(text for text in texts if text)


class TextHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        text = data.strip()
        if text:
            self.parts.append(text)


def read_html(path: Path) -> str:
    parser = TextHTMLParser()
    parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(parser.parts)


def read_pdf(path: Path) -> str:
    try:
        import pdfplumber
    except Exception:
        return ""

    parts: list[str] = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            if text.strip():
                parts.append(text)
    return "\n".join(parts)


def read_text(path: Path) -> str:
    if path.suffix.lower() == ".docx":
        return read_docx(path)
    if path.suffix.lower() == ".pptx":
        return read_pptx(path)
    if path.suffix.lower() == ".html":
        return read_html(path)
    if path.suffix.lower() == ".pdf":
        return read_pdf(path)
    return path.read_text(encoding="utf-8", errors="ignore")


def relevant_lines(text: str) -> list[str]:
    lines = [line.strip() for line in re.split(r"[\r\n]+", text) if line.strip()]
    found: list[str] = []
    for line in lines:
        lower = line.lower()
        if any(keyword in lower for keyword in KEYWORDS):
            found.append(line)
    return found[:220]


def main() -> None:
    results = []
    for path in sorted(NORTEADORES.glob("*")):
        if path.suffix.lower() not in {".docx", ".md", ".txt", ".html", ".pptx", ".pdf"}:
            continue
        text = read_text(path)
        results.append(
            {
                "arquivo": str(path.relative_to(ROOT)),
                "caracteres": len(text),
                "linhas_relevantes": relevant_lines(text),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()
