"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n";
import { balances, settle, type Bill } from "@/lib/split";
import { CopyTextButton } from "./CopyTextButton";

/** The bill splitter (ROOM-08). Everything stays in the browser: no account, nothing stored. */
export function SplitTool({ t }: { t: Dictionary }) {
  const s = t.split;
  const [people, setPeople] = useState<string[]>(["A", "B", "C"]);
  const [bills, setBills] = useState<Bill[]>([
    { label: s.examples[0], paidBy: 0, amount: 900 },
    { label: s.examples[1], paidBy: 1, amount: 240 },
    { label: s.examples[2], paidBy: 0, amount: 450 },
  ]);

  const names = people.map((p, i) => p.trim() || `#${i + 1}`);
  const transfers = useMemo(() => settle(people.length, bills), [people.length, bills]);
  const total = bills.reduce((sum, b) => sum + (b.amount > 0 ? b.amount : 0), 0);
  const share = people.length ? total / people.length : 0;
  const owed = balances(people.length, bills);
  const money = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const text = [
    `${s.title}`,
    ...bills.filter((b) => b.amount > 0).map((b) => `• ${b.label}: ${money(b.amount)} (${names[b.paidBy] ?? "?"})`),
    `${s.share}: ${money(share)}`,
    "",
    ...(transfers.length ? transfers.map((x) => `→ ${s.pays.replace("{from}", names[x.from]).replace("{to}", names[x.to])}: ${money(x.amount)}`) : [s.even]),
  ].join("\n");

  const updateBill = (i: number, change: Partial<Bill>) => setBills(bills.map((b, j) => (j === i ? { ...b, ...change } : b)));
  const removePerson = (i: number) => {
    setPeople(people.filter((_, j) => j !== i));
    // Bills paid by the removed person move to the first flatmate; later indexes shift down.
    setBills(bills.map((b) => ({ ...b, paidBy: b.paidBy === i ? 0 : b.paidBy > i ? b.paidBy - 1 : b.paidBy })));
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="grid gap-5">
        <section className="panel p-4">
          <h2 className="font-semibold">{s.people}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {people.map((name, i) => (
              <li key={i} className="flex gap-2">
                <input aria-label={s.name} value={name} onChange={(e) => setPeople(people.map((p, j) => (j === i ? e.target.value : p)))} className="field" dir="auto" />
                {people.length > 2 ? (
                  <button type="button" onClick={() => removePerson(i)} className="btn btn-quiet !px-3" aria-label={s.remove}>
                    ×
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setPeople([...people, ""])} className="btn btn-quiet mt-3">
            + {s.addPerson}
          </button>
        </section>

        <section className="panel p-4">
          <h2 className="font-semibold">{s.bills}</h2>
          <ul className="mt-3 grid gap-3">
            {bills.map((bill, i) => (
              <li key={i} className="grid grid-cols-[1fr_7rem] gap-2 sm:grid-cols-[1fr_7rem_10rem_auto]">
                <input aria-label={s.what} value={bill.label} onChange={(e) => updateBill(i, { label: e.target.value })} className="field" dir="auto" />
                <input aria-label={s.amount} inputMode="decimal" value={Number.isFinite(bill.amount) ? String(bill.amount) : ""} onChange={(e) => updateBill(i, { amount: Number(e.target.value.replace(",", ".")) || 0 })} className="field" dir="ltr" />
                <select aria-label={s.paidBy} value={bill.paidBy} onChange={(e) => updateBill(i, { paidBy: Number(e.target.value) })} className="field">
                  {names.map((n, j) => (
                    <option key={j} value={j}>
                      {s.paidBy}: {n}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => setBills(bills.filter((_, j) => j !== i))} className="btn btn-quiet !px-3" aria-label={s.remove}>
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setBills([...bills, { label: "", paidBy: 0, amount: 0 }])} className="btn btn-quiet mt-3">
            + {s.addBill}
          </button>
        </section>
      </div>

      <section className="panel p-5 lg:sticky lg:top-20" aria-live="polite">
        <h2 className="section-title">{s.result}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {s.share}: <b className="tabular-nums text-ink">{money(share)}</b>
        </p>
        <ul className="mt-4 grid gap-2">
          {transfers.length === 0 ? <li className="notice">{s.even}</li> : null}
          {transfers.map((x, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-paper px-3 py-2.5">
              <span className="text-[15px]">{s.pays.replace("{from}", names[x.from]).replace("{to}", names[x.to])}</span>
              <b className="tabular-nums">{money(x.amount)}</b>
            </li>
          ))}
        </ul>
        <ul className="mt-4 grid gap-1 text-[13px] text-ink-soft">
          {names.map((n, i) => (
            <li key={i} className="flex justify-between">
              <span>{n}</span>
              <span className={`tabular-nums ${owed[i] < 0 ? "text-alert" : owed[i] > 0 ? "text-[#1d6a3d]" : ""}`} dir="ltr">
                {owed[i] > 0 ? "+" : ""}
                {money(owed[i])}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <CopyTextButton text={text} label={s.copy} copiedLabel={s.copied} />
        </div>
      </section>
    </div>
  );
}
