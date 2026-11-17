import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GridSkeleton } from "@/components/ListingCard";
import { SavedList } from "@/components/SavedList";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";

type Props = PageProps<"/[lang]/saved">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).pop.savedTitle, robots: { index: false } };
}

/** The ads saved on this device. The list lives in the browser, so the page only brings the ads. */
export default async function SavedPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-[28px] font-extrabold tracking-tight md:text-[32px]">{t.pop.savedTitle}</h1>
      <p className="mt-1 text-ink-soft">{t.pop.savedIntro}</p>
      <Suspense fallback={<GridSkeleton count={3} label={t.pop.loading} />}>
        <Saved lang={lang} />
      </Suspense>
    </div>
  );
}

async function Saved({ lang }: { lang: Lang }) {
  const now = await requestTime();
  const listings = await getRepo().search({ sort: "newest" }, now);
  return <SavedList lang={lang} listings={listings} nowMs={now} />;
}
