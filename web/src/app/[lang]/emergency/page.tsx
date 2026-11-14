import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";
import { EMERGENCY } from "@/lib/guides";

type Props = PageProps<"/[lang]/emergency">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLang(lang) ? lang : DEFAULT_LANG).emergency.title };
}

/** Numbers to call, big enough to tap in a hurry. No account, no data, works for everyone. */
export default async function EmergencyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const e = t.emergency;
  return (
    <div className="page">
      <div className="mx-auto max-w-2xl">
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight md:text-3xl">
          <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-alert text-white">
            <ServiceIcon name="siren" width={24} height={24} />
          </span>
          {e.title}
        </h1>
        <p className="mt-2 text-ink-soft">{e.intro}</p>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {EMERGENCY.map((entry) => (
            <li key={entry.number}>
              <a href={`tel:${entry.number}`} className="panel flex items-center justify-between gap-3 p-4 transition hover:border-alert">
                <span>
                  <span className="block font-semibold">{entry.name[lang]}</span>
                  <span className="text-[13px] text-ink-soft">{e.call}</span>
                </span>
                <span dir="ltr" className="text-[30px] font-bold tabular-nums tracking-tight text-alert">
                  {entry.number}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="hint mt-3">{e.fallback}</p>

        <section className="panel mt-6 p-5">
          <h2 className="font-semibold">{e.pharmacyTitle}</h2>
          <p className="mt-1 text-[15px] text-ink-soft">{e.pharmacyBody}</p>
        </section>
        <section className="panel mt-3 p-5">
          <h2 className="font-semibold">{e.embassyTitle}</h2>
          <p className="mt-1 text-[15px] text-ink-soft">{e.embassyBody}</p>
        </section>
      </div>
    </div>
  );
}
