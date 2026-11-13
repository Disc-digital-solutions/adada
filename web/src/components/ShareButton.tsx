"use client";

import { useState } from "react";
import { ShareIcon } from "./icons";

/**
 * Shares the page you are on. Phones open their own share sheet (WhatsApp, Instagram…);
 * where that does not exist, the link is copied instead and the button says so.
 */
export function ShareButton({ title, label, copiedLabel }: { title: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href.split("?")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // The person closed the share sheet. Nothing to do.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button type="button" onClick={share} className="btn btn-quiet">
      <ShareIcon width={18} height={18} />
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
