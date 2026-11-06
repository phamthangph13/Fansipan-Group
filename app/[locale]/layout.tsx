import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";
import { getProjects, getServices, getSite } from "@/lib/content";
import { isLocale, ui, type Locale } from "@/lib/i18n";
import { jsonLdScript, organizationJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang: Locale = locale === "en" ? "en" : "vi";
  const site = await getSite();
  return {
    alternates: {
      languages: {
        vi: "/vi",
        en: "/en",
        "x-default": "/vi",
      },
    },
    icons: {
      icon: [{ url: "/brand/icon.png", type: "image/png", sizes: "512x512" }],
      apple: [{ url: "/brand/apple-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      siteName: "FANSIPAN GROUP",
      locale: lang === "vi" ? "vi_VN" : "en_US",
      alternateLocale: lang === "vi" ? "en_US" : "vi_VN",
      images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630 }],
    },
    other: {
      "format-detection": "telephone=yes",
      "business:contact_data:street_address": site.offices[0]?.address[lang] ?? "",
      "business:contact_data:locality": lang === "vi" ? "Hà Nội" : "Hanoi",
      "business:contact_data:country_name": "Vietnam",
      "business:contact_data:email": site.contact.email,
      "business:contact_data:phone_number": site.contact.hotline,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services, projects] = await Promise.all([
    getSite(),
    getServices(),
    getProjects(),
  ]);
  const t = ui[locale];

  return (
    <>
      <a href="#main" className="skip-link">
        {locale === "vi" ? "Chuyển đến nội dung chính" : "Skip to main content"}
      </a>
      <Header locale={locale} site={site} services={services} projects={projects} />
      <main id="main" className="pt-[76px] lg:pt-[108px]">
        {children}
      </main>
      <Footer locale={locale} site={site} />
      <FloatingContact site={site} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd(site)) }}
      />
      <span className="sr-only">{t.labels.contactInfo}</span>
    </>
  );
}
