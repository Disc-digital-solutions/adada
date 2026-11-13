import { describe, expect, test } from "vitest";
import { filterListings, fold, isListed, parseFilter, visibleCategories } from "./listings";
import type { Category, Listing, ListingFilter } from "./types";

const NOW = Date.parse("2026-11-12T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(NOW - n * DAY).toISOString();

let nextId = 0;
function make(overrides: Partial<Listing> = {}): Listing {
  nextId += 1;
  return {
    id: `id${nextId}`,
    kind: "offer",
    title: "Study desk",
    description: "Good condition",
    price: 500,
    currency: "TRY",
    category: "furniture",
    city: "famagusta",
    status: "live",
    soldAt: null,
    photos: [],
    views: 0,
    createdAt: daysAgo(1),
    seller: { name: "Ali", shopSlug: "ali", city: "famagusta" },
    ...overrides,
  };
}

const all: ListingFilter = { sort: "newest" };
const ids = (list: Listing[]) => list.map((l) => l.id);

describe("fold", () => {
  test("lowercases the Turkish dotted capital I to a plain i", () => {
    expect(fold("İPHONE 12")).toBe("iphone 12");
  });

  test("treats dotless and dotted i as the same letter", () => {
    expect([fold("ISITICI"), fold("ısıtıcı")]).toEqual(["isitici", "isitici"]);
  });
});

describe("isListed", () => {
  test("a live listing is listed", () => {
    expect(isListed(make(), NOW)).toBe(true);
  });

  test("a removed listing is not", () => {
    expect(isListed(make({ status: "removed" }), NOW)).toBe(false);
  });

  test("a sold listing stays for seven days", () => {
    expect(isListed(make({ status: "sold", soldAt: daysAgo(6) }), NOW)).toBe(true);
  });

  test("a sold listing leaves after seven days", () => {
    expect(isListed(make({ status: "sold", soldAt: daysAgo(8) }), NOW)).toBe(false);
  });
});

describe("filterListings", () => {
  test("leaves out removed listings", () => {
    const live = make();
    const removed = make({ status: "removed" });
    expect(ids(filterListings([live, removed], all, NOW))).toEqual([live.id]);
  });

  test("finds a word in the title", () => {
    const desk = make({ title: "Study desk" });
    const fridge = make({ title: "Fridge", description: "Works well" });
    expect(ids(filterListings([desk, fridge], { ...all, q: "desk" }, NOW))).toEqual([desk.id]);
  });

  test("finds a word in the description", () => {
    const fridge = make({ title: "Fridge", description: "Bought from Bosch store" });
    expect(ids(filterListings([make(), fridge], { ...all, q: "bosch" }, NOW))).toEqual([fridge.id]);
  });

  test("ignores capitals and Turkish dots when searching", () => {
    const heater = make({ title: "ISITICI satılık" });
    expect(ids(filterListings([heater], { ...all, q: "ısıtıcı" }, NOW))).toEqual([heater.id]);
  });

  test("filters by category", () => {
    const phone = make({ category: "electronics" });
    expect(ids(filterListings([make(), phone], { ...all, category: "electronics" }, NOW))).toEqual([phone.id]);
  });

  test("filters by any of several categories, for a service screen", () => {
    const phone = make({ category: "electronics" });
    const book = make({ category: "books" });
    const room = make({ category: "rooms" });
    expect(ids(filterListings([phone, book, room], { ...all, categories: ["electronics", "books"] }, NOW)).sort()).toEqual(
      [phone.id, book.id].sort(),
    );
  });

  test("filters by city", () => {
    const inNicosia = make({ city: "nicosia" });
    expect(ids(filterListings([make(), inNicosia], { ...all, city: "nicosia" }, NOW))).toEqual([inNicosia.id]);
  });

  test("filters wanted posts", () => {
    const wanted = make({ kind: "wanted" });
    expect(ids(filterListings([make(), wanted], { ...all, kind: "wanted" }, NOW))).toEqual([wanted.id]);
  });

  test("a chosen currency keeps only prices in that currency", () => {
    const inPounds = make({ price: 300, currency: "GBP" });
    const noPrice = make({ price: null, currency: "GBP" });
    expect(ids(filterListings([make(), inPounds, noPrice], { ...all, currency: "GBP" }, NOW))).toEqual([inPounds.id]);
  });

  test("applies the price range inside the chosen currency", () => {
    const cheap = make({ price: 100 });
    const mid = make({ price: 500 });
    const dear = make({ price: 900 });
    const filter: ListingFilter = { ...all, currency: "TRY", min: 200, max: 600 };
    expect(ids(filterListings([cheap, mid, dear], filter, NOW))).toEqual([mid.id]);
  });

  test("ignores the price range when no currency is chosen", () => {
    const pounds = make({ price: 50, currency: "GBP" });
    const lira = make({ price: 5000, currency: "TRY" });
    expect(filterListings([pounds, lira], { ...all, min: 100, max: 200 }, NOW)).toHaveLength(2);
  });

  test("shows the newest first", () => {
    const old = make({ createdAt: daysAgo(5) });
    const fresh = make({ createdAt: daysAgo(1) });
    expect(ids(filterListings([old, fresh], all, NOW))).toEqual([fresh.id, old.id]);
  });

  test("sorts cheapest first inside a currency", () => {
    const dear = make({ price: 900 });
    const cheap = make({ price: 100 });
    const filter: ListingFilter = { sort: "cheapest", currency: "TRY" };
    expect(ids(filterListings([dear, cheap], filter, NOW))).toEqual([cheap.id, dear.id]);
  });

  test("sorts most expensive first inside a currency", () => {
    const cheap = make({ price: 100 });
    const dear = make({ price: 900 });
    const filter: ListingFilter = { sort: "dearest", currency: "TRY" };
    expect(ids(filterListings([cheap, dear], filter, NOW))).toEqual([dear.id, cheap.id]);
  });

  test("falls back to newest when sorting by price with no currency", () => {
    const oldCheap = make({ price: 1, createdAt: daysAgo(5) });
    const freshDear = make({ price: 999, createdAt: daysAgo(1) });
    expect(ids(filterListings([oldCheap, freshDear], { sort: "cheapest" }, NOW))).toEqual([freshDear.id, oldCheap.id]);
  });

  test("does not change the list it was given", () => {
    const list = [make({ createdAt: daysAgo(5) }), make({ createdAt: daysAgo(1) })];
    const before = ids(list);
    filterListings(list, all, NOW);
    expect(ids(list)).toEqual(before);
  });
});

describe("visibleCategories", () => {
  const categories: Category[] = [
    { slug: "rooms", name: { tr: "Oda", en: "Rooms", ar: "غرف" }, sort: 2 },
    { slug: "furniture", name: { tr: "Mobilya", en: "Furniture", ar: "أثاث" }, sort: 1 },
    { slug: "books", name: { tr: "Kitap", en: "Books", ar: "كتب" }, sort: 3 },
  ];

  test("shows only categories that have a listing, in their set order", () => {
    const listings = [make({ category: "rooms" }), make({ category: "furniture" })];
    expect(visibleCategories(categories, listings, NOW).map((c) => c.slug)).toEqual(["furniture", "rooms"]);
  });

  test("a removed listing does not make its category appear", () => {
    const listings = [make({ category: "books", status: "removed" })];
    expect(visibleCategories(categories, listings, NOW)).toEqual([]);
  });
});

describe("parseFilter", () => {
  test("reads a full set of search parameters", () => {
    expect(
      parseFilter({ q: "  desk ", category: "furniture", city: "famagusta", kind: "wanted", currency: "GBP", min: "10", max: "90", sort: "cheapest" }),
    ).toEqual({ q: "desk", category: "furniture", city: "famagusta", kind: "wanted", currency: "GBP", min: 10, max: 90, sort: "cheapest" });
  });

  test("defaults to newest with nothing else set", () => {
    expect(parseFilter({})).toEqual({ sort: "newest" });
  });

  test("drops values it does not recognise", () => {
    expect(parseFilter({ kind: "stolen", currency: "BTC", sort: "random", min: "abc", max: "-5" })).toEqual({ sort: "newest" });
  });

  test("drops an empty search box", () => {
    expect(parseFilter({ q: "   " })).toEqual({ sort: "newest" });
  });

  test("takes the first value when a parameter is repeated", () => {
    expect(parseFilter({ q: ["desk", "chair"] })).toEqual({ q: "desk", sort: "newest" });
  });
});
