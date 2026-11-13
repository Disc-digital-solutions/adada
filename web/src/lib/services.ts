import type { Localized } from "./types";

/**
 * The map of the whole app: every service the plan names, grouped the way people think about
 * their needs. Each service is a screen (/[lang]/c/<slug>) and shows the ads of its categories.
 *
 * A service with no ads yet still has its screen: it says the list is being completed by hand
 * and offers the team's WhatsApp line. That is the plan's "by hand before by code" rule, and it
 * lets the app look and work like the whole island's app from day one.
 *
 * Nothing here is a booking, a payment or live dispatch: those are later levels.
 */

export type GroupSlug = "buy" | "housing" | "vehicles" | "home" | "students" | "work";

export interface ServiceGroup {
  slug: GroupSlug;
  name: Localized;
  /** Soft background and strong foreground for this group's tiles. */
  tone: { bg: string; fg: string };
}

export interface Service {
  slug: string;
  group: GroupSlug;
  /** Key into ServiceIcon. */
  icon: string;
  name: Localized;
  blurb: Localized;
  /** The listing categories whose ads appear on this service's screen. */
  categories: string[];
}

export const GROUPS: ServiceGroup[] = [
  { slug: "housing", name: { tr: "Konut", en: "Housing", ar: "السكن" }, tone: { bg: "#e3f1f5", fg: "#07506a" } },
  { slug: "buy", name: { tr: "Al ve sat", en: "Buy and sell", ar: "بيع وشراء" }, tone: { bg: "#fff3d1", fg: "#7a5200" } },
  { slug: "vehicles", name: { tr: "Araçlar", en: "Vehicles", ar: "المركبات" }, tone: { bg: "#e9ecfc", fg: "#3340a3" } },
  { slug: "home", name: { tr: "Ev ve iş hizmetleri", en: "Home and business services", ar: "خدمات المنزل والأعمال" }, tone: { bg: "#e2f4e9", fg: "#1d6a3d" } },
  { slug: "students", name: { tr: "Öğrenciler", en: "Students", ar: "الطلاب" }, tone: { bg: "#f1e8fb", fg: "#682ca0" } },
  { slug: "work", name: { tr: "İş ve seyahat", en: "Work and travel", ar: "العمل والتنقل" }, tone: { bg: "#fde8e2", fg: "#9e3b24" } },
];

export const SERVICES: Service[] = [
  // Housing
  {
    slug: "flats", group: "housing", icon: "key", categories: ["rooms", "roommates"],
    name: { tr: "Kiralık ev ve oda", en: "Flats and rooms", ar: "شقق وغرف" },
    blurb: { tr: "Kiralık daire, oda, ev arkadaşı ve devir", en: "Flats, rooms, roommates and lease take-overs", ar: "شقق وغرف وشركاء سكن وتنازل عن عقود" },
  },
  {
    slug: "dorms", group: "housing", icon: "building", categories: ["dorms"],
    name: { tr: "Yurtlar", en: "Dorms", ar: "السكن الطلابي" },
    blurb: { tr: "Kampüse yakın yurtlar, fiyatlar ve boş yatak", en: "Halls near campus, prices and free beds", ar: "سكن قرب الجامعة، الأسعار والأسرّة المتاحة" },
  },
  {
    slug: "agencies", group: "housing", icon: "office", categories: ["agencies"],
    name: { tr: "Emlak ofisleri", en: "Real estate agencies", ar: "المكاتب العقارية" },
    blurb: { tr: "Kiralık evler için emlak ofisleri", en: "Agencies with homes for rent", ar: "مكاتب لديها بيوت للإيجار" },
  },
  // Buy and sell
  {
    slug: "buy-sell", group: "buy", icon: "tag", categories: ["furniture", "appliances", "electronics", "books", "clothes", "other"],
    name: { tr: "İkinci el", en: "Second-hand", ar: "مستعمل" },
    blurb: { tr: "Mobilya, beyaz eşya, elektronik, kitap ve daha fazlası", en: "Furniture, appliances, electronics, books and more", ar: "أثاث وأجهزة وإلكترونيات وكتب والمزيد" },
  },
  // Vehicles
  {
    slug: "cars", group: "vehicles", icon: "car", categories: ["cars"],
    name: { tr: "Otomobil", en: "Cars", ar: "سيارات" },
    blurb: { tr: "Sahibinden ve galeriden araçlar", en: "Cars from owners and dealers", ar: "سيارات من المالكين والمعارض" },
  },
  {
    slug: "car-rental", group: "vehicles", icon: "carKey", categories: ["car-rental"],
    name: { tr: "Araç kiralama", en: "Car rental", ar: "تأجير السيارات" },
    blurb: { tr: "Günlük, haftalık, aylık; havalimanına teslim", en: "Daily, weekly, monthly; airport delivery", ar: "يومي وأسبوعي وشهري؛ تسليم في المطار" },
  },
  {
    slug: "towing", group: "vehicles", icon: "tow", categories: ["towing"],
    name: { tr: "Çekici", en: "Towing", ar: "سحب السيارات" },
    blurb: { tr: "Bölgene göre 7/24 çekiciler", en: "24/7 tow trucks by district", ar: "سيارات سحب على مدار الساعة حسب المنطقة" },
  },
  {
    slug: "car-services", group: "vehicles", icon: "wrench", categories: ["car-service"],
    name: { tr: "Oto servis ve lastik", en: "Car service and tyres", ar: "صيانة وإطارات" },
    blurb: { tr: "Lastikçi, tamirci, yıkama", en: "Tyre shops, mechanics, car wash", ar: "إطارات وميكانيكي وغسيل سيارات" },
  },
  // Home and business services
  {
    slug: "cleaning", group: "home", icon: "sparkle", categories: ["cleaning"],
    name: { tr: "Temizlik ve ev hizmetleri", en: "Cleaning and home help", ar: "التنظيف والخدمات المنزلية" },
    blurb: { tr: "Temizlik, taşıma, montaj", en: "Cleaning, moving, assembly", ar: "تنظيف ونقل وتركيب" },
  },
  {
    slug: "construction", group: "home", icon: "hammer", categories: ["construction"],
    name: { tr: "İnşaat ve tadilat", en: "Building and repairs", ar: "البناء والترميم" },
    blurb: { tr: "Usta, boya, elektrik, tesisat", en: "Builders, painters, electricians, plumbers", ar: "بنّاؤون ودهّانون وكهربائيون وسبّاكون" },
  },
  {
    slug: "professionals", group: "home", icon: "briefcase", categories: ["professionals"],
    name: { tr: "Profesyoneller", en: "Professionals", ar: "المهنيون" },
    blurb: { tr: "Muhasebeci, avukat, tercüman", en: "Accountants, lawyers, translators", ar: "محاسبون ومحامون ومترجمون" },
  },
  // Students
  {
    slug: "education", group: "students", icon: "cap", categories: ["education"],
    name: { tr: "Eğitim danışmanlığı", en: "Education agents", ar: "الوكالات التعليمية" },
    blurb: { tr: "Üniversite başvurusu, kabul, burs", en: "University applications, admission, scholarships", ar: "التقديم للجامعات والقبول والمنح" },
  },
  {
    slug: "arrival", group: "students", icon: "plane", categories: ["arrival"],
    name: { tr: "Varış hizmetleri", en: "Arrival help", ar: "خدمات الوصول" },
    blurb: { tr: "Havalimanı transferi, SIM kart, ilk gece, izin", en: "Airport pickup, SIM card, first night, permit", ar: "استقبال من المطار، شريحة، أول ليلة، تصريح" },
  },
  // Work and travel
  {
    slug: "jobs", group: "work", icon: "badge", categories: ["jobs"],
    name: { tr: "İş ilanları", en: "Jobs", ar: "الوظائف" },
    blurb: { tr: "Yarı zamanlı ve tam zamanlı işler", en: "Part-time and full-time work", ar: "عمل بدوام جزئي وكامل" },
  },
  {
    slug: "freelance", group: "work", icon: "laptop", categories: ["freelance"],
    name: { tr: "Serbest çalışma", en: "Freelance", ar: "العمل الحر" },
    blurb: { tr: "Çeviri, tasarım, ders, yazılım", en: "Translation, design, tutoring, coding", ar: "ترجمة وتصميم ودروس وبرمجة" },
  },
  {
    slug: "rides", group: "work", icon: "route", categories: ["rides"],
    name: { tr: "Yolculuk ve seyahat", en: "Rides and travel", ar: "الرحلات والتنقل" },
    blurb: { tr: "Ortak yolculuk, havalimanı, şehirler arası", en: "Shared rides, airport, between cities", ar: "رحلات مشتركة، المطار، بين المدن" },
  },
];

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

/** The service a listing category belongs to. */
export function serviceOfCategory(category: string): Service | undefined {
  return SERVICES.find((service) => service.categories.includes(category));
}

export function groupOf(service: Service): ServiceGroup {
  return GROUPS.find((group) => group.slug === service.group) ?? GROUPS[0];
}

export function servicesIn(group: GroupSlug): Service[] {
  return SERVICES.filter((service) => service.group === group);
}

/** How many listed ads each service has, for the counts on the tiles. */
export function countByService(listings: { category: string }[]): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(SERVICES.map((s) => [s.slug, 0]));
  for (const listing of listings) {
    const service = serviceOfCategory(listing.category);
    if (service) counts[service.slug] += 1;
  }
  return counts;
}
