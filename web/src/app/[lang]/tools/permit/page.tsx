import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PermitTool } from "@/components/PermitTool";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";

type Props = PageProps<"/[lang]/tools/permit">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).permit.title };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t.permit.title}</h1>
      <p className="mt-1 text-ink-soft">{t.permit.intro}</p>
      <PermitTool t={t} lang={lang} />
      <p className="notice mt-6">
        {t.help.disclaimer}{" "}
        <Link href={`/${lang}/help#immigration`} className="font-semibold text-sea underline underline-offset-2">
          {t.help.title}
        </Link>
      </p>
    </div>
  );
}
