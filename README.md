# Ladharam Narayandas LLP — Website

Static single-page site for [ladharamnarayandasllp.in](https://ladharamnarayandasllp.in), hosted on **GitHub Pages** from the `main` branch.

## Repository layout

```
├── index.html              # Page markup (sections, content, inline layout tweaks)
├── CNAME                   # Custom domain for GitHub Pages
├── assets/
│   ├── css/
│   │   ├── fonts.css       # @font-face declarations (self-hosted + Google fallbacks)
│   │   └── site.css        # Layout, components, responsive rules, mobile nav
│   ├── js/
│   │   └── site.js         # Brand marquee, mobile menu, enquiry → WhatsApp
│   ├── brands/             # Individual partner logos (PNG)
│   ├── logo.png            # Header logo (transparent background)
│   └── …                   # Fonts, trusted-brands strip, etc.
├── source/
│   └── design-export.html  # Original design-tool export (reference only)
└── scripts/                # Optional build & asset tooling (Python / Node)
```

**Source of truth for the live site:** edit `index.html`, `assets/css/site.css`, and `assets/js/site.js`, then push to `main`. GitHub Pages rebuilds automatically.

## Local preview

Any static file server works. Examples:

```bash
# Python
python -m http.server 8080

# Node (npx, no install)
npx --yes serve .
```

Open `http://localhost:8080` and resize the browser below **960px** to test the hero hamburger menu.

## Deployment

1. Commit changes on `main`.
2. Push to `origin` (`git push origin main`).
3. Confirm build under **Settings → Pages** (or the repo **Actions / Pages** UI). Live URL: `https://ladharamnarayandasllp.in`.

Custom domain DNS (apex + `www`) must point at GitHub Pages; see [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Making changes

| Task | Where to edit |
|------|----------------|
| Copy, section order, IDs for nav anchors | `index.html` |
| Colors, typography, header, marquee, breakpoints | `assets/css/site.css` |
| Mobile menu, form → WhatsApp, marquee logic | `assets/js/site.js` |
| Header logo file | Replace `assets/logo.png`, then run `npm run assets:logo` if the file has a solid background |

### Navigation anchors

Desktop: links in `.hdr-nav`. Mobile (≤960px): header links hidden; use the hamburger on the hero panel. Both target:

- `#about`, `#categories`, `#brands`, `#contact`, `#enquiry`

## Asset scripts (optional)

Requires **Python 3** with [Pillow](https://pypi.org/project/pillow/) for image scripts (`pip install pillow`).

| Command | Script | Purpose |
|---------|--------|---------|
| `npm run assets:logo` | `scripts/prepare-logo.py` | Flood-fill logo background → transparent (matches `#F5ECD8`) |
| `npm run assets:optimize` | `scripts/optimize-images.py` | Resize/compress logo + brand PNGs (run after replacing images) |
| `npm run assets:brands:crop` | `scripts/crop-brand-logos.py` | Crop brand PNGs |
| `npm run assets:brands:trim` | `scripts/trim-brand-logos.py` | Trim empty margins on brand PNGs |
| `npm run assets:brands:strip` | `scripts/make-brand-strip.py` | Build composite brand strip |
| `npm run build:from-export` | `scripts/build-site.mjs` | **Regenerate from `source/design-export.html` (destructive)** |

> **Warning:** `build:from-export` deletes the entire `assets/` folder and overwrites `index.html` and `site.js`. Use only when re-importing from the design export—not for day-to-day edits.

## Design tokens (reference)

| Token | Hex | Usage |
|-------|-----|--------|
| Page background | `#F5ECD8` | Body, header |
| Primary green | `#173F0B` | Hero panel, top bar |
| Accent gold | `#F5B318` | CTAs, ornaments |

## Contributing

1. Branch from `main`, make focused changes.
2. Test desktop and mobile (≤960px), including the mobile menu and enquiry form.
3. Open a PR with a short summary and screenshots for visible UI changes.

## License / credits

Site content © Ladharam Narayandas LLP. Footer credits MB Creatives for design.
