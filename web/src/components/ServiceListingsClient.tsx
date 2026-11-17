"use client";

import { ServiceListings, type ServiceListingsProps } from "./ServiceListings";
import { getDictionary } from "@/i18n";
import { useQuery } from "./useQuery";

/** The static site's service ads: reads ?city= and ?women= in the browser. */
export function ServiceListingsClient(props: Omit<ServiceListingsProps, "query" | "t">) {
  // The words come from the script, once, not inside every page.
  return <ServiceListings {...props} t={getDictionary(props.lang)} query={useQuery()} />;
}
