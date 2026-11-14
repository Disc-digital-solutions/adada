import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cityName } from "@/components/ListingCard";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { requestTime } from "@/lib/now";
import { priceIndex } from "@/lib/prices";

type Props = PageProps<"/[lang]/prices">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).prices.title };
}

/** Open price data (ENH-31): typical prices from the live ads, free for anyone to read and quote. */
export default async function PricesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t.prices.title}</h1>
      <p className="mt-1 text-ink-soft">{t.prices.intro}</p>
      <Suspense fallback={<div className="mt-6 h-48 rounded-xl bg-line/50" aria-hidden />}>
        <Tables lang={lang} />
      </Suspense>
      <p className="hint mt-6">{t.prices.note}</p>
    </div>
  );
}

async function Tables({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const rows = priceIndex(await getRepo().search({ sort: "newest" }, await requestTime()));
  if (rows.length === 0) return <p className="notice mt-6">{t.prices.empty}</p>;
  const groups = ["rent", "dorm", "car"] as const;
  return (
    <div className="mt-6 grid gap-6">
      {groups.map((group) => {
        const mine = rows.filter((r) => r.group === group);
        if (mine.length === 0) return null;
        return (
          <section key={group} className="panel overflow-hidden">
            <h2 className="border-b border-line px-4 py-3 font-semibold">{t.prices[group]}</h2>
            <table className="w-full text-[15px]">
              <thead className="text-start text-[12px] uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-2 text-start font-semibold">{t.search.city}</th>
                  <th className="px-4 py-2 text-end font-semibold">{t.prices.typical}</th>
                  <th className="hidden px-4 py-2 text-end font-semibold sm:table-cell">{t.prices.range}</th>
                  <th className="px-4 py-2 text-end font-semibold">{t.prices.count}</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((r) => (
                  <tr key={`${r.city}-${r.currency}`} className={`border-t border-line ${r.city === null ? "bg-paper font-semibold" : ""}`}>
                    <td className="px-4 py-2.5">{r.city === null ? t.prices.island : cityName(r.city, lang)}</td>
                    <td className="px-4 py-2.5 text-end font-bold tabular-nums">
                      <bdi>{formatMoney(r.median, r.currency, lang)}</bdi>
                    </td>
                    <td className="hidden px-4 py-2.5 text-end tabular-nums text-ink-soft sm:table-cell">
                      <bdi>
                        {formatMoney(r.low, r.currency, lang)} – {formatMoney(r.high, r.currency, lang)}
                      </bdi>
                    </td>
                    <td className="px-4 py-2.5 text-end tabular-nums text-ink-soft">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
