import type { Lang } from "@/i18n/config";

export const CURRENCIES = ["TRY", "GBP", "EUR", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type Kind = "offer" | "wanted";
export type Status = "live" | "sold" | "removed";

/** A name written once per interface language. */
export type Localized = Record<Lang, string>;

export interface Category {
  slug: string;
  name: Localized;
  sort: number;
}

export interface City {
  slug: string;
  name: Localized;
}

/** What anyone may know about a seller. The phone number is never part of it. */
export interface Seller {
  name: string;
  shopSlug: string;
  city: string;
}

export interface Listing {
  id: string;
  kind: Kind;
  title: string;
  description: string;
  /** null = no price given. 0 = free. */
  price: number | null;
  currency: Currency;
  category: string;
  city: string;
  status: Status;
  /** ISO time the owner marked it sold, if they did. */
  soldAt: string | null;
  photos: string[];
  views: number;
  createdAt: string;
  seller: Seller;
}

export type Sort = "newest" | "cheapest" | "dearest";

export interface ListingFilter {
  q?: string;
  category?: string;
  /** Any of these categories: a service screen shows several at once. */
  categories?: string[];
  city?: string;
  kind?: Kind;
  currency?: Currency;
  min?: number;
  max?: number;
  sort: Sort;
}
