import { courseCodesIn, normalizeCourse } from "./course";
import { CURRENCIES } from "./types";
import type { Category, Currency, Kind, Listing, ListingFilter, Sort } from "./types";

const DAY = 24 * 60 * 60 * 1000;
const SOLD_STAYS_FOR = 7 * DAY;

/**
 * Makes text comparable for search: lower case, and the Turkish letters
 * İ / I / ı / i all become a plain "i", so "ISITICI" finds "ısıtıcı".
 */
export function fold(text: string): string {
  return text
    .toLowerCase() // "İ" becomes "i" + a combining dot (U+0307)
    .replace(/̇/g, "")
    .replace(/ı/g, "i");
}

/** Live listings are listed. Sold ones stay a week, marked sold. Removed ones never show. */
export function isListed(listing: Listing, nowMs: number): boolean {
  if (listing.status === "live") return true;
  if (listing.status === "sold" && listing.soldAt) {
    return nowMs - Date.parse(listing.soldAt) < SOLD_STAYS_FOR;
  }
  return false;
}

function matches(listing: Listing, filter: ListingFilter): boolean {
  if (filter.q) {
    const needle = fold(filter.q);
    // "MATH 101" also finds "math101": course codes are compared in one spelling.
    const course = normalizeCourse(filter.q);
    const found =
      fold(listing.title).includes(needle) ||
      fold(listing.description).includes(needle) ||
      (course !== "" && courseCodesIn(`${listing.title} ${listing.description}`).includes(course));
    if (!found) return false;
  }
  if (filter.course && !courseCodesIn(`${listing.title} ${listing.description}`).includes(filter.course)) return false;
  if (filter.women && !listing.womenOnly) return false;
  if (filter.category && listing.category !== filter.category) return false;
  if (filter.categories && !filter.categories.includes(listing.category)) return false;
  if (filter.city && listing.city !== filter.city) return false;
  if (filter.kind && listing.kind !== filter.kind) return false;

  // Prices in different currencies cannot be compared without exchange rates (a later level),
  // so the price range only works inside one chosen currency.
  if (filter.currency) {
    if (listing.price === null || listing.currency !== filter.currency) return false;
    if (filter.min !== undefined && listing.price < filter.min) return false;
    if (filter.max !== undefined && listing.price > filter.max) return false;
  }
  return true;
}

function compare(sort: Sort, byPrice: boolean) {
  const newestFirst = (a: Listing, b: Listing) => Date.parse(b.createdAt) - Date.parse(a.createdAt);
  if (!byPrice || sort === "newest") return newestFirst;
  const direction = sort === "cheapest" ? 1 : -1;
  return (a: Listing, b: Listing) => direction * ((a.price ?? 0) - (b.price ?? 0)) || newestFirst(a, b);
}

/** The listings a visitor should see for this search, in order. Returns a new array. */
export function filterListings(listings: Listing[], filter: ListingFilter, nowMs: number): Listing[] {
  return listings
    .filter((listing) => isListed(listing, nowMs) && matches(listing, filter))
    .sort(compare(filter.sort, filter.currency !== undefined));
}

/** Only categories with at least one listed ad, so the site never shows an empty shelf. */
export function visibleCategories(categories: Category[], listings: Listing[], nowMs: number): Category[] {
  const inUse = new Set(listings.filter((l) => isListed(l, nowMs)).map((l) => l.category));
  return categories.filter((c) => inUse.has(c.slug)).sort((a, b) => a.sort - b.sort);
}

const KINDS: readonly Kind[] = ["offer", "wanted"];
const SORTS: readonly Sort[] = ["newest", "cheapest", "dearest"];

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function wholeNumber(value: string): number | undefined {
  return /^\d+$/.test(value) ? Number(value) : undefined;
}

/** Turns the address bar's ?q=…&city=… into a filter, dropping anything it does not recognise. */
export function parseFilter(params: Record<string, string | string[] | undefined>): ListingFilter {
  const filter: ListingFilter = { sort: "newest" };

  const q = first(params.q);
  if (q) filter.q = q;
  const category = first(params.category);
  if (category) filter.category = category;
  const city = first(params.city);
  if (city) filter.city = city;

  const kind = first(params.kind);
  if ((KINDS as readonly string[]).includes(kind)) filter.kind = kind as Kind;
  const currency = first(params.currency);
  if ((CURRENCIES as readonly string[]).includes(currency)) filter.currency = currency as Currency;

  const min = wholeNumber(first(params.min));
  if (min !== undefined) filter.min = min;
  const max = wholeNumber(first(params.max));
  if (max !== undefined) filter.max = max;

  if (first(params.women) === "1") filter.women = true;
  const course = normalizeCourse(first(params.course));
  if (course) filter.course = course;

  const sort = first(params.sort);
  if ((SORTS as readonly string[]).includes(sort)) filter.sort = sort as Sort;

  return filter;
}
