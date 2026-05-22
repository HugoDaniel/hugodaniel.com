#!/usr/bin/env python3
"""Convert a Zola markdown post to gemtext.

Usage: md2gemini.py < post.md > post.gmi

Mechanical conversion. Output is reviewable; not every post will look
perfect. The five posts we publish to gemini:// are hand-checked.
"""
from __future__ import annotations

import re
import sys

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
EMPH_RE = re.compile(r"\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_")
INLINE_CODE_RE = re.compile(r"`([^`]+)`")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
LIST_RE = re.compile(r"^\s*(?:[-*+]|\d+\.)\s+(.*)$")
BLOCKQUOTE_RE = re.compile(r"^>\s?(.*)$")
FRONTMATTER_FENCE = "+++"


def strip_frontmatter(lines: list[str]) -> tuple[dict[str, str], list[str]]:
    meta: dict[str, str] = {}
    if not lines or lines[0].strip() != FRONTMATTER_FENCE:
        return meta, lines
    end = next(
        (i for i, line in enumerate(lines[1:], start=1) if line.strip() == FRONTMATTER_FENCE),
        None,
    )
    if end is None:
        return meta, lines
    for raw in lines[1:end]:
        if "=" in raw and not raw.lstrip().startswith("#"):
            key, _, value = raw.partition("=")
            meta[key.strip()] = value.strip().strip('"')
    return meta, lines[end + 1 :]


def strip_inline_formatting(text: str) -> str:
    text = INLINE_CODE_RE.sub(r"\1", text)
    text = EMPH_RE.sub(lambda m: next(g for g in m.groups() if g), text)
    return text


def extract_links(text: str) -> tuple[str, list[tuple[str, str]]]:
    links: list[tuple[str, str]] = []

    def repl(match: re.Match[str]) -> str:
        label, url = match.group(1), match.group(2)
        links.append((url, label))
        return label

    return LINK_RE.sub(repl, text), links


def convert(md: str) -> str:
    lines = md.splitlines()
    meta, body = strip_frontmatter(lines)

    out: list[str] = []
    if "title" in meta:
        out.append(f"# {meta['title']}")
        if "date" in meta:
            out.append(f"Published {meta['date']}")
        out.append("")

    in_fence = False
    paragraph: list[str] = []
    pending_links: list[tuple[str, str]] = []

    def flush_paragraph() -> None:
        if paragraph:
            text = " ".join(paragraph).strip()
            if text:
                out.append(strip_inline_formatting(text))
            paragraph.clear()
        for url, label in pending_links:
            out.append(f"=> {url} {label}")
        pending_links.clear()

    for raw in body:
        if raw.startswith("```"):
            flush_paragraph()
            out.append(raw)
            in_fence = not in_fence
            continue
        if in_fence:
            out.append(raw)
            continue

        if not raw.strip():
            flush_paragraph()
            out.append("")
            continue

        img = IMAGE_RE.match(raw.strip())
        if img:
            flush_paragraph()
            alt, url = img.group(1), img.group(2)
            out.append(f"=> {url} {alt or 'image'}")
            continue

        heading = HEADING_RE.match(raw)
        if heading:
            flush_paragraph()
            level = min(len(heading.group(1)), 3)
            title = strip_inline_formatting(heading.group(2))
            title, links = extract_links(title)
            out.append(f"{'#' * level} {title}")
            for url, label in links:
                out.append(f"=> {url} {label}")
            continue

        blockquote = BLOCKQUOTE_RE.match(raw)
        if blockquote:
            flush_paragraph()
            text, links = extract_links(blockquote.group(1))
            out.append(f"> {strip_inline_formatting(text)}")
            pending_links.extend(links)
            continue

        item = LIST_RE.match(raw)
        if item:
            flush_paragraph()
            text, links = extract_links(item.group(1))
            out.append(f"* {strip_inline_formatting(text)}")
            pending_links.extend(links)
            continue

        text, links = extract_links(raw.strip())
        paragraph.append(text)
        pending_links.extend(links)

    flush_paragraph()

    cleaned: list[str] = []
    for line in out:
        if line == "" and cleaned and cleaned[-1] == "":
            continue
        cleaned.append(line)
    return "\n".join(cleaned).rstrip() + "\n"


def main() -> None:
    md = sys.stdin.read()
    sys.stdout.write(convert(md))


if __name__ == "__main__":
    main()
