"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteData } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export function FloatingContact({ site, locale }: { site: SiteData; locale: Locale }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={locale === "vi" ? "Lên đầu trang" : "Back to top"}
        className={cn(
          "flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-[0_8px_24px_-12px_rgba(7,24,44,0.4)] transition-all duration-300 hover:border-brand hover:text-brand",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowUp className="size-4" />
      </button>

      <a
        href={`https://zalo.me/${site.contact.zalo}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={locale === "vi" ? "Chat Zalo 0913 339 190" : "Chat on Zalo 0913 339 190"}
        className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-[#0068ff] pl-3.5 pr-3.5 text-white shadow-[0_12px_30px_-12px_rgba(0,104,255,0.8)] transition-all duration-300 hover:gap-2 hover:pr-4"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          <MessageCircle className="size-4" strokeWidth={2} />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100">
          Zalo 0913 339 190
        </span>
      </a>

      {site.social.facebook ? (
        <a
          href={site.social.facebook}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={locale === "vi" ? "Theo dõi Fansipan Group trên Facebook" : "Follow Fansipan Group on Facebook"}
          className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-[#1877f2] pl-3.5 pr-3.5 text-white shadow-[0_12px_30px_-12px_rgba(24,119,242,0.75)] transition-all duration-300 hover:gap-2 hover:pr-4"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              <path d="M13.5 21v-7.5h2.52l.38-2.93H13.5V8.7c0-.85.24-1.43 1.45-1.43h1.55V4.65c-.27-.04-1.19-.12-2.26-.12-2.24 0-3.77 1.37-3.77 3.88v2.16H8v2.93h2.47V21h3.03z" />
            </svg>
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100">
            Facebook
          </span>
        </a>
      ) : null}

      <a
        href={`tel:${site.contact.hotline}`}
        aria-label={locale === "vi" ? "Gọi điện 0913 339 190" : "Call 0913 339 190"}
        className="group relative flex h-12 items-center gap-0 overflow-hidden rounded-full bg-accent pl-3.5 pr-3.5 text-white shadow-[0_12px_30px_-12px_rgba(219,1,20,0.75)] transition-all duration-300 hover:gap-2 hover:pr-4"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/25 [animation-duration:2.4s]" aria-hidden />
        <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Phone className="size-4" strokeWidth={2} />
        </span>
        <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
          {site.contact.hotlineDisplay}
        </span>
      </a>
    </div>
  );
}
