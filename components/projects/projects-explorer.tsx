"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/projects/project-card";
import { ui, type Locale } from "@/lib/i18n";
import type { Project, Service, ServiceId } from "@/lib/types";

const copy = {
  vi: {
    all: "Tất cả",
    results: "dự án",
    note:
      "Thông tin dự án được công bố ở mức cơ bản. Hình ảnh kèm theo là ảnh minh họa cho hạng mục công việc, không phải ảnh công trình thực tế.",
  },
  en: {
    all: "All",
    results: "projects",
    note:
      "Project information is published at a basic level. Images illustrate the type of work and are not photographs of the actual facilities.",
  },
} as const;

export function ProjectsExplorer({
  locale,
  projects,
  services,
  initialCategory = "all",
}: {
  locale: Locale;
  projects: Project[];
  services: Service[];
  initialCategory?: string;
}) {
  const validInitial = ["all", ...services.map((service) => service.id)].includes(initialCategory)
    ? initialCategory
    : "all";
  const [active, setActive] = useState(validInitial);
  const c = copy[locale];

  const filtered = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.categories.includes(active as ServiceId)),
    [active, projects],
  );

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label={c.all}>
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            onClick={() => setActive("all")}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border px-4 py-2 text-[0.78rem] font-medium transition-colors",
              active === "all"
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand",
            )}
          >
            {c.all}
            <span
              className={cn(
                "font-mono text-[0.64rem]",
                active === "all" ? "text-white/60" : "text-muted/60",
              )}
            >
              {String(projects.length).padStart(2, "0")}
            </span>
          </button>
          {services.map((service) => {
            const count = projects.filter((project) =>
              project.categories.includes(service.id),
            ).length;
            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                aria-selected={active === service.id}
                onClick={() => setActive(service.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 border px-4 py-2 text-[0.78rem] font-medium transition-colors",
                  active === service.id
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand",
                )}
              >
                {service.shortTitle[locale]}
                <span
                  className={cn(
                    "font-mono text-[0.64rem]",
                    active === service.id ? "text-white/60" : "text-muted/60",
                  )}
                >
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        <p className="shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted/70">
          {filtered.length} {c.results}
        </p>
      </div>

      {filtered.length ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} locale={locale} index={index} />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-line bg-cloud p-6 text-sm text-muted">
          {ui[locale].labels.noResults}
        </p>
      )}

      <p className="mt-6 max-w-3xl text-[0.72rem] leading-relaxed text-muted/70">{c.note}</p>
    </div>
  );
}
