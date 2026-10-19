# Ladharam Narayandas LLP — Website

Static marketing site for Ladharam Narayandas LLP, hosted on **GitHub Pages** from the `main` branch.

| URL | What visitors see |
|-----|-------------------|
| [ladharamnarayandasllp.in](https://ladharamnarayandasllp.in)/ | Full marketing site |
| [ladharamnarayandasllp.in/launch-site/](https://ladharamnarayandasllp.in/launch-site/) | Redirects to `/` (legacy preview URL) |

## Repository layout

```
├── index.html              # Page markup (sections, content)
├── sw.js                   # Service worker (site root)
├── assets/
│   ├── css/                # site.css, motion.css
│   ├── js/site.js          # Marquee, mobile menu, enquiry → WhatsApp
│   ├── brands/             # Partner logos
│   └── …
├── launch-site/
│   └── index.html          # Redirect to / (bookmarks from pre-launch preview)
├── favicon.ico
├── CNAME                   # Custom domain: ladharamnarayandasllp.in (GitHub Pages)
├── robots.txt
├── sitemap.xml
├── source/
│   └── design-export.html  # Original design-tool export (reference only)
└── scripts/                # Optional build & asset tooling (Python / Node)
```

**Source of truth:** edit `index.html`, `assets/css/site.css`, and `assets/js/site.js`, then push to `main`. GitHub Pages rebuilds automatically.

## Local preview

Any static file server works. Examples:

```bash
# Python
python -m http.server 8080

# Node (npx, no install)
npx --yes serve .
```

Open `http://localhost:8080/`. Resize below **960px** to test the hero hamburger menu.

## Deployment

1. Commit changes on `main`.
2. Push to `origin` (`git push origin main`).
3. Confirm build under **Settings → Pages** (or the repo **Actions / Pages** UI). Live URL: `https://ladharamnarayandasllp.in`.

### Custom domain

Point **ladharamnarayandasllp.in** (and optionally `www`) at GitHub Pages using your registrar’s DNS (A/AAAA records for the apex, or CNAME `www` → `<user>.github.io`). The repo `CNAME` file is `ladharamnarayandasllp.in`. In **Settings → Pages**, set the custom domain to match and enable **Enforce HTTPS**. See [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

If you previously used another hostname (e.g. an old preview domain), remove it from **Pages → Custom domain** after DNS is updated.

### Performance, cache & CDN (recommended)

GitHub Pages serves the site globally but does not let you set custom `Cache-Control` headers. For faster repeat visits, edge caching, and basic load spreading:

1. Put **Cloudflare** (free plan) in front of the custom domain with the orange-cloud proxy enabled.
2. Enable **Auto Minify** (HTML/CSS/JS) and **Brotli** in Cloudflare speed settings.
3. Add a **Cache Rule**: cache `/assets/*` for 1 year; bypass cache for `/`, `/index.html`, and `/launch-site/`.
4. After deploy, bump `?v=` on `site.css`, `motion.css`, `site.js`, and the `CACHE` name in `sw.js` when those files change.

The repo includes `sw.js` (stale-while-revalidate for assets), `robots.txt`, `sitemap.xml`, and `.nojekyll`. Run `npm run assets:optimize` after replacing large photos so PNGs/WebP stay web-sized.

## Making changes

| Task | Where to edit |
|------|----------------|
| Copy, section order, IDs for nav anchors | `index.html` |
| Colors, typography, header, marquee, breakpoints | `assets/css/site.css` |
| Mobile menu, form → WhatsApp, marquee logic | `assets/js/site.js` |
| Scroll/split text motion | `assets/css/motion.css`, `initMotion()` in `assets/js/site.js` |
| Header logo / tab icons | Replace `assets/logo.png`; run `npm run assets:favicons` and `npm run assets:logo` if needed |
| Team / category photos | Drop images into `.media-slot` (About) or add `.cat-card__media` later—see `assets/css/site.css` |

### Navigation anchors

Desktop: links in `.hdr-nav`. Mobile (≤960px): header links hidden; use the hamburger on the hero panel. Both target:

- `#about`, `#categories`, `#brands`, `#contact`, `#enquiry`

## Asset scripts (optional)

Requires **Python 3** with [Pillow](https://pypi.org/project/pillow/) for image scripts (`pip install pillow`).

| Command | Script | Purpose |
|---------|--------|---------|
| `npm run assets:logo` | `scripts/prepare-logo.py` | Flood-fill logo background → transparent (matches `#F5ECD8`) |
| `npm run assets:favicons` | `scripts/generate-favicons.py` | Build favicon.ico and PNG tab icons from logo |
| `npm run assets:optimize` | `scripts/optimize-images.py` | Resize/compress logo, brands, product icons, hero photos + WebP (run after replacing images) |
| `npm run assets:brands:crop` | `scripts/crop-brand-logos.py` | Crop brand PNGs |
| `npm run assets:brands:trim` | `scripts/trim-brand-logos.py` | Trim empty margins on brand PNGs |
| `npm run assets:brands:strip` | `scripts/make-brand-strip.py` | Build composite brand strip |
| `npm run build:from-export` | `scripts/build-site.mjs` | **Regenerate from `source/design-export.html` (destructive)** |

> **Warning:** `build:from-export` deletes `assets/` (except backed-up `brands/`) and overwrites `index.html` and `assets/js/site.js`. Use only when re-importing from the design export—not for day-to-day edits.

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

Site content © Ladharam Narayandas LLP. Footer credits [MB Creatives](https://mbcreatives.in) for design.
