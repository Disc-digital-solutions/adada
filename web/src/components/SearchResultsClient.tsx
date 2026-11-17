"use client";

import { SearchResults, type SearchResultsProps } from "./SearchResults";
import { getDictionary } from "@/i18n";
import { useQuery } from "./useQuery";

/** The static site's search: reads the address in the browser. */
export function SearchResultsClient(props: Omit<SearchResultsProps, "query" | "t">) {
  // The words come from the script, once, not inside every page.
  return <SearchResults {...props} t={getDictionary(props.lang)} query={useQuery()} />;
}
