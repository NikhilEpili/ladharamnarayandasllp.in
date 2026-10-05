"""Resize and compress PNGs used on the marketing site."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRANDS = ROOT / "assets" / "brands"
LOGO = ROOT / "assets" / "logo.png"
MAX_BRAND = 256
MAX_LOGO = 320


def fit(im: Image.Image, max_side: int) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    scale = min(1.0, max_side / max(w, h))
    if scale >= 1.0:
        return im
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def save_png(im: Image.Image, path: Path) -> None:
    im.save(path, "PNG", optimize=True, compress_level=9)


def optimize_brands() -> None:
    for path in sorted(BRANDS.glob("*.png")):
        before = path.stat().st_size
        im = fit(Image.open(path), MAX_BRAND)
        save_png(im, path)
        after = path.stat().st_size
        print(f"{path.name}: {before // 1024}KB -> {after // 1024}KB {im.size}")


def optimize_logo() -> None:
    before = LOGO.stat().st_size
    im = fit(Image.open(LOGO), MAX_LOGO)
    save_png(im, LOGO)
    after = LOGO.stat().st_size
    print(f"logo.png: {before // 1024}KB -> {after // 1024}KB {im.size}")


def main() -> None:
    optimize_logo()
    optimize_brands()
    print("Done.")


if __name__ == "__main__":
    main()
