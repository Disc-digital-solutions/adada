import { demoRepo } from "./demo-repo";
import type { Repo } from "./repo";

/**
 * The one place that decides where data comes from.
 * Today: sample data. Next: the Supabase database, once its address is in .env.local.
 */
export function getRepo(): Repo {
  return demoRepo;
}
