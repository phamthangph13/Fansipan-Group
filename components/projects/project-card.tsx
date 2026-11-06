import { CalendarDays, CheckCircle2, Layers, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { projectStatusLabels } from "@/lib/labels";
import type { Project } from "@/lib/types";

const labels = {
  vi: { scope: "Hạng mục thực hiện", location: "Địa điểm", year: "Năm thực hiện" },
  en: { scope: "Scope of work", location: "Location", year: "Year" },
} as const;

export function ProjectCard({
  project,
  locale,
  index,
}: {
  project: Project;
  locale: Locale;
  index: number;
}) {
  const l = labels[locale];

  return (
    <article className="group relative flex flex-col border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_22px_50px_-32px_rgba(7,24,44,0.4)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.64rem] tracking-[0.16em] text-muted/45">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="inline-flex items-center gap-1.5 border border-green/20 bg-green/[0.06] px-2 py-1 text-[0.63rem] font-medium text-green">
          <CheckCircle2 className="size-3" strokeWidth={2} />
          {projectStatusLabels[project.status][locale]}
        </span>
      </div>

      <h3 className="mt-4 text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
        {locale === "vi" ? project.name : project.nameEn}
      </h3>

      <dl className="mt-4 space-y-3 border-t border-line pt-4 text-[0.78rem]">
        <div className="flex gap-3">
          <Layers className="mt-0.5 size-3.5 shrink-0 text-brand/70" strokeWidth={1.6} />
          <div>
            <dt className="sr-only">{l.scope}</dt>
            <dd className="leading-relaxed text-ink-soft">{project.scope[locale]}</dd>
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-brand/70" strokeWidth={1.6} />
          <div>
            <dt className="sr-only">{l.location}</dt>
            <dd className="leading-relaxed text-muted">{project.location[locale]}</dd>
          </div>
        </div>
        {project.year ? (
          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-brand/70" strokeWidth={1.6} />
            <div>
              <dt className="sr-only">{l.year}</dt>
              <dd className="num text-muted">{project.year}</dd>
            </div>
          </div>
        ) : null}
      </dl>

      <span className="mt-auto block pt-5">
        <span className="block h-px w-7 bg-accent/70 transition-all duration-300 group-hover:w-12" />
      </span>
    </article>
  );
}
