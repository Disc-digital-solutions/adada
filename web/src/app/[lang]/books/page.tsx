import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BooksView } from "@/components/BooksView";
import { BooksViewClient } from "@/components/BooksViewClient";
import { GridSkeleton } from "@/components/ListingCard";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { STATIC_SITE } from "@/lib/static-site";

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
  const now = await requestTime();
  const all = await getRepo().search({ sort: "newest" }, now);
  const props = { lang, t: getDictionary(lang), all, nowMs: now };
  // No server: the browser reads ?course= itself.
  if (STATIC_SITE) return <BooksViewClient lang={lang} all={all} nowMs={now} />;
  return <BooksView {...props} query={await searchParams} />;
}
