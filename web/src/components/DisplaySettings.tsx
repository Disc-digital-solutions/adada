"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n";

/**
 * Larger text (ENH-30) and save-data mode (ENH-29). Remembered on this device only.
 * The same keys are read by a tiny script in the layout before the page is drawn, so there is no flash.
 */
export const DISPLAY_KEYS = { text: "im-text", lowData: "im-lowdata" } as const;

function read(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function write(key: string, on: boolean) {
  try {
    if (on) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {
    // Private mode or blocked storage: the setting still applies until the page is closed.
  }
}

export function DisplaySettings({ t }: { t: Dictionary }) {
  const [large, setLarge] = useState(false);
  const [lowData, setLowData] = useState(false);

  useEffect(() => {
    // Reading the saved choice after the first render keeps server and browser HTML identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLarge(read(DISPLAY_KEYS.text));
    setLowData(read(DISPLAY_KEYS.lowData));
  }, []);

  function toggle(which: "text" | "lowData") {
    const html = document.documentElement;
    if (which === "text") {
      const on = !large;
      setLarge(on);
      write(DISPLAY_KEYS.text, on);
      if (on) html.dataset.text = "large";
      else delete html.dataset.text;
    } else {
      const on = !lowData;
      setLowData(on);
      write(DISPLAY_KEYS.lowData, on);
      if (on) html.dataset.lowdata = "1";
      else delete html.dataset.lowdata;
    }
  }

  const button = (on: boolean) => `chip !text-[13px] ${on ? "!border-ink !bg-ink !text-white" : ""}`;
  return (
    <div>
      <p className="text-sm font-semibold">{t.display.title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" aria-pressed={large} onClick={() => toggle("text")} className={button(large)}>
          {t.display.larger}
        </button>
        <button type="button" aria-pressed={lowData} onClick={() => toggle("lowData")} className={button(lowData)}>
          {t.display.lowData}
        </button>
      </div>
    </div>
  );
}
