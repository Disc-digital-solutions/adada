import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { SITE_PHOTOS } from "@/lib/photos";
import { GROUPS, servicesIn } from "@/lib/services";
import { TOOLS } from "@/lib/tools";
import { DisplaySettings } from "./DisplaySettings";
import { Brand } from "./Header";
import { ShieldIcon } from "./icons";

/** Every service and tool, one click away from any page. Also what search engines follow to find them all. */
export function Footer({ lang, t }: { lang: Lang; t: Dictionary }) {
  const link = "inline-flex min-h-8 items-center text-ink-soft hover:text-brand-deep";
  return (
    <footer className="border-t border-line bg-card pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[17rem_1fr] md:px-6">
        <div>
          <Brand lang={lang} />
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{t.pop.footerAbout}</p>
          <Link href={`/${lang}/safety`} className="btn btn-quiet mt-4">
            <ShieldIcon width={18} height={18} className="text-brand" />
            {t.nav.safety}
          </Link>
          <p className="mt-6 text-sm font-bold">{t.footer.help}</p>
          <ul className="mt-1 grid text-sm">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={`/${lang}/${tool.href}`} className={link}>
                  {tool.name[lang]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${lang}/post`} className={link}>
                {t.pop.postFree}
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
              <p className="text-sm font-bold">{group.name[lang]}</p>
              <ul className="mt-1 grid text-sm">
                {servicesIn(group.slug).map((service) => (
                  <li key={service.slug}>
                    <Link href={`/${lang}/c/${service.slug}`} className={link}>
                      {service.name[lang]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-4 text-[12px] text-ink-faint md:px-6">
          {t.pop.credits}:{" "}
          {SITE_PHOTOS.map((photo, i) => (
            <span key={photo.src}>
              {i > 0 ? " · " : ""}
              <a href={photo.source} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
                {photo.author}
              </a>{" "}
              (
              <a href={photo.licenseUrl} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
                {photo.license}
              </a>
              )
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
