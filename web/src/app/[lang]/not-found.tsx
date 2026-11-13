import Link from "next/link";
import { lang as langFromAddress } from "next/root-params";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";

/** Shown when an ad, a shop or a page does not exist. It says so and offers the way back. */
export default async function NotFound() {
  const value = await langFromAddress();
  const lang = isLang(value) ? value : DEFAULT_LANG;
  const t = getDictionary(lang).notFound;

  return (
    <div className="page">
      <div className="mx-auto max-w-xl py-10 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-2 text-ink-soft">{t.body}</p>
        <Link href={`/${lang}`} className="btn btn-primary mt-5">
          {t.home}
        </Link>
      </div>
    </div>
  );
}
