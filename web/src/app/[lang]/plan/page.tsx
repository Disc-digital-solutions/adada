import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PLAN_CATEGORIES, PlanView } from "@/components/PlanView";
import { PlanViewClient } from "@/components/PlanViewClient";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { STATIC_SITE } from "@/lib/static-site";

type Props = PageProps<"/[lang]/plan">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).plan.title };
}

/**
 * A new arrival's plan (ARR-06), built from today's real ads: rooms in budget, arrival help,
 * and the checklist. Everything comes from the address (?city=…&budget=…&date=…), so a plan
 * can be shared with parents in one link.
 */
export default async function PlanPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t.plan.title}</h1>
      <p className="mt-1 text-ink-soft">{t.plan.intro}</p>
      <Suspense fallback={null}>
        <Plan lang={lang} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Plan({ lang, searchParams }: { lang: Lang; searchParams: Props["searchParams"] }) {
  const now = await requestTime();
  const listings = await getRepo().search({ categories: PLAN_CATEGORIES, sort: "newest" }, now);
  const props = { lang, t: getDictionary(lang), listings, nowMs: now };
  // No server: the browser reads the plan's ?city=&budget=&date= itself.
  if (STATIC_SITE) return <PlanViewClient lang={lang} listings={listings} nowMs={now} />;
  return <PlanView {...props} query={await searchParams} />;
}
