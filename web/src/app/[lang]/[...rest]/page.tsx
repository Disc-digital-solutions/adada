import { notFound } from "next/navigation";

// This page never shows anything of its own, so there is nothing to check for fast navigation.
export const instant = false;

/** Any address that matches no page lands here and gets the "page does not exist" screen. */
export default function UnknownPage() {
  notFound();
}
