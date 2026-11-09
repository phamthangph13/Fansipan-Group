import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/lib/i18n";
import type { Project, Service } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Dự án tiêu biểu",
    title: "Công trình trải dài từ hàng không đến nhiệt điện.",
  },
  en: {
    eyebrow: "Featured projects",
    title: "From aviation to thermal power.",
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
    <section id="du-an" className="relative bg-cloud py-14 lg:py-20">
      <div className="wrap">
        <SectionHeading
          index="04"
          eyebrow={c.eyebrow}
          title={c.title}
        />
        <div className="mt-11">
          <ProjectsExplorer
            locale={locale}
            projects={projects}
            services={services}
            limit={3}
            showNote={false}
          />
        </div>
      </div>
    </section>
  );
}
