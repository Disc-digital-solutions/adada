"use client";

import { LANGS, LANG_NAMES, switchLangPath, type Lang } from "@/i18n/config";

const SHORT: Record<Lang, string> = { tr: "TR", en: "EN", ar: "ع" };

/**
 * Three links, one per language.
 * Each link points at that language's home page. At the moment of the click it is
 * re-aimed at the page you are on, with any search filters kept, so you stay where you were.
 * They are plain links, not app navigation, because changing language also changes
 * the reading direction of the whole page, which needs a full reload.
 */
export function LangSwitch({ current, label }: { current: Lang; label: string }) {
  return (
    <nav aria-label={label} className="flex rounded-full border-[1.5px] border-line bg-card p-0.5">
      {LANGS.map((lang) => {
        const active = lang === current;
        return (
          <a
            key={lang}
            href={`/${lang}`}
            hrefLang={lang}
            lang={lang}
            title={LANG_NAMES[lang]}
            aria-label={LANG_NAMES[lang]}
            aria-current={active ? "true" : undefined}
            onClick={(event) => {
              event.currentTarget.href = switchLangPath(window.location.pathname, lang) + window.location.search;
            }}
            className={`grid h-8 min-w-9 place-items-center rounded-full px-2 text-[13px] font-semibold ${
              active ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {SHORT[lang]}
          </a>
        );
      })}
    </nav>
  );
}
