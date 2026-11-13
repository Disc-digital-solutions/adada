/**
 * A link that opens WhatsApp on the seller's number with a message already written.
 * wa.me wants the number as digits only, country code first, no plus sign and no 00.
 */
export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^00/, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Fills a translated template such as: Hi, I saw "{title}" on {site}: {url}
 * One pass over the template, so braces inside a title are left alone.
 */
export function contactMessage(
  template: string,
  values: { title: string; site: string; url: string },
): string {
  return template.replace(/\{(title|site|url)\}/g, (_, key: keyof typeof values) => values[key]);
}
