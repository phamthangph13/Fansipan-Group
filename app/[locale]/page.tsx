import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about";
import { StatsBand } from "@/components/home/stats";
import { ServicesSection } from "@/components/home/services";
import { ProcessSection } from "@/components/home/process";
import { ProjectsSection } from "@/components/home/projects";
import { CatalogueSection } from "@/components/home/catalogue";
import { NewsSection } from "@/components/home/news";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { CareersTeaser } from "@/components/home/careers";
import { ContactSection } from "@/components/home/contact";
import {
  CertificationsSection,
  FacilitiesSection,
  FaqSection,
  LeadershipSection,
  StorySection,
  TestimonialsSection,
} from "@/components/home/optional";
import { getArticles, getJobs, getProjects, getServices, getSite } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { HomeSectionId } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: "",
    title:
      lang === "vi"
        ? "Giải pháp Cơ điện, HVAC và Bảo trì hệ thống"
        : "M&E, HVAC and System Maintenance Solutions",
    description:
      lang === "vi"
        ? "Fansipan Group cung cấp giải pháp cơ điện toàn diện, HVAC, tháp giải nhiệt và bảo trì hệ thống cho nhà máy, khu công nghiệp. Tư vấn, thiết kế, thi công, vận hành."
        : "Fansipan Group delivers integrated M&E, HVAC, cooling tower and system maintenance solutions for factories and industrial parks — consultancy, design, installation and operation.",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services, projects, articles, jobs] = await Promise.all([
    getSite(),
    getServices(),
    getProjects(),
    getArticles(),
    getJobs(),
  ]);

  const renderSection = (id: HomeSectionId) => {
    switch (id) {
      case "hero":
        return <Hero key={id} locale={locale} site={site} />;
      case "about":
        return <AboutSection key={id} locale={locale} />;
      case "stats":
        return <StatsBand key={id} locale={locale} site={site} />;
      case "services":
        return <ServicesSection key={id} locale={locale} services={services} />;
      case "process":
        return <ProcessSection key={id} locale={locale} site={site} />;
      case "projects":
        return (
          <ProjectsSection
            key={id}
            locale={locale}
            projects={projects}
            services={services}
          />
        );
      case "catalogue":
        return <CatalogueSection key={id} locale={locale} site={site} />;
      case "news":
        return <NewsSection key={id} locale={locale} articles={articles} />;
      case "clients":
        return <ClientsStrip key={id} locale={locale} site={site} />;
      case "careers":
        return <CareersTeaser key={id} locale={locale} jobs={jobs} />;
      case "contact":
        return <ContactSection key={id} locale={locale} site={site} services={services} />;
      case "certifications":
        return <CertificationsSection key={id} locale={locale} />;
      case "leadership":
        return <LeadershipSection key={id} locale={locale} />;
      case "facilities":
        return <FacilitiesSection key={id} locale={locale} />;
      case "testimonials":
        return <TestimonialsSection key={id} locale={locale} />;
      case "faq":
        return <FaqSection key={id} locale={locale} site={site} />;
      case "story":
        return <StorySection key={id} locale={locale} />;
      default:
        return null;
    }
  };

  return (
    <>
      {site.homeSections
        .filter((section) => section.enabled)
        .map((section) => renderSection(section.id))}
    </>
  );
}
