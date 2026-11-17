import Link from "next/link";
import { ViewTransition } from "react";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { timeAgo } from "@/lib/format";
import { serviceOfCategory } from "@/lib/services";
import type { Listing } from "@/lib/types";
import { CITIES } from "@/site.config";
import { Photo } from "./Photo";
import { priceText } from "./PriceTag";
import { WomenOnlyBadge } from "./Badges";
import { SaveButton } from "./SaveButton";
import { ServiceArt } from "./ServiceTile";
import { ShareListing } from "./ShareListing";
import { ChatIcon } from "./icons";

export function cityName(slug: string, lang: Lang): string {
  return CITIES.find((city) => city.slug === slug)?.name[lang] ?? slug;
}

/**
 * One ad in a grid. The photo and the price lead, because buyers scan those first; then the title,
 * the category and area, and the two things to do: contact (on the ad's page, where the advertiser's
 * real contact lives) and share. The heart saves it on this device.
 * Every card has the same structure, whatever the price looks like (a number, free, or on request).
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
  const href = `/${lang}/l/${listing.id}`;
  const category = serviceOfCategory(listing.category)?.name[lang];

  return (
    <li className="listing-card reveal group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-card">
      <Link href={href} className="flex flex-1 flex-col">
        {/* The picture morphs into the ad page's photo (same name there). */}
        <ViewTransition name={`photo-${listing.id}`} share="morph" default="none">
          <div className="relative aspect-[4/3] overflow-hidden bg-sunken">
            {cover ? (
              <Photo src={cover} alt="" className={`listing-photo ${sold ? "opacity-60 grayscale" : ""}`} />
            ) : wanted ? (
              // A "wanted" post has no picture: the words are the picture.
              <div className="flex h-full flex-col justify-center bg-brand-wash p-4">
                <p dir="auto" className="line-clamp-3 font-heading text-[16px] font-bold leading-snug text-brand-deep">
                  “{listing.title}”
                </p>
              </div>
            ) : (
              <ServiceArt category={listing.category} lang={lang} />
            )}
            {sold ? <span className="sold-stamp">{t.listing.sold}</span> : null}
            <span className="absolute start-2.5 top-2.5 flex flex-wrap gap-1.5">
              {wanted ? (
                <span className="rounded-md bg-ink px-2 py-0.5 text-[11.5px] font-bold uppercase tracking-wide text-white">{t.listing.wanted}</span>
              ) : null}
              {listing.womenOnly ? <WomenOnlyBadge t={t} small /> : null}
            </span>
          </div>
        </ViewTransition>

        <div className="flex flex-1 flex-col gap-1 px-3.5 pb-2 pt-3">
          <p className="font-heading text-[18px] font-extrabold leading-tight tabular-nums text-ink">
            {wanted && price ? <span className="me-1 text-[13px] font-semibold text-ink-soft">{t.listing.budget}</span> : null}
            {price ? <bdi>{price}</bdi> : <span className="text-[14px] font-semibold text-ink-soft">{t.pop.askPrice}</span>}
          </p>
          <h3 dir="auto" className="line-clamp-2 font-sans text-[15px] font-medium leading-snug text-ink group-hover:text-brand-deep">
            {listing.title}
          </h3>
          <p className="mt-auto flex flex-wrap items-center gap-x-2 pt-1 text-[12.5px] text-ink-faint">
            {category ? <span className="font-semibold text-brand-deep">{category}</span> : null}
            <span>{cityName(listing.city, lang)}</span>
            <span aria-hidden>·</span>
            <span>{timeAgo(listing.createdAt, nowMs, lang)}</span>
          </p>
        </div>
      </Link>

      <div className="absolute end-2.5 top-2.5">
        <SaveButton id={listing.id} saveLabel={t.pop.save} unsaveLabel={t.pop.unsave} failedLabel={t.pop.saveFailed} />
      </div>

      <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
        <Link href={`${href}#contact`} className="btn btn-wa !min-h-11 flex-1 !px-3 text-[13.5px]">
          <ChatIcon width={17} height={17} />
          {t.pop.contact}
        </Link>
        <ShareListing path={href} title={listing.title} label={t.pop.share} copiedLabel={t.pop.linkCopied} failedLabel={t.pop.copyFailed} />
      </div>
    </li>
  );
}

/** Three columns on wide screens, two where they fit, one on narrow phones. */
export const GRID = "grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3";

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
    <ul className={GRID}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} lang={lang} t={t} nowMs={nowMs} />
      ))}
    </ul>
  );
}

/** Boxes in the shape of the grid, shown for the moment before the ads arrive. */
export function GridSkeleton({ count = 6, label }: { count?: number; label?: string }) {
  return (
    <div role="status" aria-label={label}>
      <ul aria-hidden className={GRID}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-card">
            <div className="shimmer aspect-[4/3]" />
            <div className="grid gap-2 p-3.5">
              <div className="shimmer h-5 w-2/5 rounded" />
              <div className="shimmer h-4 w-4/5 rounded" />
              <div className="shimmer h-3 w-3/5 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
