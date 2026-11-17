"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { formatDay } from "@/lib/format";
import { daysUntil, isDate, minusDays, permitCalendar } from "@/lib/permit";

const KEY = "im-permit";
const LEADS = [30, 45, 60, 90];

interface Saved {
  expiry: string;
  lead: number;
  done: boolean[];
}

/**
 * The residence-permit reminder (ARR-11). Kept on this phone only (no account): the date, the
 * reminder lead and the ticked papers. The calendar file puts the reminders in the phone's own
 * calendar, so they work even if the site is never opened again.
 */
export function PermitTool({ t, lang }: { t: Dictionary; lang: Lang }) {
  const p = t.permit;
  const [saved, setSaved] = useState<Saved>({ expiry: "", lead: 45, done: p.items.map(() => false) });
  const [today, setToday] = useState("");

  useEffect(() => {
    // The date and the saved choices exist only in the browser, after the page is drawn.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().toISOString().slice(0, 10));
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const value = JSON.parse(raw) as Partial<Saved>;
        setSaved((s) => ({
          expiry: typeof value.expiry === "string" ? value.expiry : s.expiry,
          lead: typeof value.lead === "number" ? value.lead : s.lead,
          done: s.done.map((d, i) => Boolean(value.done?.[i] ?? d)),
        }));
      }
    } catch {
      // Storage blocked or damaged: start empty.
    }
  }, []);

  function update(change: Partial<Saved>) {
    const next = { ...saved, ...change };
    setSaved(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Not saved, but the page still works.
    }
  }

  const valid = isDate(saved.expiry) && today !== "";
  const left = valid ? daysUntil(saved.expiry, today) : null;
  const start = valid ? minusDays(saved.expiry, saved.lead) : null;
  const startLeft = start ? daysUntil(start, today) : null;
  const ready = saved.done.filter(Boolean).length;

  function downloadCalendar() {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const ics = permitCalendar({ expiry: saved.expiry, leadDays: saved.lead, startTitle: p.calStart, lastWeekTitle: p.calWeek, note: p.calNote, stamp, today });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "residence-permit-reminders.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tone = left === null ? "" : left < 0 ? "bg-alert text-white" : left <= saved.lead ? "bg-notice text-notice-ink" : "bg-ink text-white";

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:items-start">
      <section className="panel p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="label">{p.expiry}</span>
            <input type="date" value={saved.expiry} onChange={(e) => update({ expiry: e.target.value })} className="field" />
          </label>
          <label>
            <span className="label">{p.lead}</span>
            <select value={saved.lead} onChange={(e) => update({ lead: Number(e.target.value) })} className="field">
              {LEADS.map((n) => (
                <option key={n} value={n}>
                  {p.daysBefore.replace("{n}", String(n))}
                </option>
              ))}
            </select>
          </label>
        </div>

        {left !== null ? (
          <div className={`mt-5 rounded-xl p-5 ${tone}`} aria-live="polite">
            <p className="text-[32px] font-bold leading-none tabular-nums">{left < 0 ? "0" : p.daysLeft.replace("{n}", String(left))}</p>
            <p className="mt-2 text-[15px]">
              {left < 0 ? p.expired : startLeft !== null && startLeft <= 0 ? p.startNow : p.startOn.replace("{date}", formatDay(`${start}T12:00:00Z`, lang))}
            </p>
          </div>
        ) : null}

        <button type="button" onClick={downloadCalendar} disabled={!valid || (left ?? -1) < 0} className="btn btn-primary mt-5 w-full sm:w-auto">
          {p.calendar}
        </button>
      </section>

      <section className="panel p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-semibold">{p.papers}</h2>
          <span className="text-sm font-semibold text-brand-deep">
            {p.ready.replace("{done}", String(ready)).replace("{total}", String(p.items.length))}
          </span>
        </div>
        <ul className="mt-3 grid gap-2">
          {p.items.map((item, i) => (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-paper px-3 py-2.5 text-[15px]">
                <input
                  type="checkbox"
                  checked={saved.done[i] ?? false}
                  onChange={(e) => update({ done: saved.done.map((d, j) => (j === i ? e.target.checked : d)) })}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
        <p className="hint">{p.papersNote}</p>
      </section>
    </div>
  );
}
