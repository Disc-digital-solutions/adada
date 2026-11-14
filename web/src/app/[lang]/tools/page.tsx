import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolTile } from "@/components/ToolTile";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";
import { TOOLS } from "@/lib/tools";

type Props = PageProps<"/[lang]/tools">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).tools.title };
}

/** Every tool and guide: help that works without an account or the database. */
export default async function ToolsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t.tools.title}</h1>
      <p className="mt-1 text-ink-soft">{t.tools.intro}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolTile key={tool.href} tool={tool} lang={lang} />
        ))}
      </ul>
    </div>
  );
}
