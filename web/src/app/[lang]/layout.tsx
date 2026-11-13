import type { Metadata, Viewport } from "next";
import { Readex_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { BottomNav, Header } from "@/components/Header";
import { getDictionary } from "@/i18n";
import { DEFAULT_LANG, LANGS, dirOf, isLang } from "@/i18n/config";
import { getRepo } from "@/lib/data";
import { site } from "@/site.config";
import "../globals.css";

// One typeface for Turkish, English and Arabic, so the three languages look like one site.
const readex = Readex_Pro({
  subsets: ["latin", "latin-ext", "arabic"],
  variable: "--font-readex",
  display: "swap",
});

/** The three languages are known in advance, so their pages can be prepared ahead of time. */
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(isLang(lang) ? lang : DEFAULT_LANG);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} | ${t.site.tagline}`, template: `%s | ${site.name}` },
    description: t.site.intro,
  };
}

export const viewport: Viewport = { themeColor: site.themeColor };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={readex.variable}>
      <body>
        {getRepo().isDemo ? (
          <p className="bg-ink px-4 py-1.5 text-center text-[13px] text-white">{t.demo.banner}</p>
        ) : null}
        <Header lang={lang} t={t} />
        <main>{children}</main>
        <Footer lang={lang} t={t} />
        <BottomNav lang={lang} t={t} />
      </body>
    </html>
  );
}
