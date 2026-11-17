import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GridSkeleton } from "@/components/ListingCard";
import { SearchResults } from "@/components/SearchResults";
import { SearchResultsClient } from "@/components/SearchResultsClient";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { parseFilter } from "@/lib/listings";
import { STATIC_SITE } from "@/lib/static-site";

type Props = PageProps<"/[lang]/search">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).search.title };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <div className="page">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">{t.search.title}</h1>
      {/* The filters come from the address (?q=…), which is only known when someone visits. */}
      <Suspense fallback={<GridSkeleton />}>
        {STATIC_SITE ? <StaticResults lang={lang} /> : <Results lang={lang} searchParams={searchParams} />}
      </Suspense>
    </div>
  );
}

async function Results({ lang, searchParams }: { lang: Lang; searchParams: Props["searchParams"] }) {
  const query = await searchParams;
  const now = await requestTime();
  const repo = getRepo();
  const [categories, listings] = await Promise.all([repo.allCategories(), repo.search(parseFilter(query), now)]);
  return <SearchResults lang={lang} t={getDictionary(lang)} categories={categories} listings={listings} nowMs={now} query={query} />;
}

/** No server: every ad goes to the browser, which filters them by the address. */
async function StaticResults({ lang }: { lang: Lang }) {
  const now = await requestTime();
  const repo = getRepo();
  const [categories, listings] = await Promise.all([repo.allCategories(), repo.search({ sort: "newest" }, now)]);
  return <SearchResultsClient lang={lang} categories={categories} listings={listings} nowMs={now} />;
}
