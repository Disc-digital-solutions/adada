import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, ServiceIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { isLang } from "@/i18n/config";
import { GUIDES, guideBySlug } from "@/lib/guides";

type Props = PageProps<"/[lang]/guides/[slug]">;

/** The guides are a fixed list, so every guide page is prepared ahead of time. */
export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const guide = guideBySlug(slug);
  if (!isLang(lang) || !guide) return {};
  return { title: guide.title[lang], description: guide.intro[lang] };
}

export default async function GuidePage({ params }: Props) {
  const { lang, slug } = await params;
  const guide = guideBySlug(slug);
  if (!isLang(lang) || !guide) notFound();
  const t = getDictionary(lang);

  return (
    <div className="page">
      <article className="mx-auto max-w-2xl">
        <Link href={`/${lang}/guides`} className="eyebrow hover:text-ink">
          {t.guides.title}
        </Link>
        <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight md:text-3xl">
          <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand-deep">
            <ServiceIcon name={guide.icon} width={24} height={24} />
          </span>
          {guide.title[lang]}
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{guide.intro[lang]}</p>

        <ol className="mt-6 grid gap-2">
          {guide.steps.map((step, i) => (
            <li key={i} className="panel flex gap-3 p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
              <span className="min-w-0 flex-1 text-[15px] leading-relaxed">
                {step.text[lang]}
                {step.link ? (
                  <Link href={`/${lang}/${step.link}`} className="ms-2 inline-flex items-center text-brand hover:text-brand-deep" aria-label={t.tools.open}>
                    <ArrowIcon width={16} height={16} className="rtl:-scale-x-100" />
                  </Link>
                ) : null}
              </span>
            </li>
          ))}
        </ol>

        {guide.example ? (
          <figure className="mt-6">
            <figcaption className="eyebrow mb-2">{t.guides.example}</figcaption>
            <pre dir="ltr" className="panel overflow-x-auto whitespace-pre-wrap p-4 font-sans text-[15px] leading-relaxed">
              {guide.example}
            </pre>
          </figure>
        ) : null}

        <p className="notice mt-6">{t.guides.disclaimer}</p>

        <h2 className="section-title mt-10">{t.guides.more}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
            <li key={g.slug}>
              <Link href={`/${lang}/guides/${g.slug}`} className="chip">
                {g.title[lang]}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
