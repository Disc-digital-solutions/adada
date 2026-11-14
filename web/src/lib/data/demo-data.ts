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
  { slug: "dorms", sort: 9, name: { tr: "Yurt", en: "Dorms", ar: "سكن طلابي" } },
  { slug: "agencies", sort: 10, name: { tr: "Emlak ofisi (kiralık)", en: "Agency rentals", ar: "مكاتب عقارية (إيجار)" } },
  { slug: "cars", sort: 11, name: { tr: "Otomobil", en: "Cars", ar: "سيارات" } },
  { slug: "car-rental", sort: 12, name: { tr: "Araç kiralama", en: "Car rental", ar: "تأجير سيارات" } },
  { slug: "towing", sort: 13, name: { tr: "Çekici", en: "Towing", ar: "سحب السيارات" } },
  { slug: "car-service", sort: 14, name: { tr: "Oto servis ve lastik", en: "Car service and tyres", ar: "صيانة وإطارات" } },
  { slug: "cleaning", sort: 15, name: { tr: "Temizlik ve ev hizmetleri", en: "Cleaning and home help", ar: "تنظيف وخدمات منزلية" } },
  { slug: "construction", sort: 16, name: { tr: "İnşaat ve tadilat", en: "Building and repairs", ar: "بناء وترميم" } },
  { slug: "professionals", sort: 17, name: { tr: "Profesyoneller", en: "Professionals", ar: "مهنيون" } },
  { slug: "education", sort: 18, name: { tr: "Eğitim danışmanlığı", en: "Education agents", ar: "وكالات تعليمية" } },
  { slug: "arrival", sort: 19, name: { tr: "Varış hizmetleri", en: "Arrival help", ar: "خدمات الوصول" } },
  { slug: "jobs", sort: 20, name: { tr: "İş ilanları", en: "Jobs", ar: "وظائف" } },
  { slug: "freelance", sort: 21, name: { tr: "Serbest çalışma", en: "Freelance", ar: "عمل حر" } },
  { slug: "rides", sort: 22, name: { tr: "Yolculuk ve seyahat", en: "Rides and travel", ar: "رحلات وتنقل" } },
  { slug: "furniture-rental", sort: 23, name: { tr: "Mobilya kiralama", en: "Furniture rental", ar: "تأجير الأثاث" } },
  { slug: "lend", sort: 24, name: { tr: "Ödünç", en: "Borrow and lend", ar: "استعارة وإعارة" } },
  { slug: "parking", sort: 25, name: { tr: "Otopark", en: "Parking", ar: "مواقف" } },
  { slug: "driving", sort: 26, name: { tr: "Sürücü kursu", en: "Driving schools", ar: "مدارس القيادة" } },
  { slug: "tech-repair", sort: 27, name: { tr: "Telefon ve bilgisayar tamiri", en: "Phone and laptop repair", ar: "صيانة الهواتف والحواسيب" } },
  { slug: "childcare", sort: 28, name: { tr: "Çocuk bakımı ve özel ders", en: "Childcare and tutors", ar: "رعاية الأطفال والدروس" } },
  { slug: "pets", sort: 29, name: { tr: "Evcil hayvan", en: "Pets", ar: "حيوانات أليفة" } },
  { slug: "supplies", sort: 30, name: { tr: "İşletme malzemeleri", en: "Business supplies", ar: "مستلزمات الأعمال" } },
  { slug: "internships", sort: 31, name: { tr: "Staj", en: "Internships", ar: "تدريب عملي" } },
  { slug: "shifts", sort: 32, name: { tr: "Vardiyalı iş", en: "Shift work", ar: "عمل بالمناوبات" } },
  { slug: "airport", sort: 33, name: { tr: "Havalimanı panosu", en: "Airport board", ar: "لوحة المطار" } },
  { slug: "coworking", sort: 34, name: { tr: "Ortak çalışma", en: "Coworking", ar: "مساحات عمل" } },
  { slug: "experiences", sort: 35, name: { tr: "Turlar ve aktiviteler", en: "Tours and experiences", ar: "جولات وتجارب" } },
  { slug: "restaurants", sort: 36, name: { tr: "Restoran ve kafe", en: "Restaurants and cafés", ar: "مطاعم ومقاهٍ" } },
  { slug: "events", sort: 37, name: { tr: "Etkinlikler", en: "Events", ar: "فعاليات" } },
  { slug: "deals", sort: 38, name: { tr: "Fırsatlar", en: "Deals", ar: "عروض" } },
  { slug: "clinics", sort: 39, name: { tr: "Klinikler", en: "Clinics", ar: "عيادات" } },
  { slug: "notices", sort: 40, name: { tr: "Mahalle panosu", en: "Neighbourhood notices", ar: "لوحة الحي" } },
  { slug: "language-exchange", sort: 41, name: { tr: "Dil değişimi", en: "Language exchange", ar: "تبادل اللغات" } },
];

export const DEMO_SELLERS = {
  ahmad: { name: "Ahmad K.", shopSlug: "ahmad", city: "famagusta" },
  elif: { name: "Elif Y.", shopSlug: "elif", city: "famagusta" },
  chidi: { name: "Chidi O.", shopSlug: "chidi", city: "nicosia" },
  evler: { name: "Mağusa Öğrenci Evleri", shopSlug: "magusa-evleri", city: "famagusta" },
  yurt: { name: "Sakarya Öğrenci Yurdu", shopSlug: "sakarya-yurdu", city: "famagusta", verified: true },
  emlak: { name: "Mavi Ev Emlak", shopSlug: "mavi-ev", city: "kyrenia" },
  rent: { name: "Deniz Rent a Car", shopSlug: "deniz-rent", city: "famagusta", verified: true },
  oto: { name: "Hasan Oto Kurtarma", shopSlug: "hasan-oto", city: "famagusta" },
  temiz: { name: "Ayşe Temizlik", shopSlug: "ayse-temizlik", city: "famagusta" },
  usta: { name: "Burak Usta Tadilat", shopSlug: "burak-usta", city: "kyrenia" },
  atlas: { name: "Atlas Student Agency", shopSlug: "atlas-agency", city: "nicosia" },
  lina: { name: "Lina's Arrival Help", shopSlug: "lina-arrival", city: "famagusta" },
  mavi: { name: "Mavi Tekne Turları", shopSlug: "mavi-tekne", city: "kyrenia" },
  kafe: { name: "Liman Kafe", shopSlug: "liman-kafe", city: "famagusta" },
  fix: { name: "FixIt Phone Repair", shopSlug: "fixit", city: "nicosia" },
  abroad: { name: "Landlord (sample)", shopSlug: "sample-landlord", city: "famagusta" },
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
  womenOnly?: boolean;
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
    description: "غرفة مفروشة في شقة مشتركة للطالبات فقط، خمس دقائق مشياً إلى الجامعة. الإنترنت والماء ضمن الإيجار. متاحة من أول الشهر.",
    price: 180, currency: "GBP", category: "rooms", city: "famagusta", photos: ["/demo/bed.svg", "/demo/desk.svg"], womenOnly: true,
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
    description: "Calculus (MATH101), Linear Algebra (MATH 102) and Numerical Analysis. Some pencil notes inside. Free for whoever collects them first.",
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
  // Services and businesses. No photos: their cards show the service's own picture.
  {
    id: "d20", kind: "offer", status: "live", seller: "yurt", ageMin: 40, views: 88,
    title: "Tek kişilik yurt odası – kampüse 3 dk",
    description: "Banyolu tek kişilik oda, internet ve temizlik dahil. Ortak mutfak, çalışma salonu. Dönemlik veya aylık.",
    price: 220, currency: "GBP", category: "dorms", city: "famagusta", photos: [],
  },
  {
    id: "d21", kind: "offer", status: "live", seller: "yurt", ageMin: 3 * HOUR, views: 61,
    title: "Shared dorm room with meals",
    description: "Two-person room, breakfast and dinner included, laundry on every floor. Free beds from February.",
    price: 160, currency: "GBP", category: "dorms", city: "famagusta", photos: [],
  },
  {
    id: "d22", kind: "offer", status: "live", seller: "emlak", ageMin: 6 * HOUR, views: 119,
    title: "1+1 flat, Kyrenia centre – 6 months minimum",
    description: "Furnished, sea view from the balcony, five minutes to the harbour. Rentals only.",
    price: 400, currency: "GBP", category: "agencies", city: "kyrenia", photos: [],
  },
  {
    id: "d23", kind: "offer", status: "live", seller: "chidi", ageMin: 8 * HOUR, views: 240,
    title: "Toyota Vitz 2014, automatic",
    description: "92,000 km, new tyres, road tax paid until June. Right-hand drive.",
    price: 7800, currency: "GBP", category: "cars", city: "nicosia", photos: [],
  },
  {
    id: "d24", kind: "offer", status: "live", seller: "elif", ageMin: 1 * DAY, views: 175,
    title: "Honda Fit 2012 – sahibinden",
    description: "Otomatik, bakımları yapıldı, kazasız. Muayene yeni.",
    price: 6500, currency: "GBP", category: "cars", city: "famagusta", photos: [],
  },
  {
    id: "d25", kind: "offer", status: "live", seller: "rent", ageMin: 2 * HOUR, views: 132,
    title: "Car rental from £25 a day – airport delivery",
    description: "Small automatics for students, weekly and monthly prices. Delivery to Ercan airport and campus.",
    price: 25, currency: "GBP", category: "car-rental", city: "famagusta", photos: [],
  },
  {
    id: "d26", kind: "offer", status: "live", seller: "oto", ageMin: 5 * HOUR, views: 47,
    title: "7/24 çekici – Mağusa ve İskele",
    description: "Gece gündüz yol yardımı ve çekici. Akü takviyesi, lastik değişimi.",
    price: null, currency: "TRY", category: "towing", city: "famagusta", photos: [],
  },
  {
    id: "d27", kind: "offer", status: "live", seller: "oto", ageMin: 1 * DAY + 4 * HOUR, views: 29,
    title: "Lastik değişimi ve balans",
    description: "Dört lastik değişimi ve balans. Randevusuz gelebilirsiniz.",
    price: 600, currency: "TRY", category: "car-service", city: "famagusta", photos: [],
  },
  {
    id: "d28", kind: "offer", status: "live", seller: "temiz", ageMin: 4 * HOUR, views: 58,
    title: "Move-out cleaning for student flats",
    description: "Full clean before you hand back the keys, so you get your deposit back. Two cleaners, about three hours.",
    price: 1500, currency: "TRY", category: "cleaning", city: "famagusta", photos: [],
  },
  {
    id: "d29", kind: "offer", status: "live", seller: "usta", ageMin: 2 * DAY, views: 34,
    title: "Boya, badana ve küçük tadilat",
    description: "Daire boyama, alçı, fayans tamiri. Ücretsiz keşif.",
    price: null, currency: "TRY", category: "construction", city: "kyrenia", photos: [],
  },
  {
    id: "d30", kind: "offer", status: "live", seller: "atlas", ageMin: 7 * HOUR, views: 210,
    title: "University applications – free first consultation",
    description: "Help choosing a programme, applying, and getting the acceptance letter. English, Arabic and French.",
    price: 0, currency: "GBP", category: "education", city: "nicosia", photos: [],
  },
  {
    id: "d31", kind: "offer", status: "live", seller: "lina", ageMin: 1 * HOUR, views: 95,
    title: "Ercan airport pickup to Famagusta",
    description: "Meet at arrivals with your name on a sign, any hour. Up to three people with luggage.",
    price: 35, currency: "GBP", category: "arrival", city: "famagusta", photos: [],
  },
  {
    id: "d32", kind: "offer", status: "live", seller: "lina", ageMin: 1 * DAY + 1 * HOUR, views: 143,
    title: "مساعدة الوصول: شريحة، سكن أول ليلة، تصريح الإقامة",
    description: "نستقبلك ونساعدك في شراء شريحة هاتف، وحجز أول ليلة، وأوراق تصريح الإقامة. بالعربية والإنجليزية.",
    price: 50, currency: "GBP", category: "arrival", city: "famagusta", photos: [],
  },
  {
    id: "d33", kind: "offer", status: "live", seller: "elif", ageMin: 9 * HOUR, views: 102,
    title: "Kafeye yarı zamanlı barista aranıyor",
    description: "Akşam vardiyası, haftada 4 gün. Türkçe veya İngilizce yeterli. Deneyim şart değil.",
    price: null, currency: "TRY", category: "jobs", city: "famagusta", photos: [],
  },
  {
    id: "d34", kind: "offer", status: "live", seller: "ahmad", ageMin: 1 * DAY + 8 * HOUR, views: 38,
    title: "Arabic – English – Turkish translation",
    description: "Documents, CVs and university letters. Price per page, same-day delivery for short texts.",
    price: 10, currency: "GBP", category: "freelance", city: "famagusta", photos: [],
  },
  {
    id: "d35", kind: "wanted", status: "live", seller: "chidi", ageMin: 2 * DAY + 2 * HOUR, views: 27,
    title: "Student looking for part-time work",
    description: "Weekends and evenings. English and French, some Turkish. Shop, café or delivery.",
    price: null, currency: "TRY", category: "jobs", city: "nicosia", photos: [],
  },
  // Added with the 14 Nov feature lists: one or two ads for each new list service.
  {
    id: "d40", kind: "offer", status: "live", seller: "evler", ageMin: 2 * HOUR + 20, views: 66, womenOnly: true,
    title: "Room in a women-only flat, Sakarya",
    description: "Bright room in a 3+1 flat shared with two female students. Bills included, quiet street, 8 minutes to campus.",
    price: 210, currency: "GBP", category: "rooms", city: "famagusta", photos: ["/demo/bed.svg"],
  },
  {
    id: "d41", kind: "offer", status: "live", seller: "yurt", ageMin: 30 * HOUR, views: 54, womenOnly: true,
    title: "Kız öğrenci yurdu – 2 kişilik oda",
    description: "Sadece kız öğrenciler için kat. Kahvaltı dahil, 24 saat güvenlik.",
    price: 190, currency: "GBP", category: "dorms", city: "famagusta", photos: [],
  },
  {
    id: "d42", kind: "offer", status: "live", seller: "emlak", ageMin: 26 * HOUR, views: 77,
    title: "2+1 flat near the harbour, furnished",
    description: "Two bedrooms, sea view, 12 months minimum. Rentals only.",
    price: 520, currency: "GBP", category: "agencies", city: "kyrenia", photos: [],
  },
  {
    id: "d43", kind: "offer", status: "live", seller: "evler", ageMin: 3 * DAY, views: 40,
    title: "1+1 flat, Gülseren – monthly",
    description: "Furnished, air-conditioned, five minutes to the beach. Deposit one month.",
    price: 380, currency: "GBP", category: "rooms", city: "famagusta", photos: ["/demo/sofa.svg"],
  },
  {
    id: "d44", kind: "offer", status: "live", seller: "ahmad", ageMin: 5 * HOUR + 30, views: 44,
    title: "PHYS101 and CHEM101 lecture notes",
    description: "Printed and bound notes with solved past exams for PHYS 101 and CHEM-101.",
    price: 300, currency: "TRY", category: "books", city: "famagusta", photos: ["/demo/books.svg"],
  },
  {
    id: "d45", kind: "offer", status: "live", seller: "evler", ageMin: 11 * HOUR, views: 58,
    title: "Student furniture set for the year",
    description: "Bed, desk, chair and wardrobe, delivered and collected at the end of the year. Monthly price.",
    price: 900, currency: "TRY", category: "furniture-rental", city: "famagusta", photos: [],
  },
  {
    id: "d46", kind: "offer", status: "live", seller: "elif", ageMin: 20 * HOUR, views: 19,
    title: "Matkap ve merdiven – ödünç verilir",
    description: "Hafta sonu için ödünç verebilirim. Depozito yok, sadece geri getir.",
    price: 0, currency: "TRY", category: "lend", city: "famagusta", photos: [],
  },
  {
    id: "d47", kind: "offer", status: "live", seller: "chidi", ageMin: 2 * DAY + 5 * HOUR, views: 23,
    title: "Covered parking space near the old city",
    description: "Monthly, gated, one car. Five minutes from the main campus gate.",
    price: 1200, currency: "TRY", category: "parking", city: "famagusta", photos: [],
  },
  {
    id: "d48", kind: "offer", status: "live", seller: "rent", ageMin: 2 * DAY, views: 31,
    title: "Driving lessons in English and Arabic",
    description: "Automatic car, lessons on campus roads first. Help with converting your licence.",
    price: 1000, currency: "TRY", category: "driving", city: "famagusta", photos: [],
  },
  {
    id: "d49", kind: "offer", status: "live", seller: "fix", ageMin: 3 * HOUR, views: 87,
    title: "iPhone screen replacement in one hour",
    description: "Screens, batteries and charging ports for iPhone and Samsung. Price depends on the model; ask with your model.",
    price: 2500, currency: "TRY", category: "tech-repair", city: "nicosia", photos: [],
  },
  {
    id: "d50", kind: "offer", status: "live", seller: "lina", ageMin: 15 * HOUR, views: 36,
    title: "Arabic and English tutor for children",
    description: "Homework help and reading for ages 6–12. At your home or online.",
    price: 15, currency: "GBP", category: "childcare", city: "famagusta", photos: [],
  },
  {
    id: "d51", kind: "offer", status: "live", seller: "elif", ageMin: 1 * DAY + 10 * HOUR, views: 49,
    title: "Kedi sahiplendirme – aşıları tam",
    description: "İki yavru kedi yuva arıyor. Aşıları yapıldı, ücretsiz.",
    price: 0, currency: "TRY", category: "pets", city: "famagusta", photos: [],
  },
  {
    id: "d52", kind: "offer", status: "live", seller: "kafe", ageMin: 2 * DAY + 6 * HOUR, views: 14,
    title: "Kafe ekipmanı toptan: bardak, peçete, kapak",
    description: "Kafe ve restoranlar için toptan tek kullanımlık ürünler. Haftalık teslimat.",
    price: null, currency: "TRY", category: "supplies", city: "famagusta", photos: [],
  },
  {
    id: "d53", kind: "offer", status: "live", seller: "atlas", ageMin: 13 * HOUR, views: 72,
    title: "Marketing internship – 3 months",
    description: "For business or communication students. English required, Arabic a plus.",
    price: null, currency: "GBP", category: "internships", city: "nicosia", photos: [],
  },
  {
    id: "d54", kind: "offer", status: "live", seller: "kafe", ageMin: 6 * HOUR, views: 64,
    title: "Weekend shifts – waiter and barista",
    description: "Friday to Sunday, evenings. Paid per shift, tips shared.",
    price: null, currency: "TRY", category: "shifts", city: "famagusta", photos: [],
  },
  {
    id: "d55", kind: "offer", status: "live", seller: "chidi", ageMin: 4 * HOUR, views: 21,
    title: "Flying to Istanbul on Friday – share a taxi to Ercan?",
    description: "Leaving Famagusta at 6 am. Two seats free. Can also carry a small parcel.",
    price: null, currency: "TRY", category: "airport", city: "famagusta", photos: [],
  },
  {
    id: "d56", kind: "offer", status: "live", seller: "atlas", ageMin: 3 * DAY + 2 * HOUR, views: 26,
    title: "Desks in a quiet coworking space",
    description: "Fast internet, coffee, meeting room. Day pass or monthly.",
    price: 8, currency: "GBP", category: "coworking", city: "nicosia", photos: [],
  },
  {
    id: "d57", kind: "offer", status: "live", seller: "mavi", ageMin: 7 * HOUR, views: 112,
    title: "Boat trip with swimming stops – full day",
    description: "Lunch on board, two swimming stops. Guides speak Turkish, English and Russian.",
    price: 40, currency: "GBP", category: "experiences", city: "kyrenia", photos: [],
  },
  {
    id: "d58", kind: "offer", status: "live", seller: "kafe", ageMin: 10 * HOUR, views: 90,
    title: "Student menu: 20% off with student card",
    description: "Burgers, wraps and coffee. Menu in Turkish, English and Arabic.",
    price: null, currency: "TRY", category: "restaurants", city: "famagusta", photos: [],
  },
  {
    id: "d59", kind: "offer", status: "live", seller: "kafe", ageMin: 1 * DAY + 3 * HOUR, views: 67,
    title: "Live music night – free entry, Saturday",
    description: "Local bands from 9 pm. Free entry, students welcome.",
    price: 0, currency: "TRY", category: "events", city: "famagusta", photos: [],
  },
  {
    id: "d60", kind: "offer", status: "live", seller: "kafe", ageMin: 18 * HOUR, views: 38,
    title: "Market indirimleri – bu hafta",
    description: "Süt, ekmek ve meyvede hafta sonuna kadar indirim. Sample deal.",
    price: null, currency: "TRY", category: "deals", city: "famagusta", photos: [],
  },
  {
    id: "d61", kind: "offer", status: "live", seller: "elif", ageMin: 8 * HOUR, views: 29,
    title: "Kayıp anahtar bulundu – Karakol",
    description: "Mavi anahtarlıklı iki anahtar Karakol market önünde bulundu. Tarif eden alabilir.",
    price: null, currency: "TRY", category: "notices", city: "famagusta", photos: [],
  },
  {
    id: "d62", kind: "offer", status: "live", seller: "ahmad", ageMin: 2 * DAY + 4 * HOUR, views: 33,
    title: "Arabic for Turkish – language exchange",
    description: "I teach Arabic, you help me with Turkish. Coffee twice a week on campus.",
    price: null, currency: "TRY", category: "language-exchange", city: "famagusta", photos: [],
  },
  {
    // Shows the "price looks wrong" warning: far below the usual rent, and the classic story.
    id: "d63", kind: "offer", status: "live", seller: "abroad", ageMin: 50, views: 140,
    title: "2+1 furnished flat, Karakol – only £120",
    description: "I am abroad for work. Pay the first month and deposit by transfer and I will post you the keys.",
    price: 120, currency: "GBP", category: "rooms", city: "famagusta", photos: ["/demo/sofa.svg"],
  },
];
