import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceArt, type ServiceArtVariant } from "@/components/illustrations/service-art";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const copy = {
  vi: {
    eyebrow: "Dịch vụ",
    title: "Dịch vụ & lĩnh vực hoạt động",
    intro:
      "Bốn lĩnh vực được tổ chức quanh cùng một mục tiêu: hệ thống vận hành ổn định, an toàn và hiệu quả trong suốt vòng đời công trình.",
    detail: "Xem chi tiết dịch vụ",
    consult: "Yêu cầu tư vấn",
    process: "Quy trình chung",
    processIntro:
      "Mỗi dịch vụ được triển khai theo quy trình sáu bước, điều chỉnh theo phạm vi và điều kiện thực tế của công trình.",
    ctaTitle: "Chưa chắc dịch vụ nào phù hợp?",
    ctaBody:
      "Mô tả ngắn hiện trạng hoặc mục tiêu vận hành, đội ngũ kỹ thuật sẽ giúp xác định phạm vi phù hợp.",
  },
  en: {
    eyebrow: "Services",
    title: "Services & disciplines",
    intro:
      "Four disciplines organised around one objective: systems that run reliably, safely and efficiently throughout the project lifecycle.",
    detail: "View service details",
    consult: "Request consultation",
    process: "Common process",
    processIntro:
      "Every service follows a six-step delivery process, adapted to the actual scope and conditions of the project.",
    ctaTitle: "Not sure which service fits?",
    ctaBody:
      "Describe the current situation or operating objective; our engineering team will help define the right scope.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: paths.services,
    title: lang === "vi" ? "Dịch vụ" : "Services",
    description:
      lang === "vi"
        ? "Các lĩnh vực hoạt động của Fansipan Group: hệ thống điều hòa – làm lạnh (HVAC), cơ điện (M&E), tháp giải nhiệt & thiết bị công nghiệp, bảo trì chuyên nghiệp."
        : "Fansipan Group services: HVAC & refrigeration, M&E systems, cooling towers & industrial equipment, and professional maintenance.",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [services, site] = await Promise.all([getServices(), getSite()]);
  const c = copy[locale];
  const t = ui[locale];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.services },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/${locale}${paths.services}/${service.slug}`}
              className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2 text-[0.76rem] font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
            >
              <span className="font-mono text-[0.6rem] text-brand">{service.code}</span>
              {service.shortTitle[locale]}
            </Link>
          ))}
        </div>
      </PageHero>

      <div className="bg-white">
        {services.map((service, index) => (
          <section
            key={service.id}
            id={service.id}
            className={cn(
              "scroll-mt-28 border-b border-line py-14 lg:py-20",
              index % 2 === 1 ? "bg-cloud" : "bg-white",
            )}
          >
            <div className="wrap grid items-center gap-9 lg:grid-cols-12 lg:gap-14">
              <div
                className={cn(
                  "lg:col-span-5",
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1",
                )}
              >
                {service.image ? (
                  <div className="group relative aspect-[4/3] overflow-hidden border border-line bg-sky">
                    <Image
                      src={service.image}
                      alt={service.title[locale]}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.4)_0%,rgba(7,26,53,0.02)_42%,rgba(7,26,53,0.72)_100%)]" />
                    <span className="absolute left-4 top-4 bg-white/95 px-2.5 py-1 font-mono text-[0.64rem] tracking-[0.18em] text-brand">
                      {service.code}
                    </span>
                    <span className="absolute right-4 top-4 border border-white/30 bg-navy/35 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white backdrop-blur">
                      {t.labels.service}
                    </span>
                    <span className="absolute bottom-4 left-4 right-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/85">
                      {service.tagline[locale]}
                    </span>
                  </div>
                ) : (
                  <div className="relative border border-line bg-[#f5f9fe] px-6 pb-5 pt-8">
                    <span className="absolute left-6 top-6 font-mono text-[0.66rem] tracking-[0.18em] text-brand">
                      {service.code}
                    </span>
                    <span className="absolute right-5 top-5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/50">
                      {t.labels.service}
                    </span>
                    <ServiceArt variant={service.id as ServiceArtVariant} className="mt-8" />
                  </div>
                )}
              </div>

              <div className={cn("lg:col-span-7", index % 2 === 1 ? "lg:order-1" : "lg:order-2")}>
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-brand">
                  {service.tagline[locale]}
                </p>
                <h2 className="display-3 mt-3 text-ink">{service.title[locale]}</h2>
                <p className="mt-4 max-w-2xl text-[0.94rem] leading-[1.8] text-ink-soft">
                  {service.intro[locale]}
                </p>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {service.role.slice(0, 4).map((item) => (
                    <li key={item[locale]} className="flex gap-2.5 text-[0.8rem] leading-relaxed text-muted">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={2.2} />
                      <span>{item[locale]}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
                  <Link
                    href={`/${locale}${paths.services}/${service.slug}`}
                    className="link-arrow"
                  >
                    {c.detail}
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={`/${locale}${paths.contact}#quote`}
                    className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-muted transition-colors hover:text-brand"
                  >
                    {c.consult}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-white py-16 lg:py-20">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-brand">{c.process}</p>
              <h2 className="display-3 mt-4 text-ink">
                {locale === "vi" ? "Sáu bước, kiểm soát từ đầu." : "Six steps, controlled throughout."}
              </h2>
              <p className="mt-4 text-[0.86rem] leading-relaxed text-muted">{c.processIntro}</p>
              <p className="mt-5 border-l-2 border-accent pl-4 font-serif text-[1.1rem] italic text-ink">
                “{site.processIntro[locale]}”
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
                {site.process.map((step, index) => (
                  <div key={step.title[locale]} className="bg-white p-5">
                    <span className="font-mono text-[0.62rem] tracking-[0.14em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-[0.9rem] font-semibold text-ink">{step.title[locale]}</h3>
                    <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted">{step.body[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-white py-14 lg:py-16">
        <div className="wrap flex flex-col items-start justify-between gap-6 border border-line bg-cloud p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="display-3 text-ink">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-muted">{c.ctaBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {t.actions.quote}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
