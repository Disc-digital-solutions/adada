import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDictionary } from "@/i18n";
import { LANGS, dirOf, isLang } from "@/i18n/config";
import { priceText } from "@/components/PriceTag";
import { getRepo } from "@/lib/data";
import { site } from "@/site.config";
import { DEMO_SELLERS } from "@/lib/data/demo-data";

/**
 * The embed widget (BIZ-15): a business puts its ads on its own website with one <iframe>.
 * A plain, self-contained page without the site's header and footer, so it fits any website.
 * Each ad opens on our site in a new tab, where the WhatsApp tap is counted.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Every sample shop, so the static site can prepare a widget for each. */
export function generateStaticParams() {
  return LANGS.flatMap((lang) => Object.values(DEMO_SELLERS).map((seller) => ({ lang, slug: seller.shopSlug })));
}

export async function GET(_request: NextRequest, context: RouteContext<"/[lang]/embed/[slug]">) {
  const { lang, slug } = await context.params;
  if (!isLang(lang)) return new NextResponse(null, { status: 404 });
  const shop = await getRepo().shop(slug, Date.now());
  if (!shop) return new NextResponse("Not found", { status: 404 });
  const t = getDictionary(lang);

  const cards = shop.listings
    .filter((l) => l.status === "live")
    .map((l) => {
      const price = priceText(l, lang, t);
      const photo = l.photos[0] ? `<img src="${esc(site.url + l.photos[0])}" alt="" loading="lazy">` : `<div class="ph"></div>`;
      return `<a class="card" href="${esc(`${site.url}/${lang}/l/${l.id}`)}" target="_blank" rel="noopener">${photo}<b>${price ? esc(price) : "&nbsp;"}</b><span dir="auto">${esc(l.title)}</span></a>`;
    })
    .join("");

  const html = `<!doctype html><html lang="${lang}" dir="${dirOf(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(shop.seller.name)}</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#0f1e26;background:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;padding:12px}
.card{display:block;text-decoration:none;color:inherit}.card img,.ph{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;border:1px solid #dde3e7;background:#f5f7f8;display:block}
.card b{display:block;margin-top:6px;font-size:15px}.card span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;line-height:1.35}
.foot{padding:0 12px 12px;font-size:12px}.foot a{color:#0b5d6b}
</style></head><body><div class="grid">${cards}</div>
<p class="foot"><a href="${esc(`${site.url}/s/${shop.seller.shopSlug}`)}" target="_blank" rel="noopener">${esc(shop.seller.name)} · ${esc(site.name)}</a></p></body></html>`;

  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
}
