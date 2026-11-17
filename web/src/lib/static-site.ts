/**
 * True in the static copy of the site built for GitHub Pages (scripts/build-pages.mjs), which has no
 * server: pages that read the address (?q=…, ?city=…) read it in the browser instead, and WhatsApp
 * buttons open WhatsApp directly instead of going through the click counter.
 */
export const STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_SITE === "1";

/** The path the site is served under ("" normally, "/adada/site" on GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * A root-relative address with the site's path in front. Next's <Link> adds it by itself; plain
 * <a>, <img> and <form action> need this.
 */
export function withBase(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
