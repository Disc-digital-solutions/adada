import { servicesIn } from "./services";

/**
 * The six ways into the ads on the home page. Each maps onto the real categories underneath, so
 * "Homes & rooms" still covers flats, rooms, roommates, dorms and agencies.
 */
export const BROWSE = [
  { id: "homes", icon: "key", categories: servicesIn("housing").flatMap((s) => s.categories) },
  { id: "preloved", icon: "sofa", categories: servicesIn("buy").flatMap((s) => s.categories) },
  { id: "cars", icon: "car", categories: servicesIn("vehicles").flatMap((s) => s.categories) },
  { id: "jobs", icon: "briefcase", categories: ["jobs", "freelance", "internships", "shifts"] },
  { id: "rides", icon: "route", categories: ["rides"] },
  { id: "help", icon: "hammer", categories: servicesIn("home").flatMap((s) => s.categories) },
] as const;

export type BrowseId = (typeof BROWSE)[number]["id"];

export function browseById(id: string | undefined) {
  return BROWSE.find((b) => b.id === id);
}

/** The housing categories, where the women-only preference applies. */
export const HOUSING = new Set(servicesIn("housing").flatMap((s) => s.categories));
