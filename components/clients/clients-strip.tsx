import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    heading: "Khách hàng và đối tác",
  },
  en: {
    heading: "Clients & partners",
  },
} as const;

function LogoGroup({
  logos,
  compact,
  hidden = false,
}: {
  logos: SiteData["clients"]["logos"];
  compact: boolean;
  hidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {logos.map((logo) => (
        <div
          key={logo.name}
          className={cn(
            "mr-3 flex shrink-0 items-center justify-center border border-line bg-white px-5 transition-colors hover:bg-cloud",
            compact ? "h-[68px] w-[160px] sm:w-[180px]" : "h-24 w-[172px] sm:h-28 sm:w-[214px]",
          )}
        >
          <Image
            src={logo.src}
            alt={hidden ? "" : logo.name}
            width={240}
            height={80}
            sizes="220px"
            className={cn(
              "w-auto max-w-[86%] object-contain",
              compact ? "max-h-8" : "max-h-10 sm:max-h-14",
            )}
          />
        </div>
      ))}
    </div>
  );
}

function LogoMarquee({
  logos,
  compact = false,
  className,
}: {
  logos: SiteData["clients"]["logos"];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("marquee mask-fade-x overflow-hidden", className)}>
      <div className="marquee-track flex w-max items-center">
        <LogoGroup logos={logos} compact={compact} />
        <LogoGroup logos={logos} compact={compact} hidden />
      </div>
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
      <section className="border-t border-line bg-white py-9">
        <div className="wrap">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-line" aria-hidden />
            <h2 className="text-[0.92rem] font-extrabold uppercase tracking-[0.14em] text-brand">
              {c.heading}
            </h2>
            <span className="h-px w-8 bg-line" aria-hidden />
          </div>
          <LogoMarquee logos={site.clients.logos} compact className="mt-6" />
        </div>
      </section>
    );
  }

  return (
    <section id="khach-hang" className="border-y border-line bg-white py-12 lg:py-16">
      <div className="wrap">
        <div className="text-center">
          <h2 className="text-[1.05rem] font-extrabold uppercase tracking-[0.14em] text-brand sm:text-[1.3rem]">
            {c.heading}
          </h2>
          <span className="mx-auto mt-3 block h-[3px] w-16 bg-brand" aria-hidden />
        </div>

        <LogoMarquee logos={site.clients.logos} className="mt-9" />

        <p className="mt-5 text-center font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted/45">
          {site.clients.note[locale]}
        </p>
      </div>
    </section>
  );
}
