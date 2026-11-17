import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { site } from "@/site.config";
import { GridIcon, HeartIcon, HomeIcon, PlusIcon, SearchIcon } from "./icons";
import { LangSwitch } from "./LangSwitch";
import { NavLinks } from "./NavLinks";
import { SavedLink } from "./SaveButton";

/** The brand: the tag mark (a placeholder until the real logo exists) and the name. */
export function Brand({ lang, className = "" }: { lang: Lang; className?: string }) {
  return (
    <Link href={`/${lang}`} className={`flex shrink-0 items-center gap-2 font-heading text-[19px] font-extrabold tracking-tight text-ink ${className}`}>
      <span aria-hidden className="price-tag brand-mark !px-0 h-5 w-7" />
      <span>{site.name}</span>
    </Link>
  );
}

/**
 * The bar at the top of every page. One row on wide screens; below that, the three main links
 * move to a second row that scrolls with the page, so long Turkish and Arabic labels always fit.
 * It sticks to the top only on wide screens, where it is short enough not to cover anything.
 */
export function Header({ lang, t }: { lang: Lang; t: Dictionary }) {
  const nav = [
    { href: `/${lang}/search`, label: t.pop.navExplore },
    { href: `/${lang}/services`, label: t.pop.navService },
    { href: `/${lang}/tools`, label: t.pop.navGuide },
  ];
  return (
    <header className="z-20 border-b border-line bg-card/95 backdrop-blur md:sticky md:top-0">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 md:gap-3 md:px-6">
        <Brand lang={lang} />
        <NavLinks items={nav} label={t.pop.mainNav} className="ms-4 hidden lg:block" />

        <div className="ms-auto flex items-center gap-1.5 md:gap-2">
          <SavedLink href={`/${lang}/saved`} label={t.pop.saved} countLabel={t.pop.savedCount} />
          <LangSwitch current={lang} label={t.nav.language} />
          <Link href={`/${lang}/post`} className="btn btn-accent hidden !min-h-11 md:inline-flex">
            <PlusIcon width={18} height={18} />
            {t.pop.postFree}
          </Link>
        </div>
      </div>
      <NavLinks items={nav} label={t.pop.mainNav} className="swipe-row mx-auto max-w-6xl overflow-x-auto border-t border-line px-2 py-1 md:px-5 lg:hidden" />
    </header>
  );
}

/** On phones the main actions sit under the thumb. "Post" is the one that stands out. */
export function BottomNav({ lang, t }: { lang: Lang; t: Dictionary }) {
  const item = "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[11.5px] font-medium text-ink-soft";
  return (
    <nav aria-label={t.pop.mainNav} className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-md items-end">
        <Link href={`/${lang}`} className={item}>
          <HomeIcon />
          {t.nav.home}
        </Link>
        <Link href={`/${lang}/search`} className={item}>
          <SearchIcon />
          {t.nav.search}
        </Link>
        <Link href={`/${lang}/post`} className="flex flex-1 flex-col items-center gap-0.5 pb-1.5 text-[11.5px] font-semibold text-ink">
          <span className="pulse-once -mt-4 grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-on-lime bg-lime text-on-lime transition active:scale-90">
            <PlusIcon />
          </span>
          {t.nav.post}
        </Link>
        <Link href={`/${lang}/services`} className={item}>
          <GridIcon />
          {t.nav.services}
        </Link>
        <Link href={`/${lang}/saved`} className={item}>
          <HeartIcon />
          {t.pop.saved}
        </Link>
      </div>
    </nav>
  );
}
