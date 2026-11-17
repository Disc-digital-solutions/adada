import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { site } from "@/site.config";
import { GridIcon, HomeIcon, PlusIcon, SearchIcon, ShieldIcon } from "./icons";
import { LangSwitch } from "./LangSwitch";

/** The bar at the top of every page: name, search (on wide screens), language, post. */
export function Header({ lang, t }: { lang: Lang; t: Dictionary }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 md:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-ink">
          {/* The mark is the price tag itself. */}
          <span aria-hidden className="price-tag brand-mark !px-0 h-5 w-7" />
          <span>{site.name}</span>
        </Link>

        <form action={`/${lang}/search`} role="search" className="ms-4 hidden max-w-md flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">{t.search.placeholder}</span>
            <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input name="q" type="search" placeholder={t.search.placeholder} className="field ps-10" />
          </label>
        </form>

        <div className="ms-auto flex items-center gap-2">
          <Link href={`/${lang}/services`} className="btn btn-quiet hidden !min-h-9 !px-3 !py-1 md:inline-flex">
            <GridIcon width={18} height={18} />
            {t.nav.services}
          </Link>
          <Link href={`/${lang}/safety`} className="btn btn-quiet hidden !min-h-9 !px-3 !py-1 md:inline-flex">
            <ShieldIcon width={18} height={18} />
            <span className="hidden lg:inline">{t.nav.safety}</span>
          </Link>
          <LangSwitch current={lang} label={t.nav.language} />
          <Link href={`/${lang}/post`} className="btn btn-accent hidden !min-h-9 md:inline-flex">
            <PlusIcon width={18} height={18} />
            {t.nav.post}
          </Link>
        </div>
      </div>
    </header>
  );
}

/** On phones the main actions sit under the thumb. "Post" is the one that stands out. */
export function BottomNav({ lang, t }: { lang: Lang; t: Dictionary }) {
  const item = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[12px] font-medium text-ink-soft";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-md items-end">
        <Link href={`/${lang}`} className={item}>
          <HomeIcon />
          {t.nav.home}
        </Link>
        <Link href={`/${lang}/services`} className={item}>
          <GridIcon />
          {t.nav.services}
        </Link>
        <Link href={`/${lang}/post`} className="flex flex-1 flex-col items-center gap-0.5 pb-2 text-[12px] font-semibold text-coral-deep">
          <span className="pulse-once -mt-4 grid h-12 w-12 place-items-center rounded-full bg-coral text-white shadow-[0_2px_0_var(--color-coral-deep)] transition active:scale-90">
            <PlusIcon />
          </span>
          {t.nav.post}
        </Link>
        <Link href={`/${lang}/search`} className={item}>
          <SearchIcon />
          {t.nav.search}
        </Link>
        <Link href={`/${lang}/safety`} className={item}>
          <ShieldIcon />
          {t.nav.safety}
        </Link>
      </div>
    </nav>
  );
}
