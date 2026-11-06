"use client";

import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

export function OfficeMaps({
  locale,
  site,
  mode = "tabs",
}: {
  locale: Locale;
  site: SiteData;
  mode?: "tabs" | "grid";
}) {
  const [active, setActive] = useState(0);
  const offices = site.offices;
  const openLabel = locale === "vi" ? "Mở Google Maps" : "Open in Google Maps";

  if (mode === "grid") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {offices.map((office) => (
          <div key={office.id} className="overflow-hidden border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-brand">
                {office.kind[locale]}
              </p>
              <p className="mt-1 text-[0.9rem] font-semibold text-ink">{office.name[locale]}</p>
              <p className="mt-1.5 text-[0.76rem] leading-relaxed text-muted">
                {office.address[locale]}
              </p>
            </div>
            <iframe
              src={office.mapEmbed}
              title={`${office.name[locale]} — Google Maps`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[240px] w-full border-0 grayscale-[0.25]"
            />
            <a
              href={office.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between border-t border-line px-5 py-3 text-[0.74rem] font-medium text-brand transition-colors hover:bg-brand-050"
            >
              {openLabel}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        ))}
      </div>
    );
  }

  const office = offices[active] ?? offices[0];

  return (
    <div className="border border-line bg-white">
      <div className="flex border-b border-line" role="tablist" aria-label={locale === "vi" ? "Địa điểm" : "Locations"}>
        {offices.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={cn(
              "flex flex-1 items-center gap-2 px-4 py-3 text-left text-[0.75rem] font-medium transition-colors",
              active === index ? "bg-sky text-brand" : "text-muted hover:text-ink",
            )}
          >
            <MapPin className="size-3.5 shrink-0" strokeWidth={1.7} />
            <span className="truncate">{item.name[locale]}</span>
          </button>
        ))}
      </div>
      <iframe
        key={office.id}
        src={office.mapEmbed}
        title={`${office.name[locale]} — Google Maps`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[250px] w-full border-0 grayscale-[0.2]"
      />
      <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3">
        <p className="text-[0.72rem] leading-relaxed text-muted">{office.address[locale]}</p>
        <a
          href={office.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex shrink-0 items-center gap-1 text-[0.72rem] font-semibold text-brand"
        >
          {openLabel}
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
