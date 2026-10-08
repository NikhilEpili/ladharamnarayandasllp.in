"""Resize and compress PNGs used on the marketing site."""
from __future__ import annotations

import os
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
BRANDS = ASSETS / "brands"
PRODUCTS = ASSETS / "products"
LOGO = ASSETS / "logo.png"
MAX_BRAND = 256
MAX_LOGO = 320
MAX_PRODUCT = 320
MAX_HERO_WIDTH = 1200
HERO_BASENAMES = ("Warehouse Team Portrait at Supplier Entrance",)
WEBP_QUALITY = 82
JPEG_QUALITY = 85


def fit(im: Image.Image, max_side: int) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    scale = min(1.0, max_side / max(w, h))
    if scale >= 1.0:
        return im
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def fit_width(im: Image.Image, max_width: int) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    if w <= max_width:
        return im
    scale = max_width / w
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def _atomic_save(im: Image.Image, path: Path, **kwargs) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(suffix=path.suffix, dir=path.parent)
    os.close(fd)
    tmp_path = Path(tmp)
    try:
        im.save(tmp_path, **kwargs)
        tmp_path.replace(path)
    finally:
        if tmp_path.exists():
            tmp_path.unlink(missing_ok=True)


def save_png(im: Image.Image, path: Path) -> None:
    _atomic_save(im, path, format="PNG", optimize=True, compress_level=9)


def save_webp(im: Image.Image, path: Path) -> None:
    rgb = im.convert("RGB")
    _atomic_save(rgb, path, format="WEBP", quality=WEBP_QUALITY, method=6)


def report(path: Path, before: int, after: int, size: tuple[int, int]) -> None:
    print(f"{path.name}: {before // 1024}KB -> {after // 1024}KB {size}")


def optimize_brands() -> None:
    if not BRANDS.is_dir():
        return
    for path in sorted(BRANDS.glob("*.png")):
        before = path.stat().st_size
        im = fit(Image.open(path), MAX_BRAND)
        save_png(im, path)
        after = path.stat().st_size
        report(path, before, after, im.size)


def optimize_logo() -> None:
    if not LOGO.is_file():
        return
    before = LOGO.stat().st_size
    im = fit(Image.open(LOGO), MAX_LOGO)
    save_png(im, LOGO)
    after = LOGO.stat().st_size
    report(LOGO, before, after, im.size)


def optimize_products() -> None:
    if not PRODUCTS.is_dir():
        return
    for path in sorted(PRODUCTS.glob("*.png")):
        before = path.stat().st_size
        im = fit(Image.open(path), MAX_PRODUCT)
        save_png(im, path)
        after = path.stat().st_size
        report(path, before, after, im.size)


def save_jpeg(im: Image.Image, path: Path) -> None:
    rgb = im.convert("RGB")
    _atomic_save(rgb, path, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def optimize_hero_photos() -> None:
    for base in HERO_BASENAMES:
        path = None
        for ext in (".png", ".jpg", ".jpeg", ".webp"):
            candidate = ASSETS / f"{base}{ext}"
            if candidate.is_file():
                path = candidate
                break
        if path is None:
            continue
        before = path.stat().st_size
        im = fit_width(Image.open(path), MAX_HERO_WIDTH)
        webp_path = ASSETS / f"{base}.webp"
        jpg_path = ASSETS / f"{base}.jpg"
        save_webp(im, webp_path)
        save_jpeg(im, jpg_path)
        webp_size = webp_path.stat().st_size
        jpg_size = jpg_path.stat().st_size
        print(f"{base}: {before // 1024}KB -> webp {webp_size // 1024}KB, jpg {jpg_size // 1024}KB {im.size}")
        if path.suffix.lower() == ".png":
            path.unlink(missing_ok=True)


def main() -> None:
    optimize_logo()
    optimize_brands()
    optimize_products()
    optimize_hero_photos()
    print("Done.")


if __name__ == "__main__":
    main()
