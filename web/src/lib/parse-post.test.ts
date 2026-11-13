import { describe, expect, it } from "vitest";
import { parsePost } from "./parse-post";

describe("parsePost: price and currency", () => {
  it("reads Turkish lira written as TL with a dot for thousands", () => {
    expect(parsePost("Çalışma masası\nTemiz, 1.500 TL")).toMatchObject({ price: 1500, currency: "TRY" });
  });

  it("reads the lira sign before the number", () => {
    expect(parsePost("Buzdolabı ₺6.500")).toMatchObject({ price: 6500, currency: "TRY" });
  });

  it("reads pounds with the sign and with the word", () => {
    expect(parsePost("Flat for rent £450 a month")).toMatchObject({ price: 450, currency: "GBP" });
    expect(parsePost("Daire kiralık 450 sterlin")).toMatchObject({ price: 450, currency: "GBP" });
    expect(parsePost("2+1 daire 400stg aylık")).toMatchObject({ price: 400, currency: "GBP" });
  });

  it("reads euros and dollars", () => {
    expect(parsePost("Bike 80 euro")).toMatchObject({ price: 80, currency: "EUR" });
    expect(parsePost("iPhone 12 $220")).toMatchObject({ price: 220, currency: "USD" });
  });

  it("reads Arabic currency words", () => {
    expect(parsePost("غرفة مفروشة 180 جنيه شهرياً")).toMatchObject({ price: 180, currency: "GBP" });
    expect(parsePost("لابتوب للبيع 300 دولار")).toMatchObject({ price: 300, currency: "USD" });
  });

  it("reads a comma for thousands and a 'bin' or 'k' shorthand", () => {
    expect(parsePost("Sofa 1,200 TL")).toMatchObject({ price: 1200, currency: "TRY" });
    expect(parsePost("Araba 15 bin TL")).toMatchObject({ price: 15000, currency: "TRY" });
    expect(parsePost("Scooter 2.5k tl")).toMatchObject({ price: 2500, currency: "TRY" });
  });

  it("never mistakes a room count or a model number for a price", () => {
    expect(parsePost("2+1 daire, iPhone 12 hediye").price).toBeNull();
  });

  it("understands free in every language", () => {
    expect(parsePost("Bedava kitaplar, gelip alın")).toMatchObject({ price: 0 });
    expect(parsePost("Free to whoever collects")).toMatchObject({ price: 0 });
    expect(parsePost("كتب مجانا")).toMatchObject({ price: 0 });
  });
});

describe("parsePost: selling or wanted", () => {
  it("is an offer unless the post says it is looking for something", () => {
    expect(parsePost("Satılık masa 500 TL").kind).toBe("offer");
  });

  it("spots wanted posts in Turkish, English and Arabic", () => {
    expect(parsePost("Ev arkadaşı arıyorum, Mağusa").kind).toBe("wanted");
    expect(parsePost("Looking for a cheap fridge").kind).toBe("wanted");
    expect(parsePost("WTB second hand desk").kind).toBe("wanted");
    expect(parsePost("مطلوب غرفة قرب الجامعة").kind).toBe("wanted");
  });
});

describe("parsePost: city", () => {
  it("knows each district by its Turkish, English, Greek and Arabic names", () => {
    expect(parsePost("Magosa'da oda").city).toBe("famagusta");
    expect(parsePost("Room in Famagusta").city).toBe("famagusta");
    expect(parsePost("Lefkoşa merkez").city).toBe("nicosia");
    expect(parsePost("Flat in Kyrenia").city).toBe("kyrenia");
    expect(parsePost("Girne'de 1+1").city).toBe("kyrenia");
    expect(parsePost("Long Beach İskele").city).toBe("iskele");
    expect(parsePost("Morphou area").city).toBe("guzelyurt");
    expect(parsePost("شقة في نيقوسيا").city).toBe("nicosia");
  });

  it("leaves the city empty when none is named", () => {
    expect(parsePost("Masa 500 TL").city).toBeNull();
  });
});

describe("parsePost: category", () => {
  it("guesses from common words", () => {
    expect(parsePost("Arçelik buzdolabı").category).toBe("appliances");
    expect(parsePost("Çalışma masası ve sandalye").category).toBe("furniture");
    expect(parsePost("iPhone 12 128 GB").category).toBe("electronics");
    expect(parsePost("Calculus textbook").category).toBe("books");
    expect(parsePost("2+1 eşyalı daire kiralık").category).toBe("rooms");
    expect(parsePost("Ev arkadaşı arıyorum").category).toBe("roommates");
    expect(parsePost("Winter jacket size M").category).toBe("clothes");
    expect(parsePost("غرفة مفروشة").category).toBe("rooms");
  });

  it("prefers the roommate category over rooms when both fit", () => {
    expect(parsePost("Looking for a flatmate, room in 3+1 flat").category).toBe("roommates");
  });

  it("does not match a word inside another word", () => {
    // "tv" must not match inside "Ataturk caddesi tvs"; "bed" must not match in "Bedava".
    expect(parsePost("Bedava").category).toBeNull();
  });

  it("only returns categories the site has", () => {
    expect(parsePost("Masa", ["books"]).category).toBeNull();
  });
});

describe("parsePost: title and description", () => {
  it("takes the first line as the title, without emoji and hashtags", () => {
    const parsed = parsePost("🔥🔥 SATILIK #masa Çalışma masası 🔥\nÇok temiz, 1.500 TL\n#magosa");
    expect(parsed.title).toBe("Çalışma masası");
    expect(parsed.description).toBe("Çok temiz, 1.500 TL");
  });

  it("drops a leading 'for sale' word, which the selling switch already says", () => {
    expect(parsePost("Acil satılık: iPhone 12").title).toBe("iPhone 12");
    expect(parsePost("FOR SALE - Sofa").title).toBe("Sofa");
    expect(parsePost("للبيع لابتوب ديل").title).toBe("لابتوب ديل");
    expect(parsePost("Salesforce book").title).toBe("Salesforce book");
    expect(parsePost("Satılık").title).toBe("Satılık");
  });

  it("cuts a long title at a word, within 80 characters", () => {
    const long = "Very nice study desk with drawers and a lamp, barely used, must go before the end of the month";
    const { title } = parsePost(long);
    expect(title.length).toBeLessThanOrEqual(80);
    expect(long.startsWith(title)).toBe(true);
  });

  it("keeps the whole text as the description when it is one line", () => {
    const parsed = parsePost("Desk 500 TL");
    expect(parsed.title).toBe("Desk 500 TL");
    expect(parsed.description).toBe("");
  });

  it("returns nothing useful for empty text, without throwing", () => {
    expect(parsePost("   ")).toEqual({
      kind: "offer",
      title: "",
      description: "",
      price: null,
      currency: null,
      city: null,
      category: null,
    });
  });
});
