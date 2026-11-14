import type { Localized } from "./types";

/**
 * Tools and guides: things that help on the island without being a list of ads. They work
 * without an account or the database, so they are useful from day one.
 */
export interface Tool {
  /** Page address without the language. */
  href: string;
  icon: string;
  name: Localized;
  blurb: Localized;
}

export const TOOLS: Tool[] = [
  {
    href: "emergency", icon: "siren",
    name: { tr: "Acil durum", en: "Emergency", ar: "الطوارئ" },
    blurb: { tr: "Polis, ambulans, itfaiye, nöbetçi eczane", en: "Police, ambulance, fire, duty pharmacy", ar: "الشرطة، الإسعاف، الإطفاء، الصيدلية المناوبة" },
  },
  {
    href: "help", icon: "chat2",
    name: { tr: "Öğrenci soruları", en: "Student questions", ar: "أسئلة الطلاب" },
    blurb: { tr: "Banka hesabı, depozito, vize ve oturma izni", en: "Bank accounts, deposits, visas and permits", ar: "الحساب البنكي، العربون، التأشيرة والإقامة" },
  },
  {
    href: "tools/permit", icon: "calendar",
    name: { tr: "Oturma iznim", en: "My residence permit", ar: "تصريح إقامتي" },
    blurb: { tr: "Kalan gün, takvim hatırlatması, belge listesi", en: "Days left, calendar reminders, papers checklist", ar: "الأيام المتبقية، تذكيرات، قائمة الأوراق" },
  },
  {
    href: "plan", icon: "map",
    name: { tr: "Varış planım", en: "My arrival plan", ar: "خطة وصولي" },
    blurb: { tr: "Şehir, bütçe, tarih: gerçek ilanlarla bir plan", en: "City, budget, date: a plan built from real ads", ar: "المدينة والميزانية والتاريخ: خطة من إعلانات حقيقية" },
  },
  {
    href: "books", icon: "book",
    name: { tr: "Ders koduyla kitap", en: "Books by course code", ar: "كتب حسب رمز المادة" },
    blurb: { tr: "MATH101 yaz: kitap, not, hesap makinesi", en: "Type MATH101: books, notes, calculators", ar: "اكتب MATH101: كتب، ملخصات، آلات حاسبة" },
  },
  {
    href: "prices", icon: "chart",
    name: { tr: "Ortalama fiyatlar", en: "Typical prices", ar: "الأسعار المعتادة" },
    blurb: { tr: "Şehre göre kira, yurt ve araç fiyatları", en: "Rents, dorms and cars, by city", ar: "الإيجارات والسكن والسيارات، حسب المدينة" },
  },
  {
    href: "tools/split", icon: "calculator",
    name: { tr: "Fatura bölüşme", en: "Split the bills", ar: "تقسيم الفواتير" },
    blurb: { tr: "Ev arkadaşları arasında kim kime ne borçlu", en: "Who owes whom in a shared flat", ar: "من يدين لمن في الشقة المشتركة" },
  },
  {
    href: "tools/deposit", icon: "check",
    name: { tr: "Depozitonu geri al", en: "Get your deposit back", ar: "استرجع عربونك" },
    blurb: { tr: "Giriş-çıkış listesi ve ev sahibine mektup", en: "Move-in/out checklist and a letter to the landlord", ar: "قائمة الدخول والخروج ورسالة إلى المالك" },
  },
  {
    href: "tools/receipt", icon: "receipt",
    name: { tr: "Kira makbuzu", en: "Rent receipt", ar: "إيصال الإيجار" },
    blurb: { tr: "İki dilde, tarihli, yazdırılabilir makbuz", en: "A dated receipt in two languages, ready to print", ar: "إيصال مؤرخ بلغتين، جاهز للطباعة" },
  },
  {
    href: "guides", icon: "doc",
    name: { tr: "Rehberler", en: "Guides", ar: "أدلة" },
    blurb: { tr: "Varış, adres, faturalar, SIM, izinler, araç", en: "Arrival, address, utilities, SIM, permits, cars", ar: "الوصول، العنوان، الفواتير، الشريحة، التصاريح، السيارات" },
  },
];
