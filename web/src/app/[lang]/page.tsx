import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GridSkeleton, ListingGrid } from "@/components/ListingCard";
import { SearchIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";

/** Home: say what the site is in one line, offer the search, then show the newest ads. */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <div className="page">
      <section className="mb-5 md:mb-7">
        <h1 className="max-w-[18ch] text-[26px] font-bold leading-[1.15] tracking-tight md:text-[38px]">
          {t.site.tagline}
        </h1>
        <p className="mt-2 text-ink-soft">{t.site.intro}</p>

        {/* On wide screens the search box is already in the header. */}
        <form action={`/${lang}/search`} role="search" className="mt-4 flex gap-2 md:hidden">
          <label className="relative flex-1">
            <span className="sr-only">{t.search.placeholder}</span>
            <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input name="q" type="search" placeholder={t.search.placeholder} className="field ps-10" />
          </label>
          <button type="submit" className="btn btn-primary">
            {t.search.submit}
          </button>
        </form>
      </section>

      {/* The frame above is sent at once; the ads below are fetched for each visit. */}
      <Suspense fallback={<GridSkeleton />}>
        <Newest lang={lang} />
      </Suspense>
    </div>
  );
}

async function Newest({ lang }: { lang: Lang }) {
  // Which ads show depends on the time (a sold ad leaves after a week).
  const now = await requestTime();
  const repo = getRepo();
  const t = getDictionary(lang);
  const [categories, listings] = await Promise.all([
    repo.usedCategories(now),
    repo.search({ sort: "newest" }, now),
  ]);

  return (
    <>
      <nav aria-label={t.search.category} className="swipe-row -mx-4 mb-5 flex gap-2 px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {categories.map((category) => (
          <Link key={category.slug} href={`/${lang}/search?category=${category.slug}`} className="chip">
            {category.name[lang]}
          </Link>
        ))}
      </nav>

      <h2 className="mb-3 text-lg font-semibold">{t.home.newest}</h2>
      <ListingGrid listings={listings} lang={lang} t={t} nowMs={now} />
    </>
  );
}
