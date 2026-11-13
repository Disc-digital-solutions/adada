import type { Lang } from "./config";

/** One sentence per grammatical number. Only "other" is required; "{n}" is replaced by the number. */
export type PluralForms = { other: string } & Partial<Record<"zero" | "one" | "two" | "few" | "many", string>>;

/**
 * Picks the right sentence for a number. English needs two forms, Turkish one,
 * Arabic six ("إعلان واحد", "إعلانان", "5 إعلانات", "11 إعلاناً" …).
 */
export function plural(lang: Lang, n: number, forms: PluralForms): string {
  const rule = new Intl.PluralRules(lang).select(n);
  const sentence = forms[rule] ?? forms.other;
  // Latin digits in every language, so numbers read the same everywhere.
  const number = new Intl.NumberFormat(lang === "tr" ? "tr" : "en").format(n);
  return sentence.replace("{n}", number);
}
