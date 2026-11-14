import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GridSkeleton, ListingGrid } from "@/components/ListingCard";
import { SearchIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { courseCodesIn, normalizeCourse } from "@/lib/course";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";

type Props = PageProps<"/[lang]/books">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).books.title };
}

/** Books and notes by course code (BUY-06): students search by course, not by title. */
export default async function BooksPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t.books.title}</h1>
      <p className="mt-1 text-ink-soft">{t.books.intro}</p>
      <Suspense fallback={<GridSkeleton />}>
        <Results lang={lang} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ lang, searchParams }: { lang: Lang; searchParams: Props["searchParams"] }) {
  const { course: raw } = await searchParams;
  const typed = typeof raw === "string" ? raw : "";
  const course = normalizeCourse(typed);
  const t = getDictionary(lang);
  const now = await requestTime();
  const repo = getRepo();
  const all = await repo.search({ sort: "newest" }, now);
  // Every course that has at least one ad, so a student can tap instead of typing.
  const known = [...new Set(all.flatMap((l) => courseCodesIn(`${l.title} ${l.description}`)))].sort();
  const listings = course ? await repo.search({ course, sort: "newest" }, now) : [];

  return (
    <>
      <form action={`/${lang}/books`} className="panel mt-5 flex gap-2 p-2 md:max-w-xl">
        <label className="relative flex-1">
          <span className="sr-only">{t.books.placeholder}</span>
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input name="course" defaultValue={typed} placeholder={t.books.placeholder} dir="ltr" className="field !border-transparent !bg-paper ps-10 uppercase placeholder:normal-case" />
        </label>
        <button className="btn btn-primary">{t.search.submit}</button>
      </form>

      {known.length > 0 ? (
        <div className="mt-4">
          <p className="eyebrow mb-2">{t.books.courses}</p>
          <ul className="flex flex-wrap gap-2">
            {known.map((code) => (
              <li key={code}>
                <Link href={`/${lang}/books?course=${code}`} className={`chip ${code === course ? "!border-ink !bg-ink !text-white" : ""}`} dir="ltr">
                  {code}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {course ? (
        listings.length > 0 ? (
          <div className="mt-6">
            <p className="mb-3 text-[15px] text-ink-soft">{plural(lang, listings.length, t.search.results)}</p>
            <ListingGrid listings={listings} lang={lang} t={t} nowMs={now} />
          </div>
        ) : (
          <div className="panel mt-6 p-6 text-center">
            <p className="text-ink-soft">{t.books.none.replace("{code}", course)}</p>
            <Link href={`/${lang}/post?kind=wanted&category=books`} className="btn btn-primary mt-4">
              {t.search.postWanted}
            </Link>
          </div>
        )
      ) : null}
    </>
  );
}
