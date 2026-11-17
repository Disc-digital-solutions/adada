import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { filterListings } from "@/lib/listings";
import type { Service } from "@/lib/services";
import type { Listing } from "@/lib/types";
import { CITIES } from "@/site.config";
import { ListingGrid } from "./ListingCard";
import { ChatIcon } from "./icons";

export const HOUSING_CATEGORIES = ["rooms", "roommates", "dorms"];

export type ServiceListingsProps = {
  lang: Lang;
  t: Dictionary;
  service: Service;
  /** The service's ads: already filtered on a server, or all of them on the static site. */
  listings: Listing[];
  nowMs: number;
  query: Record<string, string | string[] | undefined>;
  askLink: string | null;
  postHref: string;
};

/** The city and women-only chips, the service's ads, and the "list your business" band. */
export function ServiceListings({ lang, t, service, listings: all, nowMs, query, askLink, postHref }: ServiceListingsProps) {
  const rawCity = query.city;
  const city = typeof rawCity === "string" && CITIES.some((c) => c.slug === rawCity) ? rawCity : undefined;
  // Flats, roommates and dorms can be filtered to places open to women only (ROOM-07).
  const housing = service.categories.some((c) => HOUSING_CATEGORIES.includes(c));
  const women = housing && query.women === "1";
  const href = (next: { city?: string; women?: boolean }) => {
    const params = new URLSearchParams();
    if (next.city) params.set("city", next.city);
    if (next.women) params.set("women", "1");
    const q = params.toString();
    return `/${lang}/c/${service.slug}${q ? `?${q}` : ""}`;
  };
  const listings = filterListings(all, { categories: service.categories, city, women: women || undefined, sort: "newest" }, nowMs);
  const chip = (active: boolean) => `chip ${active ? "!border-ink !bg-ink !text-white" : ""}`;

  return (
    <>
      <nav aria-label={t.search.city} className="swipe-row -mx-4 mb-4 flex gap-2 px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {housing ? (
          <Link href={href({ city, women: !women })} className={`${chip(women)} !border-women/30`}>
            {t.trust.womenFilter}
          </Link>
        ) : null}
        <Link href={href({ women })} className={chip(!city)}>
          {t.services.allCities}
        </Link>
        {CITIES.map((c) => (
          <Link key={c.slug} href={href({ city: c.slug, women })} className={chip(city === c.slug)}>
            {c.name[lang]}
          </Link>
        ))}
      </nav>

      {listings.length > 0 ? (
        <>
          <p className="mb-3 text-[15px] text-ink-soft" aria-live="polite">
            {plural(lang, listings.length, t.search.results)}
          </p>
          <ListingGrid listings={listings} lang={lang} t={t} nowMs={nowMs} />
        </>
      ) : (
        // No ads yet: the plan's "by hand first". A person finds it for you on WhatsApp.
        <div className="panel p-6 text-center md:p-10">
          <h2 className="text-lg font-semibold">{t.services.emptyTitle}</h2>
          <p className="mx-auto mt-1 max-w-md text-ink-soft">{t.services.emptyBody}</p>
          {askLink ? (
            <a href={askLink} target="_blank" rel="noopener" className="btn btn-wa mt-4">
              <ChatIcon width={18} height={18} />
              {t.services.askUs}
            </a>
          ) : null}
        </div>
      )}

      <aside className="panel mt-8 flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{t.services.providerTitle}</h2>
          <p className="text-sm text-ink-soft">{t.services.providerBody}</p>
        </div>
        <Link href={postHref} className="btn btn-quiet">
          {t.services.listFree}
        </Link>
      </aside>
    </>
  );
}
