import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceArt, type ServiceArtVariant } from "@/components/illustrations/service-art";
import { ProjectCard } from "@/components/projects/project-card";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getProjects, getService, getServices, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { buildMetadata, jsonLdScript, serviceJsonLd } from "@/lib/seo";

const copy = {
  vi: {
    role: "Vai trò của hệ thống",
    scope: "Phạm vi công việc",
    audiences: "Đối tượng & loại công trình phù hợp",
    projects: "Dự án liên quan",
    process: "Quy trình triển khai",
    consult: "Yêu cầu tư vấn",
    viewProjects: "Xem dự án tiêu biểu",
    allProjects: "Xem tất cả dự án",
    note: "Lưu ý",
    related: "dự án liên quan",
    otherServices: "Dịch vụ khác",
    contents: "Nội dung",
    contactTitle: "Trao đổi với kỹ sư",
    contactBody: "Gửi hiện trạng hoặc mục tiêu vận hành để được tư vấn phạm vi phù hợp.",
  },
  en: {
    role: "The role of the system",
    scope: "Scope of work",
    audiences: "Suitable facilities & applications",
    projects: "Related projects",
    process: "Delivery process",
    consult: "Request consultation",
    viewProjects: "View featured projects",
    allProjects: "View all projects",
    note: "Note",
    related: "related projects",
    otherServices: "Other services",
    contents: "Contents",
    contactTitle: "Talk to an engineer",
    contactBody: "Send the current situation or operating objective and we will advise on the right scope.",
  },
} as const;

export async function generateStaticParams() {
  const services = await getServices();
  return services.flatMap((service) => [
    { locale: "vi", slug: service.slug },
    { locale: "en", slug: service.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale === "en" ? "en" : "vi";
  const service = await getService(slug);
  if (!service) return {};
  return buildMetadata({
    locale: lang,
    path: `${paths.services}/${service.slug}`,
    title: service.title[lang],
    description: service.short[lang],
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [service, services, projects, site] = await Promise.all([
    getService(slug),
    getServices(),
    getProjects(),
    getSite(),
  ]);

  if (!service) notFound();

  const c = copy[locale];
  const t = ui[locale];
  const related = projects.filter((project) => project.categories.includes(service.id));
  const others = services.filter((item) => item.id !== service.id);

  const sections = [
    { id: "vai-tro", label: c.role },
    { id: "pham-vi", label: c.scope },
    { id: "doi-tuong", label: c.audiences },
    ...(related.length ? [{ id: "du-an", label: c.projects }] : []),
    { id: "quy-trinh", label: c.process },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={`${service.code} — ${service.tagline[locale]}`}
        title={service.title[locale]}
        intro={service.intro[locale]}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.services, href: `/${locale}${paths.services}` },
          { label: service.title[locale] },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary">
            {c.consult}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={`/${locale}${paths.projects}?category=${service.id}`}
            className="btn btn-outline"
          >
            {c.viewProjects}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </PageHero>

      <section className="bg-white py-14 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            {service.image ? (
              <div className="group relative aspect-[4/3] overflow-hidden border border-line bg-sky">
                <Image
                  src={service.image}
                  alt={service.title[locale]}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,53,0.4)_0%,rgba(7,26,53,0.02)_42%,rgba(7,26,53,0.72)_100%)]" />
                <span className="absolute left-4 top-4 bg-white/95 px-2.5 py-1 font-mono text-[0.64rem] tracking-[0.18em] text-brand">
                  {service.code}
                </span>
                <span className="absolute bottom-4 left-4 right-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/85">
                  {service.tagline[locale]}
                </span>
              </div>
            ) : (
              <div className="border border-line bg-[#f5f9fe] px-6 pb-6 pt-8">
                <ServiceArt variant={service.id as ServiceArtVariant} />
              </div>
            )}
            <div className="mt-5 border border-line bg-white p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/60">
                {c.related}
              </p>
              <p className="num mt-1 text-[2rem] font-semibold leading-none tracking-[-0.04em] text-ink">
                {String(related.length).padStart(2, "0")}
              </p>
              <div className="mt-5 h-px bg-line" />
              <p className="mt-4 text-[0.8rem] leading-relaxed text-muted">{service.note?.[locale]}</p>
            </div>
          </div>

          <div id="vai-tro" className="scroll-mt-28 lg:col-span-7">
            <p className="eyebrow text-brand">{c.role}</p>
            <h2 className="display-3 mt-3 text-ink">
              {locale === "vi" ? "Giá trị trong vận hành." : "Value in operation."}
            </h2>
            <ul className="mt-6 space-y-4 border-t border-line pt-6">
              {service.role.map((item, index) => (
                <li key={item[locale]} className="flex gap-4">
                  <span className="mt-0.5 font-mono text-[0.64rem] tracking-[0.12em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.9rem] leading-[1.75] text-ink-soft">{item[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cloud py-14 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/50">
                {c.contents}
              </p>
              <nav className="mt-4 border-l border-line">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block border-l-2 border-transparent px-4 py-2 text-[0.8rem] text-muted transition-colors hover:border-accent hover:text-ink"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 border border-line bg-white p-5">
                <p className="text-[0.9rem] font-semibold text-ink">{c.contactTitle}</p>
                <p className="mt-2 text-[0.76rem] leading-relaxed text-muted">{c.contactBody}</p>
                <a
                  href={`tel:${site.contact.hotline}`}
                  className="mt-4 flex items-center gap-2 text-[0.82rem] font-semibold text-brand"
                >
                  <Phone className="size-3.5" />
                  <span className="num">{site.contact.hotlineDisplay}</span>
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div id="pham-vi" className="scroll-mt-28">
              <p className="eyebrow text-brand">{c.scope}</p>
              <div className="mt-5 space-y-8">
                {service.scope.map((group) => (
                  <div key={group.title[locale]}>
                    <h3 className="text-[1.05rem] font-semibold text-ink">{group.title[locale]}</h3>
                    <ul className="mt-3 grid gap-2.5 border-t border-line pt-4 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <li
                          key={item[locale]}
                          className="flex gap-2.5 text-[0.84rem] leading-relaxed text-ink-soft"
                        >
                          <Check className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={2.2} />
                          <span>{item[locale]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div id="doi-tuong" className="mt-14 scroll-mt-28">
              <p className="eyebrow text-brand">{c.audiences}</p>
              <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
                {service.audiences.map((audience, index) => (
                  <div key={audience[locale]} className="bg-white p-5">
                    <span className="font-mono text-[0.6rem] tracking-[0.12em] text-accent/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
                      {audience[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {related.length ? (
              <div id="du-an" className="mt-14 scroll-mt-28">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow text-brand">{c.projects}</p>
                    <h2 className="display-3 mt-3 text-ink">
                      {locale === "vi" ? "Đã triển khai" : "Delivered work"}
                    </h2>
                  </div>
                  <Link
                    href={`/${locale}${paths.projects}?category=${service.id}`}
                    className="link-arrow"
                  >
                    {c.allProjects}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {related.map((project, index) => (
                    <ProjectCard key={project.id} project={project} locale={locale} index={index} />
                  ))}
                </div>
              </div>
            ) : null}

            <div id="quy-trinh" className="mt-14 scroll-mt-28">
              <p className="eyebrow text-brand">{c.process}</p>
              <div className="mt-5 border-t border-line">
                {site.process.map((step, index) => (
                  <div key={step.title[locale]} className="flex gap-4 border-b border-line py-4">
                    <span className="font-mono text-[0.66rem] tracking-[0.12em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[0.9rem] font-semibold text-ink">{step.title[locale]}</h3>
                      <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">{step.body[locale]}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-l-2 border-accent pl-4 text-[0.8rem] leading-relaxed text-muted">
                {service.note?.[locale]}
              </p>
            </div>

            <div className="mt-12 border border-line bg-white p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/50">
                {c.otherServices}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {others.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}${paths.services}/${item.slug}`}
                    className="inline-flex items-center gap-2 border border-line px-3 py-2 text-[0.76rem] text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    <span className="font-mono text-[0.58rem] text-brand">{item.code}</span>
                    {item.shortTitle[locale]}
                    <ArrowUpRight className="size-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-white py-14 lg:py-16">
        <div className="wrap flex flex-col items-start justify-between gap-6 border border-line bg-cloud p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="display-3 text-ink">{c.contactTitle}</h2>
            <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-muted">{c.contactBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.consult}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(serviceJsonLd(service, site, locale)),
        }}
      />
    </>
  );
}
