import type { Localized } from "./types";

/**
 * The guide pages (/[lang]/guides/<slug>). General help for newcomers, written short.
 * NOT legal advice, and NOT checked with the offices yet: every page says so and tells the reader
 * where to confirm. Before launch, a person on the team checks each step and the date below.
 */
export const GUIDES_CHECKED: string | null = null;

export interface GuideStep {
  text: Localized;
  /** A page on this site, without the language: "c/arrival", "guides/sim". */
  link?: string;
}

export interface Guide {
  slug: string;
  icon: string;
  title: Localized;
  intro: Localized;
  steps: GuideStep[];
  /** An example block shown in a box, such as a written address. Same in every language. */
  example?: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "arrival",
    icon: "plane",
    title: { tr: "Varış kontrol listesi", en: "Arrival checklist", ar: "قائمة الوصول" },
    intro: {
      tr: "Kabul mektubundan ilk evine kadar, sırayla.",
      en: "From your acceptance letter to your first flat, in order.",
      ar: "من رسالة القبول إلى أول سكن لك، بالترتيب.",
    },
    steps: [
      { text: { tr: "Üniversiteden kabul mektubunu ve öğrenci numaranı al.", en: "Get your acceptance letter and student number from the university.", ar: "احصل على رسالة القبول ورقمك الجامعي من الجامعة." } },
      { link: "c/arrival", text: { tr: "Uçmadan önce havalimanı transferini ayarla (Ercan veya Larnaka).", en: "Book an airport pickup before you fly (Ercan or Larnaca).", ar: "احجز الاستقبال من المطار قبل السفر (أرجان أو لارنكا)." } },
      { link: "c/viewing", text: { tr: "İlk gecelerini ayarla. Görmediğin bir ev için depozito ödeme.", en: "Book your first nights. Never pay a deposit for a flat you have not seen.", ar: "احجز لياليك الأولى. لا تدفع عربوناً لشقة لم ترها." } },
      { link: "guides/sim", text: { tr: "Havalimanında veya şehirde yerel bir SIM kart al.", en: "Buy a local SIM card at the airport or in town.", ar: "اشترِ شريحة محلية في المطار أو في المدينة." } },
      { link: "guides/residence", text: { tr: "İlk haftalarda üniversitenin uluslararası ofisi üzerinden oturma iznine başvur.", en: "In your first weeks, apply for your residence permit through the university's international office.", ar: "في أسابيعك الأولى، قدّم على تصريح الإقامة عبر المكتب الدولي في الجامعة." } },
      { link: "c/flats", text: { tr: "Evini veya yurdunu bul, gez, sonra imzala.", en: "Find your flat or dorm, visit it, then sign.", ar: "ابحث عن شقتك أو سكنك، زُره، ثم وقّع." } },
      { link: "guides/utilities", text: { tr: "Gerekiyorsa elektrik, su ve interneti bağlat.", en: "Set up electricity, water and internet if the flat needs it.", ar: "اشترك في الكهرباء والماء والإنترنت إذا احتاجت الشقة." } },
    ],
  },
  {
    slug: "address",
    icon: "map",
    title: { tr: "Adres nasıl yazılır (Mersin 10)", en: "How to write your address (Mersin 10)", ar: "كيف تكتب عنوانك (مرسين 10)" },
    intro: {
      tr: "Kuzey Kıbrıs'a posta ve kargo Türkiye üzerinden gelir. Son satır bu yüzden \"Mersin 10 – Turkey\" olur.",
      en: "Post and parcels to North Cyprus travel through Turkey. That is why the last line is \"Mersin 10 – Turkey\".",
      ar: "يصل البريد والطرود إلى شمال قبرص عبر تركيا، لذلك يكون السطر الأخير \"Mersin 10 – Turkey\".",
    },
    steps: [
      { text: { tr: "Adın ve telefon numaran.", en: "Your name and phone number.", ar: "اسمك ورقم هاتفك." } },
      { text: { tr: "Sokak, bina ve daire numarası, ardından semt (örneğin Karakol).", en: "Street, building and flat number, then the area (for example Karakol).", ar: "الشارع ورقم المبنى والشقة، ثم الحي (مثلاً كاراكول)." } },
      { text: { tr: "Şehir, Türkçe adıyla (Gazimağusa, Lefkoşa, Girne).", en: "The town, by its Turkish name (Gazimağusa, Lefkoşa, Girne).", ar: "المدينة باسمها التركي (غازي ماغوسا، لفكوشا، غيرنه)." } },
      { text: { tr: "\"KKTC\" ve son satıra \"Mersin 10 – Turkey\".", en: "\"KKTC\", and on the last line \"Mersin 10 – Turkey\".", ar: "\"KKTC\"، وفي السطر الأخير \"Mersin 10 – Turkey\"." } },
      { link: "c/shop-turkey", text: { tr: "Bazı mağazalar KKTC'ye göndermez veya ek ücret alır; sipariş vermeden sor.", en: "Some shops do not deliver to North Cyprus or charge extra; ask before you order.", ar: "بعض المتاجر لا توصل إلى شمال قبرص أو تأخذ رسوماً إضافية؛ اسأل قبل الطلب." } },
    ],
    example: "Ahmad K.  +90 5xx xxx xx xx\nSalamis Yolu, Blok B, Daire 4, Karakol\nGazimağusa, KKTC\nMersin 10 – Turkey",
  },
  {
    slug: "utilities",
    icon: "sparkle",
    title: { tr: "Elektrik, su ve internet", en: "Electricity, water and internet", ar: "الكهرباء والماء والإنترنت" },
    intro: {
      tr: "Taşınırken neyi kimden, nasıl açtıracağın.",
      en: "What to set up, with whom, when you move in.",
      ar: "ما الذي تشترك فيه ومع من، عند الانتقال.",
    },
    steps: [
      { text: { tr: "Elektrik KIB-TEK'ten gelir. Sayacın senin adına mı ev sahibinin adına mı olduğunu sor.", en: "Electricity comes from KIB-TEK. Ask whether the meter is in your name or the landlord's.", ar: "الكهرباء من شركة KIB-TEK. اسأل هل العداد باسمك أم باسم المالك." } },
      { text: { tr: "Su, şehrinin belediyesinden gelir.", en: "Water comes from your town's municipality.", ar: "الماء من بلدية مدينتك." } },
      { text: { tr: "Ev interneti için önce evde ne olduğunu sor; yeni bağlantı birkaç gün sürebilir.", en: "For home internet, first ask what the flat already has; a new line can take days.", ar: "للإنترنت المنزلي، اسأل أولاً عمّا في الشقة؛ الخط الجديد قد يستغرق أياماً." } },
      { text: { tr: "Pasaportunu ve kira sözleşmeni yanında götür.", en: "Take your passport and your tenancy contract.", ar: "خذ معك جواز سفرك وعقد الإيجار." } },
      { link: "tools/deposit", text: { tr: "Girişte ve çıkışta sayaçların fotoğrafını çek; her makbuzu sakla.", en: "Photograph the meters when you move in and out; keep every receipt.", ar: "صوّر العدادات عند الدخول والخروج؛ واحتفظ بكل إيصال." } },
    ],
  },
  {
    slug: "sim",
    icon: "phone",
    title: { tr: "SIM kart ve mobil internet", en: "SIM cards and mobile data", ar: "الشرائح وبيانات الهاتف" },
    intro: {
      tr: "Adada iki mobil operatör var. Hangisinin senin için daha iyi olduğu, paketine ve semtine bağlı.",
      en: "There are two mobile operators on the island. Which is better for you depends on the package and your area.",
      ar: "في الجزيرة شركتا اتصالات. الأفضل لك يعتمد على الباقة ومنطقتك.",
    },
    steps: [
      { text: { tr: "Operatörler: KKTCELL ve Telsim (Vodafone).", en: "The operators: KKTCELL and Telsim (Vodafone).", ar: "الشركتان: KKTCELL وTelsim (فودافون)." } },
      { text: { tr: "Mağazalarından veya bayilerden al; pasaportunu götür.", en: "Buy at their shops or dealers; take your passport.", ar: "اشترِ من متاجرهما أو الوكلاء؛ خذ جواز سفرك." } },
      { text: { tr: "Öğrenciler çoğunlukla ön ödemeli internet paketi kullanır; aylık GB'yi karşılaştır.", en: "Students mostly use prepaid data packs; compare the GB per month.", ar: "يستخدم الطلاب غالباً باقات مسبقة الدفع؛ قارن الغيغابايت شهرياً." } },
      { text: { tr: "Türkiye hattı çalışır ama dolaşımda olabilir; fiyatı sor.", en: "A Turkish SIM works but may be roaming; ask the price.", ar: "الشريحة التركية تعمل لكنها قد تكون بالتجوال؛ اسأل عن السعر." } },
      { link: "guides/utilities", text: { tr: "Ev interneti için: elektrik, su ve internet rehberi.", en: "For home internet: the electricity, water and internet guide.", ar: "للإنترنت المنزلي: دليل الكهرباء والماء والإنترنت." } },
    ],
  },
  {
    slug: "residence",
    icon: "doc",
    title: { tr: "Öğrenci oturma izni", en: "Student residence permit", ar: "تصريح إقامة الطالب" },
    intro: {
      tr: "Güncel adımları ve son tarihleri üniversitenin uluslararası ofisi verir. Bu sayfa ne bekleyeceğini anlatır.",
      en: "Your university's international office gives the current steps and deadlines. This page tells you what to expect.",
      ar: "المكتب الدولي في جامعتك يعطيك الخطوات والمواعيد الحالية. هذه الصفحة تشرح ما تتوقعه.",
    },
    steps: [
      { text: { tr: "İlk haftalarda uluslararası ofise git.", en: "Go to the international office in your first weeks.", ar: "اذهب إلى المكتب الدولي في أسابيعك الأولى." } },
      { text: { tr: "Genellikle istenenler: pasaport, öğrenci belgesi, fotoğraf, sağlık kontrolü, sigorta.", en: "Usually needed: passport, student certificate, photos, a health check, insurance.", ar: "المطلوب عادة: جواز السفر، شهادة الطالب، صور، فحص صحي، تأمين." } },
      { text: { tr: "Sağlık kontrolü devlet hastanesinde yapılır; ofis söyleyince randevu al.", en: "The health check is at a state hospital; book it when the office tells you.", ar: "الفحص الصحي في مستشفى حكومي؛ احجزه حين يخبرك المكتب." } },
      { text: { tr: "Her belgenin kopyasını sakla; iznini veya makbuzunu yanında taşı.", en: "Keep copies of everything; carry your permit or its receipt.", ar: "احتفظ بنسخ من كل شيء؛ واحمل التصريح أو إيصاله." } },
    ],
  },
  {
    slug: "work-permit",
    icon: "badge",
    title: { tr: "Çalışma izni", en: "Work permit", ar: "تصريح العمل" },
    intro: {
      tr: "Çalışmadan önce izin gerekir. İzni işveren başlatır.",
      en: "You need a permit before you work. The employer starts it.",
      ar: "تحتاج إلى تصريح قبل العمل. صاحب العمل يبدأ الإجراءات.",
    },
    steps: [
      { text: { tr: "İşveren, Çalışma Dairesi'ne başvurur.", en: "The employer applies, usually at the Labour Department (Çalışma Dairesi).", ar: "يقدّم صاحب العمل الطلب، عادة لدى دائرة العمل (Çalışma Dairesi)." } },
      { text: { tr: "Öğrencilerin çalışmasında sınırlar olabilir; başlamadan önce üniversiteye ve işverene sor.", en: "Students may have limits on work; ask your university and the employer before you start.", ar: "قد تكون هناك قيود على عمل الطلاب؛ اسأل جامعتك وصاحب العمل قبل البدء." } },
      { text: { tr: "İzinsiz çalışma, oturma iznini riske atabilir.", en: "Working without a permit can put your residence at risk.", ar: "العمل دون تصريح قد يعرّض إقامتك للخطر." } },
      { link: "c/jobs", text: { tr: "İş ilanları: yarı zamanlı ve tam zamanlı.", en: "Jobs: part-time and full-time.", ar: "الوظائف: بدوام جزئي وكامل." } },
    ],
  },
  {
    slug: "car",
    icon: "car",
    title: { tr: "İkinci el araç alırken", en: "Buying and registering a used car", ar: "شراء سيارة مستعملة وتسجيلها" },
    intro: {
      tr: "Para vermeden önce kontrol et, sonra devri resmi yap.",
      en: "Check before you pay, then make the transfer official.",
      ar: "افحص قبل أن تدفع، ثم اجعل نقل الملكية رسمياً.",
    },
    steps: [
      { text: { tr: "Ruhsattaki ismin satıcının kimliğiyle aynı olduğunu kontrol et.", en: "Check the name on the registration matches the seller's ID.", ar: "تأكد أن الاسم في رخصة السيارة يطابق هوية البائع." } },
      { text: { tr: "Yol vergisi, sigorta ve muayene tarihine bak.", en: "Check the road tax, insurance and inspection date.", ar: "تحقق من ضريبة الطريق والتأمين وموعد الفحص." } },
      { text: { tr: "Devri iki taraf birlikte, karayolları dairesinde yapar.", en: "Buyer and seller do the transfer together at the road transport office.", ar: "يتم نقل الملكية بحضور البائع والمشتري في دائرة النقل البري." } },
      { text: { tr: "Sürmeden önce kendi sigortanı yaptır.", en: "Get your own insurance before you drive.", ar: "استخرج تأمينك الخاص قبل القيادة." } },
      { link: "c/cars", text: { tr: "Satılık araçlar.", en: "Cars for sale.", ar: "سيارات للبيع." } },
    ],
  },
  {
    slug: "bank",
    icon: "receipt",
    title: { tr: "Banka hesabı açmak", en: "Opening a bank account", ar: "فتح حساب بنكي" },
    intro: {
      tr: "Öğrencilerin çoğu ilk ayında açar. İstekler bankaya göre değişir; bu genel bir yoldur.",
      en: "Most students open one in their first month. Each bank asks for slightly different things; this is the usual path.",
      ar: "يفتح معظم الطلاب حساباً في شهرهم الأول. تختلف الطلبات من بنك لآخر؛ هذا هو الطريق المعتاد.",
    },
    steps: [
      { text: { tr: "Pasaportunu, öğrenci belgeni ve varsa oturma iznini veya başvuru makbuzunu hazırla.", en: "Have your passport, student certificate and, if you have it, your residence permit or its application receipt.", ar: "جهّز جواز سفرك وشهادة الطالب، وتصريح الإقامة أو إيصال طلبه إن وُجد." } },
      { link: "guides/sim", text: { tr: "Yerel bir telefon numarası al; bankalar çoğu zaman ister.", en: "Get a local phone number first; banks often ask for one.", ar: "احصل على رقم هاتف محلي أولاً؛ كثيراً ما تطلبه البنوك." } },
      { text: { tr: "İki üç bankaya sor: öğrenci hesabı, kart ücreti, döviz hesabı ve havale ücretleri.", en: "Ask two or three banks: student accounts, card fees, foreign-currency accounts and transfer fees.", ar: "اسأل بنكين أو ثلاثة: حسابات الطلاب، رسوم البطاقة، الحساب بالعملة الأجنبية، ورسوم الحوالات." } },
      { text: { tr: "Kira sterlinse bir döviz hesabı da açmayı düşün.", en: "If your rent is in pounds, think about a foreign-currency account too.", ar: "إن كان إيجارك بالجنيه ففكّر في حساب بالعملة الأجنبية أيضاً." } },
      { text: { tr: "IBAN ve SWIFT/BIC bilgilerini ailene gönder; ilk havalenin geldiğini kontrol et.", en: "Send your IBAN and SWIFT/BIC to your family, and check the first transfer arrives.", ar: "أرسل رقم IBAN وSWIFT/BIC لأهلك، وتأكد من وصول أول حوالة." } },
      { link: "help", text: { tr: "Daha fazla soru: öğrenci soruları sayfası.", en: "More questions: the student questions page.", ar: "أسئلة أخرى: صفحة أسئلة الطلاب." } },
    ],
  },
  {
    slug: "leaving",
    icon: "plane",
    title: { tr: "Adadan ayrılırken", en: "Leaving the island", ar: "عند مغادرة الجزيرة" },
    intro: {
      tr: "Okul bittiğinde veya taşındığında, hiçbir şeyi geride bırakmamak için.",
      en: "When you finish your studies or move away, so nothing is left behind.",
      ar: "عند إنهاء الدراسة أو الانتقال، كي لا يبقى شيء معلّقاً.",
    },
    steps: [
      { text: { tr: "Diplomanı, transkriptini ve gerekiyorsa tasdikli kopyalarını al.", en: "Collect your diploma, transcript and, if you need them, certified copies.", ar: "استلم شهادتك وكشف العلامات، ونسخاً مصدّقة إن احتجت." } },
      { link: "c/buy-sell", text: { tr: "Götürmeyeceklerini sat; tümünü tek bağlantıda paylaş.", en: "Sell what you will not take, and share it all in one link.", ar: "بِع ما لن تأخذه، وشارك كل شيء برابط واحد." } },
      { link: "tools/deposit", text: { tr: "Evi teslim et ve depozitonu yazılı iste.", en: "Hand back the flat and ask for your deposit in writing.", ar: "سلّم الشقة واطلب العربون كتابةً." } },
      { text: { tr: "Son faturaları öde; elektrik ve interneti kapattır.", en: "Pay the last bills and close electricity and internet.", ar: "ادفع آخر الفواتير وأغلق الكهرباء والإنترنت." } },
      { text: { tr: "Banka hesabını kapat ya da yurt dışından kullanabilecek misin, sor.", en: "Close your bank account, or ask whether you can use it from abroad.", ar: "أغلق حسابك البنكي أو اسأل هل يمكنك استخدامه من الخارج." } },
      { text: { tr: "İzninin iptal edilmesi gerekip gerekmediğini uluslararası ofise sor.", en: "Ask the international office whether your permit must be cancelled.", ar: "اسأل المكتب الدولي هل يجب إلغاء تصريحك." } },
      { link: "c/storage", text: { tr: "Geri döneceksen eşyanı yaz boyunca sakla.", en: "Coming back? Store your things over the summer.", ar: "ستعود؟ خزّن أغراضك خلال الصيف." } },
    ],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Emergency numbers. Checked against public sources only; confirm before launch (see SCREENS.md). */
export const EMERGENCY = [
  { number: "155", name: { tr: "Polis", en: "Police", ar: "الشرطة" } },
  { number: "112", name: { tr: "Ambulans", en: "Ambulance", ar: "الإسعاف" } },
  { number: "199", name: { tr: "İtfaiye", en: "Fire", ar: "الإطفاء" } },
  { number: "177", name: { tr: "Orman yangını", en: "Forest fire", ar: "حرائق الغابات" } },
  { number: "158", name: { tr: "Sahil güvenlik", en: "Coast guard", ar: "خفر السواحل" } },
] satisfies { number: string; name: Localized }[];
