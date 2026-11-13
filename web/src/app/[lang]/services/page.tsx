import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ServiceRow } from "@/components/ServiceTile";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { GROUPS, countByService, servicesIn } from "@/lib/services";

type Props = PageProps<"/[lang]/services">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).services.title };
}

/** Every service in the app, grouped. Each group has an anchor, so the home rows can link to it. */
export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <div className="page">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t.services.title}</h1>
      <p className="mt-1 text-ink-soft">{t.services.intro}</p>
      <Suspense fallback={<Groups lang={lang} counts={{}} />}>
        <GroupsWithCounts lang={lang} />
      </Suspense>
    </div>
  );
}

async function GroupsWithCounts({ lang }: { lang: Lang }) {
  const listings = await getRepo().search({ sort: "newest" }, await requestTime());
  return <Groups lang={lang} counts={countByService(listings)} />;
}

function Groups({ lang, counts }: { lang: Lang; counts: Record<string, number> }) {
  return (
    <div className="mt-6 grid gap-8">
      {GROUPS.map((group) => (
        <section key={group.slug} id={group.slug} className="scroll-mt-20">
          <h2 className="section-title mb-3 flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: group.tone.fg }} />
            {group.name[lang]}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {servicesIn(group.slug).map((service) => (
              <ServiceRow key={service.slug} service={service} lang={lang} count={counts[service.slug] ?? 0} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
