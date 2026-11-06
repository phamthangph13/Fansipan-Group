import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Flipbook } from "@/components/profile/flipbook";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const copy = {
  vi: {
    eyebrow: "Hồ sơ năng lực",
    title: "Toàn bộ năng lực, trong một cuốn hồ sơ.",
    intro:
      "Đọc trực tiếp hồ sơ năng lực Fansipan Group hoặc tải PDF để lưu trữ và chia sẻ với đồng nghiệp, đối tác.",
    reader: "Đọc hồ sơ trực tuyến",
    readerIntro:
      "Sách lật trang hỗ trợ phím mũi tên, vuốt ngang và xem toàn màn hình. Bản PDF gốc có sẵn để tải xuống.",
    download: "Tải xuống PDF",
    contact: "Yêu cầu báo giá",
    stats: "Năng lực cốt lõi",
    inside: "Trong hồ sơ",
    insideIntro:
      "Tám trang tóm lược năng lực, dịch vụ, dự án tiêu biểu và quy trình triển khai của Fansipan Group.",
    chapters: [
      { number: "01", title: "Trang bìa", body: "Thông tin doanh nghiệp và lĩnh vực hoạt động." },
      { number: "02", title: "Giới thiệu", body: "Tầm nhìn, sứ mệnh và giá trị cốt lõi." },
      { number: "03", title: "Lĩnh vực hoạt động", body: "Bốn nhóm dịch vụ chính của Fansipan Group." },
      { number: "04", title: "Dịch vụ", body: "Phạm vi công việc cho cơ điện, HVAC, tháp giải nhiệt và bảo trì." },
      { number: "05", title: "Dự án tiêu biểu", body: "Mười một dự án trên bảy lĩnh vực công nghiệp." },
      { number: "06", title: "Quy trình", body: "Sáu bước từ tiếp nhận yêu cầu đến bàn giao và bảo trì." },
    ],
    ctaTitle: "Cần bản hồ sơ phù hợp với công trình của bạn?",
    ctaBody:
      "Đội ngũ Fansipan Group có thể trao đổi về phạm vi công việc, hồ sơ kỹ thuật và phương án triển khai riêng cho từng dự án.",
    servicesTitle: "Bốn lĩnh vực trong hồ sơ",
    servicesIntro:
      "Mỗi lĩnh vực được triển khai theo cùng một chuẩn: khảo sát kỹ, thi công chuẩn và bàn giao rõ ràng.",
    viewService: "Xem dịch vụ",
    updated: "Phiên bản 2026",
    pdfNote: "PDF · 8 trang · Tiếng Việt",
  },
  en: {
    eyebrow: "Company profile",
    title: "Our full capability, in one document.",
    intro:
      "Read the Fansipan Group company profile online or download the PDF to keep and share with colleagues and partners.",
    reader: "Read the profile online",
    readerIntro:
      "The page-turning view supports arrow keys, swipe and full screen. The original PDF is available to download.",
    download: "Download PDF",
    contact: "Request a quote",
    stats: "Core capability",
    inside: "Inside the profile",
    insideIntro:
      "Eight pages summarising Fansipan Group's capability, services, selected projects and delivery process.",
    chapters: [
      { number: "01", title: "Cover", body: "Company information and areas of activity." },
      { number: "02", title: "Introduction", body: "Vision, mission and core values." },
      { number: "03", title: "Areas of activity", body: "Fansipan Group's four main service groups." },
      { number: "04", title: "Services", body: "Scope of work for M&E, HVAC, cooling towers and maintenance." },
      { number: "05", title: "Selected projects", body: "Eleven projects across seven industrial sectors." },
      { number: "06", title: "Process", body: "Six steps from enquiry to handover and maintenance." },
    ],
    ctaTitle: "Need a profile tailored to your facility?",
    ctaBody:
      "The Fansipan Group team can discuss the scope of work, technical documents and a delivery approach specific to your project.",
    servicesTitle: "Four disciplines in the profile",
    servicesIntro:
      "Every discipline follows the same standard: a thorough survey, disciplined installation and a clear handover.",
    viewService: "View service",
    updated: "2026 edition",
    pdfNote: "PDF · 8 pages · Vietnamese",
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
    path: paths.profile,
    title: lang === "vi" ? "Hồ sơ năng lực" : "Company profile",
    description:
      lang === "vi"
        ? "Hồ sơ năng lực Fansipan Group: năng lực cơ điện, HVAC, tháp giải nhiệt, bảo trì hệ thống, dự án tiêu biểu và quy trình triển khai. Đọc trực tuyến hoặc tải PDF."
        : "Fansipan Group company profile: M&E, HVAC, cooling tower and maintenance capability, selected projects and delivery process. Read online or download the PDF.",
  });
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services] = await Promise.all([getSite(), getServices()]);
  const c = copy[locale];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: locale === "vi" ? "Trang chủ" : "Home", href: `/${locale}` },
          { label: c.eyebrow },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <a href={site.catalogue.pdf} download className="btn btn-primary btn-sm">
            <Download className="size-3.5" />
            {c.download}
          </a>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-outline btn-sm">
            {c.contact}
            <ArrowRight className="size-3.5" />
          </Link>
          <span className="ml-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/60">
            {c.pdfNote}
          </span>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="wrap grid gap-px bg-line sm:grid-cols-3">
          {site.stats.map((stat) => (
            <div key={stat.label.vi} className="bg-white px-5 py-6 sm:px-7">
              <p className="flex items-end gap-1.5">
                <span className="num text-[2.1rem] font-semibold leading-none tracking-[-0.04em] text-brand">
                  {String(stat.value).padStart(2, "0")}
                </span>
              </p>
              <p className="mt-2 text-[0.78rem] text-muted">{stat.label[locale]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="doc" className="scroll-mt-28 border-b border-line bg-cloud py-10 lg:py-14">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow text-brand">{c.reader}</p>
              <h2 className="display-3 mt-3 text-ink">{site.catalogue.title[locale]}</h2>
              <p className="mt-3 text-[0.84rem] leading-relaxed text-muted">{c.readerIntro}</p>
            </div>
            <span className="inline-flex items-center gap-2 border border-line bg-white px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
              <FileText className="size-3.5 text-brand" strokeWidth={1.6} />
              {c.updated}
            </span>
          </div>

          <div className="mt-7">
            <Flipbook
              locale={locale}
              pdfUrl={site.catalogue.pdf}
              title={site.catalogue.title[locale]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brand">{c.inside}</p>
            <h2 className="display-3 mt-3 text-ink">
              {locale === "vi" ? "Sáu phần, một mạch năng lực." : "Six parts, one capability story."}
            </h2>
            <p className="mt-4 text-[0.86rem] leading-relaxed text-muted">{c.insideIntro}</p>
            <a href={site.catalogue.pdf} download className="btn btn-outline btn-sm mt-6">
              <Download className="size-3.5" />
              {c.download}
            </a>
          </div>

          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {c.chapters.map((chapter) => (
              <div key={chapter.number} className="bg-white p-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent">
                    {chapter.number}
                  </span>
                  <span className="h-px w-7 bg-line" />
                </div>
                <h3 className="mt-3 text-[0.94rem] font-semibold text-ink">{chapter.title}</h3>
                <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted">{chapter.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-cloud py-14 lg:py-20">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="eyebrow text-brand">{c.servicesTitle}</p>
              <h2 className="display-3 mt-3 text-ink">
                {locale === "vi" ? "Từ thiết kế đến vận hành." : "From design to operation."}
              </h2>
              <p className="mt-3 text-[0.84rem] leading-relaxed text-muted">{c.servicesIntro}</p>
            </div>
            <Link href={`/${locale}${paths.services}`} className="link-arrow">
              {locale === "vi" ? "Xem tất cả dịch vụ" : "View all services"}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/${locale}${paths.services}/${service.slug}`}
                className="group flex flex-col justify-between bg-white p-5 transition-colors hover:bg-brand-050/50"
              >
                <div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">
                    {service.code}
                  </span>
                  <h3 className="mt-3 text-[0.92rem] font-semibold leading-snug text-ink">
                    {service.shortTitle[locale]}
                  </h3>
                  <p className="mt-2 text-[0.76rem] leading-relaxed text-muted">
                    {service.tagline[locale]}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-3 text-[0.72rem] font-medium text-brand">
                  {c.viewService}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-white py-14 lg:py-16">
        <div className="wrap flex flex-col items-start justify-between gap-6 border border-line bg-cloud p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="display-3 text-ink">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-muted">{c.ctaBody}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.8rem]">
              <a
                href={`tel:${site.contact.hotline}`}
                className="inline-flex items-center gap-2 font-semibold text-brand"
              >
                <Phone className="size-4" strokeWidth={1.7} />
                <span className="num">{site.contact.hotlineDisplay}</span>
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink"
              >
                <Mail className="size-4 text-brand" strokeWidth={1.7} />
                {site.contact.email}
              </a>
            </div>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.contact}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
