import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";
import { GUIDES } from "@/lib/guides";

type Props = PageProps<"/[lang]/guides">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).guides.title };
}

export default async function GuidesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t.guides.title}</h1>
      <p className="mt-1 text-ink-soft">{t.guides.intro}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <li key={guide.slug} className="min-w-0">
            <Link href={`/${lang}/guides/${guide.slug}`} className="panel flex h-full items-start gap-3 p-4 transition hover:border-brand/60">
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-wash text-brand-deep">
                <ServiceIcon name={guide.icon} width={21} height={21} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold leading-tight">{guide.title[lang]}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{guide.intro[lang]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
