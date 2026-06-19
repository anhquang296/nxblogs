#!/usr/bin/env python3
"""List the SAA study corpus by tag tier so the verifier can route a claim to its likely home post.

Scans content/{vi,en}/posts/*.mdx, reads frontmatter, and groups posts into two tiers:
  - PRIMARY: posts tagged 'Exam Prep' (the exam-prep map the user is curating)
  - SECONDARY: posts tagged 'SAA' but NOT 'Exam Prep' (exam-relevant knowledge that lives elsewhere)

A post's knowledge is identical across locales, so posts are deduped by slug. Title and
description are read from the English file when present (richer for routing), otherwise Vietnamese.
The locales each slug exists in are reported so the verifier knows where the source of truth lives
(Vietnamese is always the source of truth in this blog).

Usage:
  python3 list_exam_posts.py            # human-readable, run from repo root or anywhere
  python3 list_exam_posts.py --json     # machine-readable
"""

import json
import re
import sys
from pathlib import Path


def find_repo_root(start: Path) -> Path:
    for parent in [start, *start.parents]:
        if (parent / "content").is_dir() and (parent / "CLAUDE.md").is_file():
            return parent
    return start


def parse_frontmatter(text: str) -> dict:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end]
    fm: dict = {}

    title = re.search(r"^title:\s*(.+)$", block, re.MULTILINE)
    if title:
        fm["title"] = title.group(1).strip().strip("'\"")

    desc = re.search(r"^description:\s*(.+)$", block, re.MULTILINE)
    if desc:
        fm["description"] = desc.group(1).strip().strip("'\"")

    tags_line = re.search(r"^tags:\s*\[(.*)\]", block, re.MULTILINE)
    if tags_line:
        fm["tags"] = [t.strip().strip("'\"") for t in tags_line.group(1).split(",") if t.strip()]
    else:
        fm["tags"] = []

    return fm


def collect(root: Path) -> dict:
    posts: dict = {}
    for lang in ("vi", "en"):
        posts_dir = root / "content" / lang / "posts"
        if not posts_dir.is_dir():
            continue
        for path in sorted(posts_dir.glob("*.mdx")):
            slug = path.stem
            if slug == "index":
                continue
            fm = parse_frontmatter(path.read_text(encoding="utf-8", errors="replace"))
            entry = posts.setdefault(
                slug,
                {"slug": slug, "tags": [], "title": "", "description": "", "locales": []},
            )
            entry["locales"].append(lang)
            if fm.get("tags"):
                entry["tags"] = fm["tags"]
            # Prefer English title/description for routing; fill from whichever appears first otherwise.
            if lang == "en" or not entry["title"]:
                entry["title"] = fm.get("title", entry["title"])
                entry["description"] = fm.get("description", entry["description"])
    return posts


def main() -> None:
    as_json = "--json" in sys.argv
    root = find_repo_root(Path(__file__).resolve())
    posts = collect(root)

    primary, secondary = [], []
    for entry in posts.values():
        tags = entry["tags"]
        if "Exam Prep" in tags:
            primary.append(entry)
        elif "SAA" in tags:
            secondary.append(entry)

    primary.sort(key=lambda e: e["slug"])
    secondary.sort(key=lambda e: e["slug"])

    if as_json:
        print(json.dumps({"primary": primary, "secondary": secondary}, ensure_ascii=False, indent=2))
        return

    def render(group: list) -> None:
        for e in group:
            locales = "+".join(e["locales"])
            print(f"  [{e['slug']}]  ({locales})")
            print(f"    title: {e['title']}")
            if e["description"]:
                print(f"    desc:  {e['description']}")
            print()

    print(f"Repo root: {root}")
    print()
    print(f"=== PRIMARY corpus — tag 'Exam Prep' ({len(primary)} posts) ===")
    print("These are the exam-prep map posts. A claim that belongs in one of these but is")
    print("absent or only partially covered is a real gap.")
    print()
    render(primary)
    print(f"=== SECONDARY corpus — tag 'SAA', not 'Exam Prep' ({len(secondary)} posts) ===")
    print("Exam-relevant knowledge that already lives here. If a claim is covered only here,")
    print("it exists in the blog but is not in the Exam Prep map yet.")
    print()
    render(secondary)


if __name__ == "__main__":
    main()
