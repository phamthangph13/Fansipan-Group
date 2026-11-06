import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Khách hàng & đối tác",
    title: "Đồng hành cùng các ngành công nghiệp trọng điểm.",
    intro:
      "Danh mục khách hàng và đối tác trải rộng từ hàng không, điện tử, cơ khí đến thép, giấy, khách sạn và nhiệt điện.",
  },
  en: {
    eyebrow: "Clients & partners",
    title: "Working across key industries.",
    intro:
      "Our clients and partners span aviation, electronics, machinery, steel, paper, hospitality and power generation.",
  },
} as const;

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

  const items = showLogos
    ? site.clients.logos.map((logo) => ({
        key: logo.name,
        node: (
          <span className="flex h-14 w-[150px] items-center justify-center border border-line bg-white px-4">
            <Image
              src={logo.src}
              alt={logo.name}
              width={120}
              height={40}
              className="max-h-9 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
            />
          </span>
        ),
      }))
    : site.sectors.map((sector, index) => ({
        key: sector[locale],
        node: (
          <span className="flex items-center gap-3 whitespace-nowrap border border-line bg-white px-5 py-3">
            <span className="font-mono text-[0.58rem] tracking-[0.12em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.8rem] font-medium text-ink-soft">{sector[locale]}</span>
          </span>
        ),
      }));

  const marquee = (
    <div className="marquee mask-fade-x mt-8 overflow-hidden">
      <div className="marquee-track flex w-max items-center gap-3">
        <div className="flex items-center gap-3">
          {items.map((item) => (
            <span key={item.key}>{item.node}</span>
          ))}
        </div>
        <div className="flex items-center gap-3" aria-hidden>
          {items.map((item) => (
            <span key={`${item.key}-clone`}>{item.node}</span>
          ))}
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <section className="border-t border-line bg-cloud py-10">
        <div className="wrap">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="eyebrow text-brand">{c.eyebrow}</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/50">
              {site.clients.note[locale]}
            </p>
          </div>
          {marquee}
        </div>
      </section>
    );
  }

  return (
    <section id="khach-hang" className="border-y border-line bg-white py-16 lg:py-20">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-brand">{c.eyebrow}</p>
              <span className="eyebrow text-muted/50">/ 08</span>
            </div>
            <h2 className="display-3 mt-4 text-ink">{c.title}</h2>
            <p className="mt-4 max-w-xl text-[0.88rem] leading-relaxed text-muted">{c.intro}</p>
          </div>
          <p className="max-w-sm border-l border-line pl-4 text-[0.7rem] leading-relaxed text-muted/60">
            {site.clients.note[locale]}
          </p>
        </div>
        {marquee}
      </div>
    </section>
  );
}
