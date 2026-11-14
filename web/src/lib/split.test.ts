import { describe, expect, it } from "vitest";
import { balances, settle } from "./split";

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
