# Ladharam Narayandas LLP — Website

Production marketing site for **Ladharam Narayandas LLP**, a HoReCa supplier in Mumbai and Thane since 1957.

**Live:** [https://ladharamnarayandasllp.in](https://ladharamnarayandasllp.in)

Hosted on **GitHub Pages** from the `main` branch. The `CNAME` file pins the custom domain `ladharamnarayandasllp.in`.

| URL | Purpose |
|-----|---------|
| `/` | Homepage and full site |
| `/launch-site/` | Redirect to `/` (legacy pre-launch preview URL) |

## Repository layout

```
├── index.html              # Page markup, SEO meta, JSON-LD
├── sw.js                   # Service worker (root scope)
├── favicon.ico
├── assets/
│   ├── css/                # site.css, motion.css
│   ├── js/site.js          # Nav, marquee, enquiry → WhatsApp, motion, SW register
│   ├── logo.png
│   ├── brands/             # Partner logo PNGs
│   └── products/           # Category card images
├── launch-site/
│   └── index.html          # Meta refresh redirect → /
├── CNAME                   # ladharamnarayandasllp.in
├── robots.txt
├── sitemap.xml
├── .nojekyll               # Allow GitHub Pages to serve paths as-is
├── source/
│   └── design-export.html  # Original design export (reference / rebuild only)
├── scripts/                # Optional Python & Node tooling
└── package.json            # npm script aliases for scripts/
```

**Day-to-day edits:** change `index.html`, `assets/css/site.css`, and `assets/js/site.js`, then push to `main`. GitHub Pages redeploys automatically (usually within a couple of minutes).

## Local preview

From the repo root:

```bash
python -m http.server 8080
# or
npx --yes serve .
```

Open [http://localhost:8080/](http://localhost:8080/). Test at **≤960px** width for the hero hamburger menu and mobile layout.

## Deployment

1. Commit on `main`.
2. `git push origin main`
3. Confirm under the repo **Settings → Pages** (source: `main`, root `/`).

### Custom domain & DNS

Point **ladharamnarayandasllp.in** at GitHub Pages (apex A/AAAA records or `www` CNAME to `<user>.github.io`). In **Settings → Pages**, set the custom domain to `ladharamnarayandasllp.in` and enable **Enforce HTTPS**. See [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

### Cache busting after a deploy

When CSS, JS, or the service worker changes, bump version query strings in `index.html` (`site.css?v=`, `motion.css?v=`, `site.js?v=`, and `sw.js?v=` in `site.js`) and the `CACHE` constant in `sw.js` so browsers and the SW pick up fresh files.

### Cloudflare (optional)

GitHub Pages does not expose custom `Cache-Control` headers. With Cloudflare in front of the domain:

1. Proxy the domain (orange cloud).
2. Cache **`/assets/*`** aggressively (e.g. 1 year).
3. Bypass cache for **`/`**, **`/index.html`**, and **`/launch-site/`**.

Run `npm run assets:optimize` after replacing large photos so PNGs and WebP stay web-sized.

## What to edit

| Task | File(s) |
|------|---------|
| Copy, sections, nav anchor IDs | `index.html` |
| Footer Instagram / Facebook URLs | `index.html` (`.ft-social` block) |
| MB Creatives credit link | `index.html` (`.site-credit`) |
| Layout, colors, typography, responsive rules | `assets/css/site.css` |
| Mobile menu, marquees, enquiry form, motion | `assets/js/site.js` |
| Scroll / split-text animation styles | `assets/css/motion.css` |
| Header logo | `assets/logo.png` → `npm run assets:favicons` (and `npm run assets:logo` if the PNG has a solid background) |
| Brand logos | `assets/brands/` |
| Category images | `assets/products/` |

### In-page navigation

Desktop: `.hdr-nav`. Mobile (≤960px): hamburger on the hero panel. Anchors: `#about`, `#categories`, `#brands`, `#contact`, `#enquiry`.

### External profiles (footer)

- Instagram: [instagram.com/ladharamnarayandasllp](https://www.instagram.com/ladharamnarayandasllp/)
- Facebook: [facebook.com profile](https://www.facebook.com/profile.php?id=61594725428458)

## npm scripts

Requires **Node 18+**. Image scripts need **Python 3** and [Pillow](https://pypi.org/project/pillow/) (`pip install pillow`).

| Command | Purpose |
|---------|---------|
| `npm run assets:logo` | Make logo background transparent (`scripts/prepare-logo.py`) |
| `npm run assets:favicons` | Regenerate `favicon.ico` and PNG icons from `assets/logo.png` |
| `npm run assets:optimize` | Compress hero, logo, brand, and product images + WebP |
| `npm run assets:brands:crop` | Crop brand PNGs from a composite strip |
| `npm run assets:brands:trim` | Trim empty margins on brand PNGs |
| `npm run assets:brands:strip` | Build composite brand strip |
| `npm run build:from-export` | **Destructive:** rebuild from `source/design-export.html` |

> **Warning:** `build:from-export` removes most of `assets/` (keeps a backup of `brands/`) and overwrites `index.html` and `assets/js/site.js`. Use only when re-importing from the design export—not for routine updates.

## Design tokens

| Token | Hex | Usage |
|-------|-----|--------|
| Page background | `#F5ECD8` | Body, header |
| Primary green | `#173F0B` | Hero panel, top bar |
| Deep footer green | `#0F2B07` / `#14330e` | Footer, theme-color |
| Accent gold | `#F5B318` | CTAs, ornaments |

## Contributing

1. Branch from `main`.
2. Test desktop and mobile (≤960px), including the enquiry form (WhatsApp handoff).
3. Open a PR with a short summary and screenshots for visible UI changes.

## Credits

Site content © Ladharam Narayandas LLP. Website design by [MB Creatives](https://mbcreatives.in).
