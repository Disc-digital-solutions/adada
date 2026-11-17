"use client";

import Link from "next/link";
import { useState } from "react";
import { toggleSaved, useSavedIds } from "@/lib/saved";
import { HeartIcon } from "./icons";

/**
 * The heart on an ad. Saved ads stay on this device. The button says what it will do
 * (aria-pressed tells screen readers whether it is saved), pops once when saved, and stays filled.
 */
export function SaveButton({
  id,
  saveLabel,
  unsaveLabel,
  failedLabel,
  className = "",
}: {
  id: string;
  saveLabel: string;
  unsaveLabel: string;
  failedLabel: string;
  className?: string;
}) {
  const saved = useSavedIds().includes(id);
  const [popKey, setPopKey] = useState(0);
  const [failed, setFailed] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? unsaveLabel : saveLabel}
        title={saved ? unsaveLabel : saveLabel}
        onClick={() => {
          const ok = toggleSaved(id);
          setFailed(!ok);
          if (ok && !saved) setPopKey((k) => k + 1);
        }}
        className={`save-btn grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink shadow-sm transition hover:text-brand ${
          saved ? "!text-brand" : ""
        } ${className}`}
      >
        <HeartIcon key={popKey} width={21} height={21} fill={saved ? "currentColor" : "none"} className={popKey ? "pop" : ""} />
      </button>
      {failed ? (
        <span role="status" className="absolute inset-x-2 bottom-2 rounded-md bg-ink px-2 py-1 text-[12px] text-white">
          {failedLabel}
        </span>
      ) : null}
    </>
  );
}

/** The header's link to the saved ads, with the live count. */
export function SavedLink({ href, label, countLabel }: { href: string; label: string; countLabel: string }) {
  const count = useSavedIds().length;
  return (
    <Link
      href={href}
      aria-label={count ? countLabel.replace("{n}", String(count)) : label}
      className="relative grid h-11 w-11 place-items-center rounded-full text-ink transition hover:bg-sunken hover:text-brand"
    >
      <HeartIcon width={22} height={22} fill={count ? "currentColor" : "none"} className={count ? "text-brand" : ""} />
      {count ? (
        <span aria-hidden className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[11px] font-bold text-on-lime ring-2 ring-card">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
