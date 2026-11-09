import Image from "next/image";
import { CalendarDays, CheckCircle2, Layers, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { projectStatusLabels } from "@/lib/labels";
import type { Project } from "@/lib/types";

const labels = {
  vi: {
    scope: "Hạng mục thực hiện",
    location: "Địa điểm",
    year: "Năm thực hiện",
    updating: "Đang cập nhật",
  },
  en: {
    scope: "Scope of work",
    location: "Location",
    year: "Year",
    updating: "Updating",
  },
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
  const name = locale === "vi" ? project.name : project.nameEn;
  const status = projectStatusLabels[project.status][locale];

  return (
    <article className="group relative flex flex-col border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_22px_50px_-32px_rgba(7,24,44,0.4)]">
      {project.image ? (
        <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden border-b border-line bg-sky">
          <Image
            src={project.image}
            alt={
              locale === "vi"
                ? `Hình ảnh minh họa cho ${project.name}`
                : `Illustrative image for ${project.nameEn}`
            }
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.4)_0%,rgba(7,26,53,0.02)_40%,rgba(7,26,53,0.72)_100%)]" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
            <span className="bg-white/95 px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.16em] text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center gap-1.5 border border-green/15 bg-white/95 px-2 py-1 text-[0.63rem] font-medium text-green backdrop-blur">
              <CheckCircle2 className="size-3" strokeWidth={2} />
              {status}
            </span>
          </div>
          <span className="absolute bottom-3.5 left-4 inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/80">
            <MapPin className="size-3" strokeWidth={1.6} />
            {project.location[locale]}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.64rem] tracking-[0.16em] text-muted/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="inline-flex items-center gap-1.5 border border-green/20 bg-green/[0.06] px-2 py-1 text-[0.63rem] font-medium text-green">
            <CheckCircle2 className="size-3" strokeWidth={2} />
            {status}
          </span>
        </div>
      )}

      <h3 className="mt-4 text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
        {name}
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
        <div className="flex gap-3">
          <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-brand/70" strokeWidth={1.6} />
          <div>
            <dt className="font-mono text-[0.58rem] uppercase leading-none tracking-[0.14em] text-muted/65">
              {l.year}
            </dt>
            <dd className="num mt-1 text-muted">{project.year ?? l.updating}</dd>
          </div>
        </div>
      </dl>

      <span className="mt-auto block pt-5">
        <span className="block h-px w-7 bg-accent/70 transition-all duration-300 group-hover:w-12" />
      </span>
    </article>
  );
}
