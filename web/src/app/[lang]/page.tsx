import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Rail } from "@/components/Rail";
import { ServiceBadge, ServiceTile } from "@/components/ServiceTile";
import { ArrowIcon, GridIcon, PlusIcon, SearchIcon, ShieldIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { GROUPS, SERVICES, countByService, serviceBySlug, servicesIn, type GroupSlug } from "@/lib/services";
import type { Listing } from "@/lib/types";
import { CITIES } from "@/site.config";

/** The services on the home grid; the rest are one tap away under "All services". */
const FEATURED = ["flats", "dorms", "buy-sell", "cars", "car-rental", "towing", "cleaning", "construction", "arrival", "education", "jobs"];

/**
 * Home is the hub of the whole app: one search for everything, every service as a tile,
 * then a row of the newest ads from each part of the island's life.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-sea-deep),var(--color-sea)_55%,#1a8fa8)] text-white">
        {/* Soft circles: the sea and the sun, kept quiet behind the words. */}
        <span aria-hidden className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-tag/25 blur-2xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-32 -start-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-7 md:px-6 md:pb-12 md:pt-12">
          <h1 className="max-w-[20ch] text-[28px] font-bold leading-[1.12] tracking-tight md:text-[44px]">{t.home.heroTitle}</h1>
          <p className="mt-2 max-w-xl text-[15px] text-white/85 md:text-lg">{t.home.heroIntro}</p>

          <form action={`/${lang}/search`} role="search" className="mt-5 grid gap-2 rounded-2xl bg-card p-2 text-ink shadow-[0_18px_40px_-20px_rgb(0_0_0/0.55)] md:max-w-3xl md:grid-cols-[1fr_13rem_auto]">
            <label className="relative">
              <span className="sr-only">{t.search.placeholder}</span>
              <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input name="q" type="search" placeholder={t.search.placeholder} className="field !border-transparent !bg-paper ps-10" />
            </label>
            <label>
              <span className="sr-only">{t.search.city}</span>
              <select name="city" defaultValue="" className="field !border-transparent !bg-paper">
                <option value="">{t.home.anyCity}</option>
                {CITIES.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name[lang]}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-primary !min-h-11 !px-6">
              {t.search.submit}
            </button>
          </form>

          <ul className="mt-4 flex flex-wrap gap-2 text-[13px] font-medium">
            {[t.home.statFree, t.home.statCities, t.home.statLangs, "WhatsApp"].map((fact) => (
              <li key={fact} className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="page">
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-lg font-bold tracking-tight md:text-xl">{t.home.whatNeed}</h2>
            <Link href={`/${lang}/services`} className="inline-flex items-center gap-1 text-sm font-semibold text-sea hover:text-sea-deep">
              {t.home.allServices}
              <ArrowIcon width={16} height={16} className="rtl:-scale-x-100" />
            </Link>
          </div>
          {/* The ads, and so the counts on the tiles, are fetched for each visit. */}
          <Suspense fallback={<ServiceGrid lang={lang} label={t.home.allServices} />}>
            <ServiceGridWithCounts lang={lang} label={t.home.allServices} />
          </Suspense>
        </section>

        <Suspense fallback={<div className="mt-9 h-72 rounded-xl bg-line/50" aria-hidden />}>
          <Rails lang={lang} />
        </Suspense>

        <section className="mt-12 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white md:p-8">
            <span aria-hidden className="price-tag absolute -end-3 top-6 rotate-12 !px-8 !py-4 opacity-90" />
            <h2 className="max-w-[16ch] text-2xl font-bold leading-tight tracking-tight md:text-3xl">{t.home.ctaTitle}</h2>
            <p className="mt-2 max-w-md text-white/80">{t.home.ctaBody}</p>
            <Link href={`/${lang}/post`} className="btn mt-5 bg-tag !text-ink hover:brightness-95">
              <PlusIcon width={18} height={18} />
              {t.home.ctaButton}
            </Link>
          </div>
          <div className="rounded-2xl border border-line bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ShieldIcon className="text-sea" />
              {t.home.trustTitle}
            </h2>
            <ul className="mt-3 grid gap-2 text-[15px]">
              {t.safety.tips.slice(0, 3).map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sea" />
                  {tip}
                </li>
              ))}
            </ul>
            <Link href={`/${lang}/safety`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sea hover:text-sea-deep">
              {t.nav.safety}
              <ArrowIcon width={16} height={16} className="rtl:-scale-x-100" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function ServiceGrid({ lang, label, counts }: { lang: Lang; label: string; counts?: Record<string, number> }) {
  const featured = FEATURED.map((slug) => serviceBySlug(slug)).filter((s) => s !== undefined);
  return (
    <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:gap-3">
      {featured.map((service) => (
        <ServiceTile key={service.slug} service={service} lang={lang} count={counts?.[service.slug]} />
      ))}
      <li>
        <Link
          href={`/${lang}/services`}
          className="flex h-full flex-col items-center gap-2 rounded-2xl border border-dashed border-sea/50 bg-sea-wash/50 px-2 py-3 text-center text-sea-deep hover:border-sea"
        >
          <span aria-hidden className="grid h-12 w-12 place-items-center rounded-xl bg-card">
            <GridIcon width={26} height={26} />
          </span>
          <span className="text-[13px] font-semibold leading-tight md:text-sm">{label}</span>
          <span className="text-[11px] font-medium" dir="ltr">
            {SERVICES.length}
          </span>
        </Link>
      </li>
    </ul>
  );
}

async function ServiceGridWithCounts({ lang, label }: { lang: Lang; label: string }) {
  const now = await requestTime();
  const listings = await getRepo().search({ sort: "newest" }, now);
  return <ServiceGrid lang={lang} label={label} counts={countByService(listings)} />;
}

/** The newest ads of a group of services. */
function inGroup(listings: Listing[], group: GroupSlug, kind: "offer" | "any" = "offer") {
  const categories = new Set(servicesIn(group).flatMap((s) => s.categories));
  return listings.filter((l) => categories.has(l.category) && (kind === "any" || l.kind === "offer")).slice(0, 10);
}

async function Rails({ lang }: { lang: Lang }) {
  const now = await requestTime();
  const t = getDictionary(lang);
  const listings = await getRepo().search({ sort: "newest" }, now);
  const group = (slug: GroupSlug) => GROUPS.find((g) => g.slug === slug)!;
  const badge = (serviceSlug: string) => {
    const service = serviceBySlug(serviceSlug);
    return service ? <ServiceBadge service={service} size="sm" /> : null;
  };

  const rails: { slug: GroupSlug; icon: string; items: Listing[] }[] = [
    { slug: "housing", icon: "flats", items: inGroup(listings, "housing") },
    { slug: "buy", icon: "buy-sell", items: inGroup(listings, "buy") },
    { slug: "vehicles", icon: "cars", items: inGroup(listings, "vehicles") },
    { slug: "students", icon: "arrival", items: inGroup(listings, "students") },
    { slug: "home", icon: "cleaning", items: inGroup(listings, "home") },
    { slug: "work", icon: "jobs", items: inGroup(listings, "work") },
  ];
  const wanted = listings.filter((l) => l.kind === "wanted").slice(0, 10);

  return (
    <>
      {rails.map((rail) => (
        <Rail
          key={rail.slug}
          title={group(rail.slug).name[lang]}
          icon={badge(rail.icon)}
          href={`/${lang}/services#${rail.slug}`}
          listings={rail.items}
          lang={lang}
          t={t}
          nowMs={now}
        />
      ))}
      <Rail
        title={t.home.wantedNow}
        hint={t.home.wantedNowHint}
        href={`/${lang}/search?kind=wanted`}
        listings={wanted}
        lang={lang}
        t={t}
        nowMs={now}
      />
    </>
  );
}
