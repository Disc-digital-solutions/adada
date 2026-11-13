import { describe, expect, test } from "vitest";
import { plural } from "./plural";

const ads = { one: "{n} ad", other: "{n} ads" };
const ilan = { other: "{n} ilan" };
const arabic = {
  zero: "لا إعلانات",
  one: "إعلان واحد",
  two: "إعلانان",
  few: "{n} إعلانات",
  many: "{n} إعلاناً",
  other: "{n} إعلان",
};

describe("plural", () => {
  test("English uses the singular for one", () => {
    expect(plural("en", 1, ads)).toBe("1 ad");
  });

  test("English uses the plural for many", () => {
    expect(plural("en", 12, ads)).toBe("12 ads");
  });

  test("groups thousands", () => {
    expect(plural("en", 1500, ads)).toBe("1,500 ads");
  });

  test("Turkish keeps one form", () => {
    expect(plural("tr", 5, ilan)).toBe("5 ilan");
  });

  test("Arabic has a word for none", () => {
    expect(plural("ar", 0, arabic)).toBe("لا إعلانات");
  });

  test("Arabic has a dual", () => {
    expect(plural("ar", 2, arabic)).toBe("إعلانان");
  });

  test("Arabic uses the 'few' form from three to ten, with Latin digits", () => {
    expect(plural("ar", 5, arabic)).toBe("5 إعلانات");
  });

  test("Arabic uses the 'many' form from eleven", () => {
    expect(plural("ar", 11, arabic)).toBe("11 إعلاناً");
  });

  test("Arabic uses the general form for a hundred", () => {
    expect(plural("ar", 100, arabic)).toBe("100 إعلان");
  });

  test("falls back to the general form when a special one is missing", () => {
    expect(plural("ar", 2, { other: "{n} x" })).toBe("2 x");
  });
});
