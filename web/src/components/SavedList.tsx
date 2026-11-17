"use client";

import Link from "next/link";
import { getDictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { plural } from "@/i18n/plural";
import { useSavedIds } from "@/lib/saved";
import type { Listing } from "@/lib/types";
import { useHydrated } from "./useHydrated";
import { GridSkeleton, ListingGrid } from "./ListingCard";
import { HeartIcon } from "./icons";

/**
 * The ads saved on this device, newest save first. Unsaving the last one shows the empty state at
 * once. Saved ads that are no longer listed (removed, or sold long ago) are counted, not hidden silently.
 */
export function SavedList({ lang, listings, nowMs }: { lang: Lang; listings: Listing[]; nowMs: number }) {
  const t = getDictionary(lang);
  const ids = useSavedIds();
  const hydrated = useHydrated();
  if (!hydrated) return <GridSkeleton count={3} label={t.pop.loading} />;

  const byId = new Map(listings.map((l) => [l.id, l]));
  const saved = ids.map((id) => byId.get(id)).filter((l): l is Listing => l !== undefined);
  const gone = ids.length - saved.length;

  if (saved.length === 0) {
    return (
      <div className="panel mt-6 grid justify-items-center gap-3 p-8 text-center">
        <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full bg-brand-wash text-brand">
          <HeartIcon width={26} height={26} />
        </span>
        <p className="max-w-sm text-ink-soft">{t.pop.savedEmpty}</p>
        <Link href={`/${lang}/search`} className="btn btn-primary">
          {t.pop.navExplore}
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 mt-5 text-[15px] text-ink-soft" aria-live="polite">
        {plural(lang, saved.length, t.search.results)}
        {gone > 0 ? ` · ${t.pop.savedGone}` : ""}
      </p>
      <ListingGrid listings={saved} lang={lang} t={t} nowMs={nowMs} />
    </>
  );
}
