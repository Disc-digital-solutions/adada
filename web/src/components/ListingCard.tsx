import Link from "next/link";
import { ViewTransition } from "react";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { CITIES } from "@/site.config";
import { Photo } from "./Photo";
import { priceText } from "./PriceTag";
import { WomenOnlyBadge } from "./Badges";
import { ServiceArt } from "./ServiceTile";

export function cityName(slug: string, lang: Lang): string {
  return CITIES.find((city) => city.slug === slug)?.name[lang] ?? slug;
}

/**
 * One ad in a grid: the picture, then the price in bold, the title, and where and when.
 * The same order as the large marketplaces, because buyers scan prices first.
 */
export function ListingCard({
  listing,
  lang,
  t,
  nowMs,
}: {
  listing: Listing;
  lang: Lang;
  t: Dictionary;
  nowMs: number;
}) {
  const sold = listing.status === "sold";
  const wanted = listing.kind === "wanted";
  const cover = listing.photos[0];
  const price = priceText(listing, lang, t);

  return (
    <li className="reveal">
      <Link href={`/${lang}/l/${listing.id}`} className="group block">
        {/* The picture morphs into the ad page's photo (same name there). */}
        <ViewTransition name={`photo-${listing.id}`} share="morph" default="none">
        <div className="lift relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-card">
          {cover ? (
            <Photo src={cover} alt="" className={`transition duration-300 group-hover:scale-[1.03] ${sold ? "opacity-60 grayscale" : ""}`} />
          ) : wanted ? (
            // A "wanted" post has no picture: the words are the picture.
            <div className="flex h-full flex-col justify-center bg-sea-wash/60 p-4">
              <p dir="auto" className="line-clamp-3 text-[15px] font-semibold leading-snug text-sea-deep">
                “{listing.title}”
              </p>
            </div>
          ) : (
            <ServiceArt category={listing.category} lang={lang} />
          )}
          {sold ? <span className="sold-stamp">{t.listing.sold}</span> : null}
          {listing.womenOnly ? (
            <span className="absolute bottom-2 start-2">
              <WomenOnlyBadge t={t} small />
            </span>
          ) : null}
          {wanted ? (
            <span className="absolute start-2 top-2 rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              {t.listing.wanted}
            </span>
          ) : null}
        </div>
        </ViewTransition>

        <div className="mt-2 px-0.5">
          {price ? (
            <p className="text-[15px] font-bold tabular-nums">
              {wanted ? <span className="me-1 font-medium text-ink-soft">{t.listing.budget}</span> : null}
              <bdi>{price}</bdi>
            </p>
          ) : null}
          <h3 dir="auto" className="line-clamp-2 text-[14px] leading-snug text-ink group-hover:text-sea-deep">
            {listing.title}
          </h3>
          <p className="mt-1 flex justify-between gap-2 text-[12px] text-ink-soft">
            <span className="truncate">{cityName(listing.city, lang)}</span>
            <span className="shrink-0">{timeAgo(listing.createdAt, nowMs, lang)}</span>
          </p>
        </div>
      </Link>
    </li>
  );
}

export function ListingGrid({
  listings,
  lang,
  t,
  nowMs,
}: {
  listings: Listing[];
  lang: Lang;
  t: Dictionary;
  nowMs: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} lang={lang} t={t} nowMs={nowMs} />
      ))}
    </ul>
  );
}

/** Grey boxes in the shape of the grid, shown for the moment before the ads arrive. */
export function GridSkeleton() {
  return (
    <ul aria-hidden className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i}>
          <div className="shimmer aspect-[4/3] rounded-xl" />
          <div className="shimmer mt-2 h-4 w-2/5 rounded" />
          <div className="shimmer mt-1.5 h-3 w-4/5 rounded" />
        </li>
      ))}
    </ul>
  );
}
