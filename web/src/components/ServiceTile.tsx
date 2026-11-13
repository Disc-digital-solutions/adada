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
  const box = { sm: "h-9 w-9 rounded-lg", md: "h-11 w-11 rounded-xl", lg: "h-14 w-14 rounded-xl" }[size];
  const icon = { sm: 19, md: 23, lg: 28 }[size];
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center ${box}`} style={{ background: onTone ? "#ffffff" : tone.bg, color: tone.fg }}>
      <ServiceIcon name={service.icon} width={icon} height={icon} />
    </span>
  );
}

/** One service in the home grid: badge on top, name under it. */
export function ServiceTile({ service, lang }: { service: Service; lang: Lang }) {
  return (
    <li>
      <Link
        href={`/${lang}/c/${service.slug}`}
        className="panel flex h-full flex-col items-center gap-2 px-2 py-3.5 text-center transition hover:border-sea/60"
      >
        <ServiceBadge service={service} />
        <span className="line-clamp-2 text-[12.5px] font-medium leading-tight md:text-[13.5px]">{service.name[lang]}</span>
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
        className="panel flex items-center gap-3 p-3 transition hover:border-sea/60"
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
      style={{ background: `linear-gradient(160deg, #ffffff 0%, ${tone.bg} 100%)`, color: tone.fg }}
    >
      <ServiceIcon name={service.icon} width="30%" height="30%" strokeWidth={1.25} />
      {label ? (
        <span className="px-3 text-center text-[13px] font-semibold uppercase tracking-wide opacity-80">{service.name[lang]}</span>
      ) : null}
    </div>
  );
}
