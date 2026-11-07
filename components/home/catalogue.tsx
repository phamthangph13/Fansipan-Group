import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText, Maximize2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Hồ sơ năng lực",
    title: "Toàn bộ năng lực, trong một cuốn hồ sơ.",
    intro:
      "Xem trực tiếp dưới dạng sách lật trang hoặc tải PDF để lưu trữ, chia sẻ với đồng nghiệp và đối tác.",
    online: "Xem trực tiếp",
    download: "Tải xuống PDF",
    contents: "Năng lực & dịch vụ · Dự án tiêu biểu · Quy trình triển khai",
    badge: "Company profile",
  },
  en: {
    eyebrow: "Company profile",
    title: "Our full capability, in one document.",
    intro:
      "Read it as a page-turning book or download the PDF to keep and share with colleagues and partners.",
    online: "View online",
    download: "Download PDF",
    contents: "Capabilities & services · Selected projects · Delivery process",
    badge: "Company profile",
  },
} as const;

export function CatalogueSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const c = copy[locale];

  return (
    <section id="ho-so-nang-luc" className="relative overflow-hidden bg-[linear-gradient(115deg,#071a35_0%,#0a2a5e_55%,#0027aa_100%)] py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute inset-0 grid-lines-light opacity-40" aria-hidden />
      <svg
        className="pointer-events-none absolute -bottom-20 right-0 h-[460px] w-[60%] opacity-15"
        viewBox="0 0 900 500"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 470L120 410L230 440L360 320L470 390L590 240L700 340L810 200L900 300"
          stroke="white"
          strokeWidth="1.2"
        />
        <path
          d="M0 500L150 450L300 480L470 370L610 430L740 310L900 390"
          stroke="white"
          strokeWidth="0.8"
        />
      </svg>

      <div className="wrap relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-[min(78%,360px)] lg:mx-0">
              <div
                className="absolute -inset-4 border border-white/10"
                aria-hidden
              />
              <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:-translate-y-1.5 hover:rotate-[-1deg]">
                <Image
                  src="/images/about/plant.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 360px, 70vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.15)_0%,rgba(7,26,53,0.25)_45%,rgba(7,26,53,0.92)_100%)]" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/70">
                    {c.badge}
                  </span>
                  <Image src="/brand/mark-white.png" alt="" width={34} height={34} className="opacity-90" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/60">
                    FANSIPAN GROUP.,JSC
                  </p>
                  <p className="mt-2 text-[1.15rem] font-semibold leading-tight tracking-[-0.02em]">
                    {site.catalogue.title[locale]}
                  </p>
                  <div className="mt-4 h-px w-10 bg-accent" />
                  <p className="mt-3 text-[0.62rem] leading-relaxed text-white/55">
                    {site.catalogue.subtitle[locale]}
                  </p>
                </div>
                <span className="absolute right-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-navy/30 backdrop-blur">
                  <FileText className="size-3.5 text-white" />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionHeading index="05" eyebrow={c.eyebrow} title={c.title} intro={c.intro} light stacked />
            <p className="mt-6 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/45">
              {c.contents}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}${paths.profile}`} className="btn btn-light">
                <Maximize2 className="size-4" />
                {c.online}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={site.catalogue.pdf}
                download
                className="btn btn-outline-light"
              >
                <Download className="size-4" />
                {c.download}
              </a>
            </div>
            <p className="mt-5 max-w-lg text-[0.72rem] leading-relaxed text-white/40">
              {site.catalogue.note[locale]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
