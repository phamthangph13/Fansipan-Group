import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    heading: "Khách hàng và đối tác",
    intro:
      "Danh mục khách hàng và đối tác trải rộng từ hàng không, điện tử, cơ khí đến thép, giấy, khách sạn và nhiệt điện.",
  },
  en: {
    heading: "Clients & partners",
    intro:
      "Our clients and partners span aviation, electronics, machinery, steel, paper, hospitality and power generation.",
  },
} as const;

function LogoGrid({
  logos,
  compact = false,
}: {
  logos: SiteData["clients"]["logos"];
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
      {logos.map((logo) => (
        <div
          key={logo.name}
          className={cn(
            "flex items-center justify-center bg-white px-4 transition-colors hover:bg-cloud",
            compact ? "h-[72px]" : "h-24 sm:h-28",
          )}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={240}
            height={80}
            sizes="(min-width: 1024px) 200px, 33vw"
            className={cn(
              "w-auto max-w-[84%] object-contain",
              compact ? "max-h-9" : "max-h-11 sm:max-h-14",
            )}
          />
        </div>
      ))}
    </div>
  );
}

function SectorMarquee({
  locale,
  site,
  className,
}: {
  locale: Locale;
  site: SiteData;
  className?: string;
}) {
  const items = site.sectors.map((sector, index) => (
    <span
      key={sector[locale]}
      className="flex items-center gap-3 whitespace-nowrap border border-line bg-white px-5 py-3"
    >
      <span className="font-mono text-[0.58rem] tracking-[0.12em] text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-[0.8rem] font-medium text-ink-soft">{sector[locale]}</span>
    </span>
  ));

  return (
    <div className={cn("marquee mask-fade-x overflow-hidden", className)}>
      <div className="marquee-track flex w-max items-center gap-3">
        <div className="flex items-center gap-3">{items}</div>
        <div className="flex items-center gap-3" aria-hidden>
          {site.sectors.map((sector, index) => (
            <span
              key={`${sector[locale]}-clone`}
              className="flex items-center gap-3 whitespace-nowrap border border-line bg-white px-5 py-3"
            >
              <span className="font-mono text-[0.58rem] tracking-[0.12em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.8rem] font-medium text-ink-soft">{sector[locale]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ClientsStrip({
  locale,
  site,
  compact = false,
}: {
  locale: Locale;
  site: SiteData;
  compact?: boolean;
}) {
  const c = copy[locale];
  const showLogos = site.clients.showLogos && site.clients.logos.length > 0;

  if (!showLogos) {
    return (
      <section className="border-t border-line bg-white py-10">
        <div className="wrap">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="eyebrow text-brand">{c.heading}</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/50">
              {site.clients.note[locale]}
            </p>
          </div>
          <SectorMarquee locale={locale} site={site} className="mt-8" />
        </div>
      </section>
    );
  }

  if (compact) {
    return (
      <section className="border-t border-line bg-white py-10">
        <div className="wrap">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-line" aria-hidden />
            <h2 className="text-[0.92rem] font-extrabold uppercase tracking-[0.14em] text-brand">
              {c.heading}
            </h2>
            <span className="h-px w-8 bg-line" aria-hidden />
          </div>
          <div className="mt-6">
            <LogoGrid logos={site.clients.logos} compact />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="khach-hang" className="border-y border-line bg-white py-16 lg:py-20">
      <div className="wrap">
        <div className="text-center">
          <h2 className="text-[1.05rem] font-extrabold uppercase tracking-[0.14em] text-brand sm:text-[1.3rem]">
            {c.heading}
          </h2>
          <span className="mx-auto mt-3 block h-[3px] w-16 bg-brand" aria-hidden />
          <p className="mx-auto mt-5 max-w-2xl text-[0.86rem] leading-relaxed text-muted">
            {c.intro}
          </p>
        </div>

        <div className="mt-10">
          <LogoGrid logos={site.clients.logos} />
        </div>

        <p className="mt-5 text-center font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted/45">
          {site.clients.note[locale]}
        </p>
      </div>
    </section>
  );
}
