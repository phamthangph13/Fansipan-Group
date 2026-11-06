"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = Math.min(window.scrollY, 700);
      node.style.transform = `translate3d(0, ${offset * 0.1}px, 0) scale(1.06)`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
