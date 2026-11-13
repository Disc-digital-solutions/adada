import Link from "next/link";
import type { Lang } from "@/i18n/config";
import { groupOf, serviceOfCategory, type Service } from "@/lib/services";
import { ServiceIcon } from "./icons";

/** A square of colour with the service's drawing: the same mark on every tile, card and screen. */
export function ServiceBadge({
  service,
  size = "md",
  onTone = false,
}: {
  service: Service;
  size?: "sm" | "md" | "lg";
  /** On a band already in the service's colour, the badge turns white so it still stands out. */
  onTone?: boolean;
}) {
  const tone = groupOf(service).tone;
  const box = { sm: "h-9 w-9 rounded-lg", md: "h-12 w-12 rounded-xl", lg: "h-16 w-16 rounded-2xl" }[size];
  const icon = { sm: 20, md: 26, lg: 34 }[size];
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center ${box}`} style={{ background: onTone ? "#ffffff" : tone.bg, color: tone.fg }}>
      <ServiceIcon name={service.icon} width={icon} height={icon} />
    </span>
  );
}

/** One service in the home grid: badge on top, name under it, how many ads. */
export function ServiceTile({ service, lang, count }: { service: Service; lang: Lang; count?: number }) {
  return (
    <li>
      <Link
        href={`/${lang}/c/${service.slug}`}
        className="flex h-full flex-col items-center gap-2 rounded-2xl border border-line bg-card px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-sea hover:shadow-[0_6px_20px_-12px_rgb(16_36_46/0.45)]"
      >
        <ServiceBadge service={service} />
        <span className="line-clamp-2 text-[13px] font-semibold leading-tight md:text-sm">{service.name[lang]}</span>
        {count !== undefined ? (
          <span className="text-[11px] font-medium text-ink-soft" dir="ltr">
            {count > 0 ? count : "·"}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/** A wide row for the services screen: badge, name, what it covers, and a count. */
export function ServiceRow({ service, lang, count }: { service: Service; lang: Lang; count: number }) {
  return (
    // min-w-0: a grid cell otherwise grows to fit the full, untruncated blurb.
    <li className="min-w-0">
      <Link
        href={`/${lang}/c/${service.slug}`}
        className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3 transition hover:border-sea"
      >
        <ServiceBadge service={service} />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-tight">{service.name[lang]}</span>
          <span className="mt-0.5 block truncate text-[13px] text-ink-soft">{service.blurb[lang]}</span>
        </span>
        {count > 0 ? (
          <span className="rounded-full bg-paper px-2.5 py-0.5 text-[13px] font-semibold text-ink-soft" dir="ltr">
            {count}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/** The picture for an ad that has no photo (a service, a job): its service's mark, large. */
export function ServiceArt({
  category,
  lang,
  label = false,
  className = "",
}: {
  category: string;
  lang: Lang;
  /** Write the service's name under the drawing. Off on small cards, where the price tag sits there. */
  label?: boolean;
  className?: string;
}) {
  const service = serviceOfCategory(category);
  if (!service) return <div className={`h-full w-full bg-sea-wash ${className}`} />;
  const tone = groupOf(service).tone;
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 30% 20%, #ffffff99, transparent 60%), ${tone.bg}`, color: tone.fg }}
    >
      <ServiceIcon name={service.icon} width="38%" height="38%" strokeWidth={1.4} />
      {label ? (
        <span className="px-3 text-center text-[13px] font-semibold uppercase tracking-wide opacity-80">{service.name[lang]}</span>
      ) : null}
    </div>
  );
}
