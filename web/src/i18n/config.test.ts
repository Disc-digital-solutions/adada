import { describe, expect, test } from "vitest";
import { dirOf, isLang, pickLang, switchLangPath } from "./config";

describe("isLang", () => {
  test("accepts the three launch languages", () => {
    expect(["tr", "en", "ar"].every(isLang)).toBe(true);
  });

  test("rejects a language the site does not have", () => {
    expect(isLang("de")).toBe(false);
  });
});

describe("dirOf", () => {
  test("Arabic runs right to left", () => {
    expect(dirOf("ar")).toBe("rtl");
  });

  test("Turkish and English run left to right", () => {
    expect([dirOf("tr"), dirOf("en")]).toEqual(["ltr", "ltr"]);
  });
});

describe("switchLangPath", () => {
  test("keeps the same page when the language changes", () => {
    expect(switchLangPath("/tr/l/abc", "ar")).toBe("/ar/l/abc");
  });

  test("handles the home page", () => {
    expect(switchLangPath("/tr", "en")).toBe("/en");
  });

  test("adds a language to a path that has none", () => {
    expect(switchLangPath("/search", "en")).toBe("/en/search");
  });

  test("turns the bare root into the language home", () => {
    expect(switchLangPath("/", "ar")).toBe("/ar");
  });
});

describe("pickLang", () => {
  test("picks the browser's first language when the site has it", () => {
    expect(pickLang("ar-PS,ar;q=0.9,en;q=0.8")).toBe("ar");
  });

  test("skips languages the site does not have", () => {
    expect(pickLang("de-DE,de;q=0.9,en;q=0.7")).toBe("en");
  });

  test("follows the q weights, not the order written", () => {
    expect(pickLang("en;q=0.5,ar;q=0.9")).toBe("ar");
  });

  test("falls back to Turkish when nothing matches", () => {
    expect(pickLang("fr-FR,fr;q=0.9")).toBe("tr");
  });

  test("falls back to Turkish when the browser sends nothing", () => {
    expect(pickLang(null)).toBe("tr");
  });
});
