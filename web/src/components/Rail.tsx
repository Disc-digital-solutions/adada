import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import type { Listing } from "@/lib/types";
import { ListingCard } from "./ListingCard";
import { ArrowIcon } from "./icons";

/**
 * A titled row of ads. On a phone it scrolls sideways under the thumb, so the home screen can show
 * every part of the app without becoming endless; on a wide screen it is a grid row.
 */
export function Rail({
  title,
  hint,
  icon,
  href,
  listings,
  lang,
  t,
  nowMs,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
  href: string;
  listings: Listing[];
  lang: Lang;
  t: Dictionary;
  nowMs: number;
}) {
  if (listings.length === 0) return null;
  return (
    <section className="reveal mt-11">
      <div className="mb-4 flex items-end gap-3">
        {icon}
        <div className="min-w-0 flex-1">
          <h2 className="section-title">{title}</h2>
          {hint ? <p className="text-[13px] text-ink-soft">{hint}</p> : null}
        </div>
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-sea hover:text-sea-deep">
          {t.home.seeAllShort}
          <ArrowIcon width={16} height={16} className="nudge rtl:-scale-x-100" />
        </Link>
      </div>
      <ul className="swipe-row -mx-4 flex snap-x scroll-px-4 gap-3 px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-x-4 md:gap-y-6 md:px-0 lg:grid-cols-5 [&>li]:w-[44%] [&>li]:shrink-0 [&>li]:snap-start md:[&>li]:w-auto">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} lang={lang} t={t} nowMs={nowMs} />
        ))}
      </ul>
    </section>
  );
}
