"""Trim empty margins from assets/brands/*.png (re-run after crop)."""
from pathlib import Path
from PIL import Image, ImageChops

BRANDS = Path(__file__).resolve().parents[1] / "assets" / "brands"


def trim(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 0))
    diff = ImageChops.difference(im, bg)
    bbox = diff.getbbox()
    if not bbox:
        return im
    return im.crop(bbox)


def main() -> None:
    for path in sorted(BRANDS.glob("*.png")):
        im = Image.open(path)
        out = trim(im)
        if out.size != im.size:
            out.save(path, "PNG")
            print(path.name, im.size, "->", out.size)
    print("Done.")


if __name__ == "__main__":
    main()
