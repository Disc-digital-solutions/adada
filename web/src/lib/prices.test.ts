import { describe, expect, it } from "vitest";
import { median, priceIndex, tooLowComparedWith } from "./prices";
import type { Listing } from "./types";

let n = 0;
function ad(over: Partial<Listing>): Listing {
  return {
    id: `p${++n}`, kind: "offer", title: "Flat", description: "", price: 400, currency: "GBP", category: "rooms",
    city: "famagusta", status: "live", soldAt: null, photos: [], views: 0, createdAt: "2026-11-01T00:00:00Z",
    seller: { name: "S", shopSlug: "s", city: "famagusta" }, ...over,
  };
}

describe("median", () => {
  it("takes the middle value, or the mean of the two middle ones", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(3);
    expect(median([])).toBeNull();
  });
});

describe("tooLowComparedWith", () => {
  const usual = [ad({ price: 400 }), ad({ price: 420 }), ad({ price: 380 })];

  it("warns about a rent under half the usual one in the same city", () => {
    const bait = ad({ price: 150 });
    expect(tooLowComparedWith(bait, [...usual, bait])).toBe(400);
  });

  it("stays quiet for a normal price", () => {
    const fair = ad({ price: 350 });
    expect(tooLowComparedWith(fair, [...usual, fair])).toBeNull();
  });

  it("never compares across currencies or kinds of thing", () => {
    expect(tooLowComparedWith(ad({ price: 150, currency: "TRY" }), usual)).toBeNull();
    expect(tooLowComparedWith(ad({ price: 150, category: "furniture" }), usual)).toBeNull();
  });

  it("says nothing when there are too few ads to know what is usual", () => {
    expect(tooLowComparedWith(ad({ price: 10 }), usual.slice(0, 2))).toBeNull();
  });

  it("falls back to the whole island when the city has too few ads", () => {
    const bait = ad({ price: 100, city: "lefke" });
    expect(tooLowComparedWith(bait, usual)).toBe(400);
  });
});

describe("priceIndex", () => {
  it("gives a typical price per city and for the island, only with enough ads", () => {
    const rows = priceIndex([...[400, 420, 380].map((price) => ad({ price })), ad({ price: 900, city: "kyrenia" })]);
    expect(rows).toContainEqual({ group: "rent", city: "famagusta", currency: "GBP", median: 400, low: 380, high: 420, count: 3 });
    expect(rows.find((r) => r.city === null)).toMatchObject({ count: 4, median: 410 });
    expect(rows.find((r) => r.city === "kyrenia")).toBeUndefined();
  });
});
