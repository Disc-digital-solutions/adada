"use client";

import { useSearchParams } from "next/navigation";

/** The address's ?a=1&b=2 as { a: "1", b: "2" }, read in the browser (static site). */
export function useQuery(): Record<string, string> {
  return Object.fromEntries(useSearchParams().entries());
}
