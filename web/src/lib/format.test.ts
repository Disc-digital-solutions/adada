import { describe, expect, test } from "vitest";
import { formatDay, formatMoney, timeAgo } from "./format";

describe("formatMoney", () => {
  test("puts the currency symbol before the number", () => {
    expect(formatMoney(45, "GBP", "en")).toBe("£45");
  });

  test("groups thousands the English way in English", () => {
    expect(formatMoney(1500, "TRY", "en")).toBe("₺1,500");
  });

  test("groups thousands the Turkish way in Turkish", () => {
    expect(formatMoney(1500, "TRY", "tr")).toBe("₺1.500");
  });

  test("keeps Latin digits in Arabic", () => {
    expect(formatMoney(1500, "TRY", "ar")).toBe("₺1,500");
  });

  test("knows the euro and the dollar", () => {
    expect([formatMoney(1200, "EUR", "en"), formatMoney(30, "USD", "en")]).toEqual(["€1,200", "$30"]);
  });
});

describe("formatDay", () => {
  test("gives a short day and month", () => {
    expect(formatDay("2026-11-12T10:00:00Z", "en")).toBe("Nov 12");
  });

  test("uses the island's clock, not UTC", () => {
    // 22:30 UTC on the 12th is already the 13th in North Cyprus (UTC+2 in winter).
    expect(formatDay("2026-11-12T22:30:00Z", "en")).toBe("Nov 13");
  });

  test("writes the month in Turkish", () => {
    expect(formatDay("2026-11-12T10:00:00Z", "tr")).toBe("12 Kas");
  });
});

describe("timeAgo", () => {
  const now = Date.parse("2026-11-12T12:00:00Z");
  const ago = (ms: number) => new Date(now - ms).toISOString();
  const MIN = 60_000;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;

  test("counts minutes under an hour", () => {
    expect(timeAgo(ago(5 * MIN), now, "en")).toBe("5 min. ago");
  });

  test("never says zero minutes", () => {
    expect(timeAgo(ago(30_000), now, "en")).toBe("1 min. ago");
  });

  test("counts hours under a day, in Turkish", () => {
    expect(timeAgo(ago(2 * HOUR), now, "tr")).toBe("2 sa. önce");
  });

  test("counts days under a week, in Arabic with Latin digits", () => {
    expect(timeAgo(ago(3 * DAY), now, "ar")).toBe("قبل 3 أيام");
  });

  test("shows the date once it is a week old", () => {
    expect(timeAgo(ago(10 * DAY), now, "en")).toBe("Nov 2");
  });
});
