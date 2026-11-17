import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { filterListings, parseFilter } from "@/lib/listings";
import type { Category, Listing } from "@/lib/types";
import { FilterForm } from "./FilterForm";
import { ListingGrid } from "./ListingCard";

export type SearchResultsProps = {
  lang: Lang;
  t: Dictionary;
  categories: Category[];
  /** The ads to search in: already filtered on a server, or all of them on the static site. */
  listings: Listing[];
  nowMs: number;
  query: Record<string, string | string[] | undefined>;
};

/** The search form and its results. Runs on the server, or in the browser on the static site. */
export function SearchResults({ lang, t, categories, listings, nowMs, query }: SearchResultsProps) {
  const filter = parseFilter(query);
  const found = filterListings(listings, filter, nowMs);
  return (
    <>
      <FilterForm lang={lang} t={t} filter={filter} categories={categories} />

      {found.length > 0 ? (
        <>
          <p className="mb-3 mt-5 text-[15px] text-ink-soft" aria-live="polite">
            {plural(lang, found.length, t.search.results)}
          </p>
          <ListingGrid listings={found} lang={lang} t={t} nowMs={nowMs} />
        </>
      ) : (
        // An empty result is an invitation: say what you want and let sellers find you.
        <div className="mt-6 rounded-xl border-2 border-dashed border-line p-6 text-center">
          <h2 className="text-lg font-semibold">{t.search.emptyTitle}</h2>
          <p className="mt-1 text-ink-soft">{t.search.emptyBody}</p>
          <Link href={`/${lang}/post?kind=wanted`} className="btn btn-primary mt-4">
            {t.search.postWanted}
          </Link>
        </div>
      )}
    </>
  );
}
