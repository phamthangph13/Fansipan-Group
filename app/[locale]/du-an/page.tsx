import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getProjects, getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const copy = {
  vi: {
    eyebrow: "Dự án",
    title: "Dự án & công trình",
    intro:
      "Danh mục dự án của Fansipan Group được nhóm theo bốn lĩnh vực dịch vụ, từ hàng không, điện tử, cơ khí đến thép, giấy, khách sạn và nhiệt điện.",
    projects: "Dự án",
    groups: "Nhóm dịch vụ",
    sectors: "Lĩnh vực công nghiệp",
    ctaTitle: "Công trình của bạn có điểm tương đồng?",
    ctaBody:
      "Trao đổi với đội ngũ kỹ thuật để đánh giá phạm vi công việc và phương án triển khai phù hợp.",
    cta: "Yêu cầu khảo sát",
  },
  en: {
    eyebrow: "Projects",
    title: "Projects & facilities",
    intro:
      "Fansipan Group's portfolio is grouped by our four service areas, spanning aviation, electronics, machinery, steel, paper, hospitality and power generation.",
    projects: "Projects",
    groups: "Service groups",
    sectors: "Industrial sectors",
    ctaTitle: "Does your facility face a similar challenge?",
    ctaBody:
      "Talk to our engineering team to assess the scope and define a suitable delivery approach.",
    cta: "Request a survey",
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
    path: paths.projects,
    title: lang === "vi" ? "Dự án" : "Projects",
    description:
      lang === "vi"
        ? "Dự án tiêu biểu của Fansipan Group trong lĩnh vực cơ điện, HVAC, tháp giải nhiệt và bảo trì hệ thống cho nhà máy, khu công nghiệp."
        : "Selected Fansipan Group projects across M&E, HVAC, cooling towers and system maintenance for factories and industrial parks.",
  });
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { category } = await searchParams;
  const [projects, services, site] = await Promise.all([
    getProjects(),
    getServices(),
    getSite(),
  ]);
  const c = copy[locale];

  const facts = [
    { value: String(projects.length).padStart(2, "0"), label: c.projects },
    { value: String(services.length).padStart(2, "0"), label: c.groups },
    { value: String(site.sectors.length).padStart(2, "0"), label: c.sectors },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: ui[locale].nav.home, href: `/${locale}` },
          { label: c.eyebrow },
        ]}
      >
        <div className="flex flex-wrap gap-8 border-t border-line pt-5">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline gap-2.5">
              <span className="num text-[1.6rem] font-semibold tracking-[-0.04em] text-ink">
                {fact.value}
              </span>
              <span className="text-[0.72rem] text-muted">{fact.label}</span>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="wrap">
          <ProjectsExplorer
            locale={locale}
            projects={projects}
            services={services}
            initialCategory={category ?? "all"}
          />
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
            {c.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
