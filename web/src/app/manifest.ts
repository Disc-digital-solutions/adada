import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { withBase } from "@/lib/static-site";

/**
 * Lets a phone add the site to its home screen and open it like an app:
 * its own icon, no browser bars, the site's colour at the top.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    start_url: withBase("/"),
    display: "standalone",
    background_color: "#f5f7f8",
    theme_color: site.themeColor,
    icons: [
      { src: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
