import type { City } from "./lib/types";

/**
 * Everything about the site that is a decision, not code.
 * The name is a WORKING NAME (decision 7 in ../README.md). Change it here only.
 */
export const site = {
  name: "Island Market",
  /** The public address, used in shared links and QR codes. Set NEXT_PUBLIC_SITE_URL when deployed. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3240").replace(/\/$/, ""),
  themeColor: "#0e7c74",
  /**
   * The team's WhatsApp line, country code first, e.g. +905331234567. Set NEXT_PUBLIC_TEAM_WHATSAPP.
   * While the database is not connected, posting and reporting go to this line and a person
   * handles them ("by hand before by code"). Empty = those buttons stay off.
   */
  teamWhatsapp: (process.env.NEXT_PUBLIC_TEAM_WHATSAPP ?? "").trim(),
} as const;

/** The six districts. Launch is Famagusta, but any city can be chosen. */
export const CITIES: City[] = [
  { slug: "famagusta", name: { tr: "Gazimağusa", en: "Famagusta", ar: "فاماغوستا" } },
  { slug: "nicosia", name: { tr: "Lefkoşa", en: "Nicosia", ar: "نيقوسيا" } },
  { slug: "kyrenia", name: { tr: "Girne", en: "Kyrenia", ar: "كيرينيا" } },
  { slug: "iskele", name: { tr: "İskele", en: "Iskele", ar: "إسكيله" } },
  { slug: "guzelyurt", name: { tr: "Güzelyurt", en: "Guzelyurt", ar: "غوزليورت" } },
  { slug: "lefke", name: { tr: "Lefke", en: "Lefke", ar: "ليفكه" } },
];
