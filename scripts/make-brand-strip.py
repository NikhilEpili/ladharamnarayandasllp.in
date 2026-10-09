"""Build assets/trusted-brands.png (placeholder grid).

To use your real brand banner: save it as assets/trusted-brands.png, then run:
  python scripts/crop-brand-logos.py
That refreshes assets/brands/*.png for the marquee on the site.
"""
from PIL import Image, ImageDraw, ImageFont

BRANDS = [
    "Sarwar", "Testo", "Monin", "Manama", "Meal Time", "Everest", "MDH",
    "Unilever", "Lee Kum Kee", "VKL", "Samrat", "Society", "Gowardhan",
    "Hershey's", "Woh Hup", "Sams", "Marimbula", "Nestlé", "Badshah",
    "D'lecta", "Ching's Secret",
]

W, H = 2800, 200
BG = (245, 236, 216)
BORDER = (205, 185, 138)
TEXT = (23, 63, 11)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype("arial.ttf", 22)
    font_sm = ImageFont.truetype("arial.ttf", 16)
except OSError:
    font = ImageFont.load_default()
    font_sm = font

cols, rows = 11, 2
cell_w, cell_h = W // cols, H // rows
for i, name in enumerate(BRANDS):
    row, col = divmod(i, cols)
    if row >= rows:
        break
    x, y = col * cell_w + 8, row * cell_h + 8
    cw, ch = cell_w - 16, cell_h - 16
    draw.rounded_rectangle([x, y, x + cw, y + ch], radius=12, fill=(255, 252, 245), outline=BORDER, width=1)
    f = font_sm if len(name) > 12 else font
    bbox = draw.textbbox((0, 0), name, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((x + (cw - tw) / 2, y + (ch - th) / 2), name, fill=TEXT, font=f)

out = __import__("pathlib").Path(__file__).resolve().parents[1] / "launch-site" / "assets" / "trusted-brands.png"
img.save(out, "PNG")
print("Wrote", out)
