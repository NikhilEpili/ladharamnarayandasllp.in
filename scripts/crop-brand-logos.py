"""Crop 11×2 brand grid from assets/trusted-brands.png into assets/brands/*.png"""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "launch-site" / "assets" / "trusted-brands.png"
OUT = ROOT / "launch-site" / "assets" / "brands"
SLUGS = [
    "sarwar", "testo", "monin", "manama", "meal-time", "everest", "mdh",
    "unilever", "lee-kum-kee", "vkl", "samrat", "society", "gowardhan",
    "hersheys", "woh-hup", "sams", "marimbula", "nestle", "badshah",
    "dlecta", "chings-secret",
]
COLS, ROWS = 11, 2
PAD = 6

def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing {SRC}")
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    cw, ch = w // COLS, h // ROWS
    OUT.mkdir(parents=True, exist_ok=True)
    for i, slug in enumerate(SLUGS):
        row, col = divmod(i, COLS)
        if row >= ROWS:
            break
        x0, y0 = col * cw + PAD, row * ch + PAD
        x1, y1 = (col + 1) * cw - PAD, (row + 1) * ch - PAD
        box = im.crop((x0, y0, x1, y1))
        bg = Image.new("RGBA", box.size, (255, 255, 255, 0))
        diff = ImageChops.difference(box.convert("RGBA"), bg)
        trim = diff.getbbox()
        if trim:
            box = box.crop(trim)
        box.save(OUT / f"{slug}.png", "PNG")
    print(f"Cropped {len(SLUGS)} logos to {OUT}")

if __name__ == "__main__":
    main()
