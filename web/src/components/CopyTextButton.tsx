"use client";

import { useState } from "react";
import { CopyIcon } from "./icons";

/**
 * Copies a ready-made text, such as the post for a seller's Facebook and WhatsApp groups.
 * The text is written on the server, so it is the same for everyone and can be tested.
 */
export function CopyTextButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Old browsers, or the page is not allowed to write to the clipboard: let the person copy by hand.
      window.prompt(label, text);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  }

  return (
    <button type="button" onClick={copy} className="btn btn-quiet">
      <CopyIcon width={18} height={18} />
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
