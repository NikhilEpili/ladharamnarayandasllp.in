/**
 * Regenerates index.html from source/design-export.html.
 * WARNING: Deletes assets/ except what the bundle extracts — backs up brands/ first.
 * Prefer editing index.html + assets/css + assets/js directly (see README.md).
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { promisify } from "util";

const gunzip = promisify(zlib.gunzip);
const ROOT = path.resolve(import.meta.dirname, "..");
const SITE_DIR = path.join(ROOT, "launch-site");
const BUNDLE = path.join(ROOT, "source", "design-export.html");
const ASSETS_DIR = path.join(SITE_DIR, "assets");

const ASSET_MAP = {
  "3cf73a2e-8259-4e5f-af37-86daf95b0677": "logo.jpg",
  "baf13f92-a5e7-4d86-8493-53a6c2ed8e78": "cinzel-500.woff2",
  "2ba4eb61-f38f-4714-87fe-cc7123953846": "eb-garamond.woff2",
  "619d4363-fa20-44ec-888f-9b4a3560a719": "im-fell-english.woff2",
  "f7168d40-67e8-4549-9bdb-9d74ea611aba": "im-fell-english-italic.woff2",
};

const SKIP_UUID = new Set([
  "fe5ccf78-65fa-4fd8-a630-21a56452b648",
  "2dd3ca81-1608-4eb7-9fbd-f75a7a5776a1",
  "16700949-410a-4aaf-87d6-a06a80289e01",
]);

function extractScript(html, type) {
  const re = new RegExp(
    `<script type="${type.replace(/\//g, "\\/")}">([\\s\\S]*?)<\\/script>`
  );
  const m = html.match(re);
  return m ? JSON.parse(m[1]) : null;
}

async function decodeEntry(entry) {
  let bytes = Buffer.from(entry.data, "base64");
  if (entry.compressed) bytes = await gunzip(bytes);
  return bytes;
}

function joinTemplate(raw) {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.join("");
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => raw[k])
    .join("");
}

function extForMime(mime) {
  if (/jpeg|jpg/i.test(mime)) return ".jpg";
  if (/png/i.test(mime)) return ".png";
  if (/woff2/i.test(mime)) return ".woff2";
  if (/woff/i.test(mime)) return ".woff";
  return ".bin";
}

function toStaticHtml(template) {
  let html = template;

  html = html.replace(
    /<script src="(?:assets\/)?fe5ccf78[^"]*"><\/script>\s*/gi,
    ""
  );
  html = html.replace(
    /<meta name="hz:[^"]*"[^>]*>/gi,
    ""
  );

  const helmet = html.match(/<helmet>([\s\S]*?)<\/helmet>/i);
  if (helmet) {
    html = html.replace(/<helmet>[\s\S]*?<\/helmet>\s*/i, "");
    html = html.replace("</head>", `${helmet[1]}</head>`);
  }

  html = html.replace(/<\/?x-dc>\s*/gi, "");
  html = html.replace(
    /<script type="text\/x-dc"[\s\S]*?<\/script>\s*/i,
    ""
  );

  html = html.replace(/<sc-raw-select/gi, "<select");
  html = html.replace(/<\/sc-raw-select>/gi, "</select>");

  html = html.replace(
    /(<div style="color:#173F0B)/,
    '<div id="top" style="color:#173F0B'
  );

  const maps =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Shree Rajlaxmi Complex, Kalher, Bhiwandi, Thane, Maharashtra 421302"
    );

  html = html.replace(
    /<a class="btn gold" href="#" style="background:#245A12;color:#F5ECD8;border-color:#245A12">WhatsApp Us<\/a>/g,
    `<a class="btn gold" href="https://wa.me/918928351313" target="_blank" rel="noopener noreferrer" style="background:#245A12;color:#F5ECD8;border-color:#245A12">WhatsApp Us</a>`
  );
  html = html.replace(
    /<a class="btn" href="#" style="color:#245A12;border-color:#245A12">Get Directions<\/a>/g,
    `<a class="btn" href="${maps}" target="_blank" rel="noopener noreferrer" style="color:#245A12;border-color:#245A12">Get Directions</a>`
  );
  html = html.replace(
    /<a href="#">8928351313 \/ 8976053099<\/a>/g,
    '<a href="tel:+918928351313">8928351313</a> · <a href="tel:+918976053099">8976053099</a>'
  );

  html = html.replace(
    /<head>\s*<meta charset="utf-8">/i,
    `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Ladharam Narayandas LLP — your trusted HoReCa supply partner since 1957. Grocery, food products, syrups and juices for hospitality across Mumbai and Thane.">`
  );

  const responsive = `
<style>
@media (max-width: 900px) {
  .fd[style*="font-size:78px"] { font-size: clamp(2rem, 9vw, 3.25rem) !important; }
  .fd[style*="font-size:56px"] { font-size: clamp(1.75rem, 6vw, 2.5rem) !important; }
  .fd[style*="font-size:34px"] { font-size: clamp(1.35rem, 5vw, 2rem) !important; }
  .sec { padding: 72px 0; }
  .w { padding: 0 20px; }
  .nv { gap: 16px !important; }
  .st b { font-size: 46px; }
}
html { scroll-behavior: smooth; }
select.in { appearance: none; cursor: pointer; }
</style>
<script src="assets/js/site.js" defer></script>
`;

  html = html.replace("</head>", `${responsive}</head>`);

  html = html.replace(
    /<\/footer>\s*<\/div>\s*<\/body>/,
    `</footer>
<p style="text-align:center;padding:20px 16px 28px;margin:0;font:400 14px 'EB Garamond',Georgia,serif;color:#8A7A4E;background:#0F2B07">Website designed by MB Creatives</p>
</div>
</body>`
  );

  return html;
}

async function main() {
  if (!fs.existsSync(BUNDLE)) {
    console.error("Missing bundle:", BUNDLE);
    process.exit(1);
  }

  const html = fs.readFileSync(BUNDLE, "utf8");
  const manifest = extractScript(html, "__bundler/manifest");
  let template = joinTemplate(extractScript(html, "__bundler/template"));

  const brandsDir = path.join(ASSETS_DIR, "brands");
  let brandsBackup = null;
  if (fs.existsSync(brandsDir)) {
    brandsBackup = fs.mkdtempSync(path.join(ROOT, ".brands-backup-"));
    fs.cpSync(brandsDir, path.join(brandsBackup, "brands"), { recursive: true });
  }
  if (fs.existsSync(ASSETS_DIR)) {
    fs.rmSync(ASSETS_DIR, { recursive: true });
  }
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  if (brandsBackup) {
    fs.cpSync(path.join(brandsBackup, "brands"), brandsDir, { recursive: true });
    fs.rmSync(brandsBackup, { recursive: true });
  }

  for (const uuid of Object.keys(manifest)) {
    if (SKIP_UUID.has(uuid)) continue;

    const entry = manifest[uuid];
    const bytes = await decodeEntry(entry);
    const mime = entry.mime || "";
    const name =
      ASSET_MAP[uuid] || `${uuid}${extForMime(mime)}`;
    const rel = `assets/${name}`;
    fs.writeFileSync(path.join(SITE_DIR, rel), bytes);

    template = template.split(uuid).join(rel.replace(/\\/g, "/"));
  }

  template = template.replace(/\sintegrity="[^"]*"/gi, "");
  template = template.replace(/\scrossorigin="[^"]*"/gi, "");

  for (const uuid of SKIP_UUID) {
    template = template.replace(
      new RegExp(`<script src="(?:assets/)?${uuid}"[^>]*>\\s*</script>\\s*`, "gi"),
      ""
    );
  }

  template = toStaticHtml(template);

  fs.writeFileSync(path.join(SITE_DIR, "index.html"), template, "utf8");

  const siteJs = `document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#enquiry form");
  if (!form) return;
  var btn = form.querySelector('button[type="button"]');
  if (!btn) return;
  btn.addEventListener("click", function () {
    var biz = (document.getElementById("biz") || {}).value || "";
    var ph = (document.getElementById("ph") || {}).value || "";
    var loc = (document.getElementById("loc") || {}).value || "";
    var bt = (document.getElementById("bt") || {}).value || "";
    var msg = (document.getElementById("msg") || {}).value || "";
    var lines = [
      "Supply enquiry — Ladharam Narayandas LLP",
      biz && "Business: " + biz,
      ph && "Phone: " + ph,
      loc && "Location: " + loc,
      bt && "Business type: " + bt,
      msg && "Requirements: " + msg,
    ].filter(Boolean);
    var url =
      "https://wa.me/918928351313?text=" +
      encodeURIComponent(lines.join("\\n"));
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
`;
  fs.mkdirSync(path.join(ASSETS_DIR, "js"), { recursive: true });
  fs.writeFileSync(path.join(ASSETS_DIR, "js", "site.js"), siteJs, "utf8");

  console.log("Built static site → index.html");
  console.log("Assets:", fs.readdirSync(ASSETS_DIR).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
