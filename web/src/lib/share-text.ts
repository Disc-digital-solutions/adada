/**
 * Texts that leave the site: the post a seller pastes into their Facebook and WhatsApp groups,
 * and the message a seller sends the team while posting runs by hand.
 *
 * The group post is the plan's core habit, "post it here, share the link in your groups", made
 * into one button. It carries one line in each language and ONE link without a language in it,
 * so a Turkish, an English and an Arabic reader each land on the ad in their own language.
 * That is the "bridge between the language islands" idea, working inside the groups themselves.
 */

/** The headline: title, then price and city on one line. Empty parts are left out. */
export function groupPost(input: {
  title: string;
  price: string | null;
  city: string;
  /** One line per language, already in the right wording for an offer or a wanted ad. */
  lines: string[];
  url: string;
}): string {
  const facts = [input.price, input.city].filter(Boolean).join(" · ");
  const head = facts ? [input.title, facts] : [input.title];
  return [...head, "", ...input.lines, input.url].join("\n");
}

export interface TeamAdLabels {
  intro: string;
  kind: string;
  kindValue: string;
  title: string;
  price: string;
  category: string;
  city: string;
  description: string;
  photos: string;
  /** Shown only when the ad is for women only. */
  womenOnly?: string;
}

/**
 * The message a seller sends to the team's WhatsApp line while the database is not connected.
 * The team publishes the ad by hand. Labels are in the seller's language, so the seller can read
 * what they are about to send; the team reads all three.
 */
export function teamAdMessage(
  ad: { title: string; price: string | null; category: string; city: string; description: string; hasPhotos: boolean; womenOnly?: boolean },
  labels: TeamAdLabels,
): string {
  const rows = [
    labels.intro,
    "",
    `${labels.kind}: ${labels.kindValue}`,
    `${labels.title}: ${ad.title.trim()}`,
    ad.price ? `${labels.price}: ${ad.price}` : null,
    ad.category ? `${labels.category}: ${ad.category}` : null,
    `${labels.city}: ${ad.city}`,
    ad.womenOnly && labels.womenOnly ? `✓ ${labels.womenOnly}` : null,
  ];
  const description = ad.description.trim();
  if (description) rows.push("", `${labels.description}:`, description);
  if (ad.hasPhotos) rows.push("", labels.photos);
  return rows.filter((row): row is string => row !== null).join("\n");
}
