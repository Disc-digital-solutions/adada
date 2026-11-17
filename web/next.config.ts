import type { NextConfig } from "next";

/**
 * PAGES_BASE set (by scripts/build-pages.mjs) builds a static copy of the site for GitHub Pages,
 * served under that path. Without it, the site is built for a normal server.
 */
const pagesBase = process.env.PAGES_BASE;

const nextConfig: NextConfig = {
  ...(pagesBase ? { output: "export" as const, basePath: pagesBase, trailingSlash: true, images: { unoptimized: true } } : {}),
  // The static site has no visitors to wait for, so it is built without this mode.
  cacheComponents: !pagesBase,
  partialPrefetching: !pagesBase,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
