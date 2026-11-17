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

export type GroupSlug = "buy" | "housing" | "vehicles" | "home" | "students" | "work" | "outing" | "community";

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
  /**
   * "request": not a list of ads but a service a person arranges, asked for on WhatsApp
   * (the plan's "by hand before by code"). Its screen explains how it works instead of listing ads.
   */
  mode?: "request";
}

export const GROUPS: ServiceGroup[] = [
  { slug: "housing", name: { tr: "Konut", en: "Housing", ar: "السكن" }, tone: { bg: "#ede4ff", fg: "#54308a" } },
  { slug: "buy", name: { tr: "Al ve sat", en: "Buy and sell", ar: "بيع وشراء" }, tone: { bg: "#ffe7d4", fg: "#7a3d12" } },
  { slug: "vehicles", name: { tr: "Araçlar", en: "Vehicles", ar: "المركبات" }, tone: { bg: "#e4e9ff", fg: "#2f3f8f" } },
  { slug: "home", name: { tr: "Ev ve iş hizmetleri", en: "Home and business services", ar: "خدمات المنزل والأعمال" }, tone: { bg: "#e6f1de", fg: "#245a36" } },
  { slug: "students", name: { tr: "Öğrenciler", en: "Students", ar: "الطلاب" }, tone: { bg: "#f6e3ff", fg: "#6a2a86" } },
  { slug: "work", name: { tr: "İş ve seyahat", en: "Work and travel", ar: "العمل والتنقل" }, tone: { bg: "#ffe4e1", fg: "#8a2e25" } },
  { slug: "outing", name: { tr: "Gezme ve ziyaretçiler", en: "Going out and visitors", ar: "الخروج والزوار" }, tone: { bg: "#eefcc8", fg: "#3d5a0a" } },
  { slug: "community", name: { tr: "Topluluk", en: "Community", ar: "المجتمع" }, tone: { bg: "#eee7f5", fg: "#4f3e66" } },
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

  // ---- Added with the 14 Nov feature lists
  // Housing
  {
    slug: "viewing", group: "housing", icon: "video", categories: [], mode: "request",
    name: { tr: "Görüntülü ev gezisi", en: "Video viewing", ar: "معاينة بالفيديو" },
    blurb: { tr: "Para ödemeden önce evi senin için gezip görüntülüyoruz", en: "We visit and film a flat for you before you pay anything", ar: "نزور الشقة ونصوّرها لك قبل أن تدفع أي شيء" },
  },
  {
    slug: "contract-check", group: "housing", icon: "doc", categories: [], mode: "request",
    name: { tr: "Sözleşme kontrolü", en: "Contract check", ar: "مراجعة العقد" },
    blurb: { tr: "Kira sözleşmeni anlaşmalı bir avukat sabit ücretle kontrol eder", en: "A partner lawyer checks your tenancy contract for a fixed fee", ar: "محامٍ شريك يراجع عقد الإيجار بسعر ثابت" },
  },
  {
    slug: "staff-housing", group: "housing", icon: "users", categories: [], mode: "request",
    name: { tr: "Personel konutu", en: "Staff housing", ar: "سكن الموظفين" },
    blurb: { tr: "İşverenler için: çalışanlara tek seferde çok oda", en: "For employers: many rooms at once for your staff", ar: "لأصحاب العمل: غرف كثيرة دفعة واحدة لموظفيك" },
  },
  // Buy and sell
  {
    slug: "furniture-rental", group: "buy", icon: "sofa", categories: ["furniture-rental"],
    name: { tr: "Mobilya kiralama", en: "Furniture rental", ar: "تأجير الأثاث" },
    blurb: { tr: "Satın almak yerine bir yıllık eşya seti kirala", en: "Rent a furnished set for the year instead of buying", ar: "استأجر طقم أثاث للسنة بدل الشراء" },
  },
  {
    slug: "lend", group: "buy", icon: "swap", categories: ["lend"],
    name: { tr: "Ödünç al, ödünç ver", en: "Borrow and lend", ar: "استعارة وإعارة" },
    blurb: { tr: "Matkap, merdiven, kamp malzemesi ve daha fazlası", en: "Drills, ladders, camping gear and more", ar: "مثقاب، سلّم، معدات تخييم والمزيد" },
  },
  {
    slug: "group-buy", group: "buy", icon: "cart", categories: [], mode: "request",
    name: { tr: "Toplu alım", en: "Group buying", ar: "الشراء الجماعي" },
    blurb: { tr: "Diğer öğrencilerle ortak sipariş ver, daha ucuza al", en: "Pool an order with other students for a better price", ar: "اطلبوا معاً مع طلاب آخرين بسعر أفضل" },
  },
  // Vehicles
  {
    slug: "parking", group: "vehicles", icon: "parking", categories: ["parking"],
    name: { tr: "Kiralık otopark", en: "Parking to rent", ar: "مواقف للإيجار" },
    blurb: { tr: "Kampüs ve şehir merkezine yakın aylık park yerleri", en: "Monthly spaces near campus and city centres", ar: "مواقف شهرية قرب الجامعة ومراكز المدن" },
  },
  {
    slug: "driving", group: "vehicles", icon: "wheel", categories: ["driving"],
    name: { tr: "Sürücü kursları", en: "Driving schools", ar: "مدارس القيادة" },
    blurb: { tr: "Ehliyet kursları ve yabancı ehliyet çevirme", en: "Lessons and converting a foreign licence", ar: "دروس القيادة وتحويل الرخصة الأجنبية" },
  },
  // Home and business
  {
    slug: "tech-repair", group: "home", icon: "phone", categories: ["tech-repair"],
    name: { tr: "Telefon ve bilgisayar tamiri", en: "Phone and laptop repair", ar: "صيانة الهواتف والحواسيب" },
    blurb: { tr: "Ekran, batarya ve yaygın tamirler, fiyatlarıyla", en: "Screens, batteries and common jobs, with prices", ar: "الشاشات والبطاريات والأعطال الشائعة، مع الأسعار" },
  },
  {
    slug: "childcare", group: "home", icon: "child", categories: ["childcare"],
    name: { tr: "Çocuk bakımı ve özel ders", en: "Childcare and tutors", ar: "رعاية الأطفال والدروس الخصوصية" },
    blurb: { tr: "Bakıcılar ve özel öğretmenler, dile göre", en: "Babysitters, nannies and tutors, by language", ar: "جليسات أطفال ومعلمون خصوصيون، حسب اللغة" },
  },
  {
    slug: "pets", group: "home", icon: "paw", categories: ["pets"],
    name: { tr: "Evcil hayvan hizmetleri", en: "Pet services", ar: "خدمات الحيوانات الأليفة" },
    blurb: { tr: "Veteriner, bakım, tıraş, sahiplendirme", en: "Vets, sitting, grooming, adoption", ar: "أطباء بيطريون، رعاية، تجميل، تبنٍّ" },
  },
  {
    slug: "moving", group: "home", icon: "box", categories: [], mode: "request",
    name: { tr: "Taşınma günü", en: "Moving day", ar: "يوم الانتقال" },
    blurb: { tr: "Kamyonet, yardımcılar ve temizlik tek talepte", en: "A van, helpers and a cleaner in one request", ar: "شاحنة ومساعدون وتنظيف في طلب واحد" },
  },
  {
    slug: "supplies", group: "home", icon: "store", categories: ["supplies"],
    name: { tr: "İşletme malzemeleri", en: "Business supplies", ar: "مستلزمات الأعمال" },
    blurb: { tr: "Toptan, otel ve restoran tedarikçileri", en: "Wholesale, hotel and restaurant suppliers", ar: "موردو الجملة والفنادق والمطاعم" },
  },
  // Students
  {
    slug: "storage", group: "students", icon: "archive", categories: [], mode: "request",
    name: { tr: "Yaz depolama", en: "Summer storage", ar: "تخزين صيفي" },
    blurb: { tr: "Eşyanı ucuza satma, yaz boyunca sakla", en: "Store your things over the summer instead of selling cheap", ar: "خزّن أغراضك في الصيف بدل بيعها رخيصة" },
  },
  {
    slug: "shop-turkey", group: "students", icon: "bag", categories: [], mode: "request",
    name: { tr: "Türkiye'den alışveriş", en: "Buy from Turkey for me", ar: "تسوّق من تركيا" },
    blurb: { tr: "Sipariş ve Mersin 10 teslimatını biz hallederiz", en: "We order and handle the Mersin 10 delivery", ar: "نطلب لك ونتولى التوصيل عبر مرسين 10" },
  },
  {
    slug: "buddy", group: "students", icon: "hands", categories: [], mode: "request",
    name: { tr: "Yeni gelen arkadaşı", en: "Newcomer buddy", ar: "رفيق الوافد الجديد" },
    blurb: { tr: "Senin dilini konuşan bir üst sınıf öğrencisi", en: "A senior student who speaks your language", ar: "طالب أقدم يتحدث لغتك" },
  },
  // Work and travel
  {
    slug: "internships", group: "work", icon: "badge", categories: ["internships"],
    name: { tr: "Stajlar", en: "Internships", ar: "التدريب العملي" },
    blurb: { tr: "Bölümüne göre staj ilanları", en: "Internships filtered by your degree", ar: "فرص تدريب حسب تخصصك" },
  },
  {
    slug: "shifts", group: "work", icon: "clock", categories: ["shifts"],
    name: { tr: "Vardiyalı ve sezonluk iş", en: "Shift and seasonal work", ar: "عمل بنظام المناوبات والموسمي" },
    blurb: { tr: "Otel, kafe ve kumarhane vardiyaları", en: "Shifts at hotels, cafés and casinos", ar: "مناوبات في الفنادق والمقاهي والكازينوهات" },
  },
  {
    slug: "airport-board", group: "work", icon: "plane", categories: ["airport"],
    name: { tr: "Havalimanı panosu", en: "Airport day board", ar: "لوحة المطار" },
    blurb: { tr: "Bugün kim uçuyor: taksi paylaş, paket taşı", en: "Who flies today: share a taxi, carry a parcel", ar: "من يسافر اليوم: شارك سيارة أجرة أو احمل طرداً" },
  },
  {
    slug: "coworking", group: "work", icon: "desk", categories: ["coworking"],
    name: { tr: "Ortak çalışma ve ofis", en: "Coworking and offices", ar: "مساحات عمل ومكاتب" },
    blurb: { tr: "Günlük veya aylık masa, ofis, toplantı odası", en: "Desks, offices and meeting rooms by day or month", ar: "مكاتب وغرف اجتماعات باليوم أو الشهر" },
  },
  // Going out and visitors
  {
    slug: "experiences", group: "outing", icon: "compass", categories: ["experiences"],
    name: { tr: "Turlar ve aktiviteler", en: "Tours and experiences", ar: "جولات وتجارب" },
    blurb: { tr: "Tekne turları, dalış, geziler, transferler", en: "Boat trips, diving, tours, transfers", ar: "رحلات بحرية، غوص، جولات، تنقلات" },
  },
  {
    slug: "restaurants", group: "outing", icon: "fork", categories: ["restaurants"],
    name: { tr: "Restoran ve kafeler", en: "Restaurants and cafés", ar: "مطاعم ومقاهٍ" },
    blurb: { tr: "Öğrenci fırsatları ve üç dilde menüler", en: "Student deals and menus in three languages", ar: "عروض للطلاب وقوائم بثلاث لغات" },
  },
  {
    slug: "events", group: "outing", icon: "calendar", categories: ["events"],
    name: { tr: "Bu hafta neler var", en: "What's on this week", ar: "ماذا يحدث هذا الأسبوع" },
    blurb: { tr: "Ücretsiz etkinlikler, konserler, festivaller", en: "Free events, concerts, festivals", ar: "فعاليات مجانية، حفلات، مهرجانات" },
  },
  {
    slug: "deals", group: "outing", icon: "percent", categories: ["deals"],
    name: { tr: "Haftanın fırsatları", en: "Deals of the week", ar: "عروض الأسبوع" },
    blurb: { tr: "Market ve mağaza indirimleri, şehre göre", en: "Supermarket and shop offers, by city", ar: "عروض المتاجر والسوبرماركت، حسب المدينة" },
  },
  {
    slug: "clinics", group: "outing", icon: "cross", categories: ["clinics"],
    name: { tr: "Klinikler ve diş hekimleri", en: "Clinics and dentists", ar: "عيادات وأطباء أسنان" },
    blurb: { tr: "Ziyaretçiler için kendi dilinde bilgi", en: "Information for visitors in their own language", ar: "معلومات للزوار بلغتهم" },
  },
  // Community
  {
    slug: "notices", group: "community", icon: "megaphone", categories: ["notices"],
    name: { tr: "Mahalle panosu", en: "Neighbourhood notices", ar: "لوحة الحي" },
    blurb: { tr: "Duyurular, öneriler, kayıp ve bulunan", en: "Notices, recommendations, lost and found", ar: "إعلانات، توصيات، مفقودات" },
  },
  {
    slug: "language-exchange", group: "community", icon: "chat2", categories: ["language-exchange"],
    name: { tr: "Dil değişimi", en: "Language exchange", ar: "تبادل اللغات" },
    blurb: { tr: "Türkçe, Arapça, İngilizce, Rusça pratik arkadaşı", en: "Practise Turkish, Arabic, English, Russian together", ar: "تدرّب على التركية والعربية والإنجليزية والروسية" },
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
