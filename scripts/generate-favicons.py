"""Build tab icons from the circular emblem on the left of assets/logo.png."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "launch-site" / "assets" / "logo.png"
ASSETS = ROOT / "launch-site" / "assets"
ROOT_ICO = ROOT / "favicon.ico"

BG = (20, 51, 14, 255)  # --green-deep
PAD_RATIO = 0.06


def emblem_square(source: Image.Image) -> Image.Image:
    w, h = source.size
    side = min(w, h)
    crop = source.crop((0, 0, side, side))
    alpha = crop.split()[3]
    bbox = alpha.getbbox()
    if bbox:
        crop = crop.crop(bbox)
    return crop


def on_brand_square(emblem: Image.Image, size: int) -> Image.Image:
    pad = max(1, int(size * PAD_RATIO))
    inner = size - 2 * pad
    scaled = emblem.copy()
    scaled.thumbnail((inner, inner), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), BG)
    x = (size - scaled.width) // 2
    y = (size - scaled.height) // 2
    canvas.alpha_composite(scaled, (x, y))
    return canvas


def main() -> None:
    logo = Image.open(LOGO).convert("RGBA")
    emblem = emblem_square(logo)

    for path, size in (
        (ASSETS / "favicon-16.png", 16),
        (ASSETS / "favicon-32.png", 32),
        (ASSETS / "apple-touch-icon.png", 180),
    ):
        on_brand_square(emblem, size).save(path, optimize=True)
        print(f"wrote {path.relative_to(ROOT)} ({size}px)")

    ico_sizes = (48, 32, 16)
    ico_images = [on_brand_square(emblem, s) for s in ico_sizes]
    ico_images[0].save(
        ROOT_ICO,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_images[1:],
    )
    print(f"wrote {ROOT_ICO.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
