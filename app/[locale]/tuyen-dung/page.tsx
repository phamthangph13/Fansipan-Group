import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Compass, GraduationCap, HardHat, Layers, Mail } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { JobsExplorer } from "@/components/careers/jobs-explorer";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getJobs, getSite } from "@/lib/content";
import { isLocale, paths, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const copy = {
  vi: {
    eyebrow: "Tuyển dụng",
    title: "Gia nhập đội ngũ Fansipan Group.",
    intro:
      "Chúng tôi tìm kiếm những người làm kỹ thuật cẩn trọng, chủ động và muốn phát triển cùng các dự án công nghiệp.",
    openRoles: "Vị trí đang tuyển",
    positions: "vị trí",
    whyTitle: "Vì sao làm việc tại Fansipan Group?",
    whyIntro:
      "Môi trường kỹ thuật thực tế, phạm vi công việc rõ ràng và cơ hội học từ chính các công trình đang vận hành.",
    benefits: [
      {
        title: "Dự án công nghiệp đa dạng",
        body: "Hệ thống cơ điện, HVAC, tháp giải nhiệt và bảo trì tại nhà máy, khu công nghiệp trên nhiều địa bàn.",
      },
      {
        title: "Học từ đội ngũ kỹ thuật",
        body: "Làm việc cùng các kỹ sư có kinh nghiệm trong khảo sát, thiết kế, thi công và nghiệm thu.",
      },
      {
        title: "Phạm vi và trách nhiệm rõ ràng",
        body: "Công việc được xác định theo hồ sơ kỹ thuật, với yêu cầu an toàn và chất lượng cụ thể.",
      },
      {
        title: "Phát triển theo năng lực",
        body: "Cơ hội phát triển từ kỹ thuật viên đến kỹ sư, giám sát và quản lý dự án theo kinh nghiệm thực tế.",
      },
    ],
    generalTitle: "Không thấy vị trí phù hợp?",
    generalBody:
      "Bạn có thể gửi CV và giới thiệu ngắn về kinh nghiệm qua email tuyển dụng. Hồ sơ sẽ được lưu để xem xét khi có vị trí phù hợp.",
    generalCta: "Gửi CV qua email",
    noteTitle: "Lưu ý khi ứng tuyển",
    noteBody:
      "CV cần được đính kèm khi gửi hồ sơ qua website. Chúng tôi chỉ sử dụng thông tin trong hồ sơ cho mục đích tuyển dụng và không chia sẻ cho bên thứ ba.",
  },
  en: {
    eyebrow: "Careers",
    title: "Join the Fansipan Group team.",
    intro:
      "We look for careful, self-driven technical people who want to grow with industrial projects.",
    openRoles: "Open positions",
    positions: "positions",
    whyTitle: "Why work at Fansipan Group?",
    whyIntro:
      "A hands-on engineering environment, clearly defined scope and the chance to learn from systems in live operation.",
    benefits: [
      {
        title: "Diverse industrial projects",
        body: "M&E, HVAC, cooling tower and maintenance systems in factories and industrial parks across several locations.",
      },
      {
        title: "Learn from our engineering team",
        body: "Work alongside experienced engineers in surveying, design, installation and commissioning.",
      },
      {
        title: "Clear scope and responsibility",
        body: "Work is defined by technical documents, with specific safety and quality requirements.",
      },
      {
        title: "Grow with capability",
        body: "A path from technician to engineer, supervisor and project manager based on practical experience.",
      },
    ],
    generalTitle: "No suitable position listed?",
    generalBody:
      "Send your CV and a short introduction of your experience to our recruitment email. We keep applications on file for future openings.",
    generalCta: "Email your CV",
    noteTitle: "Before you apply",
    noteBody:
      "A CV must be attached when applying through the website. We use the information in your application only for recruitment and do not share it with third parties.",
  },
} as const;

const icons = [Layers, GraduationCap, HardHat, Compass];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: paths.careers,
    title: lang === "vi" ? "Tuyển dụng" : "Careers",
    description:
      lang === "vi"
        ? "Cơ hội nghề nghiệp tại Fansipan Group trong lĩnh vực cơ điện, HVAC, tháp giải nhiệt và bảo trì hệ thống. Xem vị trí đang tuyển và gửi hồ sơ trực tuyến."
        : "Career opportunities at Fansipan Group in M&E, HVAC, cooling towers and system maintenance. View open positions and apply online.",
  });
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [jobs, site] = await Promise.all([getJobs(), getSite()]);
  const c = copy[locale];
  const openJobs = jobs.filter((job) => job.open);
  const mailHref = `mailto:${site.contact.careersEmail}?subject=${encodeURIComponent(
    locale === "vi" ? "Ứng tuyển Fansipan Group" : "Application to Fansipan Group",
  )}`;

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
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
          <p className="text-[0.78rem] text-muted">
            <span className="num text-[1.35rem] font-semibold text-ink">
              {String(openJobs.length).padStart(2, "0")}
            </span>{" "}
            {c.positions}
          </p>
          <a href={mailHref} className="link-arrow">
            {site.contact.careersEmail}
            <Mail className="size-4" />
          </a>
        </div>
      </PageHero>

      <section className="border-b border-line bg-cloud py-12 lg:py-16">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-brand">{locale === "vi" ? "Môi trường" : "Environment"}</p>
              <h2 className="display-3 mt-3 text-ink">{c.whyTitle}</h2>
              <p className="mt-4 text-[0.86rem] leading-relaxed text-muted">{c.whyIntro}</p>
            </div>
            <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:col-span-8">
              {c.benefits.map((benefit, index) => {
                const Icon = icons[index] ?? Layers;
                return (
                  <div key={benefit.title} className="bg-white p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <Icon className="size-5 text-brand" strokeWidth={1.5} />
                      <span className="font-mono text-[0.6rem] tracking-[0.14em] text-muted/40">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[0.92rem] font-semibold text-ink">{benefit.title}</h3>
                    <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{benefit.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-brand">{c.openRoles}</p>
              <h2 className="display-3 mt-3 text-ink">
                {locale === "vi" ? "Cơ hội đang mở." : "Open opportunities."}
              </h2>
            </div>
            <a href={mailHref} className="link-arrow">
              {c.generalCta}
              <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="mt-8">
            <JobsExplorer locale={locale} jobs={jobs} />
          </div>

          <div className="mt-10 grid gap-5 border border-line bg-cloud p-6 sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="text-[1.05rem] font-semibold text-ink">{c.generalTitle}</h3>
              <p className="mt-2 max-w-xl text-[0.84rem] leading-relaxed text-muted">
                {c.generalBody}
              </p>
              <a href={mailHref} className="btn btn-outline btn-sm mt-5">
                <Mail className="size-4" />
                {c.generalCta}
              </a>
            </div>
            <div className="lg:col-span-5">
              <div className="border-l-2 border-accent pl-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/60">
                  {c.noteTitle}
                </p>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{c.noteBody}</p>
                <Link
                  href={`/${locale}${paths.privacy}`}
                  className="mt-3 inline-flex items-center gap-1 text-[0.76rem] font-medium text-brand"
                >
                  {locale === "vi" ? "Chính sách bảo mật" : "Privacy policy"}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />
    </>
  );
}
