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
    imageAlt: "Toàn cảnh đỉnh Fansipan nhìn từ trên cao, giữa biển mây",
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
    imageAlt: "Aerial view of the Fansipan summit above a sea of clouds",
  },
} as const;

export function Hero({ locale, site }: { locale: Locale; site: SiteData }) {
  const t = ui[locale];
  const c = copy[locale];

  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-0" aria-hidden>
        <HeroParallax>
          <Image
            src="/images/hero-fansipan.jpg"
            alt={c.imageAlt}
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="scale-[1.06] object-cover object-[58%_52%]"
          />
        </HeroParallax>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,53,0.94)_0%,rgba(7,26,53,0.84)_34%,rgba(7,26,53,0.3)_68%,rgba(7,26,53,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.55)_0%,rgba(7,26,53,0.04)_26%,rgba(7,26,53,0.1)_58%,rgba(7,26,53,0.94)_100%)]" />
        <div className="grid-lines-light pointer-events-none absolute inset-0 opacity-[0.16]" />
      </div>

      <div className="wrap relative flex min-h-[calc(100svh-76px)] flex-col justify-end pb-14 pt-24 sm:justify-center sm:pb-20 lg:min-h-[calc(100svh-108px)] lg:pt-28">
        <div className="max-w-[730px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden />
            <p className="eyebrow text-white/65">{c.eyebrow}</p>
          </div>

          <h1 className="display-1 mt-6 text-white">
            {c.titleA}
            <br />
            <span className="serif font-medium italic text-[#b7cdff]">{c.titleB}</span>
            <span className="text-accent">.</span>
          </h1>

          <p className="mt-6 max-w-[540px] text-[0.98rem] leading-[1.8] text-white/75 text-pretty sm:text-[1.05rem]">
            {c.intro}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary">
              {c.primary}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/${locale}${paths.projects}`}
              className="btn btn-outline-light"
            >
              {c.secondary}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 flex items-start gap-4 border-t border-white/15 pt-5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-white/55" strokeWidth={1.6} />
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/45">
                {c.markets}
              </p>
              <p className="mt-1.5 text-[0.8rem] text-white/70">
                Hà Nội · Hưng Yên · Hải Phòng · Thanh Hóa
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-white/45 lg:flex">
        <span className="font-mono text-[0.56rem] uppercase tracking-[0.24em]">{c.scroll}</span>
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
