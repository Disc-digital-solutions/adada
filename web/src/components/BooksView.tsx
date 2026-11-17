import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { courseCodesIn, normalizeCourse } from "@/lib/course";
import { filterListings } from "@/lib/listings";
import type { Listing } from "@/lib/types";
import { SearchIcon } from "./icons";
import { ListingGrid } from "./ListingCard";
import { withBase } from "@/lib/static-site";

export type BooksViewProps = {
  lang: Lang;
  t: Dictionary;
  /** Every listed ad: the course list is built from them and the search runs over them. */
  all: Listing[];
  nowMs: number;
  query: Record<string, string | string[] | undefined>;
};

/** Search by course code, the codes that have ads, and the matching ads. */
export function BooksView({ lang, t, all, nowMs: now, query }: BooksViewProps) {
  const raw = query.course;
  const typed = typeof raw === "string" ? raw : "";
  const course = normalizeCourse(typed);
  // Every course that has at least one ad, so a student can tap instead of typing.
  const known = [...new Set(all.flatMap((l) => courseCodesIn(`${l.title} ${l.description}`)))].sort();
  const listings = course ? filterListings(all, { course, sort: "newest" }, now) : [];

  return (
    <>
      <form action={withBase(`/${lang}/books`)} className="panel mt-5 flex gap-2 p-2 md:max-w-xl">
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
