"use client";

import { useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { ServiceIcon } from "./icons";

/** The browser's own speech-to-text, where it exists (Chrome, Edge, Safari, Android). Nothing is sent to us. */
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

const SPEECH_LANG: Record<Lang, string> = { tr: "tr-TR", en: "en-GB", ar: "ar" };

export function VoiceButton({ lang, t, onText }: { lang: Lang; t: Dictionary; onText: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const recognition = useRef<Recognition | null>(null);

  function toggle() {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Engine = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Engine) {
      setUnsupported(true);
      return;
    }
    const r = new Engine();
    r.lang = SPEECH_LANG[lang];
    r.interimResults = false;
    r.continuous = false;
    r.onresult = (event) => {
      const said = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (said) onText(said);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognition.current = r;
    setListening(true);
    r.start();
  }

  return (
    <>
      <button type="button" onClick={toggle} className={`btn ${listening ? "btn-primary" : "btn-quiet"}`} aria-pressed={listening}>
        <ServiceIcon name="mic" width={18} height={18} />
        {listening ? t.voice.stop : t.voice.speak}
      </button>
      {unsupported ? <span className="text-sm text-ink-soft">{t.voice.unsupported}</span> : null}
    </>
  );
}
