"use client";

import { useSyncExternalStore } from "react";

/**
 * Saved ads, kept on this device (there are no accounts yet). Every heart, the header's count and the
 * saved list read the same store, so they always agree.
 */
const KEY = "adada-saved";
const EVENT = "adada-saved-change";
const EMPTY: readonly string[] = [];
let cache: { raw: string | null; ids: readonly string[] } = { raw: null, ids: EMPTY };

function read(): readonly string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.ids;
  let ids: readonly string[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) ids = parsed.filter((x): x is string => typeof x === "string");
  } catch {
    ids = EMPTY;
  }
  cache = { raw, ids };
  return ids;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The saved ad ids; empty on the server and until the page has loaded. */
export function useSavedIds(): readonly string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Saves or unsaves an ad. Returns false if the device would not store it (private mode, full). */
export function toggleSaved(id: string): boolean {
  const ids = read();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(EVENT));
  return true;
}
