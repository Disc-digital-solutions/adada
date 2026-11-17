import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type React from "react";
import { FreshFinds } from "@/components/FreshFinds";
import { HeroArt } from "@/components/HeroArt";
import { GridSkeleton } from "@/components/ListingCard";
import { ToolTile } from "@/components/ToolTile";
import { ArrowIcon, ChatIcon, PlusIcon, SearchIcon, ServiceIcon } from "@/components/icons";
import { getDictionary, type Dictionary } from "@/i18n";
import { isLang, type Lang } from "@/i18n/config";
import { BROWSE, type BrowseId } from "@/lib/browse";
import { getRepo } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { requestTime } from "@/lib/now";
import { parsePost } from "@/lib/parse-post";
import { EXAMPLE_ROOM_PHOTO, HARBOUR_PHOTO, type SitePhoto } from "@/lib/photos";
import { GROUPS, SERVICES, serviceBySlug, serviceOfCategory } from "@/lib/services";
import { withBase } from "@/lib/static-site";
import { TOOLS } from "@/lib/tools";
import { CITIES } from "@/site.config";

/** Services the home page shows first; every group and all the others are one tap away. */
const FEATURED_SERVICES = ["cleaning", "construction", "towing", "arrival", "viewing", "contract-check"];
/** The area list, in the order people on the island ask for them; the model's other areas follow. */
const AREA_ORDER = ["famagusta", "kyrenia", "nicosia", "iskele"];

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

/**
 * Home: the violet hero with the island in photos, one search, six ways into the ads, the newest
 * ads with their filters, then services (lavender), newcomer help (peach) and posting (violet).
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const p = t.pop;

  return (
    <>
      <Hero lang={lang} t={t} />
      <SearchPanel lang={lang} t={t} />

      <div className="page !pt-0">
        <section aria-labelledby="browse-title" className="mt-10">
          <h2 id="browse-title" className="sr-only">
            {p.browse}
          </h2>
          <ul className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 lg:grid-cols-6">
            {BROWSE.map((b, i) => (
              <li key={b.id} className="enter" style={delay(i)}>
                <Link
                  href={`/${lang}?browse=${b.id}#finds`}
                  scroll={false}
                  className="category-tile group flex h-full min-h-[6.5rem] flex-col items-start justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-card p-4 font-heading text-[15.5px] font-bold text-ink"
                >
                  <span aria-hidden className="wiggle grid h-11 w-11 place-items-center rounded-xl bg-brand-wash text-brand">
                    <ServiceIcon name={b.icon} width={22} height={22} />
                  </span>
                  {p[b.id as BrowseId]}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="finds" aria-labelledby="finds-title" className="mt-14 scroll-mt-24">
          <div className="mb-5 max-w-2xl">
            <h2 id="finds-title" className="section-title">
              {p.findsTitle}
            </h2>
            <p className="mt-1 text-ink-soft">{p.findsBody}</p>
          </div>
          <Suspense fallback={<GridSkeleton label={p.loading} />}>
            <Finds lang={lang} />
          </Suspense>
        </section>
      </div>

      <Services lang={lang} t={t} />
      <Newcomers lang={lang} t={t} />
      <PostPanel lang={lang} t={t} />
    </>
  );
}

async function Finds({ lang }: { lang: Lang }) {
  const now = await requestTime();
  const listings = await getRepo().search({ sort: "newest" }, now);
  return <FreshFinds lang={lang} listings={listings} nowMs={now} />;
}

function Hero({ lang, t }: { lang: Lang; t: Dictionary }) {
  const p = t.pop;
  // The photo really shows Girne (Kyrenia); its caption uses that place's name in the reader's language.
  const harbourPlace = CITIES.find((c) => c.slug === HARBOUR_PHOTO.place)?.name[lang] ?? HARBOUR_PHOTO.place;
  const cues = [
    { icon: "tag", text: p.cueFree },
    { icon: "chat2", text: p.cueLangs },
    { icon: "phone", text: p.cueWhatsApp },
  ];
  return (
    <section className="on-dark relative overflow-hidden bg-hero text-on-hero">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 pt-10 md:px-6 md:pb-32 md:pt-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="enter text-[13px] font-bold uppercase tracking-[0.14em] text-lime">{p.eyebrow}</p>
          <h1 className="hero-title enter mt-3 font-heading font-extrabold text-on-hero" style={delay(1)}>
            {p.heroTitle}
            <span className="block text-lime">{p.heroAccent}</span>
          </h1>
          <p className="enter mt-5 max-w-[34rem] text-[16.5px] leading-relaxed text-on-hero-soft md:text-[18px]" style={delay(2)}>
            {p.heroBody}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {cues.map((cue, i) => (
              <li key={cue.text} className="enter inline-flex min-h-9 items-center gap-2 rounded-full bg-hero-2 px-3.5 text-[13.5px] font-medium text-on-hero" style={delay(3 + i)}>
                <ServiceIcon name={cue.icon} width={16} height={16} className="text-lime" />
                <bdi>{cue.text}</bdi>
              </li>
            ))}
          </ul>
        </div>

        <HeroArt className="enter-fade relative mx-auto aspect-square w-full max-w-[28rem] sm:aspect-[10/9] sm:max-w-[30rem] lg:max-w-none">
          {/* The housing card: a generic photo, labelled as an example until real listings have photos. */}
          <figure className="hero-layer absolute start-0 top-[9%] w-[64%] rounded-[18px] sm:top-[7%] sm:w-[62%] bg-hero-lavender p-2.5 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)]" style={{ "--tilt": "-4deg", "--depth": "10px" } as React.CSSProperties}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
              <SitePhotoImg photo={EXAMPLE_ROOM_PHOTO} eager />
              <span className="absolute start-2 top-2 rounded-md bg-card/95 px-2 py-0.5 text-[11.5px] font-bold text-ink">{p.examplePhoto}</span>
            </div>
            <figcaption className="flex items-center gap-2 px-1.5 pb-1 pt-2.5 font-heading text-[13.5px] font-bold leading-tight sm:text-[15px]">
              <ServiceIcon name="key" width={17} height={17} className="text-brand" />
              {p.heroHomes}
            </figcaption>
          </figure>

          {/* The postcard: a real photo of Girne harbour. */}
          <figure className="hero-layer absolute end-0 top-0 w-[44%] rounded-[16px] bg-hero-peach p-2 pb-1 text-ink shadow-[0_24px_50px_-28px_rgb(0_0_0/0.7)]" style={{ "--tilt": "5deg", "--depth": "6px" } as React.CSSProperties}>
            <div className="aspect-[3/2] overflow-hidden rounded-[10px]">
              <SitePhotoImg photo={HARBOUR_PHOTO} eager />
            </div>
            <figcaption className="px-1 py-1.5 font-heading text-[14px] font-extrabold tracking-tight">{harbourPlace}</figcaption>
          </figure>

          {/* The message tile: the ready-made WhatsApp message every ad offers. */}
          <div className="hero-layer absolute bottom-0 end-0 w-[60%] rounded-[16px] bg-card p-3 sm:bottom-[3%] sm:end-[2%] sm:w-[56%] sm:p-3.5 text-ink shadow-[0_24px_50px_-26px_rgb(0_0_0/0.75)]" style={{ "--tilt": "-2deg", "--depth": "8px" } as React.CSSProperties}>
            <p className="flex items-center gap-2 text-[12.5px] font-bold text-mint-ink">
              <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-mint">
                <ChatIcon width={15} height={15} />
              </span>
              {p.messageTile}
            </p>
            <p dir="auto" className="mt-2 rounded-xl rounded-ss-sm bg-mint px-3 py-2 text-[12.5px] leading-snug text-ink sm:text-[13.5px]">
              {p.messageText}
            </p>
          </div>
        </HeroArt>
      </div>
    </section>
  );
}

/** A site photo with reserved dimensions, so nothing jumps while it loads. */
function SitePhotoImg({ photo, eager = false }: { photo: SitePhoto; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBase(photo.src)}
      width={photo.width}
      height={photo.height}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

/** The one search, overlapping the bottom of the hero. The pasted-post shortcut sits right under it. */
function SearchPanel({ lang, t }: { lang: Lang; t: Dictionary }) {
  const p = t.pop;
  const areas = [...AREA_ORDER.map((slug) => CITIES.find((c) => c.slug === slug)!), ...CITIES.filter((c) => !AREA_ORDER.includes(c.slug))];
  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 md:-mt-20 md:px-6">
      <div className="rounded-[var(--radius-panel)] border border-line bg-card p-3 shadow-[0_30px_60px_-34px_rgb(43_25_62/0.55)] md:p-4">
        <form action={withBase(`/${lang}/search`)} role="search" className="grid gap-2 md:grid-cols-[1fr_14rem_auto]">
          <label className="relative">
            <span className="sr-only">{t.search.placeholder}</span>
            <SearchIcon className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input name="q" type="search" placeholder={t.search.placeholder} className="field !min-h-13 !bg-paper ps-11 text-[16px]" />
          </label>
          <label>
            <span className="sr-only">{p.area}</span>
            <select name="city" defaultValue="" className="field !min-h-13 !bg-paper text-[16px]">
              <option value="">{p.allArea}</option>
              {areas.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name[lang]}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-accent !min-h-13 !px-8 text-[16px]">
            <SearchIcon width={19} height={19} />
            {t.search.submit}
          </button>
        </form>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-[14.5px] text-ink-soft">
          <span>{p.pasteAsk}</span>
          <Link href={`/${lang}/post#paste`} className="group inline-flex min-h-9 items-center gap-1 font-semibold text-brand hover:text-brand-deep">
            {p.pasteAction}
            <ArrowIcon width={16} height={16} className="nudge rtl:-scale-x-100" />
          </Link>
        </p>
      </div>
      <PhotoCredits t={t} />
    </div>
  );
}

/** The photo licences ask for credit: shown small, right under the search. */
function PhotoCredits({ t }: { t: Dictionary }) {
  const [before, rest] = t.pop.photoCredit.split("{harbour}");
  const [middle, after] = rest.split("{room}");
  const link = (photo: SitePhoto) => (
    <a href={photo.source} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
      {photo.author}, {photo.license}
    </a>
  );
  return (
    <p className="mt-2 px-2 text-[12px] text-ink-faint">
      {before}
      {link(HARBOUR_PHOTO)}
      {middle}
      {link(EXAMPLE_ROOM_PHOTO)}
      {after}
    </p>
  );
}

function Services({ lang, t }: { lang: Lang; t: Dictionary }) {
  const p = t.pop;
  const featured = FEATURED_SERVICES.map((slug) => serviceBySlug(slug)).filter((s) => s !== undefined);
  return (
    <section aria-labelledby="services-title" className="mt-16 bg-lavender py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 id="services-title" className="section-title">
            {p.servicesTitle}
          </h2>
          <p className="mt-2 text-[16px] text-ink-soft">{p.servicesBody}</p>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => (
            <li key={service.slug} className="reveal" style={delay(i)}>
              <Link href={`/${lang}/c/${service.slug}`} className="service-card group flex h-full items-start gap-3.5 rounded-[var(--radius-card)] border border-transparent bg-card p-4 transition-colors hover:border-brand/40">
                <span aria-hidden className="wiggle grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-hero text-lime">
                  <ServiceIcon name={service.icon} width={22} height={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-[16px] font-bold leading-tight">{service.name[lang]}</span>
                  <span className="mt-1 block text-[14px] leading-snug text-ink-soft">{service.blurb[lang]}</span>
                </span>
                <ArrowIcon width={18} height={18} className="nudge mt-1 shrink-0 text-brand rtl:-scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {GROUPS.map((group) => (
            <Link key={group.slug} href={`/${lang}/services#${group.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-brand/25 bg-card/70 px-3.5 text-[14px] font-semibold text-brand-deep transition-colors hover:bg-card">
              {group.name[lang]}
            </Link>
          ))}
          <Link href={`/${lang}/services`} className="btn btn-primary ms-auto">
            {p.servicesAll.replace("{n}", String(SERVICES.length))}
            <ArrowIcon width={17} height={17} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Newcomers({ lang, t }: { lang: Lang; t: Dictionary }) {
  const p = t.pop;
  return (
    <section aria-labelledby="new-title" className="bg-peach py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 id="new-title" className="section-title">
            {p.newTitle}
          </h2>
          <p className="mt-2 text-[16px] text-ink-soft">{p.newBody}</p>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolTile key={tool.href} tool={tool} lang={lang} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** From group text to form fields, using the real paste reader on a sample post. */
function PostPanel({ lang, t }: { lang: Lang; t: Dictionary }) {
  const p = t.pop;
  const parsed = parsePost(p.postSample);
  const fields = [
    { label: t.search.category, value: parsed.category ? (serviceOfCategory(parsed.category)?.name[lang] ?? parsed.title) : parsed.title },
    { label: p.fieldPrice, value: parsed.price !== null && parsed.currency ? formatMoney(parsed.price, parsed.currency, lang) : "—" },
    { label: p.fieldArea, value: CITIES.find((c) => c.slug === parsed.city)?.name[lang] ?? "—" },
  ];
  return (
    <section aria-labelledby="post-title" className="px-4 py-14 md:px-6 md:py-20">
      <div className="on-dark relative mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-[28px] bg-hero p-6 text-on-hero md:p-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <h2 id="post-title" className="font-heading text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[38px]">
            {p.postTitle}
          </h2>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-on-hero-soft">{p.postBody}</p>
          <Link href={`/${lang}/post#paste`} className="btn btn-accent mt-7 !min-h-12 !px-6 text-[16px]">
            <PlusIcon width={19} height={19} />
            {p.postButton}
          </Link>
        </div>
        <div aria-hidden className="grid gap-3">
          <p dir="auto" className="reveal max-w-[24rem] rounded-2xl rounded-es-sm bg-hero-2 px-4 py-3 text-[14.5px] leading-snug text-on-hero">
            {p.postSample}
          </p>
          <div className="reveal grid gap-2 rounded-2xl bg-card p-4 text-ink" style={delay(1)}>
            {fields.map((field, i) => (
              <div key={field.label} className="paste-field grid grid-cols-[6.5rem_1fr] items-center gap-3 rounded-lg bg-paper px-3 py-2" style={delay(i + 2)}>
                <span className="text-[12.5px] font-semibold text-ink-soft">{field.label}</span>
                <span className="truncate text-[15px] font-bold">
                  <bdi>{field.value}</bdi>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
