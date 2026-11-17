"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n";
import type { Lang } from "@/i18n/config";
import { formatMoney } from "@/lib/format";
import { parsePost } from "@/lib/parse-post";
import { teamAdMessage } from "@/lib/share-text";
import { VoiceButton } from "./VoiceButton";
import { CURRENCIES, type Currency, type Kind } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
import { useHydrated } from "./useHydrated";

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

/** What the person has typed so far. Kept for this browser tab only, so a language switch keeps it. */
interface Draft {
  kind: Kind;
  title: string;
  price: string;
  currency: Currency;
  free: boolean;
  category: string;
  city: string;
  description: string;
  womenOnly: boolean;
  pasted: string;
}

const DRAFT_KEY = "adada-post-draft";

function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

type PostFormProps = {
  lang: Lang;
  t: Dictionary;
  categories: Option[];
  cities: Option[];
  initialKind: Kind;
  /** From ?category= when the seller comes from a service screen. */
  initialCategory: string;
  mode: PostMode;
  teamPhone: string;
  siteName: string;
};

/**
 * The post form. Once the page runs in the browser, an unfinished draft from this tab is brought
 * back (for example after switching language), so nothing typed is lost. A link that asks for a
 * kind or category (?kind=wanted) wins over the draft for that field.
 */
export function PostForm(props: PostFormProps) {
  const hydrated = useHydrated();
  const draft = hydrated ? readDraft() : null;
  return <PostFormFields key={hydrated ? "restored" : "initial"} {...props} draft={draft} keepDraft={hydrated} />;
}

function PostFormFields({
  lang,
  t,
  categories,
  cities,
  initialKind,
  initialCategory,
  mode,
  teamPhone,
  siteName,
  draft,
  keepDraft,
}: PostFormProps & { draft: Draft | null; keepDraft: boolean }) {
  const p = t.post;
  const [kind, setKind] = useState<Kind>(initialKind === "wanted" ? "wanted" : (draft?.kind ?? initialKind));
  const [title, setTitle] = useState(draft?.title ?? "");
  const [price, setPrice] = useState(draft?.price ?? "");
  const [currency, setCurrency] = useState<Currency>(draft?.currency ?? "TRY");
  const [free, setFree] = useState(draft?.free ?? false);
  const [category, setCategory] = useState(initialCategory || draft?.category || "");
  // No area is chosen for the seller: a post that does not say where stays for them to pick.
  const [city, setCity] = useState(draft?.city ?? "");
  const [description, setDescription] = useState(draft?.description ?? "");
  const [womenOnly, setWomenOnly] = useState(draft?.womenOnly ?? false);
  const housing = ["rooms", "roommates", "dorms"].includes(category);
  const [pasted, setPasted] = useState(draft?.pasted ?? "");

  // Keep the draft for this tab as it changes (storing only; nothing is sent anywhere).
  useEffect(() => {
    // The first, server-drawn instance must not touch storage: it would wipe the draft before it is read.
    if (!keepDraft) return;
    const next: Draft = { kind, title, price, currency, free, category, city, description, womenOnly, pasted };
    try {
      if (title || price || description || pasted) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // Storage switched off: the form still works, the draft just is not kept.
    }
  }, [keepDraft, kind, title, price, currency, free, category, city, description, womenOnly, pasted]);
  const [pasteStatus, setPasteStatus] = useState<"" | "done" | "nothing">("");

  function fillFromPaste(text = pasted) {
    const found = parsePost(
      text,
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
    if (found.womenOnly) setWomenOnly(true);
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
        womenOnly: housing && womenOnly,
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
        womenOnly: t.trust.womenOnly,
      },
    );
    window.location.assign(whatsappLink(teamPhone, message));
  }

  const choice =
    "flex-1 cursor-pointer rounded-lg px-3 py-2 text-center text-[15px] font-semibold text-ink-soft has-[:checked]:bg-ink has-[:checked]:text-white";

  return (
    <div className="grid gap-5">
      {/* Sellers already wrote this ad once, in a group. Let them paste it instead of typing it again. */}
      <section className="panel border-brand/30 bg-brand-wash/40 p-4">
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
          <button type="button" onClick={() => fillFromPaste()} disabled={!pasted.trim()} className="btn btn-quiet">
            {p.pasteButton}
          </button>
          {/* Say the ad instead of typing it (LST-20): the words land in the box and fill the form. */}
          <VoiceButton
            lang={lang}
            t={t}
            onText={(said) => {
              const text = [pasted.trim(), said].filter(Boolean).join("\n");
              setPasted(text);
              fillFromPaste(text);
            }}
          />
          <span aria-live="polite" className="text-sm text-ink-soft">
            {pasteStatus === "done" ? p.pasteDone : pasteStatus === "nothing" ? p.pasteNothing : ""}
          </span>
        </div>
      </section>

      <form className="grid gap-4" onSubmit={onSubmit}>
        {mode === "off" ? <p className="notice">{p.notConnected}</p> : null}
        {mode === "whatsapp" ? <p className="notice">{p.whatsappNote}</p> : null}

        <fieldset className="flex gap-1 rounded-xl border border-line bg-card p-1">
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
            <input id="photos" name="photos" type="file" accept="image/*" multiple className="field file:me-3 file:rounded-md file:border-0 file:bg-brand-wash file:px-3 file:py-1 file:font-semibold file:text-brand-deep" />
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
              onChange={(e) => setPrice(toWesternDigits(e.target.value).replace(/\D/g, ""))}
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
              <input type="checkbox" name="free" checked={free} onChange={(e) => setFree(e.target.checked)} className="h-5 w-5 accent-brand" />
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
            <select id="city" name="city" required value={city} onChange={(e) => setCity(e.target.value)} className="field">
              <option value="" disabled>
                {t.search.city}
              </option>
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {housing ? (
          <label className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" name="womenOnly" checked={womenOnly} onChange={(e) => setWomenOnly(e.target.checked)} className="h-5 w-5 accent-brand" />
            {t.trust.womenFilter}
          </label>
        ) : null}

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

/** "٤٥٠" → "450": Arabic-Indic and Persian digits typed into the price are kept, not dropped. */
function toWesternDigits(text: string): string {
  return text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}
