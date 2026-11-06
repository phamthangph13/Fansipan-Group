"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Layers, Target } from "lucide-react";
import { cn, splitParagraphs } from "@/lib/utils";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { Service, SiteData } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Về Fansipan Group",
    title: "Năng lực được kiểm chứng qua từng công trình.",
    intro:
      "Một đầu mối kỹ thuật cho toàn bộ vòng đời hệ thống — từ khảo sát, thiết kế, thi công đến bảo trì.",
    tabs: ["Tổng quan", "Tầm nhìn – Sứ mệnh – Giá trị", "Năng lực công ty"],
    more: "Tìm hiểu về Fansipan Group",
    vision: "Tầm nhìn",
    mission: "Sứ mệnh",
    values: "Giá trị cốt lõi",
    capability: "Năng lực theo vòng đời công trình",
    viewServices: "Xem các lĩnh vực hoạt động",
  },
  en: {
    eyebrow: "About Fansipan Group",
    title: "Capability proven on every project.",
    intro:
      "One technical partner across the full system lifecycle — from survey and design to installation and maintenance.",
    tabs: ["Overview", "Vision – Mission – Values", "Company capability"],
    more: "More about Fansipan Group",
    vision: "Vision",
    mission: "Mission",
    values: "Core values",
    capability: "Capability across the project lifecycle",
    viewServices: "Explore our services",
  },
} as const;

export function AboutSection({
  locale,
  site,
  services,
}: {
  locale: Locale;
  site: SiteData;
  services: Service[];
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const t = ui[locale];
  const c = copy[locale];
  const paragraphs = splitParagraphs(site.about.intro[locale]);

  return (
    <section id="gioi-thieu" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-brand">{c.eyebrow}</p>
              <span className="eyebrow text-muted/50">/ 01</span>
            </div>
            <h2 className="display-2 mt-5 max-w-md text-ink">{c.title}</h2>
            <p className="mt-5 max-w-sm text-[0.92rem] leading-relaxed text-muted">{c.intro}</p>

            <div className="mt-8 flex gap-2 overflow-x-auto border-b border-line pb-px no-scrollbar lg:mt-10 lg:flex-col lg:border-b-0 lg:border-l">
              {c.tabs.map((tab, index) => (
                <button
                  key={tab}
                  id={`${baseId}-tab-${index}`}
                  role="tab"
                  aria-selected={active === index}
                  aria-controls={`${baseId}-panel-${index}`}
                  onClick={() => setActive(index)}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 whitespace-nowrap border-b-2 px-0 py-3.5 text-left text-[0.82rem] font-medium transition-colors lg:w-full lg:whitespace-normal lg:border-b-0 lg:border-l-2 lg:px-5 lg:py-4",
                    active === index
                      ? "border-accent text-ink lg:border-accent"
                      : "border-transparent text-muted hover:text-ink-soft",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[0.64rem] tracking-[0.12em]",
                      active === index ? "text-accent" : "text-muted/50",
                    )}
                  >
                    0{index + 1}
                  </span>
                  {tab}
                </button>
              ))}
            </div>

            <Link
              href={`/${locale}${paths.about}`}
              className="link-arrow mt-7 hidden lg:inline-flex"
            >
              {c.more}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="lg:col-span-8">
            <div
              id={`${baseId}-panel-0`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-0`}
              hidden={active !== 0}
            >
              <div className="relative border border-line bg-cloud p-7 sm:p-10">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,var(--color-brand),transparent_60%)]" />
                <p className="display-3 max-w-[36ch] text-ink">{paragraphs[0]}</p>
                <div className="mt-7 space-y-4 border-t border-line pt-7">
                  {paragraphs.slice(1).map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="text-[0.92rem] leading-[1.8] text-ink-soft">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
                  <Link href={`/${locale}${paths.about}`} className="link-arrow">
                    {c.more}
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={`/${locale}${paths.profile}`}
                    className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-muted transition-colors hover:text-brand"
                  >
                    {t.nav.profile}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div
              id={`${baseId}-panel-1`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-1`}
              hidden={active !== 1}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="border border-line bg-white p-6">
                  <Compass className="size-5 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-4 text-[0.95rem] font-semibold text-ink">{c.vision}</h3>
                  <div className="mt-3 space-y-3">
                    {site.about.vision.map((item) => (
                      <p key={item[locale]} className="text-[0.82rem] leading-relaxed text-muted">
                        {item[locale]}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="border border-line bg-white p-6">
                  <Target className="size-5 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-4 text-[0.95rem] font-semibold text-ink">{c.mission}</h3>
                  <div className="mt-3 space-y-3">
                    {site.about.mission.map((item) => (
                      <p key={item[locale]} className="text-[0.82rem] leading-relaxed text-muted">
                        {item[locale]}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 border border-line bg-white p-6">
                <h3 className="text-[0.95rem] font-semibold text-ink">{c.values}</h3>
                <ul className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {site.about.values.map((value, index) => (
                    <li key={value.title[locale]} className="flex gap-3">
                      <span className="font-mono text-[0.62rem] tracking-[0.1em] text-accent">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-[0.82rem] font-semibold text-ink">{value.title[locale]}</p>
                        <p className="mt-1 text-[0.76rem] leading-relaxed text-muted">
                          {value.body[locale]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              id={`${baseId}-panel-2`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-2`}
              hidden={active !== 2}
            >
              <div className="border border-line bg-cloud">
                <div className="flex items-start gap-4 border-b border-line p-6 sm:p-8">
                  <Layers className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-[0.95rem] font-semibold text-ink">{c.capability}</h3>
                    <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
                      {site.about.capabilityNote[locale]}
                    </p>
                  </div>
                </div>
                <ul className="divide-y divide-line">
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/${locale}${paths.services}/${service.slug}`}
                        className="group flex items-start gap-4 p-6 transition-colors hover:bg-white sm:p-8"
                      >
                        <span className="mt-0.5 font-mono text-[0.68rem] tracking-[0.14em] text-brand">
                          {service.code}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[0.9rem] font-semibold text-ink">
                            {service.title[locale]}
                          </span>
                          <span className="mt-1.5 block text-[0.8rem] leading-relaxed text-muted">
                            {service.short[locale]}
                          </span>
                        </span>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line p-6 sm:px-8">
                  <Link href={`/${locale}${paths.services}`} className="link-arrow">
                    {c.viewServices}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
