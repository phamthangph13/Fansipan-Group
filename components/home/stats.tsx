import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Số liệu nổi bật",
    title: "Năng lực, đo bằng kết quả.",
    note: "Các số liệu được Fansipan Group cập nhật theo tình hình hoạt động thực tế.",
  },
  en: {
    eyebrow: "Key figures",
    title: "Capability, measured in results.",
    note: "Figures are maintained by Fansipan Group based on current operations.",
  },
} as const;

export function StatsBand({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(110deg,#1b365d_0%,#005a9c_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 grid-lines-light opacity-60" aria-hidden />
      <svg
        className="pointer-events-none absolute -right-10 bottom-0 h-[120%] w-[55%] opacity-[0.12]"
        viewBox="0 0 800 400"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <path
          d="M0 380 L120 350 L220 365 L330 300 L420 340 L520 240 L610 310 L700 190 L800 280"
          stroke="white"
          strokeWidth="1.2"
        />
        <path
          d="M0 400 L150 370 L280 392 L420 330 L540 375 L660 300 L800 350"
          stroke="white"
          strokeWidth="0.8"
        />
      </svg>

      <div className="wrap relative py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-white/55">{c.eyebrow}</p>
            </div>
            <h2 className="mt-5 text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
              {c.title}
            </h2>
            <p className="mt-4 max-w-xs text-[0.78rem] leading-relaxed text-white/45">{c.note}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-9 lg:gap-0">
            {site.stats.map((stat, index) => (
              <Reveal
                key={stat.label[locale]}
                delay={index * 110}
                className="border-t border-white/15 pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0 lg:pl-10"
              >
                <p className="flex items-start gap-1 text-white">
                  <CountUp
                    value={stat.value}
                    className="text-[3.6rem] font-semibold leading-[0.9] tracking-[-0.06em] sm:text-[4rem] lg:text-[4.6rem]"
                  />
                </p>
                <p className="mt-4 max-w-[12rem] text-[0.82rem] leading-snug text-white/65">
                  {stat.label[locale]}
                </p>
                <span className="mt-5 block h-px w-8 bg-accent" aria-hidden />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
