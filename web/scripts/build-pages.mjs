/**
 * Builds a static copy of the website for GitHub Pages into ../site, served at /adada/site/.
 *
 *   node scripts/build-pages.mjs [base]      (default base: /adada/site)
 *
 * GitHub Pages cannot run a server, so three server-only parts are set aside during the build and
 * put back afterwards: the language redirect (src/proxy.ts), the WhatsApp click counter
 * (src/app/[lang]/l/[id]/wa) and the catch-all "page not found" route. In the static copy, pages read
 * the address in the browser, and a small page at the root picks the visitor's language. The normal
 * server build is not changed.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "/adada/site";
const web = new URL("..", import.meta.url).pathname;
const out = join(web, "..", "site");
const aside = join(tmpdir(), `pages-aside-${process.pid}`);
const serverOnly = ["src/proxy.ts", "src/app/[lang]/l/[id]/wa", "src/app/[lang]/[...rest]"];
// Files that a static export must prepare at build time; marked so only while the build runs,
// because the server build's cacheComponents mode does not allow the marker.
const forceStatic = ["src/app/manifest.ts", "src/app/[lang]/embed/[slug]/route.ts"];

mkdirSync(aside, { recursive: true });
const moved = [];
const patched = [];
try {
  for (const rel of forceStatic) {
    const file = join(web, rel);
    const original = readFileSync(file, "utf8");
    patched.push([file, original]);
    writeFileSync(file, `export const dynamic = "force-static";\n${original}`);
  }
  for (const rel of serverOnly) {
    const from = join(web, rel);
    if (!existsSync(from)) continue;
    const to = join(aside, rel.replaceAll("/", "__"));
    renameSync(from, to);
    moved.push([to, from]);
  }
  rmSync(join(web, ".next"), { recursive: true, force: true });
  execSync("npx next build", {
    cwd: web,
    stdio: "inherit",
    env: { ...process.env, PAGES_BASE: base, NEXT_PUBLIC_BASE_PATH: base, NEXT_PUBLIC_STATIC_SITE: "1" },
  });
} finally {
  for (const [file, original] of patched) writeFileSync(file, original);
  for (const [from, to] of moved) renameSync(from, to);
  rmSync(aside, { recursive: true, force: true });
}

rmSync(out, { recursive: true, force: true });
cpSync(join(web, "out"), out, { recursive: true });
rmSync(join(web, "out"), { recursive: true, force: true });
// The root of the site: send the visitor to their language, as the server's proxy does.
writeFileSync(
  join(out, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>Adada</title><meta name="viewport" content="width=device-width,initial-scale=1">
<script>
var l = (navigator.languages || [navigator.language || ""]).map(function (x) { return x.slice(0, 2).toLowerCase(); });
var lang = l.find(function (x) { return x === "tr" || x === "en" || x === "ar"; }) || "tr";
location.replace("${base}/" + lang + "/" + location.hash);
</script>
<a href="${base}/tr/">Türkçe</a> · <a href="${base}/en/">English</a> · <a href="${base}/ar/">العربية</a>
`,
);
writeFileSync(join(out, ".nojekyll"), "");
console.log(`Static site written to ../site (base ${base})`);
