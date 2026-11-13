import type { Category, Listing, ListingFilter, Seller } from "../types";

/**
 * Everything the pages ask the data store. Today it is answered by sample data;
 * once the database is connected, a second implementation answers the same questions.
 * Methods take "now" so that time-based rules (sold ads leave after a week) can be tested.
 */
export interface Repo {
  /** True while the site runs on sample data. */
  readonly isDemo: boolean;
  /** Categories that have at least one listed ad. */
  usedCategories(nowMs: number): Promise<Category[]>;
  /** Every category, for the forms. */
  allCategories(): Promise<Category[]>;
  search(filter: ListingFilter, nowMs: number): Promise<Listing[]>;
  /** One ad by id, whatever its status, so its page can say "sold" or "removed". */
  listing(id: string, nowMs: number): Promise<Listing | null>;
  shop(slug: string, nowMs: number): Promise<{ seller: Seller; listings: Listing[] } | null>;
  /**
   * Records that someone tapped a contact button and returns the seller's number.
   * The number is only ever handed out here, never inside a page.
   */
  contact(listingId: string, via: "whatsapp" | "call"): Promise<string | null>;
}
