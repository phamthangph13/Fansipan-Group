import type { Metadata } from "next";
import type { Article, Job, Service, SiteData } from "./types";
import type { Locale } from "./i18n";
import { absoluteUrl } from "./utils";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://fansipan-group.vn").replace(/\/$/, "");
const OG_IMAGE = "/images/og-cover.jpg";

export function buildMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${BASE}/${locale}${path}`;
  const image = `${BASE}${OG_IMAGE}`;
  const alt = `${title} — FANSIPAN GROUP`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        vi: `${BASE}/vi${path}`,
        en: `${BASE}/en${path}`,
        "x-default": `${BASE}/vi${path}`,
      },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: "FANSIPAN GROUP",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: locale === "vi" ? "en_US" : "vi_VN",
      images: [{ url: image, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd(site: SiteData) {
  const socials = Object.values(site.social).filter(Boolean);
  const organization = {
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: site.company.displayName,
    legalName: site.company.legalName.vi,
    alternateName: site.company.shortName,
    url: BASE,
    logo: `${BASE}/brand/icon.png`,
    image: `${BASE}${OG_IMAGE}`,
    slogan: site.company.slogan.vi,
    email: site.contact.email,
    telephone: `+84${site.contact.hotline.replace(/^0/, "")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.offices[0]?.address.vi,
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
    areaServed: ["Hà Nội", "Hưng Yên", "Hải Phòng", "Thanh Hóa", "Bắc Ninh", "Thái Nguyên", "Phú Thọ"],
    knowsAbout: [
      "Cơ điện công trình (M&E)",
      "Hệ thống điều hòa không khí và làm lạnh (HVAC)",
      "Tháp giải nhiệt và thiết bị công nghiệp",
      "Bảo trì hệ thống kỹ thuật",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+84${site.contact.hotline.replace(/^0/, "")}`,
        email: site.contact.email,
        availableLanguage: ["Vietnamese", "English"],
      },
    ],
    ...(socials.length ? { sameAs: socials } : {}),
  };

  const locations = site.offices.map((office) => ({
    "@type": "LocalBusiness",
    "@id": `${BASE}/#${office.id}`,
    name: `${site.company.shortName} — ${office.name.vi}`,
    parentOrganization: { "@id": `${BASE}/#organization` },
    telephone: `+84${site.contact.hotline.replace(/^0/, "")}`,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.address.vi,
      addressCountry: "VN",
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      ...locations,
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: site.company.displayName,
        publisher: { "@id": `${BASE}/#organization` },
        inLanguage: ["vi", "en"],
      },
    ],
  };
}

export function serviceJsonLd(service: Service, site: SiteData, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title[locale],
    description: service.short[locale],
    serviceType: service.title[locale],
    provider: {
      "@type": "Organization",
      name: site.company.displayName,
      url: BASE,
    },
    areaServed: ["Hà Nội", "Hưng Yên", "Hải Phòng", "Thanh Hóa"],
    url: `${BASE}/${locale}/dich-vu/${service.slug}`,
  };
}

export function articleJsonLd(article: Article, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[locale],
    description: article.excerpt[locale],
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: locale,
    author: { "@type": "Organization", name: "FANSIPAN GROUP" },
    publisher: {
      "@type": "Organization",
      name: "FANSIPAN GROUP",
      logo: { "@type": "ImageObject", url: `${BASE}/brand/icon.png` },
    },
    image: `${BASE}${OG_IMAGE}`,
    mainEntityOfPage: `${BASE}/${locale}/tin-tuc/${article.slug}`,
  };
}

export function jobJsonLd(job: Job, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title[locale],
    description: job.body[locale],
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Fansipan Group",
      sameAs: BASE,
      logo: `${BASE}/brand/icon.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location[locale],
        addressCountry: "VN",
      },
    },
    ...(job.deadline ? { validThrough: job.deadline } : {}),
    directApply: true,
    url: `${BASE}/${locale}/tuyen-dung/${job.slug}`,
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
