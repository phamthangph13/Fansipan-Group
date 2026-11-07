import type { MetadataRoute } from "next";
import { getArticles, getJobs, getServices } from "@/lib/content";
import { paths } from "@/lib/i18n";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://fansipan-group.vn").replace(/\/$/, "");
const locales = ["vi", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, articles, jobs] = await Promise.all([
    getServices(),
    getArticles(),
    getJobs(),
  ]);

  const staticPaths = [
    paths.home,
    paths.about,
    paths.services,
    paths.projects,
    paths.news,
    paths.profile,
    paths.careers,
    paths.contact,
    paths.privacy,
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === paths.home ? "weekly" : "monthly",
        priority: path === paths.home ? 1 : path === paths.news || path === paths.projects ? 0.8 : 0.7,
      });
    }

    for (const service of services) {
      entries.push({
        url: `${BASE}/${locale}${paths.services}/${service.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const article of articles) {
      entries.push({
        url: `${BASE}/${locale}${paths.news}/${article.slug}`,
        lastModified: new Date(`${article.date}T00:00:00`),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }

    for (const job of jobs.filter((item) => item.open)) {
      entries.push({
        url: `${BASE}/${locale}${paths.careers}/${job.slug}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
