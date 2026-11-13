import { filterListings, visibleCategories } from "../listings";
import type { Listing, Seller } from "../types";
import { DEMO_CATEGORIES, DEMO_LISTINGS, DEMO_SELLERS, type DemoListing } from "./demo-data";
import type { Repo } from "./repo";

const MINUTE = 60_000;

/** Turns a sample ad's "posted 12 minutes ago" into a real timestamp, measured from now. */
function materialize(sample: DemoListing, nowMs: number): Listing {
  const { ageMin, soldAgeMin, seller, ...rest } = sample;
  return {
    ...rest,
    seller: DEMO_SELLERS[seller],
    createdAt: new Date(nowMs - ageMin * MINUTE).toISOString(),
    soldAt: soldAgeMin === undefined ? null : new Date(nowMs - soldAgeMin * MINUTE).toISOString(),
  };
}

const everything = (nowMs: number) => DEMO_LISTINGS.map((sample) => materialize(sample, nowMs));

/** The data store while there is no database: read-only sample ads. */
export const demoRepo: Repo = {
  isDemo: true,

  async usedCategories(nowMs) {
    return visibleCategories(DEMO_CATEGORIES, everything(nowMs), nowMs);
  },

  async allCategories() {
    return [...DEMO_CATEGORIES].sort((a, b) => a.sort - b.sort);
  },

  async search(filter, nowMs) {
    return filterListings(everything(nowMs), filter, nowMs);
  },

  async listing(id, nowMs) {
    return everything(nowMs).find((listing) => listing.id === id) ?? null;
  },

  async shop(slug, nowMs) {
    const sellers: Seller[] = Object.values(DEMO_SELLERS);
    const seller = sellers.find((s) => s.shopSlug === slug);
    if (!seller) return null;
    // filterListings already leaves out removed ads and ads sold more than a week ago.
    const listings = filterListings(everything(nowMs), { sort: "newest" }, nowMs).filter(
      (listing) => listing.seller.shopSlug === slug,
    );
    return { seller, listings };
  },

  // Sample ads have no real seller, so there is nobody to contact and nothing to count.
  async contact() {
    return null;
  },
};
