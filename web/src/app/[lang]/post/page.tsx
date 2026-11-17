import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { PostForm, type PostMode } from "@/components/PostForm";
import { PostFormClient } from "@/components/PostFormClient";
import { getRepo } from "@/lib/data";
import { STATIC_SITE } from "@/lib/static-site";
import { CITIES, site } from "@/site.config";

type Props = PageProps<"/[lang]/post">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).post.title };
}

export default async function PostPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <div className="page">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 text-2xl font-bold tracking-tight">{t.post.title}</h1>
        {/* ?kind=wanted in the address opens the form already set to "I am looking for". */}
        <Suspense fallback={null}>
          <PostFormLoader lang={lang} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

/** Decides how the form sends an ad, and hands it the lists it needs. The form itself is in components/PostForm. */
async function PostFormLoader({ lang, searchParams }: { lang: Lang; searchParams: Props["searchParams"] }) {
  const repo = getRepo();
  const categories = await repo.allCategories();
  const mode: PostMode = !repo.isDemo ? "direct" : site.teamWhatsapp ? "whatsapp" : "off";
  const props = {
    lang,
    categories: categories.map((c) => ({ slug: c.slug, name: c.name[lang] })),
    cities: CITIES.map((c) => ({ slug: c.slug, name: c.name[lang] })),
    mode,
    teamPhone: site.teamWhatsapp,
    siteName: site.name,
  };
  // No server: the browser reads ?kind= and ?category= itself.
  if (STATIC_SITE) return <PostFormClient {...props} />;

  const { kind, category } = await searchParams;
  return (
    <PostForm
      {...props}
      t={getDictionary(lang)}
      initialKind={kind === "wanted" ? "wanted" : "offer"}
      initialCategory={categories.some((c) => c.slug === category) ? (category as string) : ""}
    />
  );
}
