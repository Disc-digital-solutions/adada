"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

/** The header's main links. The page you are on is marked, in words for screen readers too. */
export function NavLinks({ items, label, className = "" }: { items: NavItem[]; label: string; className?: string }) {
  const path = usePathname().replace(/\/$/, "");
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = path === item.href || path.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-3 text-[14px] font-semibold lg:px-3.5 lg:text-[14.5px] transition-colors duration-200 ${
                  active ? "bg-brand-wash text-brand-deep" : "text-ink-soft hover:bg-sunken hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
