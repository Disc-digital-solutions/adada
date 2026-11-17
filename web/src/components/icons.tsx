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

/** Pass fill="currentColor" for the saved (filled) state. */
export const HeartIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M12 20.5s-7.5-4.6-7.5-10.4A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.5c0 5.8-7.5 10.4-7.5 10.4z" />
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
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10l5-3v10l-5-3" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c.6-3.4 3-5 6-5s5.4 1.6 6 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14c2.2 0 3.7 1.3 4 4" />
    </>
  ),
  sofa: (
    <>
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM6 18v2M18 18v2" />
    </>
  ),
  swap: <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  cart: (
    <>
      <path d="M3 4h2l2.5 11h10L20 8H6.3" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </>
  ),
  wheel: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M4 11c3-1 5 0 6 1M20 11c-3-1-5 0-6 1M12 14v6" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  child: (
    <>
      <circle cx="12" cy="6" r="2.5" />
      <path d="M8 21v-6l-2-3 4-2h4l4 2-2 3v6M12 13v8" />
    </>
  ),
  paw: (
    <>
      <circle cx="7" cy="10" r="1.6" />
      <circle cx="10" cy="6.5" r="1.6" />
      <circle cx="14" cy="6.5" r="1.6" />
      <circle cx="17" cy="10" r="1.6" />
      <path d="M8.5 17c0-2.5 1.6-4.5 3.5-4.5s3.5 2 3.5 4.5c0 1.5-1.2 2.5-2.5 2.2-.6-.1-.7-.2-1-.2s-.4.1-1 .2c-1.3.3-2.5-.7-2.5-2.2z" />
    </>
  ),
  box: (
    <>
      <path d="M3 8l9-4 9 4v9l-9 4-9-4z" />
      <path d="M3 8l9 4 9-4M12 12v9" />
    </>
  ),
  store: (
    <>
      <path d="M4 9l1.5-5h13L20 9M4 9h16v2a2.5 2.5 0 0 1-4 0 2.5 2.5 0 0 1-4 0 2.5 2.5 0 0 1-4 0 2.5 2.5 0 0 1-4 0z" />
      <path d="M5 12v8h14v-8M10 20v-5h4v5" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v11h14V9M10 13h4" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 13H6z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  hands: (
    <>
      <path d="M3 12l4-4 4 2 3-2 4 1 3 3" />
      <path d="M7 14l3 3c.8.8 2 .8 2.8 0l4.2-4.2M10 11l3 3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  desk: (
    <>
      <path d="M3 10h18M5 10v10M19 10v10M14 10v6h5" />
      <rect x="7" y="4" width="7" height="4" rx="1" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  fork: <path d="M7 3v7a2 2 0 0 0 4 0V3M9 10v11M16 21V3c-2 1.5-3 4-3 7h3" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  percent: (
    <>
      <path d="M18 6L6 18" />
      <circle cx="7.5" cy="7.5" r="2" />
      <circle cx="16.5" cy="16.5" r="2" />
    </>
  ),
  cross: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4h3l7 4V6L7 10z" />
      <path d="M17 9a4 4 0 0 1 0 6M7 14l1 5h2" />
    </>
  ),
  chat2: (
    <>
      <path d="M3 15V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7z" />
      <path d="M18 9h1a2 2 0 0 1 2 2v9l-3-2.5h-6a2 2 0 0 1-2-2V15" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h1M12 12h1M16 12h0M8 16h1M12 16h1M16 15v2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  chart: <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />,
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  siren: (
    <>
      <path d="M6 18v-6a6 6 0 0 1 12 0v6" />
      <path d="M4 18h16v3H4zM12 3V1M4.5 6L3 4.5M19.5 6L21 4.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 21V5M8 7h7" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
};

export function ServiceIcon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  return <Icon {...props}>{SERVICE_PATHS[name] ?? SERVICE_PATHS.tag}</Icon>;
}
