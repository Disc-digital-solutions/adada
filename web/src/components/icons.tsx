import type { ReactNode, SVGProps } from "react";

/** Small line drawings. They are decoration next to a word, so screen readers skip them. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />
  </Icon>
);

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Icon>
);

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const ShieldIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);

export const ShareIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" />
  </Icon>
);

export const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M4 19l1.3-3.8A8 8 0 1 1 8.7 19z" />
  </Icon>
);

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a1 1 0 0 1 1-1h10" />
  </Icon>
);

export const FlagIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </Icon>
);

export const GridIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Icon>
);

export const ArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  // Points the way reading goes; flipped for Arabic by the rtl:-scale-x-100 class where used.
  <Icon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

/** One drawing per service in lib/services.ts. */
const SERVICE_PATHS: Record<string, ReactNode> = {
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l8-8M16 7l2 2M14 9l2 2" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 10h3a1 1 0 0 1 1 1v10M3 21h18" />
      <path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1" />
    </>
  ),
  office: (
    <>
      <path d="M3 10l9-6 9 6M5 9v11h14V9" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="7.5" cy="8.5" r="1.5" />
    </>
  ),
  car: (
    <>
      <path d="M5 16V12l2-5h10l2 5v4M3 16h18v2H3z" />
      <circle cx="7.5" cy="16.5" r="1.5" />
      <circle cx="16.5" cy="16.5" r="1.5" />
      <path d="M5 12h14" />
    </>
  ),
  carKey: (
    <>
      <path d="M3 14l1.5-4h9L15 14v3H3z" />
      <circle cx="6" cy="17" r="1.2" />
      <circle cx="12" cy="17" r="1.2" />
      <circle cx="18.5" cy="6.5" r="2.5" />
      <path d="M18.5 9v6M18.5 12h1.5M18.5 14h1.5" />
    </>
  ),
  tow: (
    <>
      <path d="M2 17V9h8v8M10 12h4l3 3v2" />
      <path d="M17 5l4 8" />
      <circle cx="6" cy="17.5" r="1.5" />
      <circle cx="15" cy="17.5" r="1.5" />
    </>
  ),
  wrench: <path d="M14.5 5.5a4 4 0 0 0 4.9 5L12 18a2 2 0 0 1-3-3l7.5-7.4a4 4 0 0 0-2-2.1zM6 20l-2-2" />,
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </>
  ),
  hammer: (
    <>
      <path d="M13 7l-2-2 3-2 5 5-2 2-2-2" />
      <path d="M13 7L4 16l3 3 9-9" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
    </>
  ),
  cap: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" />
    </>
  ),
  plane: <path d="M10.5 13.5L3 11l1.5-1.5 8 1 4-4.5a2 2 0 0 1 3 3l-4.5 4 1 8L14.5 22l-2.5-7.5-3.5 3.5V21l-1.5 1-1-3.5L2.5 17l1-1.5H6z" />,
  badge: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M9 5V3h6v2" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M8 17c.8-2 2.2-3 4-3s3.2 1 4 3" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="5" width="14" height="10" rx="1.5" />
      <path d="M3 19h18l-2-4H5z" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
    </>
  ),
};

export function ServiceIcon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  return <Icon {...props}>{SERVICE_PATHS[name] ?? SERVICE_PATHS.tag}</Icon>;
}
