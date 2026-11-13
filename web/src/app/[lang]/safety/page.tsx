import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";

type Props = PageProps<"/[lang]/safety">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).safety.title };
}

/** How to deal safely. Plain words, because the people who need this most are new to the island. */
export default async function SafetyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const s = getDictionary(lang).safety;

  return (
    <div className="page">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-[28px] font-bold tracking-tight">{s.title}</h1>
        <p className="mt-2 text-ink-soft">{s.intro}</p>

        <ul className="mt-5 grid gap-2">
          {s.tips.map((tip) => (
            <li key={tip} className="rounded-lg border border-line bg-card px-4 py-3 font-medium">
              {tip}
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-lg font-semibold">{s.meetTitle}</h2>
        <ul className="mt-2 list-disc ps-5 text-[16px] leading-relaxed">
          {s.meetPlaces.map((place) => (
            <li key={place}>{place}</li>
          ))}
        </ul>

        <h2 className="mt-8 text-lg font-semibold">{s.scamTitle}</h2>
        <p className="notice notice-alert mt-2">{s.scamBody}</p>
      </div>
    </div>
  );
}
