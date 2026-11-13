import { describe, expect, it } from "vitest";
import { DEMO_CATEGORIES } from "./data/demo-data";
import { GROUPS, SERVICES, countByService, serviceBySlug, serviceOfCategory } from "./services";

describe("the service map", () => {
  it("has unique slugs", () => {
    expect(new Set(SERVICES.map((s) => s.slug)).size).toBe(SERVICES.length);
  });

  it("puts every service in a group that exists, and every group has a service", () => {
    const groups = new Set(GROUPS.map((g) => g.slug));
    for (const service of SERVICES) expect(groups.has(service.group)).toBe(true);
    for (const group of GROUPS) expect(SERVICES.some((s) => s.group === group.slug)).toBe(true);
  });

  it("gives every listing category exactly one service, so no ad is left without a screen", () => {
    for (const category of DEMO_CATEGORIES) {
      const owners = SERVICES.filter((s) => s.categories.includes(category.slug));
      expect(owners.map((s) => s.slug), category.slug).toHaveLength(1);
    }
  });

  it("only points at categories that exist", () => {
    const known = new Set(DEMO_CATEGORIES.map((c) => c.slug));
    for (const service of SERVICES) for (const c of service.categories) expect(known.has(c), c).toBe(true);
  });

  it("is written in all three languages", () => {
    for (const s of SERVICES) for (const text of [s.name, s.blurb]) {
      expect(text.tr && text.en && text.ar, s.slug).toBeTruthy();
    }
  });

  it("finds services by slug and by category", () => {
    expect(serviceBySlug("towing")?.categories).toEqual(["towing"]);
    expect(serviceOfCategory("roommates")?.slug).toBe("flats");
    expect(serviceBySlug("nope")).toBeUndefined();
  });

  it("counts ads per service", () => {
    const counts = countByService([{ category: "rooms" }, { category: "roommates" }, { category: "cars" }, { category: "unknown" }]);
    expect(counts.flats).toBe(2);
    expect(counts.cars).toBe(1);
    expect(counts.towing).toBe(0);
  });
});
