import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { Suspense } from "react";
import { GridSkeleton, ListingGrid, cityName } from "@/components/ListingCard";
import { VerifiedBadge } from "@/components/Badges";
import { CopyTextButton } from "@/components/CopyTextButton";
import { ShareButton } from "@/components/ShareButton";
import { getDictionary } from "@/i18n";
import { LANGS, isLang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { getRepo } from "@/lib/data";
import { requestTime } from "@/lib/now";
import { groupPost } from "@/lib/share-text";
import { site } from "@/site.config";

type Props = PageProps<"/[lang]/s/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const shop = await getRepo().shop(slug, await requestTime());
  return shop ? { title: shop.seller.name } : {};
}

/**
 * A seller's shop: every ad they have, on one page with one link.
 * This is the link a seller puts in an Instagram bio or on a sticker.
 */
export default function ShopPage(props: Props) {
  return (
    <div className="page">
      <Suspense fallback={<GridSkeleton />}>
        <ShopView {...props} />
      </Suspense>
    </div>
  );
}

async function ShopView({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const now = await requestTime();
  const shop = await getRepo().shop(slug, now);
  if (!shop) notFound();

  const t = getDictionary(lang);
  // The shared link has no language in it: each visitor gets the shop in their own.
  const shopUrl = `${site.url}/s/${shop.seller.shopSlug}`;
  const groupText = groupPost({
    title: shop.seller.name,
    price: null,
    city: cityName(shop.seller.city, lang),
    lines: [lang, ...LANGS.filter((l) => l !== lang)].map((l) => getDictionary(l).shop.groupLine),
    url: shopUrl,
  });
  const embedCode = `<iframe src="${site.url}/${lang}/embed/${shop.seller.shopSlug}" width="100%" height="560" style="border:0" loading="lazy" title="${shop.seller.name}"></iframe>`;
  const qrSvg = await QRCode.toString(shopUrl, {
    type: "svg",
    margin: 1,
    color: { dark: "#0f1e26", light: "#ffffff" },
  });

  return (
    <>
      <header className="panel mb-8 flex flex-wrap items-center gap-5 p-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- a QR code drawn on the spot, not a photo */}
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
          alt={t.shop.qrCaption}
          width={112}
          height={112}
          className="rounded-md border border-line"
        />
        <div className="min-w-0 flex-1">
          <h1 dir="auto" className="flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight">
            {shop.seller.name}
            {shop.seller.verified ? <VerifiedBadge t={t} /> : null}
          </h1>
          <p className="mt-0.5 text-sm text-ink-soft">
            {cityName(shop.seller.city, lang)}, {plural(lang, shop.listings.length, t.shop.ads)}
          </p>
          <p className="hint">{t.shop.qrCaption}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ShareButton title={shop.seller.name} label={t.shop.share} copiedLabel={t.listing.copied} />
            <CopyTextButton text={groupText} label={t.listing.copyForGroups} copiedLabel={t.listing.copiedForGroups} />
          </div>
        </div>
      </header>

      {shop.listings.length > 0 ? (
        <ListingGrid listings={shop.listings} lang={lang} t={t} nowMs={now} />
      ) : (
        <p className="text-ink-soft">{t.shop.empty}</p>
      )}

      {/* The embed widget (BIZ-15): the same ads on the seller's own website. */}
      <section className="panel mt-10 p-5">
        <h2 className="font-semibold">{t.embed.title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t.embed.body}</p>
        <pre dir="ltr" className="mt-3 overflow-x-auto rounded-lg bg-paper p-3 text-[12px]">{embedCode}</pre>
        <div className="mt-3">
          <CopyTextButton text={embedCode} label={t.embed.copy} copiedLabel={t.embed.copied} />
        </div>
      </section>
    </>
  );
}
