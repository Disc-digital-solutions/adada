import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { GROUPS, servicesIn } from "@/lib/services";
import { TOOLS } from "@/lib/tools";
import { DisplaySettings } from "./DisplaySettings";
import { site } from "@/site.config";

/** Every service, one click away from any page. Also what search engines follow to find them all. */
export function Footer({ lang, t }: { lang: Lang; t: Dictionary }) {
  return (
    <footer className="mt-10 border-t border-line bg-card pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[16rem_1fr] md:px-6">
        <div>
          <p className="flex items-center gap-2 text-[17px] font-bold tracking-tight">
            <span aria-hidden className="price-tag brand-mark !px-0 h-5 w-7" />
            {site.name}
          </p>
          <p className="mt-2 text-sm text-ink-soft">{t.footer.about}</p>
          <p className="mt-4 text-sm font-semibold">{t.footer.help}</p>
          <ul className="mt-1 grid gap-1 text-sm">
            <li>
              <Link href={`/${lang}/safety`} className="text-ink-soft hover:text-sea-deep">
                {t.nav.safety}
              </Link>
            </li>
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={`/${lang}/${tool.href}`} className="text-ink-soft hover:text-sea-deep">
                  {tool.name[lang]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${lang}/post`} className="text-ink-soft hover:text-sea-deep">
                {t.nav.post}
              </Link>
            </li>
          </ul>
          <div className="mt-6">
            <DisplaySettings t={t} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <div key={group.slug}>
              <p className="text-sm font-semibold">{group.name[lang]}</p>
              <ul className="mt-1 grid gap-1 text-sm">
                {servicesIn(group.slug).map((service) => (
                  <li key={service.slug}>
                    <Link href={`/${lang}/c/${service.slug}`} className="text-ink-soft hover:text-sea-deep">
                      {service.name[lang]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
