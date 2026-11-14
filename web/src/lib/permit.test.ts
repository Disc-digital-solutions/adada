import { describe, expect, it } from "vitest";
import { daysUntil, isDate, minusDays, permitCalendar } from "./permit";

describe("permit dates", () => {
  it("counts whole days, negative once passed", () => {
    expect(daysUntil("2027-09-30", "2027-09-01")).toBe(29);
    expect(daysUntil("2027-09-01", "2027-09-30")).toBe(-29);
    expect(daysUntil("2028-03-01", "2028-02-28")).toBe(2); // leap year
  });

  it("goes back a number of days across months and years", () => {
    expect(minusDays("2027-01-10", 45)).toBe("2026-11-26");
  });

  it("accepts only real dates", () => {
    expect(isDate("2027-02-28")).toBe(true);
    expect(isDate("2027-02-30")).toBe(false);
    expect(isDate("28/02/2027")).toBe(false);
  });
});

describe("permitCalendar", () => {
  const ics = permitCalendar({
    expiry: "2027-09-30",
    leadDays: 45,
    startTitle: "Start renewing my permit",
    lastWeekTitle: "Permit ends in 7 days; renew, now",
    note: "Ask the international office for the list of papers.",
    stamp: "20261114T090000Z",
  });

  it("has two all-day events on the right days", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20270816");
    expect(ics).toContain("DTSTART;VALUE=DATE:20270923");
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  });

  it("moves a reminder that would be in the past to today", () => {
    const late = permitCalendar({ expiry: "2027-09-30", leadDays: 45, startTitle: "a", lastWeekTitle: "b", note: "", stamp: "x", today: "2027-09-01" });
    expect(late).toContain("DTSTART;VALUE=DATE:20270901");
    expect(late).toContain("DTSTART;VALUE=DATE:20270923");
  });

  it("escapes commas and semicolons and uses CRLF", () => {
    expect(ics).toContain("SUMMARY:Permit ends in 7 days\\; renew\\, now");
    expect(ics).toMatch(/^BEGIN:VCALENDAR\r\n/);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
});
