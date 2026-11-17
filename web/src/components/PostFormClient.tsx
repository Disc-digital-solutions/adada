"use client";

import { getDictionary } from "@/i18n";
import { PostForm } from "./PostForm";
import { useQuery } from "./useQuery";

type Props = Omit<React.ComponentProps<typeof PostForm>, "initialKind" | "initialCategory" | "t">;

/** The static site's post form: reads ?kind=wanted&category=… in the browser. */
export function PostFormClient(props: Props) {
  const { kind, category } = useQuery();
  return (
    <PostForm
      {...props}
      t={getDictionary(props.lang)}
      initialKind={kind === "wanted" ? "wanted" : "offer"}
      initialCategory={props.categories.some((c) => c.slug === category) ? category : ""}
    />
  );
}
