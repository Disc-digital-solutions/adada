"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getDictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { BROWSE, browseById, type BrowseId } from "@/lib/browse";
import { filterListings } from "@/lib/listings";
import { useSavedIds } from "@/lib/saved";
import { CURRENCIES, type Currency, type Listing } from "@/lib/types";
import { CITIES } from "@/site.config";
import { useHydrated } from "./useHydrated";
import { GRID, GridSkeleton, ListingCard } from "./ListingCard";
import { PlusIcon } from "./icons";

const PAGE = 9;
const SYMBOL: Record<Currency, string> = { TRY: "₺ TRY", GBP: "£ GBP", EUR: "€ EUR", USD: "$ USD" };

/** The home page's newest ads with their filters. The filters live in the address (?browse=homes&area=kyrenia), so a refresh, the back button and a language switch all keep them. */
export function FreshFinds({ lang, listings, nowMs }: { lang: Lang; listings: Listing[]; nowMs: number }) {
  const t = getDictionary(lang);
  const p = t.pop;
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const savedIds = useSavedIds();
  const hydrated = useHydrated();

  const browse = browseById(query.get("browse") ?? undefined);
  const areaParam = query.get("area");
  const area = CITIES.some((c) => c.slug === areaParam) ? areaParam! : undefined;
  const curParam = query.get("cur");
  const currency = (CURRENCIES as readonly string[]).includes(curParam ?? "") ? (curParam as Currency) : undefined;
  // Women-only is an advertiser's choice on housing ads, so the filter exists only for homes.
  const housing = browse?.id === "homes";
  const women = housing && query.get("women") === "1";
  const savedOnly = query.get("saved") === "1";

  let found = filterListings(listings, { categories: browse ? [...browse.categories] : undefined, city: area, currency, women: women || undefined, sort: "newest" }, nowMs);
  if (savedOnly) found = found.filter((l) => savedIds.includes(l.id));

  // "Show more" starts again whenever the filters change.
  const filterKey = query.toString();
  const [more, setMore] = useState({ key: filterKey, shown: PAGE });
  const shown = more.key === filterKey ? more.shown : PAGE;

  function update(name: string, value: string | null) {
    const next = new URLSearchParams(query.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    // Leaving homes drops the women-only filter instead of applying it to jobs or cars.
    if (name === "browse" && value !== "homes") next.delete("women");
    const qs = next.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}#finds`, { scroll: false });
  }

  const active = Boolean(browse || area || currency || women || savedOnly);
  const select = "field !min-h-11 !py-2 text-[14.5px]";
  const toggle = (on: boolean) =>
    `inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-[14px] font-semibold transition-colors duration-200 ${
      on ? "border-brand bg-brand text-white" : "border-line-strong bg-card text-ink hover:border-brand"
    }`;

  return (
    <>
      <form role="search" aria-label={p.filters} onSubmit={(e) => e.preventDefault()} className="filter-bar panel mb-5 grid gap-2.5 p-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center">
        <label className="min-w-0 lg:w-48">
          <span className="sr-only">{t.search.category}</span>
          <select value={browse?.id ?? ""} onChange={(e) => update("browse", e.target.value || null)} className={select}>
            <option value="">{p.allTypes}</option>
            {BROWSE.map((b) => (
              <option key={b.id} value={b.id}>
                {p[b.id as BrowseId]}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 lg:w-48">
          <span className="sr-only">{p.area}</span>
          <select value={area ?? ""} onChange={(e) => update("area", e.target.value || null)} className={select}>
            <option value="">{p.allArea}</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name[lang]}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 lg:w-44">
          <span className="sr-only">{t.search.currency}</span>
          <select value={currency ?? ""} onChange={(e) => update("cur", e.target.value || null)} className={select}>
            <option value="">{p.anyCurrency}</option>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {SYMBOL[c]}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-3 lg:col-span-1">
          {housing ? (
            <button type="button" aria-pressed={women} onClick={() => update("women", women ? null : "1")} className={toggle(women)}>
              {p.womenOnly}
            </button>
          ) : null}
          <button type="button" aria-pressed={savedOnly} onClick={() => update("saved", savedOnly ? null : "1")} className={toggle(savedOnly)}>
            {p.savedOnly}
          </button>
          {active ? (
            <button type="button" onClick={() => router.replace(`${pathname}#finds`, { scroll: false })} className="inline-flex min-h-11 items-center px-3 text-[14px] font-semibold text-brand underline-offset-4 hover:underline">
              {p.reset}
            </button>
          ) : null}
        </div>
      </form>

      {savedOnly && !hydrated ? (
        <GridSkeleton count={3} label={p.loading} />
      ) : (
        <>
          <p className="mb-4 text-[15px] font-medium text-ink-soft" aria-live="polite">
            {plural(lang, found.length, t.search.results)}
          </p>
          {found.length > 0 ? (
            <>
              <ul className={GRID}>
                {found.slice(0, shown).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} lang={lang} t={t} nowMs={nowMs} />
                ))}
              </ul>
              {found.length > shown ? (
                <div className="mt-6 text-center">
                  <button type="button" onClick={() => setMore({ key: filterKey, shown: shown + PAGE })} className="btn btn-quiet">
                    {p.showMore}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="panel grid justify-items-center gap-3 p-8 text-center">
              <h3 className="text-lg font-bold">{p.emptyTitle}</h3>
              <p className="max-w-md text-ink-soft">{savedOnly ? p.savedEmpty : p.emptyBody}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {active ? (
                  <button type="button" onClick={() => router.replace(`${pathname}#finds`, { scroll: false })} className="btn btn-quiet">
                    {p.reset}
                  </button>
                ) : null}
                <Link href={`/${lang}/post?kind=wanted`} className="btn btn-primary">
                  <PlusIcon width={18} height={18} />
                  {t.search.postWanted}
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
