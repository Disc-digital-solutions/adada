import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GridSkeleton } from "@/components/ListingCard";
import { ServiceListings } from "@/components/ServiceListings";
import { ServiceListingsClient } from "@/components/ServiceListingsClient";
import { ServiceBadge, ServiceRow } from "@/components/ServiceTile";
import { ChatIcon, PlusIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { STATIC_SITE } from "@/lib/static-site";
import { SERVICES, groupOf, serviceBySlug, type Service } from "@/lib/services";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/site.config";

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
  const postHref = `/${lang}/post?category=${service.categories[0] ?? ""}`;
  const requestLink = site.teamWhatsapp
    ? whatsappLink(site.teamWhatsapp, t.request.message.replace("{service}", service.name[lang]))
    : null;

  return (
    <>
      <section className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-6 md:px-6 md:py-8">
          <span className="enter pop">
            <ServiceBadge service={service} size="lg" />
          </span>
          <div className="enter min-w-0 flex-1" style={{ "--i": 1 } as React.CSSProperties}>
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
          {service.mode === "request" ? (
            requestLink ? (
              <a href={requestLink} target="_blank" rel="noopener" className="btn btn-wa w-full sm:w-auto">
                <ChatIcon width={18} height={18} />
                {t.request.button}
              </a>
            ) : null
          ) : (
            <Link href={postHref} className="btn btn-primary w-full sm:w-auto">
              <PlusIcon width={18} height={18} />
              {t.services.postHere}
            </Link>
          )}
        </div>
      </section>

      <div className="page">
        {service.mode === "request" ? (
          // Not a list of ads: a service a person arranges, asked for on WhatsApp.
          <section className="panel p-6 md:p-8">
            <h2 className="section-title">{t.request.howTitle}</h2>
            <ol className="mt-4 grid gap-3 md:grid-cols-3">
              {t.request.how.map((step, i) => (
                <li key={step} className="flex gap-3 rounded-xl bg-paper p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sea text-sm font-bold text-white">{i + 1}</span>
                  <span className="text-[15px]">{step}</span>
                </li>
              ))}
            </ol>
            {requestLink ? (
              <a href={requestLink} target="_blank" rel="noopener" className="btn btn-wa mt-6">
                <ChatIcon width={18} height={18} />
                {t.request.button}
              </a>
            ) : (
              <p className="notice mt-6">{t.request.noTeam}</p>
            )}
          </section>
        ) : (
          <Suspense fallback={<GridSkeleton />}>
            <ServiceAds lang={lang} service={service} searchParams={searchParams} postHref={postHref} />
          </Suspense>
        )}

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

async function ServiceAds({
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
  const now = await requestTime();
  const t = getDictionary(lang);
  const askLink = site.teamWhatsapp
    ? whatsappLink(site.teamWhatsapp, t.services.askMessage.replace("{service}", service.name[lang]))
    : null;
  const props = { lang, service, nowMs: now, askLink, postHref };
  // No server: all the service's ads go to the browser, which applies ?city= and ?women= itself.
  if (STATIC_SITE) {
    const listings = await getRepo().search({ categories: service.categories, sort: "newest" }, now);
    return <ServiceListingsClient {...props} listings={listings} />;
  }
  const query = await searchParams;
  const listings = await getRepo().search({ categories: service.categories, sort: "newest" }, now);
  return <ServiceListings {...props} t={t} listings={listings} query={query} />;
}
