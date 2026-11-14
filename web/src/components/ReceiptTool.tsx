"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n";
import { CURRENCIES, type Currency } from "@/lib/types";

/**
 * A rent receipt in Turkish and English (ROOM-10, easy version): no money moves through the app,
 * it only records a payment both sides agree happened. Printed, or saved as PDF from the print box.
 */
export function ReceiptTool({ t }: { t: Dictionary }) {
  const r = t.receipt;
  const [v, setV] = useState({ landlord: "", tenant: "", address: "", amount: "", currency: "GBP" as Currency, period: "", paid: "", method: "transfer" });
  // Today's date is only known in the browser; the page itself is prepared ahead of time.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setV((current) => (current.paid ? current : { ...current, paid: new Date().toISOString().slice(0, 10) }));
  }, []);
  const field = (key: "landlord" | "tenant" | "address" | "amount" | "period" | "paid", label: string, type = "text") => (
    <label>
      <span className="label">{label}</span>
      <input type={type} value={v[key]} onChange={(e) => setV({ ...v, [key]: e.target.value })} className="field" dir="auto" />
    </label>
  );
  const row = (tr: string, en: string, value: string) => (
    <tr className="border-t border-line">
      <th className="w-1/3 py-2 pe-4 text-start align-top text-[13px] font-semibold text-ink-soft">
        {tr}
        <br />
        <span className="font-normal">{en}</span>
      </th>
      <td className="py-2 text-[15px]" dir="auto">
        {value || "—"}
      </td>
    </tr>
  );

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
      <form className="panel grid gap-3 p-4 print:hidden" onSubmit={(e) => e.preventDefault()}>
        {field("landlord", r.landlord)}
        {field("tenant", r.tenant)}
        {field("address", r.address)}
        <div className="grid grid-cols-[1fr_6.5rem] gap-2">
          {field("amount", r.amount)}
          <label>
            <span className="label">&nbsp;</span>
            <select value={v.currency} onChange={(e) => setV({ ...v, currency: e.target.value as Currency })} className="field">
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        {field("period", r.period, "month")}
        {field("paid", r.paid, "date")}
        <label>
          <span className="label">{r.method}</span>
          <select value={v.method} onChange={(e) => setV({ ...v, method: e.target.value })} className="field">
            <option value="transfer">{r.transfer}</option>
            <option value="cash">{r.cash}</option>
          </select>
        </label>
        <button type="button" onClick={() => window.print()} className="btn btn-primary mt-2">
          {r.print}
        </button>
      </form>

      {/* The receipt itself: the only thing that prints. Always Turkish and English. */}
      <article id="receipt" className="panel p-6 print:border-0 print:shadow-none" dir="ltr">
        <header className="flex items-start justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <h2 className="text-xl font-bold">KİRA MAKBUZU</h2>
            <p className="text-[13px] text-ink-soft">Rent receipt</p>
          </div>
          <p className="text-[28px] font-bold tabular-nums">
            {v.amount || "0"} {v.currency}
          </p>
        </header>
        <table className="mt-2 w-full">
          <tbody>
            {row("Ev sahibi", "Landlord", v.landlord)}
            {row("Kiracı", "Tenant", v.tenant)}
            {row("Adres", "Address", v.address)}
            {row("Ait olduğu ay", "For the month of", v.period)}
            {row("Ödeme tarihi", "Date paid", v.paid)}
            {row("Ödeme şekli", "Paid by", v.method === "cash" ? "Nakit / Cash" : "Banka havalesi / Bank transfer")}
          </tbody>
        </table>
        <div className="mt-10 grid grid-cols-2 gap-8 text-[13px] text-ink-soft">
          <p className="border-t border-ink pt-1">Ev sahibi imza / Landlord signature</p>
          <p className="border-t border-ink pt-1">Kiracı imza / Tenant signature</p>
        </div>
      </article>
    </div>
  );
}
