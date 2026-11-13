import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FilterForm } from "@/components/FilterForm";
import { GridSkeleton, ListingGrid } from "@/components/ListingCard";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { parseFilter } from "@/lib/listings";

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
        <Results lang={lang} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ lang, searchParams }: { lang: Lang; searchParams: Props["searchParams"] }) {
  const filter = parseFilter(await searchParams);
  const now = await requestTime();
  const repo = getRepo();
  const t = getDictionary(lang);
  const [categories, listings] = await Promise.all([repo.allCategories(), repo.search(filter, now)]);

  return (
    <>
      <FilterForm lang={lang} t={t} filter={filter} categories={categories} />

      {listings.length > 0 ? (
        <>
          <p className="mb-3 mt-5 text-[15px] text-ink-soft" aria-live="polite">
            {plural(lang, listings.length, t.search.results)}
          </p>
          <ListingGrid listings={listings} lang={lang} t={t} nowMs={now} />
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
