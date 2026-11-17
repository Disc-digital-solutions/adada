"use client";

import { PlanView, type PlanViewProps } from "./PlanView";
import { getDictionary } from "@/i18n";
import { useQuery } from "./useQuery";

/** The static site's arrival plan: reads ?city=&budget=&date= in the browser. */
export function PlanViewClient(props: Omit<PlanViewProps, "query" | "t">) {
  // The words come from the script, once, not inside every page.
  return <PlanView {...props} t={getDictionary(props.lang)} query={useQuery()} />;
}
