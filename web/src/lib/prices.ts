import type { Currency, Listing } from "./types";

/**
 * Typical prices from the ads themselves. Used twice:
 * - the "price looks wrong" warning on an ad, because a rent far below the usual one is the
 *   commonest bait of the rental scam;
 * - the open price page, which anyone can read and which gives the press a reason to link to us.
 * Prices are only compared inside one currency and one kind of thing, and only when there are
 * enough ads to say what "usual" is.
 */
export const PRICE_GROUPS: Record<string, string[]> = {
  rent: ["rooms", "agencies"],
  dorm: ["dorms"],
  car: ["cars"],
};

/** How many ads a typical price needs before it is shown or used. */
export const MIN_SAMPLE = 3;
/** Below this share of the typical price, an ad gets the warning. */
export const TOO_LOW = 0.5;

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function groupOf(category: string): string | null {
  for (const [group, categories] of Object.entries(PRICE_GROUPS)) if (categories.includes(category)) return group;
  return null;
}

export interface PriceRow {
  group: string;
  city: string | null;
  currency: Currency;
  median: number;
  low: number;
  high: number;
  count: number;
}

/** Typical prices per kind of thing, per city and for the whole island, for offers with a price. */
export function priceIndex(listings: Listing[]): PriceRow[] {
  const buckets = new Map<string, { group: string; city: string | null; currency: Currency; prices: number[] }>();
  for (const l of listings) {
    const group = groupOf(l.category);
    if (!group || l.kind !== "offer" || !l.price) continue;
    for (const city of [l.city, null]) {
      const key = `${group}|${city ?? "*"}|${l.currency}`;
      const bucket = buckets.get(key) ?? { group, city, currency: l.currency, prices: [] };
      bucket.prices.push(l.price);
      buckets.set(key, bucket);
    }
  }
  const rows: PriceRow[] = [];
  for (const b of buckets.values()) {
    if (b.prices.length < MIN_SAMPLE) continue;
    rows.push({
      group: b.group,
      city: b.city,
      currency: b.currency,
      median: median(b.prices)!,
      low: Math.min(...b.prices),
      high: Math.max(...b.prices),
      count: b.prices.length,
    });
  }
  return rows.sort((a, b) => a.group.localeCompare(b.group) || (a.city ?? "").localeCompare(b.city ?? "") || a.currency.localeCompare(b.currency));
}

/**
 * The typical price an ad should be compared with, when its own price is suspiciously low.
 * The ad itself is left out of the comparison. City first; the whole island if the city has too few.
 */
export function tooLowComparedWith(listing: Listing, all: Listing[]): number | null {
  const group = groupOf(listing.category);
  if (!group || listing.kind !== "offer" || !listing.price) return null;
  const peers = all.filter(
    (l) => l.id !== listing.id && l.kind === "offer" && l.price && l.currency === listing.currency && groupOf(l.category) === group,
  );
  const inCity = peers.filter((l) => l.city === listing.city).map((l) => l.price!);
  const sample = inCity.length >= MIN_SAMPLE ? inCity : peers.map((l) => l.price!);
  if (sample.length < MIN_SAMPLE) return null;
  const typical = median(sample)!;
  return listing.price < typical * TOO_LOW ? typical : null;
}
