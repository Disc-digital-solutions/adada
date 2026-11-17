"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import { CopyTextButton } from "./CopyTextButton";

/**
 * The letter asking for a deposit back (ROOM-09), in Turkish and English so that both sides can
 * read it. Plain and polite; it states facts and asks for a date. Nothing leaves the browser.
 */
export function depositLetter(v: { tenant: string; landlord: string; address: string; amount: string; left: string }): string {
  const d = (x: string, fallback: string) => x.trim() || fallback;
  const tenant = d(v.tenant, "…");
  const landlord = d(v.landlord, "…");
  const address = d(v.address, "…");
  const amount = d(v.amount, "…");
  const left = d(v.left, "…");
  return [
    `Sayın ${landlord},`,
    `${left} tarihinde ${address} adresindeki evden çıktım ve anahtarları teslim ettim. Ev temiz ve teslim aldığım durumda bırakıldı; giriş ve çıkış fotoğrafları bende mevcuttur.`,
    `${amount} tutarındaki depozitomun 14 gün içinde iadesini rica ederim. Bir kesinti yapılacaksa, lütfen gerekçesini ve makbuzlarını yazılı olarak iletiniz.`,
    `Saygılarımla,\n${tenant}`,
    "",
    "———",
    "",
    `Dear ${landlord},`,
    `I moved out of the flat at ${address} on ${left} and returned the keys. The flat was left clean and in the condition I received it; I have photos from moving in and moving out.`,
    `Please return my deposit of ${amount} within 14 days. If you plan to deduct anything, please tell me in writing, with the reason and the receipts.`,
    `Kind regards,\n${tenant}`,
  ].join("\n\n");
}

export function DepositTool({ t, cleanHref }: { t: Dictionary; cleanHref: string }) {
  const d = t.deposit;
  const [v, setV] = useState({ tenant: "", landlord: "", address: "", amount: "", left: "" });
  const field = (key: keyof typeof v, label: string, type = "text") => (
    <label>
      <span className="label">{label}</span>
      <input type={type} value={v[key]} onChange={(e) => setV({ ...v, [key]: e.target.value })} className="field" dir="auto" />
    </label>
  );
  const letter = depositLetter(v);

  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {([
          [d.moveIn, d.inSteps],
          [d.moveOut, d.outSteps],
        ] as const).map(([title, steps]) => (
          <section key={title} className="panel p-5">
            <h2 className="font-semibold">{title}</h2>
            <ul className="mt-3 grid gap-2">
              {steps.map((step) => (
                <li key={step}>
                  <label className="flex cursor-pointer gap-2.5 text-[15px]">
                    <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-brand" />
                    {step}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <a href={cleanHref} className="btn btn-quiet mt-4">
        {d.clean}
      </a>

      <section className="panel mt-8 p-5">
        <h2 className="section-title">{d.letter}</h2>
        <p className="hint !mt-1">{d.letterNote}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {field("tenant", d.tenant)}
          {field("landlord", d.landlord)}
          {field("address", d.address)}
          {field("amount", d.amountLabel)}
          {field("left", d.left, "date")}
        </div>
        <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-paper p-4 font-sans text-[14px] leading-relaxed" dir="ltr">
          {letter}
        </pre>
        <div className="mt-3">
          <CopyTextButton text={letter} label={d.copy} copiedLabel={d.copied} />
        </div>
      </section>
    </>
  );
}
