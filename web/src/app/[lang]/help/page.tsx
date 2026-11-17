import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, ChatIcon, ServiceIcon } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, isLang } from "@/i18n/config";
import { HELP } from "@/lib/help";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/site.config";

type Props = PageProps<"/[lang]/help">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(isLang(lang) ? lang : DEFAULT_LANG);
  return { title: t.help.title, description: t.help.intro };
}

/**
 * Student questions (ARR-09): banks, deposits, visas and permits. Every answer opens in place, so
 * the page reads like a list of questions; anything missing goes to a person on WhatsApp.
 */
export default async function HelpPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const h = t.help;
  const ask = site.teamWhatsapp ? whatsappLink(site.teamWhatsapp, h.askMessage) : null;

  return (
    <div className="page">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{h.title}</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">{h.intro}</p>

        <nav aria-label={h.jump} className="mt-5 flex flex-wrap gap-2">
          {HELP.map((topic) => (
            <a key={topic.slug} href={`#${topic.slug}`} className="chip">
              <ServiceIcon name={topic.icon} width={16} height={16} className="me-1.5" />
              {topic.title[lang]}
            </a>
          ))}
        </nav>

        {HELP.map((topic) => (
          <section key={topic.slug} id={topic.slug} className="mt-10 scroll-mt-20">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-brand-wash text-brand-deep">
                <ServiceIcon name={topic.icon} width={19} height={19} />
              </span>
              {topic.title[lang]}
            </h2>
            <div className="grid gap-2">
              {topic.answers.map((answer) => (
                <details key={answer.q.en} className="panel group p-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-semibold [&::-webkit-details-marker]:hidden">
                    {answer.q[lang]}
                    <span aria-hidden className="inline-block text-xl leading-none text-ink-soft transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="border-t border-line px-4 py-3.5 text-[15px] leading-relaxed">
                    <p>{answer.a[lang]}</p>
                    {answer.link ? (
                      <Link href={`/${lang}/${answer.link}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-deep">
                        {h.more}
                        <ArrowIcon width={15} height={15} className="rtl:-scale-x-100" />
                      </Link>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-10 rounded-2xl bg-ink p-6 text-white md:p-8">
          <h2 className="text-xl font-bold">{h.notHere}</h2>
          <p className="mt-1 text-white/80">{h.notHereBody}</p>
          {ask ? (
            <a href={ask} target="_blank" rel="noopener" className="btn btn-wa mt-5">
              <ChatIcon width={18} height={18} />
              {h.ask}
            </a>
          ) : (
            <p className="mt-4 text-sm text-white/70">{t.request.noTeam}</p>
          )}
        </section>

        <p className="notice mt-6">{h.disclaimer}</p>
      </div>
    </div>
  );
}
