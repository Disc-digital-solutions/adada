import { describe, expect, it, test } from "vitest";
import { balances, extraCents, parseAmount, settle } from "./split";

describe("balances", () => {
  it("shares each bill equally among everyone", () => {
    expect(balances(3, [{ label: "Electricity", paidBy: 0, amount: 90 }])).toEqual([60, -30, -30]);
  });

  it("gives leftover cents to the first people so the total stays exact", () => {
    const b = balances(3, [{ label: "Water", paidBy: 2, amount: 100 }]);
    expect(b.reduce((s, x) => s + x, 0)).toBeCloseTo(0, 10);
    expect(b).toEqual([-33.34, -33.33, 66.67]);
  });

  it("ignores empty or impossible bills", () => {
    expect(balances(2, [{ label: "x", paidBy: 5, amount: 10 }, { label: "y", paidBy: 0, amount: 0 }])).toEqual([0, 0]);
  });
});

describe("settle", () => {
  it("finds the payments that make everyone even", () => {
    const bills = [
      { label: "Electricity", paidBy: 0, amount: 120 },
      { label: "Internet", paidBy: 1, amount: 60 },
    ];
    // Each owes 60 in all: person 0 is owed 60, person 1 is even, person 2 owes 60.
    expect(settle(3, bills)).toEqual([{ from: 2, to: 0, amount: 60 }]);
  });

  it("needs no payment when everyone paid their share", () => {
    expect(settle(2, [{ label: "a", paidBy: 0, amount: 50 }, { label: "b", paidBy: 1, amount: 50 }])).toEqual([]);
  });

  it("settles several people with at most n-1 payments", () => {
    const t = settle(4, [{ label: "Rent", paidBy: 0, amount: 1000 }, { label: "Gas", paidBy: 3, amount: 100 }]);
    expect(t.length).toBeLessThanOrEqual(3);
    const net = [0, 0, 0, 0];
    for (const x of t) { net[x.from] += x.amount; net[x.to] -= x.amount; }
    expect(net.map((v) => Math.round(v * 100) / 100)).toEqual([-725, 275, 275, 175]);
  });
});

describe("parseAmount", () => {
  test("reads points, commas and Arabic digits", () => {
    expect(parseAmount("450")).toEqual({ ok: true, amount: 450 });
    expect(parseAmount("12,50")).toEqual({ ok: true, amount: 12.5 });
    expect(parseAmount(" 12.05 ")).toEqual({ ok: true, amount: 12.05 });
    expect(parseAmount("٤٥٠")).toEqual({ ok: true, amount: 450 });
  });
  test("refuses blank, zero, negative and non-numbers", () => {
    expect(parseAmount("")).toEqual({ ok: false, error: "blank" });
    expect(parseAmount("   ")).toEqual({ ok: false, error: "blank" });
    expect(parseAmount("0")).toEqual({ ok: false, error: "number" });
    expect(parseAmount("-5")).toEqual({ ok: false, error: "number" });
    expect(parseAmount("12.345")).toEqual({ ok: false, error: "number" });
    expect(parseAmount("abc")).toEqual({ ok: false, error: "number" });
    expect(parseAmount("Infinity")).toEqual({ ok: false, error: "number" });
  });
});

describe("rounding", () => {
  test("shares add up to the total exactly", () => {
    const owed = balances(3, [{ label: "Internet", paidBy: 0, amount: 100 }]);
    // 100.00 / 3 = 33.33 × 3 + 0.01: one person carries the extra cent.
    expect(extraCents(3, 100)).toBe(1);
    expect(Math.round(owed.reduce((a, b) => a + b, 0) * 100)).toBe(0);
    expect(owed[0]).toBeCloseTo(66.66, 2);
  });
});
