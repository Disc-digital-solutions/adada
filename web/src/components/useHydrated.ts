"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False while the server's HTML is shown, true once the page runs in the browser. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
