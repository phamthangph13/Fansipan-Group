import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { HeroParallax } from "./hero-parallax";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Cơ điện · HVAC · Tháp giải nhiệt · Bảo trì",
    titleA: "Vươn tới",
    titleB: "tầm cao",
    intro:
      "Chuyên gia Cơ điện (M&E), HVAC, tháp giải nhiệt và bảo trì hệ thống. Fansipan Group đồng hành cùng nhà máy và khu công nghiệp từ tư vấn, thi công đến vận hành ổn định.",
    primary: "Yêu cầu báo giá / Khảo sát",
    secondary: "Xem dự án tiêu biểu",
    markets: "Thị trường hiện tại",
    scroll: "Cuộn xuống",
    cardTitle: "Giải pháp cơ điện toàn diện",
    cardBody: "Tư vấn · Thiết kế · Cung cấp thiết bị · Thi công · Bảo trì",
    imageAlt: "Đỉnh Fansipan trong biển mây",
  },
  en: {
    eyebrow: "M&E · HVAC · Cooling towers · Maintenance",
    titleA: "Rising to",
    titleB: "new heights",
    intro:
      "Specialists in M&E, HVAC, cooling towers and system maintenance. Fansipan Group partners with factories and industrial parks from consultancy and installation through to stable operation.",
    primary: "Request a quote / survey",
    secondary: "View featured projects",
    markets: "Current markets",
    scroll: "Scroll",
    cardTitle: "Integrated M&E solutions",
    cardBody: "Consultancy · Design · Equipment supply · Installation · Maintenance",
    imageAlt: "Fansipan summit above the clouds",
  },
} as const;

export function Hero({ locale, site }: { locale: Locale; site: SiteData }) {
  const t = ui[locale];
  const c = copy[locale];

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fd_58%,#e7f1fc_100%)]">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" aria-hidden />

      <div className="absolute inset-y-0 right-0 hidden w-[49%] lg:block">
        <HeroParallax>
          <Image
            src="/images/hero-fansipan.jpg"
            alt={c.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover object-[72%_center]"
          />
        </HeroParallax>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#eef5fd_0%,rgba(238,245,253,0.82)_9%,rgba(238,245,253,0.12)_38%,rgba(7,26,53,0.05)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.06)_0%,transparent_35%,rgba(7,26,53,0.22)_100%)]" />

        <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between gap-6 text-white">
          <div className="max-w-[280px] border-l border-white/40 pl-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/65">
              Fansipan · 3.143 m
            </p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-white/85">{c.cardBody}</p>
          </div>
          <p className="hidden font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/55 [writing-mode:vertical-rl] xl:block">
            Ha Noi · Viet Nam
          </p>
        </div>
      </div>

      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/images/hero-fansipan.jpg"
          alt={c.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,251,255,0.9)_0%,rgba(238,245,253,0.94)_60%,#eef5fd_100%)]" />
      </div>

      <div className="wrap relative flex min-h-[calc(100svh-76px)] flex-col justify-center py-14 lg:min-h-[calc(100svh-108px)] lg:py-20">
        <div className="max-w-[640px] xl:max-w-[680px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden />
            <p className="eyebrow text-brand">{c.eyebrow}</p>
          </div>

          <h1 className="display-1 mt-7 text-ink">
            {c.titleA}
            <br />
            <span className="serif font-medium text-brand">{c.titleB}</span>
            <span className="text-accent">.</span>
          </h1>

          <p className="lead mt-7 max-w-[540px] text-pretty">{c.intro}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary">
              {c.primary}
              <ArrowRight className="size-4" />
            </Link>
            <Link href={`/${locale}${paths.projects}`} className="btn btn-outline">
              {c.secondary}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-11 flex items-start gap-4 border-t border-ink/10 pt-5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.6} />
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted/80">
                {c.markets}
              </p>
              <p className="mt-1.5 text-[0.8rem] text-ink-soft">
                Hà Nội · Hưng Yên · Hải Phòng · Thanh Hóa
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 lg:block" aria-hidden>
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <path
            d="M0 142 L120 128 L220 136 L330 100 L420 118 L520 74 L610 112 L720 58 L810 104 L900 84 L1010 120 L1120 96 L1230 126 L1330 112 L1440 134"
            stroke="rgba(0,39,170,0.13)"
            strokeWidth="1.2"
          />
          <path
            d="M0 154 L160 142 L280 150 L400 122 L520 142 L660 108 L780 140 L920 118 L1060 146 L1200 126 L1320 148 L1440 138"
            stroke="rgba(7,24,44,0.08)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-muted/70 lg:flex">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em]">{c.scroll}</span>
        <ArrowDown className="size-3.5 animate-bounce [animation-duration:2.2s]" strokeWidth={1.5} />
      </div>

      <div className="relative sr-only">
        <p>
          {site.company.displayName} — {site.company.slogan[locale]}.
        </p>
        <p>{t.nav.profile}</p>
      </div>
    </section>
  );
}
