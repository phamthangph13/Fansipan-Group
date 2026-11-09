import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ServiceArt, type ServiceArtVariant } from "@/components/illustrations/service-art";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { Service } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Lĩnh vực hoạt động",
    title: "Bốn lĩnh vực, một chuẩn kỹ thuật.",
    all: "Tất cả dịch vụ",
    detail: "Xem chi tiết",
  },
  en: {
    eyebrow: "What we do",
    title: "Four disciplines, one engineering standard.",
    all: "All services",
    detail: "View details",
  },
} as const;

export function ServicesSection({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  const c = copy[locale];
  const t = ui[locale];

  return (
    <section id="dich-vu" className="relative overflow-hidden bg-sky py-14 lg:py-20">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <div className="wrap relative">
        <SectionHeading
          index="02"
          eyebrow={c.eyebrow}
          title={c.title}
          action={
            <Link href={`/${locale}${paths.services}`} className="link-arrow">
              {c.all}
              <ArrowRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 80}>
              <Link
                href={`/${locale}${paths.services}/${service.slug}`}
                className="group flex h-full flex-col overflow-hidden border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_30px_60px_-34px_rgba(7,24,44,0.35)]"
              >
                {service.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-sky">
                    <Image
                      src={service.image}
                      alt={service.title[locale]}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.4)_0%,rgba(7,26,53,0.02)_38%,rgba(7,26,53,0.72)_100%)]" />
                    <span className="absolute left-4 top-4 bg-white/95 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.18em] text-brand">
                      {service.code}
                    </span>
                    <span className="absolute right-4 top-4 flex size-8 items-center justify-center border border-white/30 bg-white/10 text-white backdrop-blur transition-colors group-hover:border-white/60 group-hover:bg-white group-hover:text-brand">
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                ) : (
                  <div className="relative overflow-hidden border-b border-line bg-[#f5f9fe] px-6 pb-4 pt-7">
                    <span className="absolute left-6 top-6 font-mono text-[0.65rem] tracking-[0.18em] text-brand">
                      {service.code}
                    </span>
                    <span className="absolute right-5 top-5 flex size-8 items-center justify-center border border-line bg-white text-muted transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                      <ArrowUpRight className="size-3.5" />
                    </span>
                    <ServiceArt
                      variant={service.id as ServiceArtVariant}
                      className="mt-6 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <h3 className="text-[1.02rem] font-semibold leading-snug text-ink">
                      {service.title[locale]}
                    </h3>
                    <p className="mt-3 text-[0.8rem] leading-[1.7] text-muted">
                      {service.short[locale]}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[0.78rem] font-semibold text-brand">
                    {t.actions.viewDetail}
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
