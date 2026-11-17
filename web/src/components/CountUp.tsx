"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up from zero when it scrolls into view, once. The final number is in the
 * page from the start (search engines and screen readers read it), and with reduced motion it
 * simply stays there.
 */
export function CountUp({ to, duration = 1100 }: { to: number; duration?: number }) {
  const [shown, setShown] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        // Ease out: fast at first, settling on the number.
        setShown(Math.round(to * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      setShown(0);
      frame = requestAnimationFrame(step);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
