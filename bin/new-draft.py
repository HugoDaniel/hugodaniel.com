#!/usr/bin/env python3
"""Create a new draft post in content/posts/ with today's date and a title.

Usage:
    bin/new-draft.py "My Post Title"
    make draft title="My Post Title"

The filename follows the YYYY-MM-DD-slug.md convention and the frontmatter
matches recent posts. Refuses to overwrite an existing file.

Drafts carry `draft = true`, so Zola skips them in a normal build (never
deployed, never in the feed). Preview them with `zola serve --drafts`.
"""
import datetime
import pathlib
import re
import sys
import unicodedata

POSTS_DIR = pathlib.Path(__file__).resolve().parent.parent / "content" / "posts"
PLACE = "Amadora"
AUTHOR = "Hugo Daniel"


def slugify(title: str) -> str:
    slug = title.strip().lower()
    # fold accents to ASCII (é -> e) so slugs/URLs stay plain ascii
    slug = unicodedata.normalize("NFKD", slug).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^\w\s-]", "", slug)   # drop punctuation
    slug = re.sub(r"[\s_]+", "-", slug)    # spaces/underscores -> hyphen
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def main() -> int:
    title = " ".join(sys.argv[1:]).strip()
    if not title:
        print('usage: new-draft.py "Post Title"', file=sys.stderr)
        return 1

    slug = slugify(title)
    if not slug:
        print("error: title produced an empty slug", file=sys.stderr)
        return 1

    today = datetime.date.today()
    path = POSTS_DIR / f"{today.isoformat()}-{slug}.md"
    if path.exists():
        print(f"error: {path} already exists", file=sys.stderr)
        return 1

    front = (
        "+++\n"
        f'title = "{title}"\n'
        'description = ""\n'
        f"date = {today.isoformat()}\n"
        "draft = true\n"
        f'extra = {{ place = "{PLACE}", author = "{AUTHOR}", '
        'social_img = "/images/hugo_dog.jpg", class = "narrow-media", modules = [] }\n'
        "+++\n\n"
    )
    path.write_text(front)
    print(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
