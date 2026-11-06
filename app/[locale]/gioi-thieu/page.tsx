import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Compass,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceArt, type ServiceArtVariant } from "@/components/illustrations/service-art";
import { StatsBand } from "@/components/home/stats";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { splitParagraphs } from "@/lib/utils";

const copy = {
  vi: {
    eyebrow: "Giới thiệu",
    title: "Về Fansipan Group",
    intro:
      "Fansipan Group – Chuyên gia Cơ điện (M&E), HVAC, tháp giải nhiệt và bảo trì hệ thống.",
    overview: "Tổng quan công ty",
    difference: "Điểm khác biệt",
    vision: "Tầm nhìn",
    mission: "Sứ mệnh",
    values: "Giá trị cốt lõi",
    capability: "Năng lực công ty",
    capabilityTitle: "Một vòng đời, bốn lĩnh vực.",
    capabilityIntro:
      "Năng lực của Fansipan Group được tổ chức theo vòng đời công trình: tư vấn – thiết kế – cung cấp thiết bị – thi công – chạy thử – bàn giao – bảo trì.",
    ctaTitle: "Cần trao đổi về một hệ thống cụ thể?",
    ctaBody:
      "Gửi thông tin công trình hoặc liên hệ hotline để đội ngũ kỹ thuật trao đổi trước khi khảo sát.",
    cta: "Liên hệ đội ngũ kỹ thuật",
    services: "Xem dịch vụ",
    legal: "Tên pháp lý",
    profile: "Hồ sơ năng lực",
    differences: [
      {
        title: "Giải pháp toàn diện",
        body: "Từ tư vấn, thiết kế, cung cấp thiết bị, thi công đến vận hành và bảo trì — một đầu mối xuyên suốt vòng đời hệ thống.",
      },
      {
        title: "Chuyên môn kỹ thuật",
        body: "Kinh nghiệm trên hệ thống cơ điện, HVAC, tháp giải nhiệt và thiết bị công nghiệp tại nhà máy, khu công nghiệp.",
      },
      {
        title: "Đồng hành dài hạn",
        body: "Bảo trì chủ động giúp duy trì hiệu suất, hạn chế gián đoạn và kéo dài tuổi thọ thiết bị.",
      },
      {
        title: "Minh bạch & an toàn",
        body: "Phạm vi công việc, vật tư và tiến độ được xác định rõ; an toàn được kiểm soát tại từng hạng mục.",
      },
    ],
  },
  en: {
    eyebrow: "About",
    title: "About Fansipan Group",
    intro:
      "Fansipan Group – specialists in M&E, HVAC, cooling towers and system maintenance.",
    overview: "Company overview",
    difference: "What sets us apart",
    vision: "Vision",
    mission: "Mission",
    values: "Core values",
    capability: "Company capability",
    capabilityTitle: "One lifecycle, four disciplines.",
    capabilityIntro:
      "Our capability is organised around the project lifecycle: consultancy – design – equipment supply – installation – commissioning – handover – maintenance.",
    ctaTitle: "Need to discuss a specific system?",
    ctaBody:
      "Send your project information or call our hotline. Our engineering team will discuss the requirement before any survey.",
    cta: "Contact our engineering team",
    services: "View services",
    legal: "Legal name",
    profile: "Company profile",
    differences: [
      {
        title: "Integrated solutions",
        body: "From consultancy, design and equipment supply to installation, operation and maintenance — one partner across the system lifecycle.",
      },
      {
        title: "Technical expertise",
        body: "Experience across M&E, HVAC, cooling towers and industrial equipment in factories and industrial parks.",
      },
      {
        title: "Long-term partnership",
        body: "Proactive maintenance sustains performance, reduces downtime and extends equipment life.",
      },
      {
        title: "Transparency & safety",
        body: "Scope, materials and schedule are clearly defined, with safety controlled at every work item.",
      },
    ],
  },
} as const;

const valueIcons = [ShieldCheck, Award, Compass, Users, Lightbulb, Handshake];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: paths.about,
    title: lang === "vi" ? "Giới thiệu" : "About us",
    description:
      lang === "vi"
        ? "Fansipan Group – chuyên gia Cơ điện (M&E), HVAC, tháp giải nhiệt và bảo trì hệ thống. Tầm nhìn, sứ mệnh, giá trị cốt lõi và năng lực công ty."
        : "Fansipan Group – specialists in M&E, HVAC, cooling towers and system maintenance. Our vision, mission, values and company capability.",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services] = await Promise.all([getSite(), getServices()]);
  const c = copy[locale];
  const t = ui[locale];
  const paragraphs = splitParagraphs(site.about.intro[locale]);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.about },
        ]}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-brand">{c.overview}</p>
            </div>
            <p className="display-3 mt-5 max-w-2xl text-ink">{paragraphs[0]}</p>
            <div className="mt-7 space-y-5 border-t border-line pt-7">
              {paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-[0.96rem] leading-[1.85] text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden border border-line bg-navy text-white">
              <div className="relative h-32">
                <Image
                  src="/images/hero-fansipan.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover object-[70%_center]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.3),rgba(7,26,53,0.95))]" />
                <Image
                  src="/brand/mark-white.png"
                  alt=""
                  width={44}
                  height={44}
                  className="absolute bottom-5 left-6"
                />
              </div>
              <div className="p-6">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/40">
                  {c.legal}
                </p>
                <p className="mt-2 text-[1rem] font-semibold text-white">
                  {site.company.legalName[locale]}
                </p>
                <p className="mt-1 text-[0.82rem] text-white/55">{site.company.displayName}</p>
                <div className="mt-5 h-px bg-white/10" />
                <p className="mt-5 font-serif text-[1.15rem] italic text-white/80">
                  “{site.company.slogan[locale]}”
                </p>
                <div className="mt-6 flex flex-col gap-2 text-[0.74rem] text-white/50">
                  <p>{site.contact.email}</p>
                  <p className="num">{site.contact.hotlineDisplay}</p>
                </div>
                <Link
                  href={`/${locale}${paths.profile}`}
                  className="group mt-6 inline-flex items-center gap-1.5 border-t border-white/10 pt-4 text-[0.78rem] font-semibold text-white"
                >
                  {c.profile}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cloud py-16 lg:py-24">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-accent" aria-hidden />
                <p className="eyebrow text-brand">{c.difference}</p>
              </div>
              <h2 className="display-3 mt-4 text-ink">
                {locale === "vi"
                  ? "Kỹ thuật vững, dịch vụ tận tâm."
                  : "Strong engineering, attentive service."}
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
              {c.differences.map((item, index) => (
                <Reveal key={item.title} delay={index * 70} className="border border-line bg-white p-6">
                  <span className="font-mono text-[0.62rem] tracking-[0.14em] text-accent">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-[0.92rem] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{item.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-16 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0 grid-lines-light opacity-40" aria-hidden />
        <div className="wrap relative grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-white/55">{c.vision}</p>
            </div>
            <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
              {site.about.vision.map((item) => (
                <p key={item[locale]} className="text-[0.96rem] leading-[1.8] text-white/70">
                  {item[locale]}
                </p>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-white/55">{c.mission}</p>
            </div>
            <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
              {site.about.mission.map((item) => (
                <p key={item[locale]} className="text-[0.96rem] leading-[1.8] text-white/70">
                  {item[locale]}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="wrap">
          <SectionHeading eyebrow={c.values} title={
            locale === "vi"
              ? "Sáu giá trị làm nên cách chúng tôi làm việc."
              : "Six values that shape how we work."
          } />
          <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {site.about.values.map((value, index) => {
              const Icon = valueIcons[index] ?? ShieldCheck;
              return (
                <div key={value.title[locale]} className="group bg-white p-6 transition-colors hover:bg-cloud lg:p-8">
                  <div className="flex items-start justify-between">
                    <Icon className="size-6 text-brand" strokeWidth={1.4} />
                    <span className="font-mono text-[0.62rem] tracking-[0.14em] text-muted/40">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[1rem] font-semibold text-ink">{value.title[locale]}</h3>
                  <p className="mt-2.5 text-[0.84rem] leading-[1.75] text-muted">{value.body[locale]}</p>
                  <span className="mt-6 block h-px w-8 bg-accent/60 transition-all duration-300 group-hover:w-14" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cloud py-16 lg:py-24">
        <div className="wrap">
          <SectionHeading
            eyebrow={c.capability}
            title={c.capabilityTitle}
            intro={c.capabilityIntro}
            action={
              <Link href={`/${locale}${paths.services}`} className="link-arrow">
                {c.services}
                <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/${locale}${paths.services}/${service.slug}`}
                className="group grid grid-cols-[1fr_150px] items-center gap-4 border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_22px_50px_-34px_rgba(7,24,44,0.4)] sm:grid-cols-[1fr_190px] sm:p-6"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.62rem] tracking-[0.14em] text-brand">
                      {service.code}
                    </span>
                    <span className="h-px w-5 bg-line" />
                  </div>
                  <h3 className="mt-3 text-[1rem] font-semibold leading-snug text-ink">
                    {service.title[locale]}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[0.8rem] leading-relaxed text-muted">
                    {service.short[locale]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[0.75rem] font-semibold text-brand">
                    {t.actions.viewDetail}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <ServiceArt
                  variant={service.id as ServiceArtVariant}
                  className="opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="sr-only">{index + 1}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StatsBand locale={locale} site={site} />

      <section className="bg-white py-14 lg:py-16">
        <div className="wrap flex flex-col items-start justify-between gap-6 border border-line bg-cloud p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="display-3 max-w-xl text-ink">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-muted">{c.ctaBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
