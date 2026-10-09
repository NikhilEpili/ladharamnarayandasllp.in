"""Remove solid logo background so it blends with site (#F5ECD8)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "launch-site" / "assets" / "logo.png"
TOLERANCE = 22


def main() -> None:
    im = Image.open(LOGO).convert("RGBA")
    px = im.load()
    w, h = im.size

    def rgb_at(x: int, y: int) -> tuple[int, int, int]:
        return px[x, y][:3]

    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    bg_samples = {rgb_at(x, y) for x, y in seeds}

    def matches_bg(r: int, g: int, b: int) -> bool:
        for br, bg, bb in bg_samples:
            if (
                abs(r - br) <= TOLERANCE
                and abs(g - bg) <= TOLERANCE
                and abs(b - bb) <= TOLERANCE
            ):
                return True
        return False

    seen = set()
    q: deque[tuple[int, int]] = deque(seeds)
    while q:
        x, y = q.popleft()
        if (x, y) in seen or x < 0 or y < 0 or x >= w or y >= h:
            continue
        seen.add((x, y))
        r, g, b, a = px[x, y]
        if not matches_bg(r, g, b):
            continue
        px[x, y] = (r, g, b, 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    out = LOGO.with_name("logo-transparent.png")
    im.save(out, "PNG")
    try:
        out.replace(LOGO)
        print(f"Updated {LOGO} ({w}x{h}) with transparent background.")
    except OSError:
        print(f"Wrote {out} — close logo.png in the editor, then re-run to replace.")


if __name__ == "__main__":
    main()
