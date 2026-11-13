"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { formatMoney } from "@/lib/format";
import { parsePost } from "@/lib/parse-post";
import { teamAdMessage } from "@/lib/share-text";
import { CURRENCIES, type Currency, type Kind } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * How a finished form is sent:
 * - "whatsapp": the database is not connected yet, so the ad goes to the team's WhatsApp line and a
 *   person publishes it. Real ads can go live months before the database does.
 * - "off": no database and no team line: the button is switched off and the form says why.
 * - "direct": the database is connected (the next build step wires this to a server action).
 */
export type PostMode = "whatsapp" | "off" | "direct";

interface Option {
  slug: string;
  name: string;
}

export function PostForm({
  lang,
  t,
  categories,
  cities,
  initialKind,
  mode,
  teamPhone,
  siteName,
}: {
  lang: Lang;
  t: Dictionary;
  categories: Option[];
  cities: Option[];
  initialKind: Kind;
  mode: PostMode;
  teamPhone: string;
  siteName: string;
}) {
  const p = t.post;
  const [kind, setKind] = useState<Kind>(initialKind);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<Currency>("TRY");
  const [free, setFree] = useState(false);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("famagusta");
  const [description, setDescription] = useState("");
  const [pasted, setPasted] = useState("");
  const [pasteStatus, setPasteStatus] = useState<"" | "done" | "nothing">("");

  function fillFromPaste() {
    const found = parsePost(
      pasted,
      categories.map((c) => c.slug),
    );
    if (!found.title) {
      setPasteStatus("nothing");
      return;
    }
    setKind(found.kind);
    setTitle(found.title);
    setDescription(found.description);
    if (found.price === 0) {
      setFree(true);
      setPrice("");
    } else if (found.price !== null) {
      setFree(false);
      setPrice(String(found.price));
      if (found.currency) setCurrency(found.currency);
    }
    if (found.city) setCity(found.city);
    if (found.category) setCategory(found.category);
    setPasteStatus("done");
  }

  function priceForMessage(): string | null {
    if (free) return t.listing.free;
    const amount = Number(price);
    return price && Number.isFinite(amount) ? formatMoney(amount, currency, lang) : null;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (mode !== "whatsapp") return;
    event.preventDefault();
    const message = teamAdMessage(
      {
        title,
        price: priceForMessage(),
        category: categories.find((c) => c.slug === category)?.name ?? "",
        city: cities.find((c) => c.slug === city)?.name ?? city,
        description,
        hasPhotos: kind === "offer",
      },
      {
        intro: p.teamIntro.replace("{site}", siteName),
        kind: p.teamKind,
        kindValue: kind === "offer" ? p.selling : p.looking,
        title: p.titleLabel,
        price: kind === "wanted" ? t.listing.budget : p.price,
        category: p.category,
        city: p.city,
        description: p.description,
        photos: p.teamPhotos,
      },
    );
    window.location.assign(whatsappLink(teamPhone, message));
  }

  const choice =
    "flex-1 cursor-pointer rounded-lg px-3 py-2 text-center text-[15px] font-semibold text-ink-soft has-[:checked]:bg-ink has-[:checked]:text-white";

  return (
    <div className="grid gap-5">
      {/* Sellers already wrote this ad once, in a group. Let them paste it instead of typing it again. */}
      <section className="rounded-xl border-[1.5px] border-dashed border-sea/50 bg-sea-wash/40 p-4">
        <label htmlFor="paste" className="label !mb-1">
          {p.pasteTitle}
        </label>
        <p className="hint !mt-0 mb-2">{p.pasteHint}</p>
        <textarea
          id="paste"
          rows={3}
          dir="auto"
          value={pasted}
          onChange={(e) => {
            setPasted(e.target.value);
            setPasteStatus("");
          }}
          className="field"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button type="button" onClick={fillFromPaste} disabled={!pasted.trim()} className="btn btn-quiet">
            {p.pasteButton}
          </button>
          <span aria-live="polite" className="text-sm text-ink-soft">
            {pasteStatus === "done" ? p.pasteDone : pasteStatus === "nothing" ? p.pasteNothing : ""}
          </span>
        </div>
      </section>

      <form className="grid gap-4" onSubmit={onSubmit}>
        {mode === "off" ? <p className="notice">{p.notConnected}</p> : null}
        {mode === "whatsapp" ? <p className="notice">{p.whatsappNote}</p> : null}

        <fieldset className="flex gap-1 rounded-xl border-[1.5px] border-line bg-card p-1">
          <legend className="sr-only">{t.search.kind}</legend>
          <label className={choice}>
            <input type="radio" name="kind" value="offer" checked={kind === "offer"} onChange={() => setKind("offer")} className="sr-only" />
            {p.selling}
          </label>
          <label className={choice}>
            <input type="radio" name="kind" value="wanted" checked={kind === "wanted"} onChange={() => setKind("wanted")} className="sr-only" />
            {p.looking}
          </label>
        </fieldset>

        {/* Photos cannot travel inside a WhatsApp link; in that mode they are sent in the chat. */}
        {mode === "whatsapp" ? null : (
          <div>
            <label className="label" htmlFor="photos">
              {p.photos}
            </label>
            <input id="photos" name="photos" type="file" accept="image/*" multiple className="field file:me-3 file:rounded-md file:border-0 file:bg-sea-wash file:px-3 file:py-1 file:font-semibold file:text-sea-deep" />
            <p className="hint">{p.photosHint}</p>
          </div>
        )}

        <div>
          <label className="label" htmlFor="title">
            {p.titleLabel}
          </label>
          <input id="title" name="title" maxLength={80} required dir="auto" placeholder={p.titleHint} value={title} onChange={(e) => setTitle(e.target.value)} className="field" />
        </div>

        <div>
          <label className="label" htmlFor="price">
            {kind === "wanted" ? t.listing.budget : p.price}
          </label>
          <div className="flex gap-2">
            <input
              id="price"
              name="price"
              inputMode="numeric"
              pattern="[0-9]*"
              dir="ltr"
              disabled={free}
              value={free ? "" : price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
              className="field flex-1 disabled:opacity-50"
            />
            <select name="currency" aria-label={t.search.currency} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} disabled={free} className="field !w-28 disabled:opacity-50">
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          {kind === "offer" ? (
            <label className="mt-2 flex items-center gap-2 text-[15px]">
              <input type="checkbox" name="free" checked={free} onChange={(e) => setFree(e.target.checked)} className="h-5 w-5 accent-sea" />
              {p.freeToggle}
            </label>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="category">
              {p.category}
            </label>
            <select id="category" name="category" required value={category} onChange={(e) => setCategory(e.target.value)} className="field">
              <option value="" disabled>
                {t.search.category}
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="city">
              {p.city}
            </label>
            <select id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="field">
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="description">
            {p.description}
          </label>
          <textarea id="description" name="description" rows={5} maxLength={1500} dir="auto" placeholder={p.descriptionHint} value={description} onChange={(e) => setDescription(e.target.value)} className="field" />
        </div>

        <p className="hint !mt-0">{p.banned}</p>

        <button type="submit" disabled={mode === "off"} className={mode === "whatsapp" ? "btn btn-wa" : "btn btn-primary"}>
          {mode === "whatsapp" ? p.submitWhatsapp : p.submit}
        </button>
      </form>
    </div>
  );
}
