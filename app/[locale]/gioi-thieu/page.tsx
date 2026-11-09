import type { Metadata } from "next";
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
import { Logo } from "@/components/brand/logo";
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
    overviewTitle:
      "Chuyên gia Cơ điện (M&E) – Hệ thống điều hòa không khí & Làm lạnh (HVAC) – Tháp giải nhiệt & Thiết bị công nghiệp – Dịch vụ bảo trì chuyên nghiệp",
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
    legal: "Hồ sơ pháp lý",
    taxCode: "Mã số thuế",
    address: "Địa chỉ",
    email: "Email",
    hotline: "Hotline",
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
    overviewTitle:
      "M&E specialists – HVAC systems – Cooling towers & industrial equipment – Professional maintenance services",
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
    legal: "Legal profile",
    taxCode: "Tax code",
    address: "Address",
    email: "Email",
    hotline: "Hotline",
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
        introClassName="lg:max-w-none lg:whitespace-nowrap lg:text-[0.92rem]"
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.about },
        ]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-brand">{c.overview}</p>
            </div>
            <h2 className="mt-5 max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.15rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-ink">
              {c.overviewTitle}
            </h2>
            <div className="mt-7 space-y-5 border-t border-line pt-7">
              {paragraphs.map((paragraph, index) => {
                const last = index === paragraphs.length - 1;
                return (
                  <p
                    key={paragraph.slice(0, 32)}
                    className={
                      last
                        ? "border-l-2 border-accent pl-4 text-[1.02rem] font-semibold leading-relaxed text-ink"
                        : "text-[0.96rem] leading-[1.85] text-ink-soft"
                    }
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden border border-line bg-cloud">
              <div className="h-1 bg-[linear-gradient(90deg,var(--color-brand),var(--color-cyan),var(--color-accent))]" />
              <div className="p-6 sm:p-7">
                <div className="rounded-sm bg-white p-5">
                  <Logo size="md" />
                </div>

                <p className="eyebrow mt-7 text-brand">{c.legal}</p>
                <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-ink">
                  {site.company.legalName[locale]}
                </p>
                <p className="mt-1 text-[0.8rem] text-muted">{site.company.displayName}</p>

                <dl className="mt-6 space-y-4 border-t border-line pt-5">
                  <div>
                    <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted/65">
                      {c.taxCode}
                    </dt>
                    <dd className="num mt-1 text-[0.95rem] font-semibold text-ink">
                      {site.company.taxCode || t.labels.updating}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted/65">
                      {c.address}
                    </dt>
                    <dd className="mt-1 text-[0.82rem] leading-relaxed text-ink-soft">
                      {site.offices[0]?.address[locale]}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted/65">
                      {c.email}
                    </dt>
                    <dd className="mt-1 text-[0.82rem] text-ink-soft">
                      <a href={`mailto:${site.contact.email}`} className="break-all hover:text-brand">
                        {site.contact.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted/65">
                      {c.hotline}
                    </dt>
                    <dd className="num mt-1 text-[0.82rem] text-ink-soft">{site.contact.hotlineDisplay}</dd>
                  </div>
                </dl>

                <Link
                  href={`/${locale}${paths.profile}`}
                  className="group mt-6 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[0.82rem] font-semibold text-brand"
                >
                  {c.profile}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cloud py-14 lg:py-20">
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

      <section className="relative overflow-hidden bg-navy py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute inset-0 grid-lines-light opacity-40" aria-hidden />
        <div className="wrap relative grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-accent" aria-hidden />
                <p className="eyebrow text-white/60">{c.vision}</p>
              </div>
              <span className="font-mono text-[2.4rem] leading-none tracking-[-0.04em] text-white/20">
                01
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {site.about.vision.map((item) => (
                <p key={item[locale]} className="text-[0.96rem] leading-[1.8] text-white/70">
                  {item[locale]}
                </p>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-accent" aria-hidden />
                <p className="eyebrow text-white/60">{c.mission}</p>
              </div>
              <span className="font-mono text-[2.4rem] leading-none tracking-[-0.04em] text-white/20">
                02
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {site.about.mission.map((item) => (
                <p key={item[locale]} className="text-[0.96rem] leading-[1.8] text-white/70">
                  {item[locale]}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
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

      <section className="border-y border-line bg-cloud py-14 lg:py-20">
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
