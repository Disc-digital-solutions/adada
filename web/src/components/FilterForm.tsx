import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { CURRENCIES, type Category, type ListingFilter } from "@/lib/types";
import { CITIES } from "@/site.config";
import { SearchIcon } from "./icons";
import { withBase } from "@/lib/static-site";

const SYMBOLS = { TRY: "₺ TRY", GBP: "£ GBP", EUR: "€ EUR", USD: "$ USD" } as const;

/**
 * The search filters. It is an ordinary form that puts its fields in the address
 * (?q=desk&city=famagusta), so it works without JavaScript and a filtered page can be shared.
 */
export function FilterForm({
  lang,
  t,
  filter,
  categories,
}: {
  lang: Lang;
  t: Dictionary;
  filter: ListingFilter;
  categories: Category[];
}) {
  const s = t.search;
  return (
    <form action={withBase(`/${lang}/search`)} className="panel grid gap-3 p-3 md:grid-cols-6 md:p-4">
      <label className="relative md:col-span-6">
        <span className="sr-only">{s.placeholder}</span>
        <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input name="q" type="search" defaultValue={filter.q ?? ""} placeholder={s.placeholder} className="field ps-10" />
      </label>

      <label className="md:col-span-2">
        <span className="label">{s.category}</span>
        <select name="category" defaultValue={filter.category ?? ""} className="field">
          <option value="">{s.anyCategory}</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name[lang]}
            </option>
          ))}
        </select>
      </label>

      <label className="md:col-span-2">
        <span className="label">{s.city}</span>
        <select name="city" defaultValue={filter.city ?? ""} className="field">
          <option value="">{s.anyCity}</option>
          {CITIES.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name[lang]}
            </option>
          ))}
        </select>
      </label>

      <label className="md:col-span-2">
        <span className="label">{s.kind}</span>
        <select name="kind" defaultValue={filter.kind ?? ""} className="field">
          <option value="">{s.anyKind}</option>
          <option value="offer">{s.offers}</option>
          <option value="wanted">{s.wanted}</option>
        </select>
      </label>

      <fieldset className="grid grid-cols-3 gap-2 md:col-span-4">
        <legend className="sr-only">{t.post.price}</legend>
        <label>
          <span className="label">{s.currency}</span>
          <select name="currency" defaultValue={filter.currency ?? ""} className="field">
            <option value="">{s.anyCurrency}</option>
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {SYMBOLS[currency]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">{s.min}</span>
          <input name="min" inputMode="numeric" pattern="[0-9]*" defaultValue={filter.min ?? ""} className="field" dir="ltr" />
        </label>
        <label>
          <span className="label">{s.max}</span>
          <input name="max" inputMode="numeric" pattern="[0-9]*" defaultValue={filter.max ?? ""} className="field" dir="ltr" />
        </label>
        <p className="hint col-span-3 !mt-0">{s.priceHint}</p>
      </fieldset>

      <label className="md:col-span-2">
        <span className="label">{s.sort}</span>
        <select name="sort" defaultValue={filter.sort} className="field">
          <option value="newest">{s.newest}</option>
          <option value="cheapest">{s.cheapest}</option>
          <option value="dearest">{s.dearest}</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-[15px] md:col-span-6">
        <input type="checkbox" name="women" value="1" defaultChecked={filter.women === true} className="h-5 w-5 accent-brand" />
        {t.trust.womenFilter}
      </label>

      <div className="flex flex-wrap items-center gap-2 md:col-span-6">
        <button type="submit" className="btn btn-primary">
          {s.apply}
        </button>
        <a href={withBase(`/${lang}/search`)} className="btn btn-quiet">
          {s.clear}
        </a>
      </div>
    </form>
  );
}
