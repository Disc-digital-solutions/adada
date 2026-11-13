import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDictionary } from "@/i18n";
import { isLang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { contactMessage, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/site.config";

/**
 * The WhatsApp button points here, not straight at WhatsApp, for two reasons:
 * 1. each visit is counted as one contact, which is the number the whole project is judged by;
 * 2. the seller's phone number is never written inside a page, where a robot could collect it.
 * After counting, the visitor is sent on to WhatsApp with a message already written.
 */
export async function GET(request: NextRequest, context: RouteContext<"/[lang]/l/[id]/wa">) {
  const { lang, id } = await context.params;
  if (!isLang(lang)) return new NextResponse(null, { status: 404 });

  const repo = getRepo();
  const listing = await repo.listing(id, Date.now());
  const adPage = new URL(`/${lang}/l/${id}`, request.nextUrl.origin);

  // No such ad, or it is sold or removed: go back to its page, which explains.
  if (!listing || listing.status !== "live") return NextResponse.redirect(adPage);

  const phone = await repo.contact(id, "whatsapp");
  if (!phone) {
    // Sample ads have no seller. Say so instead of opening WhatsApp on nobody.
    adPage.searchParams.set("notice", "sample");
    return NextResponse.redirect(adPage);
  }

  const template = getDictionary(lang).listing.contactTemplate;
  const message = contactMessage(template, {
    title: listing.title,
    site: site.name,
    url: `${site.url}/${lang}/l/${id}`,
  });
  return NextResponse.redirect(whatsappLink(phone, message));
}
