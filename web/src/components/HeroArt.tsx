"use client";

import { useRef, type ReactNode } from "react";

/**
 * The hero's photo composition, which leans a few pixels towards the pointer (at most ~8px and a
 * degree of tilt) and settles back when it leaves. Only with a mouse, and never when the device
 * asks for reduced motion: touch screens and reduced motion get the still composition.
 * The layers read --px and --py (each -1…1) in CSS (.hero-layer); the search form is outside, so it
 * never moves. The composition is fully visible without this script.
 */
export function HeroArt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const allowed = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={ref}
      className={`hero-art ${className}`}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !allowed()) return;
        const box = ref.current;
        if (!box) return;
        const rect = box.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          box.style.setProperty("--px", x.toFixed(3));
          box.style.setProperty("--py", y.toFixed(3));
        });
      }}
      onPointerLeave={() => {
        cancelAnimationFrame(frame.current);
        ref.current?.style.setProperty("--px", "0");
        ref.current?.style.setProperty("--py", "0");
      }}
    >
      {children}
    </div>
  );
}
