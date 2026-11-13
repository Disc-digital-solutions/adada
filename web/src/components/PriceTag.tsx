import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { formatMoney } from "@/lib/format";
import type { Listing } from "@/lib/types";

/** What a price reads as: "£45", or the word for free. Nothing when no price was given. */
export function priceText(listing: Pick<Listing, "price" | "currency">, lang: Lang, t: Dictionary): string | null {
  if (listing.price === null) return null;
  if (listing.price === 0) return t.listing.free;
  return formatMoney(listing.price, listing.currency, lang);
}

/** The yellow tag. The one loud thing on the page. */
export function PriceTag({
  listing,
  lang,
  t,
  large = false,
}: {
  listing: Pick<Listing, "price" | "currency">;
  lang: Lang;
  t: Dictionary;
  large?: boolean;
}) {
  const text = priceText(listing, lang, t);
  if (text === null) return null;
  return (
    <span className={large ? "price-tag price-tag-lg" : "price-tag"}>
      {/* Numbers read left to right in every language. */}
      <bdi>{text}</bdi>
    </span>
  );
}
