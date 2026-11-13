import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GridSkeleton, ListingGrid } from "@/components/ListingCard";
import { ServiceBadge, ServiceRow } from "@/components/ServiceTile";
import { ChatIcon, PlusIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { isLang, type Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { SERVICES, groupOf, serviceBySlug, type Service } from "@/lib/services";
import { whatsappLink } from "@/lib/whatsapp";
import { CITIES, site } from "@/site.config";

type Props = PageProps<"/[lang]/c/[slug]">;

/** The services are a fixed list, so every service screen is prepared ahead of time. */
export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const service = serviceBySlug(slug);
  if (!isLang(lang) || !service) return {};
  return { title: service.name[lang], description: service.blurb[lang] };
}

/**
 * One screen per service: what it covers, a filter by city, its ads, and two ways in:
 * post here, or (while a list is not complete) ask the team on WhatsApp.
 */
export default async function ServicePage({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  const service = serviceBySlug(slug);
  if (!isLang(lang) || !service) notFound();
  const t = getDictionary(lang);
  const tone = groupOf(service).tone;
  const postHref = `/${lang}/post?category=${service.categories[0]}`;

  return (
    <>
      <section className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-6 md:px-6 md:py-8">
          <ServiceBadge service={service} size="lg" />
          <div className="min-w-0 flex-1">
            <nav className="eyebrow" aria-label="breadcrumb">
              <Link href={`/${lang}/services`} className="hover:text-ink">
                {t.services.title}
              </Link>
              <span className="mx-1.5">/</span>
              <Link href={`/${lang}/services#${service.group}`} style={{ color: tone.fg }} className="hover:underline">
                {groupOf(service).name[lang]}
              </Link>
            </nav>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight md:text-[34px]">{service.name[lang]}</h1>
            <p className="mt-1 text-ink-soft">{service.blurb[lang]}</p>
          </div>
          <Link href={postHref} className="btn btn-primary w-full sm:w-auto">
            <PlusIcon width={18} height={18} />
            {t.services.postHere}
          </Link>
        </div>
      </section>

      <div className="page">
        <Suspense fallback={<GridSkeleton />}>
          <ServiceListings lang={lang} service={service} searchParams={searchParams} postHref={postHref} />
        </Suspense>

        <section className="mt-10">
          <h2 className="section-title mb-4">{t.services.related}</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.filter((s) => s.group === service.group && s.slug !== service.slug).map((s) => (
              <ServiceRow key={s.slug} service={s} lang={lang} count={0} />
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

async function ServiceListings({
  lang,
  service,
  searchParams,
  postHref,
}: {
  lang: Lang;
  service: Service;
  searchParams: Props["searchParams"];
  postHref: string;
}) {
  const { city: rawCity } = await searchParams;
  const city = typeof rawCity === "string" && CITIES.some((c) => c.slug === rawCity) ? rawCity : undefined;
  const now = await requestTime();
  const t = getDictionary(lang);
  const listings = await getRepo().search({ categories: service.categories, city, sort: "newest" }, now);
  const askLink = site.teamWhatsapp
    ? whatsappLink(site.teamWhatsapp, t.services.askMessage.replace("{service}", service.name[lang]))
    : null;
  const chip = (active: boolean) => `chip ${active ? "!border-ink !bg-ink !text-white" : ""}`;

  return (
    <>
      <nav aria-label={t.search.city} className="swipe-row -mx-4 mb-4 flex gap-2 px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <Link href={`/${lang}/c/${service.slug}`} className={chip(!city)}>
          {t.services.allCities}
        </Link>
        {CITIES.map((c) => (
          <Link key={c.slug} href={`/${lang}/c/${service.slug}?city=${c.slug}`} className={chip(city === c.slug)}>
            {c.name[lang]}
          </Link>
        ))}
      </nav>

      {listings.length > 0 ? (
        <>
          <p className="mb-3 text-[15px] text-ink-soft" aria-live="polite">
            {plural(lang, listings.length, t.search.results)}
          </p>
          <ListingGrid listings={listings} lang={lang} t={t} nowMs={now} />
        </>
      ) : (
        // No ads yet: the plan's "by hand first". A person finds it for you on WhatsApp.
        <div className="panel p-6 text-center md:p-10">
          <h2 className="text-lg font-semibold">{t.services.emptyTitle}</h2>
          <p className="mx-auto mt-1 max-w-md text-ink-soft">{t.services.emptyBody}</p>
          {askLink ? (
            <a href={askLink} target="_blank" rel="noopener" className="btn btn-wa mt-4">
              <ChatIcon width={18} height={18} />
              {t.services.askUs}
            </a>
          ) : null}
        </div>
      )}

      <aside className="panel mt-8 flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{t.services.providerTitle}</h2>
          <p className="text-sm text-ink-soft">{t.services.providerBody}</p>
        </div>
        <Link href={postHref} className="btn btn-quiet">
          {t.services.listFree}
        </Link>
      </aside>
    </>
  );
}
