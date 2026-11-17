import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepositTool } from "@/components/DepositTool";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";
import { withBase } from "@/lib/static-site";

type Props = PageProps<"/[lang]/tools/deposit">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).deposit.title };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl print:hidden">{t.deposit.title}</h1>
      <p className="mt-1 text-ink-soft print:hidden">{t.deposit.intro}</p>
      <DepositTool t={t} cleanHref={withBase(`/${lang}/c/cleaning`)} />
    </div>
  );
}
