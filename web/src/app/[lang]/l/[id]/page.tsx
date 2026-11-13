import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cityName } from "@/components/ListingCard";
import { Photo } from "@/components/Photo";
import { PriceTag, priceText } from "@/components/PriceTag";
import { CopyTextButton } from "@/components/CopyTextButton";
import { ShareButton } from "@/components/ShareButton";
import { ChatIcon, FlagIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { LANGS, isLang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { timeAgo } from "@/lib/format";
import { groupPost } from "@/lib/share-text";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/site.config";

type Props = PageProps<"/[lang]/l/[id]">;

/** The title and picture that WhatsApp and others show when the link is shared. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLang(lang)) return {};
  const listing = await getRepo().listing(id, await requestTime());
  if (!listing || listing.status === "removed") return {};

  const price = priceText(listing, lang, getDictionary(lang));
  const title = price ? `${listing.title} (${price})` : listing.title;
  return {
    title,
    description: listing.description.slice(0, 160),
    openGraph: { title, description: listing.description.slice(0, 160), images: listing.photos.slice(0, 1) },
  };
}

export default function ListingPage(props: Props) {
  return (
    <div className="page">
      {/* Which ad this is comes from the address, so the page is built when someone opens it. */}
      <Suspense fallback={<div className="mx-auto aspect-square max-w-xl rounded-xl bg-line/60" aria-hidden />}>
        <ListingView {...props} />
      </Suspense>
    </div>
  );
}

async function ListingView({ params, searchParams }: Props) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();
  const { notice } = await searchParams;
  const now = await requestTime();
  const listing = await getRepo().listing(id, now);
  if (!listing) notFound();

  const t = getDictionary(lang);

  if (listing.status === "removed") {
    return (
      <div className="mx-auto max-w-xl">
        <p className="notice notice-alert">{t.listing.removedNotice}</p>
        <Link href={`/${lang}`} className="btn btn-primary mt-4">
          {t.notFound.home}
        </Link>
      </div>
    );
  }

  const sold = listing.status === "sold";
  const wanted = listing.kind === "wanted";

  // The text for the seller's groups: the reader's language first, then the others, and one link
  // with no language in it, so every reader opens the ad in their own language.
  const groupText = groupPost({
    title: wanted ? `${t.listing.wanted}: ${listing.title}` : listing.title,
    price: priceText(listing, lang, t),
    city: cityName(listing.city, lang),
    lines: [lang, ...LANGS.filter((l) => l !== lang)].map((l) => {
      const words = getDictionary(l).listing;
      return wanted ? words.groupLineWanted : words.groupLine;
    }),
    url: `${site.url}/l/${listing.id}`,
  });
  const reportLink = site.teamWhatsapp
    ? whatsappLink(site.teamWhatsapp, t.listing.reportMessage.replace("{url}", `${site.url}/${lang}/l/${listing.id}`))
    : null;

  return (
    <article className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[minmax(0,1fr)_22rem] md:items-start">
      {listing.photos.length > 0 ? (
        // Swipe sideways through the pictures. No script needed: the browser snaps to each one.
        <div className="swipe-row -mx-4 flex snap-x snap-mandatory md:mx-0 md:rounded-xl">
          {listing.photos.map((src, index) => (
            <div key={src + index} className="relative aspect-square w-full shrink-0 snap-center bg-card">
              <Photo
                src={src}
                alt={t.listing.photoOf.replace("{n}", String(index + 1)).replace("{total}", String(listing.photos.length))}
                eager={index === 0}
                className={sold ? "opacity-60 grayscale" : ""}
              />
              {listing.photos.length > 1 ? (
                <span className="absolute bottom-3 end-3 rounded-full bg-ink/80 px-2.5 py-0.5 text-[13px] text-white" dir="ltr">
                  {index + 1} / {listing.photos.length}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className={listing.photos.length === 0 ? "md:col-span-2 md:max-w-2xl" : ""}>
        {wanted ? <p className="mb-1 text-sm font-semibold text-sea-deep">{t.listing.wanted}</p> : null}
        <h1 dir="auto" className="text-[24px] font-bold leading-tight tracking-tight md:text-[28px]">
          {listing.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          {wanted && listing.price !== null ? <span className="text-sm text-ink-soft">{t.listing.budget}</span> : null}
          <PriceTag listing={listing} lang={lang} t={t} large />
          {sold ? <span className="sold-stamp !static !rotate-0">{t.listing.sold}</span> : null}
        </div>

        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
          <span>{cityName(listing.city, lang)}</span>
          <span>{timeAgo(listing.createdAt, now, lang)}</span>
          <span>{plural(lang, listing.views, t.listing.seenBy)}</span>
        </p>

        {notice === "sample" ? <p className="notice mt-4">{t.demo.noSeller}</p> : null}
        {sold ? <p className="notice notice-alert mt-4">{t.listing.soldNotice}</p> : null}

        {sold ? null : (
          <div className="mt-4 flex flex-wrap gap-2">
            {/* A plain link, never prefetched: opening it counts as one contact. */}
            <a href={`/${lang}/l/${listing.id}/wa`} rel="nofollow" className="btn btn-wa min-w-[14rem] flex-1">
              <ChatIcon />
              {t.listing.whatsapp}
            </a>
            <ShareButton title={listing.title} label={t.listing.share} copiedLabel={t.listing.copied} />
            <CopyTextButton text={groupText} label={t.listing.copyForGroups} copiedLabel={t.listing.copiedForGroups} />
          </div>
        )}
        {sold ? null : <p className="hint">{t.listing.safetyNote}</p>}

        <p dir="auto" className="mt-5 whitespace-pre-line text-[16px] leading-relaxed">
          {listing.description}
        </p>

        <section className="mt-6 rounded-xl border border-line bg-card p-4">
          <h2 className="text-[13px] font-semibold text-ink-soft">{t.listing.seller}</h2>
          <p className="mt-0.5 text-[17px] font-semibold" dir="auto">
            {listing.seller.name}
          </p>
          <Link href={`/${lang}/s/${listing.seller.shopSlug}`} className="mt-1 inline-block font-medium text-sea underline underline-offset-4 hover:text-sea-deep">
            {t.listing.viewShop}
          </Link>
        </section>

        {/* Reports go to a person on the team's WhatsApp line until the reports table exists. */}
        {reportLink ? (
          <a href={reportLink} rel="nofollow noopener" target="_blank" className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
            <FlagIcon width={16} height={16} />
            {t.listing.report}
          </a>
        ) : null}
      </div>
    </article>
  );
}
