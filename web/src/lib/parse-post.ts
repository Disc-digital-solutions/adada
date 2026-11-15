import { fold } from "./listings";
import type { Currency, Kind } from "./types";

/**
 * Reads an ad that a seller already wrote for a Facebook or WhatsApp group and guesses the form's
 * fields from it. Sellers in North Cyprus already write their ad once, in a group; asking them to
 * type it again is the biggest reason they would not post here. So: paste, check, publish.
 *
 * Every guess is only a suggestion. The form shows it and the seller corrects it. When unsure,
 * a field is left empty rather than filled wrongly: a wrong price is worse than no price.
 */
export interface ParsedPost {
  kind: Kind;
  title: string;
  description: string;
  /** null = no price found. 0 = free. */
  price: number | null;
  currency: Currency | null;
  /** A city slug from site.config, or null. */
  city: string | null;
  /** A category slug, or null. */
  category: string | null;
  /** The post says the place is for women only. */
  womenOnly: boolean;
}

const TITLE_MAX = 80;
const DESCRIPTION_MAX = 1500;

/**
 * Keywords are written folded (lower case, no Turkish accents).
 * A trailing "*" lets Turkish endings follow: "masa*" finds "masası", "masalar".
 * Without it, the whole word must match, so "bed" does not find "bedava".
 * Arabic keywords are found anywhere in a word, because "ال" and other prefixes join the word.
 */
type Keywords = readonly string[];

/** First match wins, so the narrower category comes first. */
const CATEGORY_WORDS: readonly (readonly [string, Keywords])[] = [
  [
    "roommates",
    ["ev arkadas*", "oda arkadas*", "flatmate*", "roommate*", "housemate*", "devren*", "take over", "lease takeover", "شريك سكن", "شريكة سكن", "تنازل"],
  ],
  [
    "rooms",
    ["daire*", "kiralik*", "oda", "odali", "stüdyo*", "studyo*", "rezidans*", "yurt*", "flat", "flats", "apartment*", "room", "rooms", "studio*", "dorm*", "1+1", "2+1", "3+1", "شقة", "شقق", "غرف", "سكن", "استوديو"],
  ],
  [
    "appliances",
    ["buzdolab*", "camasir makine*", "bulasik makine*", "firin*", "mikrodalga*", "klima*", "isitici*", "supurge*", "utu", "kettle*", "fridge*", "freezer*", "washing machine*", "microwave*", "oven*", "heater*", "vacuum*", "air condition*", "ثلاجة", "غسالة", "ميكروويف", "فرن", "مكيف", "سخان", "مكنسة"],
  ],
  [
    "electronics",
    ["telefon*", "bilgisayar*", "laptop*", "tablet*", "kulaklik*", "iphone*", "ipad*", "samsung*", "xiaomi*", "macbook*", "playstation*", "ps4", "ps5", "xbox*", "monitor*", "tv", "televizyon*", "phone*", "headphone*", "airpods", "camera*", "kamera*", "هاتف", "جوال", "موبايل", "لابتوب", "حاسوب", "كمبيوتر", "سماعة", "شاشة", "تلفزيون"],
  ],
  [
    "furniture",
    ["masa*", "sandalye*", "koltuk*", "kanepe*", "yatak*", "dolap*", "gardirop*", "kitaplik*", "komodin*", "desk*", "chair*", "sofa*", "couch*", "bed", "beds", "mattress*", "wardrobe*", "shelf", "shelves", "table*", "طاولة", "مكتب", "كرسي", "كنبة", "سرير", "خزانة", "مرتبة"],
  ],
  [
    "books",
    ["kitap*", "ders not*", "textbook*", "book", "books", "novel*", "notes", "كتاب", "كتب", "مذكرات"],
  ],
  [
    "clothes",
    ["mont*", "ceket*", "elbise*", "ayakkabi*", "kazak*", "pantolon*", "gomlek*", "jacket*", "coat*", "dress*", "shoes", "sneakers", "trainers", "jeans", "shirt*", "hoodie*", "ملابس", "جاكيت", "فستان", "حذاء", "بنطال", "قميص"],
  ],
];

const CITY_WORDS: readonly (readonly [string, Keywords])[] = [
  ["famagusta", ["famagusta*", "gazimagusa*", "magusa*", "magosa*", "ammochostos", "فاماغوستا", "فماغوستا", "ماغوسا", "مغوسا"]],
  // Before Lefke: "lefke*" would also find "lefkosa".
  ["nicosia", ["nicosia*", "lefkosa*", "lefkose*", "lefkosia", "نيقوسيا", "لفكوشا"]],
  ["kyrenia", ["kyrenia*", "girne*", "keryneia", "كيرينيا", "جيرنه", "غيرنه"]],
  ["iskele", ["iskele*", "trikomo*", "long beach", "longbeach", "إسكيله", "اسكيلة", "اسكلة"]],
  ["guzelyurt", ["guzelyurt*", "morphou", "morfou", "غوزليورت", "مورفو"]],
  ["lefke", ["lefke", "lefkede", "lefkeye", "lefka", "ليفكه", "لفكة"]],
];

const WANTED_WORDS: Keywords = [
  "ariyorum", "ariyoruz", "araniyor", "aranir", "alinir", "almak istiyorum",
  "looking for", "wanted", "wtb", "iso", "in search of", "need a", "need an", "anyone selling",
  "مطلوب", "أبحث", "ابحث", "ادور", "أدور", "محتاج",
];

const WOMEN_WORDS: Keywords = [
  "women only", "female only", "females only", "girls only", "ladies only", "female student*", "girl student*",
  "sadece kiz*", "sadece bayan*", "kiz ogrenci*", "bayan ogrenci*", "kizlara", "bayanlara",
  "للبنات", "للطالبات", "للنساء", "بنات فقط",
];

const FREE_WORDS: Keywords = ["bedava", "ucretsiz", "free", "giveaway", "مجانا", "مجاناً", "مجاني", "ببلاش"];

/** The word lists, exported for the mobile app so both read posts with the same words. */
export const PARSE_WORDS = {
  categories: CATEGORY_WORDS,
  cities: CITY_WORDS,
  wanted: WANTED_WORDS,
  women: WOMEN_WORDS,
  free: FREE_WORDS,
};

/**
 * Lower case, no Turkish accents, words separated by single spaces, padded with a space at each
 * end so that " word" means "a word starting here". Arabic-Indic digits become 0–9.
 */
function loose(text: string): string {
  const plain = fold(text)
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u");
  // Keep "+" so that "2+1" (two rooms and a living room) survives as one word.
  return " " + plain.replace(/[^\p{L}\p{N}+]+/gu, " ").trim() + " ";
}

const ARABIC = /[؀-ۿ]/;

function hasWord(text: string, keyword: string): boolean {
  if (ARABIC.test(keyword)) return text.includes(keyword);
  if (keyword.endsWith("*")) return text.includes(" " + keyword.slice(0, -1));
  return text.includes(" " + keyword + " ");
}

function firstMatch(text: string, table: readonly (readonly [string, Keywords])[], allowed?: readonly string[]) {
  for (const [slug, words] of table) {
    if (allowed && !allowed.includes(slug)) continue;
    if (words.some((word) => hasWord(text, word))) return slug;
  }
  return null;
}

// ---------------------------------------------------------------------------- price

const CURRENCY_OF: readonly (readonly [RegExp, Currency])[] = [
  [/^(₺|tl|try|ytl|lira|liras?|ليرة)$/, "TRY"],
  [/^(£|gbp|stg|sterlin|sterling|pounds?|جنيه|باوند|استرليني|إسترليني)$/, "GBP"],
  [/^(€|eur|euros?|avro|يورو)$/, "EUR"],
  [/^(\$|usd|dollars?|dolar|دولار)$/, "USD"],
];

const NUMBER = String.raw`(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)`;
const MULTIPLIER = String.raw`(?:\s*(k|bin)(?![\p{L}]))?`;
const CURRENCY_WORD = String.raw`(₺|£|€|\$|tl|try|ytl|liras?|lira|gbp|stg|sterlin|sterling|pounds?|eur|euros?|avro|usd|dollars?|dolar|ليرة|جنيه|باوند|استرليني|إسترليني|يورو|دولار)`;

/** "1.500 TL", "400stg", "15 bin TL", "180 جنيه". The currency must not be followed by a number. */
const AMOUNT_THEN_CURRENCY = new RegExp(
  String.raw`(?<![\p{L}\p{N}.,])${NUMBER}${MULTIPLIER}\s*${CURRENCY_WORD}(?![\p{L}])(?!\s*\d)`,
  "u",
);
/** "₺6.500", "£450", "$220", "TL 500". */
const CURRENCY_THEN_AMOUNT = new RegExp(
  String.raw`(?<![\p{L}])${CURRENCY_WORD}\s*${NUMBER}${MULTIPLIER}(?![\p{L}\p{N}])`,
  "u",
);

function toNumber(written: string, multiplier: string | undefined): number {
  // A dot or comma followed by exactly three digits groups thousands ("1.500", "1,500");
  // otherwise it is a decimal point ("2.5k").
  const value = /^\d{1,3}([.,]\d{3})+$/.test(written)
    ? Number(written.replace(/[.,]/g, ""))
    : Number(written.replace(",", "."));
  return Math.round(multiplier ? value * 1000 : value);
}

function currencyOf(word: string): Currency | null {
  for (const [pattern, currency] of CURRENCY_OF) if (pattern.test(word)) return currency;
  return null;
}

function findPrice(text: string): { price: number; currency: Currency } | null {
  const lower = fold(text).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  const after = AMOUNT_THEN_CURRENCY.exec(lower);
  const before = CURRENCY_THEN_AMOUNT.exec(lower);

  // Both shapes can appear in one post; the earlier one is usually the asking price.
  const candidates = [
    after && { index: after.index, number: after[1], multiplier: after[2], currency: after[3] },
    before && { index: before.index, number: before[2], multiplier: before[3], currency: before[1] },
  ].filter((c): c is NonNullable<typeof c> => Boolean(c));
  candidates.sort((a, b) => a.index - b.index);

  for (const candidate of candidates) {
    const currency = currencyOf(candidate.currency);
    const price = toNumber(candidate.number, candidate.multiplier);
    if (currency && Number.isFinite(price) && price > 0) return { price, currency };
  }
  return null;
}

// ---------------------------------------------------------------------------- text

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu;

function clean(line: string): string {
  return line.replace(EMOJI, " ").replace(/#[^\s#]+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * "SATILIK Çalışma masası" → "Çalışma masası". The selling / wanted switch already says it,
 * and in a list of ads every title starting with the same word hides what the item is.
 */
const LEADING_LABEL =
  /^(?:(?:satılık|satilik|acil satılık|acil|kiralık|kiralik|for sale|selling|sale|fs|wts|للبيع|للإيجار|للايجار|بيع)\s*[:\-–!|]*\s*)+/iu;

function dropLabel(title: string): string {
  const stripped = title.replace(LEADING_LABEL, "");
  // Keep the word when it is the whole title, or when it is part of a word ("Salesforce").
  return stripped && stripped !== title && /\s|[:\-–!|]/.test(title.slice(0, title.length - stripped.length))
    ? stripped
    : title;
}

/** Cut at the last space before the limit, so a word is never cut in half. */
function shorten(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,.;:–-]+$/, "");
}

export function parsePost(text: string, categories?: readonly string[]): ParsedPost {
  const lines = text.split(/\r?\n/).map(clean).filter(Boolean);
  const first = dropLabel(lines[0] ?? "");
  const title = shorten(first, TITLE_MAX);
  // If the first line was too long for a title, keep it whole in the description.
  const rest = title === first ? lines.slice(1) : lines;
  const description = rest.join("\n").slice(0, DESCRIPTION_MAX);

  const words = loose(text.replace(/#/g, " "));
  const found = findPrice(text);
  const free = !found && FREE_WORDS.some((word) => hasWord(words, word));

  return {
    kind: WANTED_WORDS.some((word) => hasWord(words, word)) ? "wanted" : "offer",
    title,
    description,
    price: found ? found.price : free ? 0 : null,
    currency: found ? found.currency : null,
    city: firstMatch(words, CITY_WORDS),
    category: firstMatch(words, CATEGORY_WORDS, categories),
    womenOnly: WOMEN_WORDS.some((word) => hasWord(words, word)),
  };
}
