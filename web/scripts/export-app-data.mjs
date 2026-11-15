/**
 * Exports everything the Flutter app shows from the website's own source, so the two never drift:
 * the three languages, the services, guides, answers, tools, cities and the sample ads.
 * Run from web/:  npm run export:app   (writes ../app/assets/data/*.json and copies the demo pictures)
 * The website stays the single source of truth; never edit the JSON files by hand.
 */
import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(web, "..", "app", "assets", "data");
const pictures = join(web, "..", "app", "assets", "demo");

const server = await createServer({
  configFile: false,
  root: web,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false },
  resolve: { alias: { "@": join(web, "src") } },
});

const load = (path) => server.ssrLoadModule(path);
try {
  const [{ en }, { tr }, { ar }, services, guides, help, tools, demo, config, parse] = await Promise.all([
    load("/src/i18n/dictionaries/en.ts"),
    load("/src/i18n/dictionaries/tr.ts"),
    load("/src/i18n/dictionaries/ar.ts"),
    load("/src/lib/services.ts"),
    load("/src/lib/guides.ts"),
    load("/src/lib/help.ts"),
    load("/src/lib/tools.ts"),
    load("/src/lib/data/demo-data.ts"),
    load("/src/site.config.ts"),
    load("/src/lib/parse-post.ts"),
  ]);

  mkdirSync(out, { recursive: true });
  const write = (name, value) => writeFileSync(join(out, name), JSON.stringify(value, null, 1) + "\n");

  write("i18n.json", { tr, en, ar });
  write("catalog.json", {
    site: { name: config.site.name, url: "https://example.com" },
    cities: config.CITIES,
    groups: services.GROUPS,
    services: services.SERVICES,
    tools: tools.TOOLS,
    guides: guides.GUIDES,
    emergency: guides.EMERGENCY,
    help: help.HELP,
    parseWords: parse.PARSE_WORDS,
  });
  write("demo.json", {
    categories: demo.DEMO_CATEGORIES,
    sellers: demo.DEMO_SELLERS,
    listings: demo.DEMO_LISTINGS,
  });

  mkdirSync(pictures, { recursive: true });
  for (const file of readdirSync(join(web, "public", "demo"))) copyFileSync(join(web, "public", "demo", file), join(pictures, file));
  console.log(`Wrote i18n.json, catalog.json, demo.json and ${readdirSync(pictures).length} pictures to app/assets.`);
} finally {
  await server.close();
}
