import { connection } from "next/server";
import { STATIC_SITE } from "./static-site";

/**
 * The time of this visit, in milliseconds.
 * It first waits for a real visitor, so a page is never prepared in advance with an old clock.
 * Pages ask for the time here, once, and pass it down, which keeps the components themselves
 * free of anything that changes from one moment to the next.
 */
export async function requestTime(): Promise<number> {
  // The static site is prepared once, when it is built; its sample ads are dated from that moment.
  if (!STATIC_SITE) await connection();
  return Date.now();
}
