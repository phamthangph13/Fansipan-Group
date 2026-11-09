import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Quy trình triển khai",
    title: "Từ yêu cầu đến bàn giao, có lộ trình.",
    intro:
      "Mỗi dự án được triển khai theo một quy trình rõ ràng, có kiểm soát ở từng bước và được điều chỉnh theo phạm vi công việc thực tế.",
    cta: "Trao đổi về dự án của bạn",
  },
  en: {
    eyebrow: "How we deliver",
    title: "A clear route from enquiry to handover.",
    intro:
      "Every project follows a defined process, controlled at each stage and adapted to the actual scope of work.",
    cta: "Discuss your project",
  },
} as const;

export function ProcessSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];
  const t = ui[locale];

  return (
    <section id="quy-trinh" className="relative overflow-hidden bg-white py-14 lg:py-20">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading index="03" eyebrow={c.eyebrow} title={c.title} intro={c.intro} stacked />
              <blockquote className="mt-8 border-l-2 border-accent pl-5">
                <p className="font-serif text-[1.25rem] italic leading-snug text-ink">
                  “{site.processIntro[locale]}”
                </p>
              </blockquote>
              <Link
                href={`/${locale}${paths.contact}#quote`}
                className="link-arrow mt-8"
              >
                {c.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <ol className="relative lg:col-span-8">
            <span
              className="absolute bottom-6 left-[19px] top-6 w-px bg-line sm:left-[23px]"
              aria-hidden
            />
            {site.process.map((step, index) => (
              <li key={step.title[locale]} className="group relative flex gap-5 pb-8 last:pb-0 sm:gap-7">
                <span className="relative z-10 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-white font-mono text-[0.68rem] font-medium tracking-[0.08em] text-brand transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white sm:size-12">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 border-b border-line pb-8 transition-colors group-last:border-b-0 group-hover:border-brand/25">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-ink sm:text-[1.15rem]">
                      {step.title[locale]}
                    </h3>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted/40">
                      {locale === "vi" ? "Bước" : "Step"} {index + 1} / {site.process.length}
                    </span>
                  </div>
                  <p className="mt-2 max-w-xl text-[0.86rem] leading-[1.75] text-muted">
                    {step.body[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
