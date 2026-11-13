export const LANGS = ["tr", "en", "ar"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "tr";

/** The name each language calls itself, for the language switch. */
export const LANG_NAMES: Record<Lang, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
};

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/** The same page in another language: /tr/l/abc → /ar/l/abc. */
export function switchLangPath(pathname: string, to: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && isLang(parts[0])) parts.shift();
  return "/" + [to, ...parts].join("/");
}

/**
 * Chooses a language from the browser's Accept-Language header,
 * for a visitor who arrives without one in the address.
 */
export function pickLang(acceptLanguage: string | null): Lang {
  if (!acceptLanguage) return DEFAULT_LANG;

  const wanted = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { base: tag.toLowerCase().split("-")[0], weight: q ? Number(q.slice(2)) : 1 };
    })
    .filter((entry) => Number.isFinite(entry.weight))
    .sort((a, b) => b.weight - a.weight);

  for (const { base } of wanted) {
    if (isLang(base)) return base;
  }
  return DEFAULT_LANG;
}
