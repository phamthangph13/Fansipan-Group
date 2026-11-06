import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { RichText } from "@/components/content/rich-text";
import { ApplicationForm } from "@/components/forms/application-form";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getJob, getJobs, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata, jobJsonLd, jsonLdScript } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

const copy = {
  vi: {
    about: "Mô tả công việc",
    apply: "Gửi ứng tuyển",
    applyIntro:
      "Điền thông tin bên dưới và đính kèm CV. Hồ sơ được gửi trực tiếp đến bộ phận tuyển dụng của Fansipan Group.",
    closedTitle: "Vị trí này đã đóng.",
    closedBody:
      "Bạn vẫn có thể gửi CV cho các đợt tuyển dụng tiếp theo qua email tuyển dụng của Fansipan Group.",
    closedCta: "Gửi CV qua email",
    otherJobs: "Vị trí khác",
    allJobs: "Xem tất cả vị trí",
    jobInfo: "Thông tin vị trí",
    salary: "Thu nhập",
    type: "Hình thức",
    location: "Địa điểm",
    department: "Bộ phận",
    deadline: "Hạn nộp",
    status: "Trạng thái",
    open: "Đang nhận hồ sơ",
    closed: "Đã đóng",
    note: "Thông tin tuyển dụng có thể thay đổi theo kế hoạch nhân sự của công ty.",
  },
  en: {
    about: "Job description",
    apply: "Apply now",
    applyIntro:
      "Complete the form below and attach your CV. Your application goes directly to the Fansipan Group recruitment team.",
    closedTitle: "This position is closed.",
    closedBody:
      "You can still send your CV for future recruitment rounds via the Fansipan Group recruitment email.",
    closedCta: "Email your CV",
    otherJobs: "Other positions",
    allJobs: "View all positions",
    jobInfo: "Position details",
    salary: "Salary",
    type: "Employment type",
    location: "Location",
    department: "Department",
    deadline: "Deadline",
    status: "Status",
    open: "Accepting applications",
    closed: "Closed",
    note: "Recruitment information may change in line with the company's hiring plan.",
  },
} as const;

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.flatMap((job) => [
    { locale: "vi", slug: job.slug },
    { locale: "en", slug: job.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang: Locale = locale === "en" ? "en" : "vi";
  const job = await getJob(slug);
  if (!job) return {};
  return buildMetadata({
    locale: lang,
    path: `${paths.careers}/${job.slug}`,
    title: job.title[lang],
    description: job.summary[lang],
  });
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [job, jobs, site] = await Promise.all([getJob(slug), getJobs(), getSite()]);
  if (!job) notFound();

  const c = copy[locale];
  const t = ui[locale];
  const others = jobs.filter((item) => item.slug !== job.slug && item.open).slice(0, 3);
  const mailHref = `mailto:${site.contact.careersEmail}?subject=${encodeURIComponent(
    `${locale === "vi" ? "Ứng tuyển" : "Application"}: ${job.title[locale]}`,
  )}`;

  const facts = [
    { label: c.department, value: job.department[locale] },
    { label: c.location, value: job.location[locale] },
    { label: c.type, value: job.type[locale] },
    { label: c.salary, value: job.salary[locale] },
    ...(job.deadline
      ? [{ label: c.deadline, value: formatDate(job.deadline, locale) }]
      : []),
  ];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={`${job.department[locale]} — ${job.open ? c.open : c.closed}`}
        title={job.title[locale]}
        intro={job.summary[locale]}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.careers, href: `/${locale}${paths.careers}` },
          { label: job.title[locale] },
        ]}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {facts.map((fact) => (
              <span
                key={fact.label}
                className="inline-flex items-center gap-2 border border-line bg-white px-3 py-1.5 text-[0.72rem] text-ink-soft"
              >
                <span className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted/60">
                  {fact.label}
                </span>
                {fact.value}
              </span>
            ))}
          </div>
          <Link
            href={`/${locale}${paths.careers}`}
            className="inline-flex shrink-0 items-center gap-1.5 text-[0.76rem] font-medium text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            {t.actions.backToCareers}
          </Link>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 xl:col-span-8">
            <p className="eyebrow text-brand">{c.about}</p>
            <h2 className="display-3 mt-3 text-ink">{job.title[locale]}</h2>
            <div className="mt-6 border-t border-line pt-6">
              <RichText content={job.body[locale]} />
            </div>

            <div className="mt-10 border border-line bg-cloud p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/60">
                {c.note}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.8rem]">
                <a
                  href={`tel:${site.contact.hotline}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-brand"
                >
                  <span className="num">{site.contact.hotlineDisplay}</span>
                </a>
                <a href={mailHref} className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
                  {site.contact.careersEmail}
                </a>
              </div>
            </div>

            {others.length ? (
              <div className="mt-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <p className="eyebrow text-brand">{c.otherJobs}</p>
                  <Link href={`/${locale}${paths.careers}`} className="link-arrow">
                    {c.allJobs}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
                <ul className="mt-4 divide-y divide-line border border-line">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/${locale}${paths.careers}/${item.slug}`}
                        className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-cloud"
                      >
                        <span>
                          <span className="block text-[0.9rem] font-semibold text-ink">
                            {item.title[locale]}
                          </span>
                          <span className="mt-0.5 block text-[0.72rem] text-muted">
                            {item.department[locale]} · {item.location[locale]}
                          </span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-muted/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside id="apply" className="scroll-mt-28 lg:col-span-5 xl:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-32">
              <div className="border border-line bg-cloud p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/60">
                  {c.jobInfo}
                </p>
                <dl className="mt-4 divide-y divide-line border-t border-line">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex items-start justify-between gap-4 py-2.5">
                      <dt className="text-[0.74rem] text-muted">{fact.label}</dt>
                      <dd className="text-right text-[0.78rem] font-medium text-ink">{fact.value}</dd>
                    </div>
                  ))}
                  <div className="flex items-start justify-between gap-4 py-2.5">
                    <dt className="text-[0.74rem] text-muted">{c.status}</dt>
                    <dd
                      className={
                        job.open
                          ? "text-right text-[0.78rem] font-medium text-green"
                          : "text-right text-[0.78rem] font-medium text-accent"
                      }
                    >
                      {job.open ? c.open : c.closed}
                    </dd>
                  </div>
                </dl>
              </div>

              {job.open ? (
                <ApplicationForm
                  locale={locale}
                  jobSlug={job.slug}
                  jobTitle={job.title[locale]}
                />
              ) : (
                <div className="border border-line bg-white p-6">
                  <p className="text-[1.05rem] font-semibold text-ink">{c.closedTitle}</p>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">{c.closedBody}</p>
                  <a href={mailHref} className="btn btn-outline btn-sm mt-5">
                    {c.closedCta}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      {job.open ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jobJsonLd(job, locale)) }}
        />
      ) : null}
    </>
  );
}
