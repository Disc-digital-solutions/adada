import type { Category, Currency, Kind, Seller, Status } from "../types";

/**
 * SAMPLE DATA. None of these ads or people are real. They exist so the site can be
 * seen and tested before the database is connected, and they go away once it is.
 * There are no phone numbers here on purpose: a made-up number could belong to a real person.
 */

export const DEMO_CATEGORIES: Category[] = [
  { slug: "rooms", sort: 1, name: { tr: "Oda ve daire", en: "Rooms and flats", ar: "غرف وشقق" } },
  { slug: "roommates", sort: 2, name: { tr: "Ev arkadaşı ve devir", en: "Roommates and take-overs", ar: "شريك سكن وتنازل" } },
  { slug: "furniture", sort: 3, name: { tr: "Mobilya", en: "Furniture", ar: "أثاث" } },
  { slug: "appliances", sort: 4, name: { tr: "Beyaz eşya", en: "Home appliances", ar: "أجهزة منزلية" } },
  { slug: "electronics", sort: 5, name: { tr: "Elektronik", en: "Electronics", ar: "إلكترونيات" } },
  { slug: "books", sort: 6, name: { tr: "Kitap ve ders", en: "Books and study", ar: "كتب ودراسة" } },
  { slug: "clothes", sort: 7, name: { tr: "Giyim", en: "Clothes", ar: "ملابس" } },
  { slug: "other", sort: 8, name: { tr: "Diğer", en: "Other", ar: "أخرى" } },
];

export const DEMO_SELLERS = {
  ahmad: { name: "Ahmad K.", shopSlug: "ahmad", city: "famagusta" },
  elif: { name: "Elif Y.", shopSlug: "elif", city: "famagusta" },
  chidi: { name: "Chidi O.", shopSlug: "chidi", city: "nicosia" },
  evler: { name: "Mağusa Öğrenci Evleri", shopSlug: "magusa-evleri", city: "famagusta" },
} satisfies Record<string, Seller>;

export interface DemoListing {
  id: string;
  kind: Kind;
  title: string;
  description: string;
  price: number | null;
  currency: Currency;
  category: string;
  city: string;
  status: Status;
  photos: string[];
  views: number;
  seller: keyof typeof DEMO_SELLERS;
  /** How long ago it was posted, in minutes. Kept relative so the samples always look fresh. */
  ageMin: number;
  /** How long ago it was marked sold, in minutes. */
  soldAgeMin?: number;
}

const HOUR = 60;
const DAY = 24 * HOUR;

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "d01", kind: "offer", status: "live", seller: "ahmad", ageMin: 12, views: 18,
    title: "Study desk, like new",
    description: "Solid wood desk with one drawer. 120 × 60 cm. Bought in September, selling because I am moving. Pick up near EMU main gate.",
    price: 1500, currency: "TRY", category: "furniture", city: "famagusta", photos: ["/demo/desk.svg"],
  },
  {
    id: "d02", kind: "offer", status: "live", seller: "elif", ageMin: 2 * HOUR, views: 64,
    title: "Buzdolabı – Arçelik, sorunsuz",
    description: "İki kapılı, 4 yıllık, sorunsuz çalışıyor. Karakol bölgesinden teslim. Taşıma alıcıya ait.",
    price: 6500, currency: "TRY", category: "appliances", city: "famagusta", photos: ["/demo/fridge.svg"],
  },
  {
    id: "d03", kind: "offer", status: "live", seller: "chidi", ageMin: 5 * HOUR, views: 131,
    title: "iPhone 12, 128 GB",
    description: "Battery health 86%. No scratches on the screen, always used with a case. Box and cable included.",
    price: 220, currency: "GBP", category: "electronics", city: "nicosia", photos: ["/demo/phone.svg"],
  },
  {
    id: "d04", kind: "offer", status: "live", seller: "evler", ageMin: 9 * HOUR, views: 207,
    title: "غرفة مفروشة قرب الجامعة – شهرياً",
    description: "غرفة مفروشة في شقة مشتركة، خمس دقائق مشياً إلى الجامعة. الإنترنت والماء ضمن الإيجار. متاحة من أول الشهر.",
    price: 180, currency: "GBP", category: "rooms", city: "famagusta", photos: ["/demo/bed.svg", "/demo/desk.svg"],
  },
  {
    id: "d05", kind: "offer", status: "live", seller: "evler", ageMin: 1 * DAY + 2 * HOUR, views: 342,
    title: "2+1 eşyalı daire, Karakol – aylık",
    description: "Eşyalı, klimalı, 2. kat. Öğrenciye uygun. 1 depozito + 1 komisyon. Faturalar hariç.",
    price: 450, currency: "GBP", category: "rooms", city: "famagusta", photos: ["/demo/sofa.svg", "/demo/bed.svg", "/demo/fridge.svg"],
  },
  {
    id: "d06", kind: "offer", status: "live", seller: "ahmad", ageMin: 1 * DAY + 6 * HOUR, views: 55,
    title: "Engineering maths books (3)",
    description: "Calculus, Linear Algebra and Numerical Analysis. Some pencil notes inside. Free for whoever collects them first.",
    price: 0, currency: "TRY", category: "books", city: "famagusta", photos: ["/demo/books.svg"],
  },
  {
    id: "d07", kind: "wanted", status: "live", seller: "chidi", ageMin: 2 * DAY, views: 23,
    title: "Looking for a bicycle",
    description: "Any adult bicycle in working condition. I can collect anywhere in Famagusta.",
    price: 3000, currency: "TRY", category: "other", city: "famagusta", photos: [],
  },
  {
    id: "d08", kind: "offer", status: "live", seller: "elif", ageMin: 2 * DAY + 5 * HOUR, views: 12,
    title: "Su ısıtıcısı",
    description: "1.7 litre, 6 ay kullanıldı. Kutusu duruyor.",
    price: 400, currency: "TRY", category: "appliances", city: "famagusta", photos: ["/demo/kettle.svg"],
  },
  {
    id: "d09", kind: "offer", status: "live", seller: "elif", ageMin: 3 * DAY, views: 77,
    title: "Bisiklet, 26 jant",
    description: "Vitesli, lastikler yeni değişti. Kilit hediye.",
    price: 4200, currency: "TRY", category: "other", city: "nicosia", photos: ["/demo/bike.svg"],
  },
  {
    id: "d10", kind: "offer", status: "live", seller: "ahmad", ageMin: 4 * DAY, views: 41,
    title: "كنبة ثلاثة مقاعد",
    description: "كنبة مريحة بحالة جيدة جداً، مع وسادتين. الاستلام من منطقة ساكاريا.",
    price: 5000, currency: "TRY", category: "furniture", city: "famagusta", photos: ["/demo/sofa.svg"],
  },
  {
    id: "d11", kind: "wanted", status: "live", seller: "chidi", ageMin: 4 * DAY + 3 * HOUR, views: 96,
    title: "Roommate wanted, Sakarya area",
    description: "One room free in a 2+1 flat from December. Quiet, non-smoking. Message me for the rent and photos.",
    price: null, currency: "GBP", category: "roommates", city: "famagusta", photos: [],
  },
  {
    id: "d12", kind: "offer", status: "live", seller: "chidi", ageMin: 5 * DAY, views: 30,
    title: "Office chair and desk set",
    description: "Height-adjustable chair with a small desk. Wheels fine, small mark on the armrest.",
    price: 1200, currency: "TRY", category: "furniture", city: "nicosia", photos: ["/demo/desk.svg"],
  },
  {
    id: "d13", kind: "offer", status: "sold", seller: "ahmad", ageMin: 6 * DAY, soldAgeMin: 2 * DAY, views: 150,
    title: "Mini fridge",
    description: "Small fridge for a dorm room. Works well.",
    price: 3000, currency: "TRY", category: "appliances", city: "famagusta", photos: ["/demo/fridge.svg"],
  },
  {
    id: "d14", kind: "offer", status: "removed", seller: "elif", ageMin: 3 * DAY, views: 3,
    title: "Removed sample ad",
    description: "This sample shows what a removed ad looks like.",
    price: 100, currency: "TRY", category: "other", city: "famagusta", photos: ["/demo/kettle.svg"],
  },
];
