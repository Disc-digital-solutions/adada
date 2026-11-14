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
        {/* Apply the saved display settings before anything is drawn (see DisplaySettings). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;if(localStorage.getItem("im-text")==="1")d.dataset.text="large";if(localStorage.getItem("im-lowdata")==="1")d.dataset.lowdata="1"}catch(e){}`,
          }}
        />
        <a href="#main" className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:start-3 focus:top-3">
          {t.skip}
        </a>
        {getRepo().isDemo ? (
          <p className="border-b border-line bg-[#fff8e1] px-4 py-1 text-center text-[12px] font-medium text-[#6b5300]">{t.demo.banner}</p>
        ) : null}
        <Header lang={lang} t={t} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        <BottomNav lang={lang} t={t} />
      </body>
    </html>
  );
}
