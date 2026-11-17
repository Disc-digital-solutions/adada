import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type React from "react";
import { CountUp } from "@/components/CountUp";
import { Photo } from "@/components/Photo";
import { priceText } from "@/components/PriceTag";
import { Rail } from "@/components/Rail";
import { ServiceArt } from "@/components/ServiceTile";
import { ServiceTile } from "@/components/ServiceTile";
import { ToolTile } from "@/components/ToolTile";
import { ArrowIcon, ChatIcon, GridIcon, PlusIcon, SearchIcon, ServiceIcon, ShieldIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { tooLowComparedWith } from "@/lib/prices";
import { GROUPS, SERVICES, serviceBySlug, servicesIn, type GroupSlug } from "@/lib/services";
import { TOOLS } from "@/lib/tools";
import type { Listing } from "@/lib/types";
import { CITIES } from "@/site.config";
import { withBase } from "@/lib/static-site";

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
        {/* Two soft lights drifting slowly behind the words: the sea and the sun. */}
        <span aria-hidden className="glow pointer-events-none absolute -top-40 end-[-10%] h-[30rem] w-[30rem] rounded-full bg-sea/40 blur-3xl" />
        <span aria-hidden className="glow-slow pointer-events-none absolute -bottom-48 start-[-12%] h-[26rem] w-[26rem] rounded-full bg-sea-wash/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-8 md:px-6 md:pb-16 md:pt-14 lg:grid-cols-[1fr_24rem]">
          <div>
            <p className="eyebrow enter !text-white/60">North Cyprus · KKTC · شمال قبرص</p>
            <h1 className="enter mt-2 max-w-[22ch] text-[30px] font-bold leading-[1.12] tracking-tight md:text-[48px]" style={{ "--i": 1 } as React.CSSProperties}>
              {t.home.heroTitle}
            </h1>
            <p className="enter mt-3 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-[17px]" style={{ "--i": 2 } as React.CSSProperties}>
              {t.home.heroIntro}
            </p>

          <form action={withBase(`/${lang}/search`)} role="search"
            style={{ "--i": 3 } as React.CSSProperties} className="enter mt-6 grid gap-2 rounded-xl bg-card p-2 text-ink shadow-[0_24px_48px_-24px_rgb(0_0_0/0.6)] md:max-w-3xl md:grid-cols-[1fr_13rem_auto]">
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
              {facts.map(([Icon, fact], i) => (
                <li key={fact} className="enter flex items-center gap-1.5" style={{ "--i": 4 + i } as React.CSSProperties}>
                  <Icon width={15} height={15} className="text-white/50" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Three real ads floating beside the words, on wide screens. */}
          <Suspense fallback={null}>
            <HeroCollage lang={lang} />
          </Suspense>
        </div>

        {/* Every service, sliding past; it holds still under the pointer. */}
        <ServiceMarquee lang={lang} />
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
            {featured.map((service, i) => (
              <ServiceTile key={service.slug} service={service} lang={lang} index={i} />
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
        <Suspense fallback={<div className="shimmer mt-10 h-72 rounded-xl" aria-hidden />}>
          <Rails lang={lang} />
        </Suspense>

        <Suspense fallback={null}>
          <Stats lang={lang} />
        </Suspense>

        <section className="reveal mt-14">
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

        <section className="reveal mt-14 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-sea-deep p-6 text-white md:p-8">
            <span aria-hidden className="pointer-events-none absolute -bottom-24 -end-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative max-w-[18ch] text-2xl font-bold leading-tight tracking-tight md:text-[28px]">{t.home.ctaTitle}</h2>
            <p className="relative mt-2 max-w-md text-[15px] leading-relaxed text-white/80">{t.home.ctaBody}</p>
            <Link href={`/${lang}/post`} className="btn btn-accent relative mt-6">
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

/** Three ads with pictures, tilted and floating, so the first screen already shows what is inside. */
async function HeroCollage({ lang }: { lang: Lang }) {
  const now = await requestTime();
  const t = getDictionary(lang);
  const all = await getRepo().search({ sort: "newest" }, now);
  // Never showcase an ad whose price looks too good to be true (the scam warning, ACC-20).
  const picks = all.filter((l) => l.kind === "offer" && l.status === "live" && l.photos.length > 0 && !tooLowComparedWith(l, all)).slice(0, 3);
  const spots = [
    { tilt: "-6deg", place: "start-0 top-10 w-44" },
    { tilt: "5deg", place: "end-0 top-0 w-48" },
    { tilt: "-2deg", place: "start-28 bottom-0 w-48" },
  ];
  return (
    <div aria-hidden className="relative hidden h-[26rem] lg:block">
      {picks.map((l, i) => (
        <Link
          key={l.id}
          href={`/${lang}/l/${l.id}`}
          tabIndex={-1}
          className={`floaty enter-fade absolute ${spots[i].place} rounded-2xl bg-card p-2 text-ink shadow-[0_24px_48px_-20px_rgb(0_0_0/0.6)]`}
          style={{ "--tilt": spots[i].tilt, "--i": i + 2 } as React.CSSProperties}
        >
          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-paper">
            {l.photos[0] ? <Photo src={l.photos[0]} alt="" /> : <ServiceArt category={l.category} lang={lang} />}
          </div>
          <p className="mt-1.5 px-1 text-[14px] font-bold">{priceText(l, lang, t)}</p>
          <p className="truncate px-1 pb-1 text-[12px] text-ink-soft" dir="auto">
            {l.title}
          </p>
        </Link>
      ))}
    </div>
  );
}

/** All the services as chips sliding past in a loop (the list twice, so the loop has no seam). */
function ServiceMarquee({ lang }: { lang: Lang }) {
  const chips = SERVICES.map((service) => (
    <Link
      key={service.slug}
      href={`/${lang}/c/${service.slug}`}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[13px] text-white/85 transition hover:border-white/50 hover:text-white"
    >
      <ServiceIcon name={service.icon} width={15} height={15} className="text-white/60" />
      {service.name[lang]}
    </Link>
  ));
  return (
    <nav aria-label={getDictionary(lang).nav.services} className="marquee relative border-t border-white/10 py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="marquee-track flex w-max gap-2" dir="ltr">
        {chips}
        <span aria-hidden className="contents">
          {SERVICES.map((service) => (
            <span key={service.slug} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[13px] text-white/85">
              <ServiceIcon name={service.icon} width={15} height={15} className="text-white/60" />
              {service.name[lang]}
            </span>
          ))}
        </span>
      </div>
    </nav>
  );
}

/** A row of numbers that count up as they scroll into view. */
async function Stats({ lang }: { lang: Lang }) {
  const now = await requestTime();
  const t = getDictionary(lang);
  const ads = (await getRepo().search({ sort: "newest" }, now)).length;
  const items: [number, string][] = [
    [SERVICES.length, t.nav.services],
    [ads, t.search.results.other.replace("{n}", "").trim()],
    [CITIES.length, t.home.statCities.replace(/\d+\s*/, "")],
    [3, t.home.statLangs.replace(/\d+\s*/, "")],
  ];
  return (
    <ul className="reveal mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map(([n, label]) => (
        <li key={label} className="panel px-4 py-5 text-center">
          <p className="text-[34px] font-bold leading-none tracking-tight text-sea-deep">
            <CountUp to={n} />
          </p>
          <p className="mt-2 text-[13px] font-medium text-ink-soft">{label}</p>
        </li>
      ))}
    </ul>
  );
}
