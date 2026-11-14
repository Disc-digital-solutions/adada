import type { Localized } from "./types";

/**
 * The student questions centre (ARR-09): the questions students ask most, answered short.
 * General help, NOT legal or financial advice, and NOT checked with banks or offices yet. Answers
 * avoid fees, bank names and nationality rules on purpose: those change and differ by person, so
 * every answer says who gives the definitive one. Anything not here goes to the team on WhatsApp.
 */
export interface Answer {
  q: Localized;
  a: Localized;
  /** A page on this site, without the language. */
  link?: string;
}

export interface HelpTopic {
  slug: string;
  icon: string;
  title: Localized;
  answers: Answer[];
}

export const HELP: HelpTopic[] = [
  {
    slug: "money",
    icon: "receipt",
    title: { tr: "Banka ve para", en: "Banks and money", ar: "البنوك والمال" },
    answers: [
      {
        q: { tr: "Yabancı öğrenci olarak banka hesabı açabilir miyim?", en: "Can I open a bank account as a foreign student?", ar: "هل يمكنني فتح حساب بنكي كطالب أجنبي؟" },
        a: {
          tr: "Genellikle evet. Bankaların çoğu pasaport, üniversiteden öğrenci belgesi ve çoğu zaman oturma izni veya başvuru makbuzu ile yerel bir telefon numarası ister. İstekler bankadan bankaya değişir; iki üç bankaya sor.",
          en: "Usually, yes. Most banks ask for your passport, a student certificate from your university, and often your residence permit (or its application receipt) and a local phone number. Requirements differ from bank to bank, so ask two or three.",
          ar: "غالباً نعم. تطلب معظم البنوك جواز السفر وشهادة طالب من الجامعة، وكثيراً تصريح الإقامة (أو إيصال طلبه) ورقم هاتف محلي. تختلف الشروط من بنك لآخر، فاسأل بنكين أو ثلاثة.",
        },
        link: "guides/bank",
      },
      {
        q: { tr: "Hesabım hangi para biriminde olmalı?", en: "Which currency should my account be in?", ar: "بأي عملة يجب أن يكون حسابي؟" },
        a: {
          tr: "Hesaplar Türk lirası, sterlin, avro veya dolar olabilir. Kira çoğu zaman sterlin, günlük alışveriş lira olur. Döviz çevirme ve havale ücretlerini sor.",
          en: "Accounts can be in Turkish lira, pounds, euros or dollars. Rent is often in pounds and daily shopping in lira. Ask about the fees for changing money and for transfers.",
          ar: "يمكن أن تكون الحسابات بالليرة التركية أو الجنيه أو اليورو أو الدولار. الإيجار غالباً بالجنيه والتسوق اليومي بالليرة. اسأل عن رسوم تحويل العملات والحوالات.",
        },
      },
      {
        q: { tr: "Ailemden nasıl para alırım?", en: "How do I receive money from home?", ar: "كيف أستلم المال من أهلي؟" },
        a: {
          tr: "En yaygın yol, buradaki hesabına uluslararası havaledir. Toplam maliyeti karşılaştır: ücret, döviz kuru ve buradaki bankanın alım ücreti. Gönderenin bankasının istediği bilgileri (IBAN, SWIFT/BIC) bankandan al.",
          en: "The usual way is an international transfer to your account here. Compare the total cost: the fee, the exchange rate and what your bank here charges to receive it. Get the details the sender's bank needs (IBAN, SWIFT/BIC) from your bank.",
          ar: "الطريقة المعتادة حوالة دولية إلى حسابك هنا. قارن التكلفة الكاملة: الرسوم وسعر الصرف وما يأخذه بنكك هنا للاستلام. خذ من بنكك البيانات التي يحتاجها بنك المرسل (IBAN وSWIFT/BIC).",
        },
      },
      {
        q: { tr: "Her yerde kartla ödeyebilir miyim?", en: "Can I pay by card everywhere?", ar: "هل أستطيع الدفع بالبطاقة في كل مكان؟" },
        a: {
          tr: "Marketler, zincir mağazalar ve restoranların çoğu kart kabul eder. Küçük dükkanlar, bazı ev sahipleri ve taksiler çoğu zaman nakit ister. Yanında biraz nakit bulundur, büyük miktar değil.",
          en: "Supermarkets, chain shops and most restaurants take cards. Small shops, some landlords and taxis often want cash. Keep some cash with you, but not large amounts.",
          ar: "تقبل البطاقات في السوبرماركت والمتاجر الكبرى ومعظم المطاعم. المحلات الصغيرة وبعض المالكين وسيارات الأجرة تطلب غالباً نقداً. احمل بعض النقود، لا مبالغ كبيرة.",
        },
      },
      {
        q: { tr: "Kirayı nakit mi ödemeliyim?", en: "Should I pay rent in cash?", ar: "هل أدفع الإيجار نقداً؟" },
        a: {
          tr: "Mümkünse havaleyle öde; kayıt kalır. Nakit ödersen her ay imzalı makbuz al.",
          en: "If you can, pay by transfer: it leaves a record. If you pay cash, get a signed receipt every month.",
          ar: "إن أمكن ادفع بالتحويل لأنه يترك سجلاً. وإن دفعت نقداً فاحصل على إيصال موقّع كل شهر.",
        },
        link: "tools/receipt",
      },
    ],
  },
  {
    slug: "deposits",
    icon: "key",
    title: { tr: "Kira depozitosu", en: "Rent deposits", ar: "عربون الإيجار" },
    answers: [
      {
        q: { tr: "Ev sahipleri ne kadar depozito ister?", en: "How much deposit do landlords ask for?", ar: "كم عربوناً يطلب المالكون؟" },
        a: {
          tr: "Çoğu zaman bir aylık kira, bazen daha fazla; emlakçılar ayrıca komisyon alabilir. Gezmeden önce sor ve tutarları yazılı al.",
          en: "Often one month's rent, sometimes more; agencies may also charge a commission. Ask before you visit, and get the amounts in writing.",
          ar: "غالباً إيجار شهر، وأحياناً أكثر؛ وقد تأخذ المكاتب عمولة أيضاً. اسأل قبل الزيارة واحصل على المبالغ مكتوبة.",
        },
      },
      {
        q: { tr: "Evi görmeden depozito ödemeli miyim?", en: "Should I pay a deposit before I see the flat?", ar: "هل أدفع العربون قبل أن أرى الشقة؟" },
        a: {
          tr: "Hayır. Senin veya güvendiğin birinin görmediği bir ev için para ödeme. Yurt dışındaysan bizden görüntülü ev gezisi iste.",
          en: "No. Never pay for a flat that you, or someone you trust, have not seen. If you are abroad, ask us for a video viewing.",
          ar: "لا. لا تدفع لشقة لم تزرها أنت أو شخص تثق به. إن كنت في الخارج فاطلب منا معاينة بالفيديو.",
        },
        link: "c/viewing",
      },
      {
        q: { tr: "Depozitomu geri aldığımdan nasıl emin olurum?", en: "How do I make sure I get my deposit back?", ar: "كيف أضمن استرجاع عربوني؟" },
        a: {
          tr: "Yazılı sözleşme ve depozito makbuzu al, ilk gün her şeyin fotoğrafını çek ve çıkış listesini uygula.",
          en: "Get a written contract and a receipt for the deposit, photograph everything on the first day, and follow the move-out checklist.",
          ar: "احصل على عقد مكتوب وإيصال للعربون، وصوّر كل شيء في اليوم الأول، واتبع قائمة المغادرة.",
        },
        link: "tools/deposit",
      },
      {
        q: { tr: "Ev sahibi depozitomu vermiyor. Ne yapabilirim?", en: "The landlord will not return my deposit. What can I do?", ar: "المالك لا يعيد عربوني. ماذا أفعل؟" },
        a: {
          tr: "Depozito aracımızdaki mektupla yazılı iste ve tüm mesajları sakla. Yine verilmezse üniversitenin öğrenci ofisiyle veya bir avukatla konuş.",
          en: "Ask in writing with the letter from our deposit tool, and keep every message. If it is still not returned, talk to your university's student office or a lawyer.",
          ar: "اطلبه كتابةً بالرسالة من أداة العربون واحتفظ بكل الرسائل. وإن لم يُعَد، تحدّث مع مكتب الطلاب في جامعتك أو مع محامٍ.",
        },
        link: "c/contract-check",
      },
    ],
  },
  {
    slug: "immigration",
    icon: "doc",
    title: { tr: "Vize, oturma izni ve göç", en: "Visas, permits and immigration", ar: "التأشيرات والإقامة والهجرة" },
    answers: [
      {
        q: { tr: "Kuzey Kıbrıs'a gelmek için vize gerekir mi?", en: "Do I need a visa to come to North Cyprus?", ar: "هل أحتاج تأشيرة للقدوم إلى شمال قبرص؟" },
        a: {
          tr: "Uyruğuna bağlı. Bazıları pasaportla girer, bazılarının yola çıkmadan onay alması gerekir. Bilet almadan önce üniversitenin uluslararası ofisine sor.",
          en: "It depends on your nationality. Some people enter with a passport; others need approval before they travel. Ask your university's international office before you buy a ticket.",
          ar: "يعتمد على جنسيتك. بعضهم يدخل بجواز السفر، وآخرون يحتاجون موافقة قبل السفر. اسأل المكتب الدولي في جامعتك قبل شراء التذكرة.",
        },
      },
      {
        q: { tr: "Türkiye üzerinden Ercan'a uçuyorum. Türkiye vizesi gerekir mi?", en: "I fly to Ercan through Turkey. Do I need a Turkish visa?", ar: "أسافر إلى أرجان عبر تركيا. هل أحتاج تأشيرة تركية؟" },
        a: {
          tr: "Havalimanından çıkmadan aktarma yapıyorsan çoğu zaman gerekmez; ama kurallar uyruğa ve havalimanından çıkıp çıkmamana göre değişir. Bilet almadan önce pasaportun için Türkiye'nin kurallarına bak.",
          en: "If you change planes without leaving the airport, usually not, but it depends on your nationality and on whether you leave the airport. Check Turkey's rules for your passport before you book.",
          ar: "إن بدّلت الطائرة دون مغادرة المطار فغالباً لا، لكن ذلك يعتمد على جنسيتك وعلى خروجك من المطار. تحقق من قواعد تركيا لجوازك قبل الحجز.",
        },
      },
      {
        q: { tr: "Öğrenci oturma izni nedir, ne zaman başvururum?", en: "What is a student residence permit, and when do I apply?", ar: "ما تصريح إقامة الطالب ومتى أقدّم عليه؟" },
        a: {
          tr: "Okurken burada yaşamanı sağlar. İlk haftalarda üniversitenin uluslararası ofisi üzerinden başvurursun; güncel belge listesini onlar verir.",
          en: "It lets you live here while you study. You apply in your first weeks through your university's international office; they give you the current list of papers.",
          ar: "يسمح لك بالعيش هنا أثناء الدراسة. تقدّم في أسابيعك الأولى عبر المكتب الدولي في جامعتك، وهم يعطونك قائمة الأوراق الحالية.",
        },
        link: "guides/residence",
      },
      {
        q: { tr: "İznimi ne zaman yenilemeliyim?", en: "When must I renew my permit?", ar: "متى يجب أن أجدد تصريحي؟" },
        a: {
          tr: "Genellikle her yıl, bitmeden önce. Erken başla: dönem başlarında ofisler çok yoğun olur. İzin aracımız sana hatırlatır.",
          en: "Usually every year, before it ends. Start early: offices get busy at the start of each term. Our permit tool reminds you.",
          ar: "عادة كل سنة، قبل انتهائه. ابدأ مبكراً لأن المكاتب تزدحم في بداية كل فصل. أداة التصريح عندنا تذكّرك.",
        },
        link: "tools/permit",
      },
      {
        q: { tr: "İznimin süresi geçerse ne olur?", en: "What if my permit runs out?", ar: "ماذا لو انتهى تصريحي؟" },
        a: {
          tr: "Süresi bittikten sonra kalmak cezaya ve ileride girişte sorunlara yol açabilir. Geç kaldıysan hemen uluslararası ofise git ve ne yapman gerektiğini sor.",
          en: "Staying after it ends can mean fines and problems entering again later. If you are late, go to the international office at once and ask what to do.",
          ar: "البقاء بعد انتهائه قد يعني غرامات ومشاكل في الدخول لاحقاً. إن تأخرت فاذهب فوراً إلى المكتب الدولي واسأل ماذا تفعل.",
        },
      },
      {
        q: { tr: "Okurken çalışabilir miyim?", en: "Can I work while I study?", ar: "هل يمكنني العمل أثناء الدراسة؟" },
        a: {
          tr: "Sadece çalışma izniyle; öğrenciler için sınırlar olabilir. Önce üniversitene sor.",
          en: "Only with a work permit, and students may have limits. Ask your university first.",
          ar: "فقط بتصريح عمل، وقد توجد قيود على الطلاب. اسأل جامعتك أولاً.",
        },
        link: "guides/work-permit",
      },
      {
        q: { tr: "Güneye (Kıbrıs Cumhuriyeti) geçebilir miyim?", en: "Can I visit the south (the Republic of Cyprus)?", ar: "هل يمكنني زيارة الجنوب (جمهورية قبرص)؟" },
        a: {
          tr: "Geçiş kapıları açık, ama geçiş kuralları uyruğuna ve adaya nasıl girdiğine bağlı. Gezi planlamadan önce sor; geçebileceğini varsayma.",
          en: "The crossing points are open, but the rules depend on your nationality and on how you entered the island. Ask before you plan a trip; do not assume you can cross.",
          ar: "المعابر مفتوحة، لكن القواعد تعتمد على جنسيتك وعلى طريقة دخولك إلى الجزيرة. اسأل قبل التخطيط لرحلة ولا تفترض أنك تستطيع العبور.",
        },
      },
      {
        q: { tr: "Okulu bitiriyorum. Ayrılmadan önce ne yapmalıyım?", en: "I am finishing my studies. What should I do before I leave?", ar: "أنهيت دراستي. ماذا أفعل قبل المغادرة؟" },
        a: {
          tr: "Diplomanı ve transkriptini al, banka hesabını kapat ya da koru, evi teslim edip depozitonu al, götürmeyeceklerini sat ve iznin iptal edilmesi gerekip gerekmediğini ofise sor.",
          en: "Get your diploma and transcript, close or keep your bank account, hand back the flat and get your deposit, sell what you will not take, and ask the office whether your permit must be cancelled.",
          ar: "خذ شهادتك وكشف علاماتك، أغلق حسابك البنكي أو احتفظ به، سلّم الشقة واسترجع العربون، بِع ما لن تأخذه، واسأل المكتب هل يجب إلغاء تصريحك.",
        },
        link: "guides/leaving",
      },
    ],
  },
];
