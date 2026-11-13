import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { CITIES } from "@/site.config";
import { Photo } from "./Photo";
import { PriceTag, priceText } from "./PriceTag";

export function cityName(slug: string, lang: Lang): string {
  return CITIES.find((city) => city.slug === slug)?.name[lang] ?? slug;
}

/** One ad in a grid: the picture with its price tag, then the title, the city and how old it is. */
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
  const cover = listing.photos[0];
  const budget = listing.kind === "wanted" ? priceText(listing, lang, t) : null;

  return (
    <li>
      <Link href={`/${lang}/l/${listing.id}`} className="group block">
        {cover ? (
          <div className="relative aspect-square overflow-hidden rounded-xl bg-card">
            <Photo src={cover} alt="" className={sold ? "opacity-60 grayscale" : ""} />
            {sold ? <span className="sold-stamp">{t.listing.sold}</span> : null}
            <span className="absolute bottom-2 start-2">
              <PriceTag listing={listing} lang={lang} t={t} />
            </span>
          </div>
        ) : (
          // A "wanted" post has no picture: the words are the picture.
          <div className="flex aspect-square flex-col rounded-xl border-2 border-dashed border-sea/45 bg-sea-wash p-3">
            <span className="text-[13px] font-semibold text-sea-deep">{t.listing.wanted}</span>
            <p dir="auto" className="mt-1 line-clamp-4 text-[17px] font-semibold leading-snug">
              {listing.title}
            </p>
            {budget ? (
              <p className="mt-auto text-[13px] text-ink-soft">
                {t.listing.budget} <bdi className="font-semibold text-ink">{budget}</bdi>
              </p>
            ) : null}
          </div>
        )}

        {cover ? (
          <h3 dir="auto" className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug group-hover:text-sea-deep">
            {listing.title}
          </h3>
        ) : null}
        <p className={`flex justify-between gap-2 text-[13px] text-ink-soft ${cover ? "mt-0.5" : "mt-2"}`}>
          <span className="truncate">{cityName(listing.city, lang)}</span>
          <span className="shrink-0">{timeAgo(listing.createdAt, nowMs, lang)}</span>
        </p>
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
    <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} lang={lang} t={t} nowMs={nowMs} />
      ))}
    </ul>
  );
}

/** Grey boxes in the shape of the grid, shown for the moment before the ads arrive. */
export function GridSkeleton() {
  return (
    <ul aria-hidden className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i}>
          <div className="aspect-square rounded-xl bg-line/60" />
          <div className="mt-2 h-4 w-4/5 rounded bg-line/60" />
          <div className="mt-1.5 h-3 w-2/5 rounded bg-line/60" />
        </li>
      ))}
    </ul>
  );
}
