"use client";

import { useState } from "react";
import { withBase } from "@/lib/static-site";
import { ShareIcon } from "./icons";

/**
 * Shares one ad's page. Phones open their share sheet; elsewhere the link is copied. The message
 * says what really happened: "copied" only after the copy succeeded.
 */
export function ShareListing({
  path,
  title,
  label,
  copiedLabel,
  failedLabel,
}: {
  path: string;
  title: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function share() {
    const url = new URL(withBase(path), window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Closed the share sheet: nothing happened, nothing to say.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 3000);
  }

  return (
    <button type="button" onClick={share} className="btn btn-quiet !min-h-11 !px-3" aria-label={state === "idle" ? `${label}: ${title}` : undefined}>
      <ShareIcon width={18} height={18} />
      <span aria-live="polite" className="text-[13.5px]">
        {state === "copied" ? copiedLabel : state === "failed" ? failedLabel : label}
      </span>
    </button>
  );
}
