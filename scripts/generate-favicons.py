"""Build tab icons by scaling logo.png (full mark) onto square canvases."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "assets" / "logo.png"
SITE_ASSETS = ROOT / "assets"
ROOT_ICO = ROOT / "favicon.ico"

BG = (20, 51, 14, 255)  # --green-deep
PAD_RATIO = 0.08


def logo_on_square(source: Image.Image, size: int) -> Image.Image:
    pad = max(1, int(size * PAD_RATIO))
    inner = size - 2 * pad
    scaled = source.copy()
    scaled.thumbnail((inner, inner), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), BG)
    x = (size - scaled.width) // 2
    y = (size - scaled.height) // 2
    canvas.alpha_composite(scaled, (x, y))
    return canvas


def main() -> None:
    logo = Image.open(LOGO).convert("RGBA")
    SITE_ASSETS.mkdir(parents=True, exist_ok=True)

    favicon_jobs = (
        ("favicon-16.png", 16),
        ("favicon-32.png", 32),
        ("apple-touch-icon.png", 180),
    )
    for name, size in favicon_jobs:
        image = logo_on_square(logo, size)
        path = SITE_ASSETS / name
        image.save(path, optimize=True)
        print(f"wrote {path.relative_to(ROOT)} ({size}px)")

    ico_sizes = (48, 32, 16)
    ico_images = [logo_on_square(logo, s) for s in ico_sizes]
    ico_images[0].save(
        ROOT_ICO,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_images[1:],
    )
    print(f"wrote {ROOT_ICO.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
