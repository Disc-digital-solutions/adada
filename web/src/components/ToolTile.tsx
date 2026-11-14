import Link from "next/link";
import type { Lang } from "@/i18n/config";
import type { Tool } from "@/lib/tools";
import { ServiceIcon } from "./icons";

/** One tool or guide: an icon, its name and one line on what it does. */
export function ToolTile({ tool, lang }: { tool: Tool; lang: Lang }) {
  return (
    <li className="min-w-0">
      <Link href={`/${lang}/${tool.href}`} className="panel flex h-full items-start gap-3 p-4 transition hover:border-sea/60">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-white">
          <ServiceIcon name={tool.icon} width={21} height={21} />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold leading-tight">{tool.name[lang]}</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{tool.blurb[lang]}</span>
        </span>
      </Link>
    </li>
  );
}
