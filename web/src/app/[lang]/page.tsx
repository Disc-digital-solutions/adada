import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Rail } from "@/components/Rail";
import { ServiceTile } from "@/components/ServiceTile";
import { ToolTile } from "@/components/ToolTile";
import { ArrowIcon, ChatIcon, GridIcon, PlusIcon, SearchIcon, ShieldIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { GROUPS, SERVICES, serviceBySlug, servicesIn, type GroupSlug } from "@/lib/services";
import { TOOLS } from "@/lib/tools";
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
  const facts: [typeof PlusIcon, string][] = [
    [PlusIcon, t.home.statFree],
    [GridIcon, `${SERVICES.length} · ${t.nav.services}`],
    [ChatIcon, "WhatsApp"],
    [ShieldIcon, `${t.home.statCities} · ${t.home.statLangs}`],
  ];
  const featured = FEATURED.map((slug) => serviceBySlug(slug)).filter((s) => s !== undefined);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        {/* One soft glow in the brand's sea colour; the rest stays quiet. */}
        <span aria-hidden className="pointer-events-none absolute -top-40 end-[-10%] h-[28rem] w-[28rem] rounded-full bg-sea/45 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-9 pt-8 md:px-6 md:pb-14 md:pt-14">
          <p className="eyebrow !text-white/60">North Cyprus · KKTC · شمال قبرص</p>
          <h1 className="mt-2 max-w-[22ch] text-[28px] font-bold leading-[1.15] tracking-tight md:text-[44px]">{t.home.heroTitle}</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-[17px]">{t.home.heroIntro}</p>

          <form action={`/${lang}/search`} role="search" className="mt-6 grid gap-2 rounded-xl bg-card p-2 text-ink shadow-[0_24px_48px_-24px_rgb(0_0_0/0.6)] md:max-w-3xl md:grid-cols-[1fr_13rem_auto]">
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
            <button type="submit" className="btn btn-primary !min-h-11 !px-7">
              {t.search.submit}
            </button>
          </form>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/70">
            {facts.map(([Icon, fact]) => (
              <li key={fact} className="flex items-center gap-1.5">
                <Icon width={15} height={15} className="text-white/50" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="page">
        <section className="mt-2">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="section-title">{t.home.whatNeed}</h2>
            <Link href={`/${lang}/services`} className="inline-flex items-center gap-1 text-sm font-semibold text-sea hover:text-sea-deep">
              {t.home.allServices}
              <ArrowIcon width={16} height={16} className="rtl:-scale-x-100" />
            </Link>
          </div>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:gap-3">
            {featured.map((service) => (
              <ServiceTile key={service.slug} service={service} lang={lang} />
            ))}
            <li>
              <Link href={`/${lang}/services`} className="panel flex h-full flex-col items-center gap-2 px-2 py-3.5 text-center text-sea-deep transition hover:border-sea/60">
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-paper">
                  <GridIcon width={23} height={23} />
                </span>
                <span className="text-[12.5px] font-semibold leading-tight md:text-[13.5px]">{t.home.allServices}</span>
              </Link>
            </li>
          </ul>
        </section>

        {/* The ads are fetched for each visit; the frame above is sent at once. */}
        <Suspense fallback={<div className="mt-10 h-72 rounded-xl bg-line/50" aria-hidden />}>
          <Rails lang={lang} />
        </Suspense>

        <section className="mt-14">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="section-title">{t.tools.title}</h2>
            <Link href={`/${lang}/tools`} className="inline-flex items-center gap-1 text-sm font-semibold text-sea hover:text-sea-deep">
              {t.home.seeAllShort}
              <ArrowIcon width={16} height={16} className="rtl:-scale-x-100" />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.slice(0, 4).map((tool) => (
              <ToolTile key={tool.href} tool={tool} lang={lang} />
            ))}
          </ul>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-sea-deep p-6 text-white md:p-8">
            <span aria-hidden className="pointer-events-none absolute -bottom-24 -end-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative max-w-[18ch] text-2xl font-bold leading-tight tracking-tight md:text-[28px]">{t.home.ctaTitle}</h2>
            <p className="relative mt-2 max-w-md text-[15px] leading-relaxed text-white/80">{t.home.ctaBody}</p>
            <Link href={`/${lang}/post`} className="btn relative mt-6 bg-card !text-ink hover:bg-paper">
              <PlusIcon width={18} height={18} />
              {t.home.ctaButton}
            </Link>
          </div>
          <div className="panel p-6 md:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ShieldIcon className="text-sea" />
              {t.home.trustTitle}
            </h2>
            <ul className="mt-4 grid gap-3 text-[14.5px]">
              {t.safety.tips.slice(0, 3).map((tip) => (
                <li key={tip} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-sea" />
                  {tip}
                </li>
              ))}
            </ul>
            <Link href={`/${lang}/safety`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sea hover:text-sea-deep">
              {t.nav.safety}
              <ArrowIcon width={16} height={16} className="rtl:-scale-x-100" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

/** The newest ads of a group of services. */
function inGroup(listings: Listing[], group: GroupSlug) {
  const categories = new Set(servicesIn(group).flatMap((s) => s.categories));
  return listings.filter((l) => categories.has(l.category) && l.kind === "offer").slice(0, 10);
}

async function Rails({ lang }: { lang: Lang }) {
  const now = await requestTime();
  const t = getDictionary(lang);
  const listings = await getRepo().search({ sort: "newest" }, now);
  const order: GroupSlug[] = ["housing", "buy", "vehicles", "students", "home", "work"];
  const wanted = listings.filter((l) => l.kind === "wanted").slice(0, 10);

  return (
    <>
      {order.map((slug) => (
        <Rail
          key={slug}
          title={GROUPS.find((g) => g.slug === slug)!.name[lang]}
          href={`/${lang}/services#${slug}`}
          listings={inGroup(listings, slug)}
          lang={lang}
          t={t}
          nowMs={now}
        />
      ))}
      <Rail title={t.home.wantedNow} hint={t.home.wantedNowHint} href={`/${lang}/search?kind=wanted`} listings={wanted} lang={lang} t={t} nowMs={now} />
    </>
  );
}
