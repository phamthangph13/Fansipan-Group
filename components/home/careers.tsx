import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { paths, type Locale } from "@/lib/i18n";
import type { Job } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Tuyển dụng",
    title: "Gia nhập đội ngũ Fansipan Group.",
    intro:
      "Chúng tôi tìm kiếm những người làm kỹ thuật cẩn trọng, chủ động và muốn phát triển cùng các dự án công nghiệp.",
    cta: "Xem vị trí đang tuyển",
    open: "vị trí đang tuyển",
  },
  en: {
    eyebrow: "Careers",
    title: "Join the Fansipan Group team.",
    intro:
      "We look for careful, self-driven technical people who want to grow with industrial projects.",
    cta: "See open positions",
    open: "open positions",
  },
} as const;

export function CareersTeaser({ locale, jobs }: { locale: Locale; jobs: Job[] }) {
  const c = copy[locale];
  const openJobs = jobs.filter((job) => job.open);

  return (
    <section id="tuyen-dung" className="relative overflow-hidden bg-ink py-12 text-white lg:py-16">
      <div className="pointer-events-none absolute inset-0 grid-lines-light opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[340px] w-[340px] -translate-y-1/2 rounded-full border border-white/[0.07]" aria-hidden />
      <div className="wrap relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-accent" aria-hidden />
            <p className="eyebrow text-white/55">{c.eyebrow}</p>
            <span className="eyebrow text-white/25">/ 09</span>
          </div>
          <h2 className="display-3 mt-4 max-w-2xl text-white">{c.title}</h2>
          <p className="mt-4 max-w-xl text-[0.88rem] leading-relaxed text-white/55">{c.intro}</p>
          <Link href={`/${locale}${paths.careers}`} className="btn btn-light mt-7">
            {c.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-white/12 bg-white/[0.04] p-6 backdrop-blur">
            <div className="flex items-end justify-between border-b border-white/10 pb-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/45">
                {c.open}
              </p>
              <p className="num text-[2.8rem] font-semibold leading-none tracking-[-0.05em] text-white">
                {String(openJobs.length).padStart(2, "0")}
              </p>
            </div>
            <ul className="mt-2 divide-y divide-white/8">
              {openJobs.slice(0, 3).map((job) => (
                <li key={job.slug}>
                  <Link
                    href={`/${locale}${paths.careers}/${job.slug}`}
                    className="group flex items-center justify-between gap-4 py-3.5"
                  >
                    <span>
                      <span className="block text-[0.84rem] font-medium text-white/85 transition-colors group-hover:text-white">
                        {job.title[locale]}
                      </span>
                      <span className="mt-0.5 block text-[0.7rem] text-white/40">
                        {job.location[locale]}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-white/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
