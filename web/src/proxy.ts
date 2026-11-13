import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isLang, pickLang } from "@/i18n/config";

/**
 * Runs before every page request. Every page lives under a language (/tr, /en, /ar).
 * A visitor who arrives without one, for example from a shop link in an Instagram bio,
 * is sent to the same page in their browser's language.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLang(first)) return;

  const lang = pickLang(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Pages only: skip Next's own files and anything with a file extension (pictures, the manifest).
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
