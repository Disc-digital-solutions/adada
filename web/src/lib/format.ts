import type { Lang } from "@/i18n/config";
import type { Currency } from "./types";

const SYMBOL: Record<Currency, string> = { TRY: "₺", GBP: "£", EUR: "€", USD: "$" };

/** Arabic keeps Latin digits, so prices and dates read the same in every language. */
const LOCALE: Record<Lang, string> = { tr: "tr", en: "en", ar: "ar-u-nu-latn" };

/** North Cyprus has its own entry in the time-zone database. */
const TIME_ZONE = "Asia/Famagusta";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "£45", "₺1.500". The symbol always comes first so the price tag stays compact. */
export function formatMoney(amount: number, currency: Currency, lang: Lang): string {
  // Group thousands the reader's way, but never borrow Arabic's currency layout.
  const groupingLocale = lang === "tr" ? "tr" : "en";
  const number = new Intl.NumberFormat(groupingLocale, { maximumFractionDigits: 0 }).format(amount);
  return SYMBOL[currency] + number;
}

/** A short day and month on the island's clock: "Nov 12", "12 Kas". */
export function formatDay(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    day: "numeric",
    month: "short",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** "5 min. ago", "2 sa. önce". After a week it becomes the date. */
export function timeAgo(iso: string, nowMs: number, lang: Lang): string {
  const elapsed = nowMs - Date.parse(iso);
  if (elapsed >= 7 * DAY) return formatDay(iso, lang);

  const relative = new Intl.RelativeTimeFormat(LOCALE[lang], { numeric: "always", style: "short" });
  if (elapsed >= DAY) return relative.format(-Math.floor(elapsed / DAY), "day");
  if (elapsed >= HOUR) return relative.format(-Math.floor(elapsed / HOUR), "hour");
  return relative.format(-Math.max(1, Math.floor(elapsed / MINUTE)), "minute");
}
