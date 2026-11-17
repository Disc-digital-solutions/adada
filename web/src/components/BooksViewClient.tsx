"use client";

import { BooksView, type BooksViewProps } from "./BooksView";
import { getDictionary } from "@/i18n";
import { useQuery } from "./useQuery";

/** The static site's course search: reads ?course= in the browser. */
export function BooksViewClient(props: Omit<BooksViewProps, "query" | "t">) {
  // The words come from the script, once, not inside every page.
  return <BooksView {...props} t={getDictionary(props.lang)} query={useQuery()} />;
}
