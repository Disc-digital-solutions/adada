import type { Dictionary } from "@/i18n";
import { ServiceIcon } from "./icons";

/** Small labels that say something checked about an ad or a seller. */
export function WomenOnlyBadge({ t, small = false }: { t: Dictionary; small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md bg-[#fbe8f1] font-semibold text-[#8a1f55] ${small ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-[13px]"}`}>
      {t.trust.womenOnly}
    </span>
  );
}

export function VerifiedBadge({ t }: { t: Dictionary }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#e2f4e9] px-2 py-0.5 text-[12px] font-semibold text-[#1d6a3d]">
      <ServiceIcon name="check" width={14} height={14} />
      {t.trust.verified}
    </span>
  );
}
