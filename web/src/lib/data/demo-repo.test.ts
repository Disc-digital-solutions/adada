import { describe, expect, test } from "vitest";
import { demoRepo } from "./demo-repo";

const NOW = Date.parse("2026-11-12T12:00:00Z");
const all = { sort: "newest" } as const;

describe("demoRepo", () => {
  test("search shows sample ads, newest first", async () => {
    const found = await demoRepo.search(all, NOW);
    const times = found.map((l) => Date.parse(l.createdAt));
    expect(found.length).toBeGreaterThan(8);
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  test("search never shows a removed ad", async () => {
    const found = await demoRepo.search(all, NOW);
    expect(found.some((l) => l.status === "removed")).toBe(false);
  });

  test("sample ads are always recent, measured from now", async () => {
    const [newest] = await demoRepo.search(all, NOW);
    expect(NOW - Date.parse(newest.createdAt)).toBeLessThan(60 * 60 * 1000);
  });

  test("an unknown id gives nothing", async () => {
    expect(await demoRepo.listing("no-such-ad", NOW)).toBeNull();
  });

  test("a removed ad can still be opened, so its page can say it was removed", async () => {
    const removed = await demoRepo.listing("d14", NOW);
    expect(removed?.status).toBe("removed");
  });

  test("a shop shows only that seller's listed ads", async () => {
    const shop = await demoRepo.shop("ahmad", NOW);
    expect(shop?.seller.name).toBe("Ahmad K.");
    expect(shop?.listings.length).toBeGreaterThan(1);
    expect(shop?.listings.every((l) => l.seller.shopSlug === "ahmad" && l.status !== "removed")).toBe(true);
  });

  test("an unknown shop gives nothing", async () => {
    expect(await demoRepo.shop("nobody", NOW)).toBeNull();
  });

  test("sample ads have no real seller to contact", async () => {
    expect(await demoRepo.contact("d01", "whatsapp")).toBeNull();
  });

  test("only categories with ads are offered", async () => {
    const used = (await demoRepo.usedCategories(NOW)).map((c) => c.slug);
    const every = (await demoRepo.allCategories()).map((c) => c.slug);
    expect(used).toContain("furniture");
    expect(used).not.toContain("clothes");
    expect(every).toContain("clothes");
  });
});
