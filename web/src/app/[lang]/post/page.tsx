import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang, type Lang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { CURRENCIES } from "@/lib/types";
import { CITIES } from "@/site.config";

type Props = PageProps<"/[lang]/post">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).post.title };
}

export default async function PostPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <div className="page">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 text-2xl font-bold tracking-tight">{t.post.title}</h1>
        {/* ?kind=wanted in the address opens the form already set to "I am looking for". */}
        <Suspense fallback={null}>
          <PostForm lang={lang} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * The form to post an ad, in the order a seller thinks: photos, what it is, what it costs, where.
 * It cannot publish yet. Publishing needs sign-in and the database, which come next;
 * until then the button is switched off and the form says why.
 */
async function PostForm({ lang, searchParams }: { lang: Lang; searchParams: Props["searchParams"] }) {
  const { kind } = await searchParams;
  const repo = getRepo();
  const categories = await repo.allCategories();
  const t = getDictionary(lang);
  const p = t.post;
  const choice =
    "flex-1 cursor-pointer rounded-lg px-3 py-2 text-center text-[15px] font-semibold text-ink-soft has-[:checked]:bg-ink has-[:checked]:text-white";

  return (
    <form className="grid gap-4">
      {repo.isDemo ? <p className="notice">{p.notConnected}</p> : null}

      <fieldset className="flex gap-1 rounded-xl border-[1.5px] border-line bg-card p-1">
        <legend className="sr-only">{t.search.kind}</legend>
        <label className={choice}>
          <input type="radio" name="kind" value="offer" defaultChecked={kind !== "wanted"} className="sr-only" />
          {p.selling}
        </label>
        <label className={choice}>
          <input type="radio" name="kind" value="wanted" defaultChecked={kind === "wanted"} className="sr-only" />
          {p.looking}
        </label>
      </fieldset>

      <div>
        <label className="label" htmlFor="photos">
          {p.photos}
        </label>
        <input id="photos" name="photos" type="file" accept="image/*" multiple className="field file:me-3 file:rounded-md file:border-0 file:bg-sea-wash file:px-3 file:py-1 file:font-semibold file:text-sea-deep" />
        <p className="hint">{p.photosHint}</p>
      </div>

      <div>
        <label className="label" htmlFor="title">
          {p.titleLabel}
        </label>
        <input id="title" name="title" maxLength={80} required dir="auto" placeholder={p.titleHint} className="field" />
      </div>

      <div>
        <label className="label" htmlFor="price">
          {p.price}
        </label>
        <div className="flex gap-2">
          <input id="price" name="price" inputMode="numeric" pattern="[0-9]*" dir="ltr" className="field flex-1" />
          <select name="currency" aria-label={t.search.currency} defaultValue="TRY" className="field !w-28">
            {CURRENCIES.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <label className="mt-2 flex items-center gap-2 text-[15px]">
          <input type="checkbox" name="free" className="h-5 w-5 accent-sea" />
          {p.freeToggle}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="category">
            {p.category}
          </label>
          <select id="category" name="category" required defaultValue="" className="field">
            <option value="" disabled>
              {t.search.category}
            </option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name[lang]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="city">
            {p.city}
          </label>
          <select id="city" name="city" defaultValue="famagusta" className="field">
            {CITIES.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          {p.description}
        </label>
        <textarea id="description" name="description" rows={5} maxLength={1500} dir="auto" placeholder={p.descriptionHint} className="field" />
      </div>

      <p className="hint !mt-0">{p.banned}</p>

      <button type="submit" disabled={repo.isDemo} className="btn btn-primary">
        {p.submit}
      </button>
    </form>
  );
}
