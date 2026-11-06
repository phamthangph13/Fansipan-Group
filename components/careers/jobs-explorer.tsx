"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { paths, ui, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/lib/types";

const copy = {
  vi: {
    search: "Tìm theo vị trí hoặc bộ phận…",
    all: "Tất cả",
    open: "Đang tuyển",
    closed: "Đã đóng",
    departments: "Bộ phận",
    results: "vị trí",
    noResults: "Không tìm thấy vị trí phù hợp.",
    deadline: "Hạn nộp",
    statusOpen: "Đang nhận hồ sơ",
    statusClosed: "Đã đóng",
    view: "Xem vị trí",
  },
  en: {
    search: "Search by position or department…",
    all: "All",
    open: "Open",
    closed: "Closed",
    departments: "Department",
    results: "positions",
    noResults: "No matching positions.",
    deadline: "Deadline",
    statusOpen: "Accepting applications",
    statusClosed: "Closed",
    view: "View position",
  },
} as const;

export function JobsExplorer({ locale, jobs }: { locale: Locale; jobs: Job[] }) {
  const c = copy[locale];
  const t = ui[locale];
  const [status, setStatus] = useState<"all" | "open" | "closed">("all");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.department[locale]))),
    [jobs, locale],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (status === "open" && !job.open) return false;
      if (status === "closed" && job.open) return false;
      if (department !== "all" && job.department[locale] !== department) return false;
      if (!needle) return true;
      return (
        job.title[locale].toLowerCase().includes(needle) ||
        job.department[locale].toLowerCase().includes(needle) ||
        job.location[locale].toLowerCase().includes(needle)
      );
    });
  }, [jobs, status, department, query, locale]);

  return (
    <div>
      <div className="flex flex-col gap-4 border border-line bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
              strokeWidth={1.7}
            />
            <label htmlFor="job-search" className="sr-only">
              {t.labels.search}
            </label>
            <input
              id="job-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={c.search}
              className="input pl-9"
            />
          </div>
          <div className="flex border border-line p-0.5" role="group" aria-label={t.labels.status}>
            {(
              [
                { id: "all", label: c.all },
                { id: "open", label: c.open },
                { id: "closed", label: c.closed },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatus(item.id)}
                aria-pressed={status === item.id}
                className={cn(
                  "px-3.5 py-1.5 text-[0.76rem] font-medium transition-colors",
                  status === item.id
                    ? "bg-brand text-white"
                    : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/60">
            {c.departments}
          </span>
          <button
            type="button"
            onClick={() => setDepartment("all")}
            className={cn(
              "border px-3 py-1.5 text-[0.72rem] transition-colors",
              department === "all"
                ? "border-brand bg-brand-050 text-brand"
                : "border-line text-muted hover:border-brand/40 hover:text-brand",
            )}
          >
            {c.all}
          </button>
          {departments.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDepartment(item)}
              className={cn(
                "border px-3 py-1.5 text-[0.72rem] transition-colors",
                department === item
                  ? "border-brand bg-brand-050 text-brand"
                  : "border-line text-muted hover:border-brand/40 hover:text-brand",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted/70">
          {filtered.length} {c.results}
        </p>
        <span className="h-px flex-1 bg-line" />
      </div>

      {filtered.length ? (
        <ul className="mt-4 divide-y divide-line border border-line bg-white">
          {filtered.map((job) => (
            <li key={job.slug}>
              <Link
                href={`/${locale}${paths.careers}/${job.slug}`}
                className={cn(
                  "group flex flex-col gap-4 p-5 transition-colors sm:p-6 lg:flex-row lg:items-center lg:justify-between",
                  job.open ? "hover:bg-brand-050/50" : "opacity-70 hover:bg-cloud",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 border px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.08em]",
                        job.open
                          ? "border-green/25 bg-green/[0.07] text-green"
                          : "border-line bg-cloud text-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          job.open ? "bg-green" : "bg-muted/50",
                        )}
                      />
                      {job.open ? c.statusOpen : c.statusClosed}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted/60">
                      {job.department[locale]}
                    </span>
                  </div>
                  <h3 className="mt-2 text-[1.02rem] font-semibold leading-snug text-ink">
                    {job.title[locale]}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 max-w-2xl text-[0.8rem] leading-relaxed text-muted">
                    {job.summary[locale]}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.72rem] text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-brand/60" strokeWidth={1.6} />
                      {job.location[locale]}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness className="size-3.5 text-brand/60" strokeWidth={1.6} />
                      {job.type[locale]}
                    </span>
                    {job.deadline ? (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-brand/60" strokeWidth={1.6} />
                        {c.deadline}: <span className="num">{formatDate(job.deadline, locale)}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.78rem] font-semibold text-brand lg:pl-6">
                  {c.view}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 border border-line bg-cloud p-6 text-sm text-muted">{c.noResults}</p>
      )}
    </div>
  );
}
