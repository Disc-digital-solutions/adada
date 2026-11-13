import type { Lang } from "./config";
import { ar } from "./dictionaries/ar";
import { en, type Dictionary } from "./dictionaries/en";
import { tr } from "./dictionaries/tr";

const dictionaries: Record<Lang, Dictionary> = { tr, en, ar };

/** Every word the interface shows, in one language. */
export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

export type { Dictionary };
