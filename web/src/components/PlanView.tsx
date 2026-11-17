import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { guideBySlug } from "@/lib/guides";
import { filterListings } from "@/lib/listings";
import type { Listing } from "@/lib/types";
import { CITIES } from "@/site.config";
import { ArrowIcon } from "./icons";
import { ListingGrid } from "./ListingCard";
import { withBase } from "@/lib/static-site";

const DAY = 24 * 60 * 60 * 1000;

/** The ads an arrival plan draws from: rooms, roommates, dorms and arrival help. */
export const PLAN_CATEGORIES = ["rooms", "roommates", "dorms", "arrival"];

export type PlanViewProps = {
  lang: Lang;
  t: Dictionary;
  /** Ads in PLAN_CATEGORIES (or more); the plan picks from them. */
  listings: Listing[];
  nowMs: number;
  query: Record<string, string | string[] | undefined>;
};

/** The plan's form and, once made, rooms in budget, arrival help and the checklist. */
export function PlanView({ lang, t, listings, nowMs: now, query: sp }: PlanViewProps) {
  const p = t.plan;
  const city = typeof sp.city === "string" && CITIES.some((c) => c.slug === sp.city) ? sp.city : "famagusta";
  const budget = typeof sp.budget === "string" && /^\d+$/.test(sp.budget) ? Number(sp.budget) : null;
  const date = typeof sp.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : "";
  const made = budget !== null;

  const rooms = made
    ? filterListings(listings, { categories: ["rooms", "roommates", "dorms"], city, kind: "offer", currency: "GBP", max: budget, sort: "cheapest" }, now).slice(0, 8)
    : [];
  const help = made ? filterListings(listings, { categories: ["arrival"], sort: "newest" }, now).slice(0, 4) : [];
  const days = date ? Math.ceil((Date.parse(`${date}T00:00:00Z`) - now) / DAY) : null;
  const checklist = guideBySlug("arrival")!;

  return (
    <>
      <form action={withBase(`/${lang}/plan`)} className="panel mt-5 grid gap-3 p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        <label>
          <span className="label">{p.city}</span>
          <select name="city" defaultValue={city} className="field">
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name[lang]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">{p.budget}</span>
          <input name="budget" inputMode="numeric" pattern="[0-9]*" defaultValue={budget ?? 300} dir="ltr" className="field" />
        </label>
        <label>
          <span className="label">{p.date}</span>
          <input name="date" type="date" defaultValue={date} className="field" />
        </label>
        <button className="btn btn-primary">{p.make}</button>
      </form>

      {made ? (
        <>
          {days !== null && days > 0 ? (
            <p className="mt-6 inline-block rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white">{p.daysLeft.replace("{n}", String(days))}</p>
          ) : null}

          <h2 className="section-title mt-8 mb-4">{p.rooms}</h2>
          {rooms.length > 0 ? (
            <ListingGrid listings={rooms} lang={lang} t={t} nowMs={now} />
          ) : (
            <div className="panel p-6 text-center">
              <p className="text-ink-soft">{p.none}</p>
              <Link href={`/${lang}/post?kind=wanted&category=rooms`} className="btn btn-primary mt-4">
                {t.search.postWanted}
              </Link>
            </div>
          )}

          {help.length > 0 ? (
            <>
              <h2 className="section-title mt-10 mb-4">{p.help}</h2>
              <ListingGrid listings={help} lang={lang} t={t} nowMs={now} />
            </>
          ) : null}

          <h2 className="section-title mt-10 mb-4">{p.checklist}</h2>
          <ol className="grid gap-2">
            {checklist.steps.map((step, i) => (
              <li key={i} className="panel flex items-center gap-3 p-3.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-sea text-[12px] font-bold text-sea">{i + 1}</span>
                <span className="flex-1 text-[15px]">{step.text[lang]}</span>
                {step.link ? (
                  <Link href={`/${lang}/${step.link}`} className="text-sea hover:text-sea-deep" aria-label={t.tools.open}>
                    <ArrowIcon width={18} height={18} className="rtl:-scale-x-100" />
                  </Link>
                ) : null}
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </>
  );
}
