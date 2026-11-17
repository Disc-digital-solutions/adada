"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import { balances, extraCents, parseAmount, settle, type Bill } from "@/lib/split";
import { CURRENCIES, type Currency } from "@/lib/types";
import { CopyTextButton } from "./CopyTextButton";

const SYMBOL: Record<Currency, string> = { TRY: "₺", GBP: "£", EUR: "€", USD: "$" };

/** A bill as typed: the amount stays exactly as written until it is valid. */
type Draft = { label: string; paidBy: number; raw: string };

/**
 * The bill splitter (ROOM-08). Everything stays in the browser: no account, nothing stored.
 * Amounts are checked as they are typed; a bill with a blank or invalid amount is marked and left
 * out of the result (never counted as 0). Shares are worked in whole cents, and any leftover cent
 * is said out loud, so the payments always add up to the total.
 */
export function SplitTool({ t, lang }: { t: Dictionary; lang: string }) {
  const s = t.split;
  const [people, setPeople] = useState<string[]>(["A", "B", "C"]);
  const [currency, setCurrency] = useState<Currency>("TRY");
  const [bills, setBills] = useState<Draft[]>([
    { label: s.examples[0], paidBy: 0, raw: "900" },
    { label: s.examples[1], paidBy: 1, raw: "240" },
    { label: s.examples[2], paidBy: 0, raw: "450" },
  ]);

  const names = people.map((p, i) => p.trim() || `#${i + 1}`);
  const parsed = bills.map((b) => parseAmount(b.raw));
  const valid: Bill[] = bills.flatMap((b, i) => {
    const r = parsed[i];
    return r.ok ? [{ label: b.label, paidBy: b.paidBy, amount: r.amount }] : [];
  });
  const invalid = parsed.some((r) => !r.ok);
  const transfers = settle(people.length, valid);
  const owed = balances(people.length, valid);
  const totalCents = valid.reduce((sum, b) => sum + Math.round(b.amount * 100), 0);
  const total = totalCents / 100;
  const share = Math.floor(totalCents / people.length) / 100;
  const extra = extraCents(people.length, total);

  const grouping = lang === "tr" ? "tr" : "en";
  const money = (n: number) =>
    SYMBOL[currency] + new Intl.NumberFormat(grouping, { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n);

  const text = [
    `${s.title}`,
    ...valid.map((b) => `• ${b.label}: ${money(b.amount)} (${names[b.paidBy] ?? "?"})`),
    `${s.total}: ${money(total)}`,
    `${s.share}: ${money(share)}`,
    "",
    ...(transfers.length ? transfers.map((x) => `→ ${s.pays.replace("{from}", names[x.from]).replace("{to}", names[x.to])}: ${money(x.amount)}`) : [s.even]),
  ].join("\n");

  const updateBill = (i: number, change: Partial<Draft>) => setBills(bills.map((b, j) => (j === i ? { ...b, ...change } : b)));
  const removePerson = (i: number) => {
    setPeople(people.filter((_, j) => j !== i));
    // Bills paid by the removed person move to the first flatmate; later indexes shift down.
    setBills(bills.map((b) => ({ ...b, paidBy: b.paidBy === i ? 0 : b.paidBy > i ? b.paidBy - 1 : b.paidBy })));
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="grid gap-5">
        <section className="panel p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-heading text-lg font-bold">{s.people}</h2>
            <label className="w-40">
              <span className="label">{s.currency}</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="field">
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {SYMBOL[c]} {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {people.map((name, i) => (
              <li key={i} className="flex gap-2">
                <input aria-label={`${s.name} ${i + 1}`} value={name} onChange={(e) => setPeople(people.map((p, j) => (j === i ? e.target.value : p)))} className="field" dir="auto" />
                {people.length > 2 ? (
                  <button type="button" onClick={() => removePerson(i)} className="btn btn-quiet !min-w-11 !px-3" aria-label={`${s.remove}: ${names[i]}`}>
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
          <h2 className="font-heading text-lg font-bold">{s.bills}</h2>
          <ul className="mt-3 grid gap-3">
            {bills.map((bill, i) => {
              const r = parsed[i];
              const errorId = `bill-error-${i}`;
              return (
                <li key={i} className="grid grid-cols-[1fr_7.5rem] gap-2 sm:grid-cols-[1fr_7.5rem_10rem_auto]">
                  <input aria-label={`${s.what} ${i + 1}`} value={bill.label} onChange={(e) => updateBill(i, { label: e.target.value })} className="field" dir="auto" />
                  <input
                    aria-label={`${s.amount} (${currency})`}
                    aria-invalid={!r.ok}
                    aria-describedby={!r.ok ? errorId : undefined}
                    inputMode="decimal"
                    value={bill.raw}
                    onChange={(e) => updateBill(i, { raw: e.target.value })}
                    className={`field tabular-nums ${!r.ok ? "!border-alert" : ""}`}
                    dir="ltr"
                  />
                  <select aria-label={s.paidBy} value={bill.paidBy} onChange={(e) => updateBill(i, { paidBy: Number(e.target.value) })} className="field">
                    {names.map((n, j) => (
                      <option key={j} value={j}>
                        {s.paidBy}: {n}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setBills(bills.filter((_, j) => j !== i))} className="btn btn-quiet !min-w-11 !px-3" aria-label={`${s.remove}: ${bill.label || i + 1}`}>
                    ×
                  </button>
                  {!r.ok ? (
                    <p id={errorId} className="col-span-full -mt-1 text-[13.5px] font-medium text-alert">
                      {r.error === "blank" ? s.errBlank : s.errNumber}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => setBills([...bills, { label: "", paidBy: 0, raw: "" }])} className="btn btn-quiet mt-3">
            + {s.addBill}
          </button>
        </section>
      </div>

      <section className="panel p-5 lg:sticky lg:top-24" aria-live="polite">
        <h2 className="section-title">{s.result}</h2>
        {invalid ? <p className="notice notice-alert mt-3">{s.fixFirst}</p> : null}
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[14.5px]">
          <dt className="text-ink-soft">{s.total}</dt>
          <dd className="text-end font-bold tabular-nums">
            <bdi>{money(total)}</bdi>
          </dd>
          <dt className="text-ink-soft">{s.share}</dt>
          <dd className="text-end font-bold tabular-nums">
            <bdi>{money(share)}</bdi>
          </dd>
        </dl>
        {extra > 0 ? <p className="mt-2 text-[13px] text-ink-soft">{s.rounding.replace("{n}", String(extra))}</p> : null}
        <ul className="mt-4 grid gap-2">
          {transfers.length === 0 ? <li className="notice">{s.even}</li> : null}
          {transfers.map((x, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-paper px-3 py-2.5">
              <span className="text-[15px]">{s.pays.replace("{from}", names[x.from]).replace("{to}", names[x.to])}</span>
              <b className="tabular-nums">
                <bdi>{money(x.amount)}</bdi>
              </b>
            </li>
          ))}
        </ul>
        <ul className="mt-4 grid gap-1 text-[13px] text-ink-soft">
          {names.map((n, i) => (
            <li key={i} className="flex justify-between">
              <span>{n}</span>
              <span className={`tabular-nums ${owed[i] < 0 ? "text-alert" : owed[i] > 0 ? "text-ok" : ""}`} dir="ltr">
                {owed[i] > 0 ? "+" : owed[i] < 0 ? "−" : ""}
                {money(Math.abs(owed[i]))}
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
