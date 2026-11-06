import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { SectionHeading } from "@/components/ui/section-heading";
import { paths, type Locale } from "@/lib/i18n";
import type { Project, Service } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Dự án tiêu biểu",
    title: "Công trình trải dài từ hàng không đến nhiệt điện.",
    intro:
      "Danh mục dự án được nhóm theo bốn lĩnh vực hoạt động, phản ánh phạm vi công việc và địa bàn Fansipan Group đã triển khai.",
    all: "Xem tất cả dự án",
  },
  en: {
    eyebrow: "Featured projects",
    title: "From aviation to thermal power.",
    intro:
      "The portfolio is grouped by our four service areas, reflecting the scope and locations where Fansipan Group has delivered work.",
    all: "View all projects",
  },
} as const;

export function ProjectsSection({
  locale,
  projects,
  services,
}: {
  locale: Locale;
  projects: Project[];
  services: Service[];
}) {
  const c = copy[locale];

  return (
    <section id="du-an" className="relative bg-cloud py-20 lg:py-28">
      <div className="wrap">
        <SectionHeading
          index="04"
          eyebrow={c.eyebrow}
          title={c.title}
          intro={c.intro}
          action={
            <Link href={`/${locale}${paths.projects}`} className="link-arrow">
              {c.all}
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-11">
          <ProjectsExplorer locale={locale} projects={projects} services={services} />
        </div>
      </div>
    </section>
  );
}
