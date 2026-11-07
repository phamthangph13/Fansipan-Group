import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type {
  Application,
  Article,
  Job,
  Project,
  Service,
  SiteData,
  Submission,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(fileName: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDir, fileName), "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJson<T>(fileName: string, data: T): Promise<void> {
  const target = path.join(dataDir, fileName);
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(temp, target);
}

export const getSite = cache(async (): Promise<SiteData> => readJson<SiteData>("site.json"));

export const getServices = cache(async (): Promise<Service[]> => readJson<Service[]>("services.json"));

export const getProjects = cache(async (): Promise<Project[]> => readJson<Project[]>("projects.json"));

export const getJobs = cache(async (): Promise<Job[]> => readJson<Job[]>("jobs.json"));

export const getArticles = cache(async (): Promise<Article[]> => {
  const articles = await readJson<Article[]>("news.json");
  return articles
    .filter((article) => article.published)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export const getAllArticles = cache(async (): Promise<Article[]> => {
  const articles = await readJson<Article[]>("news.json");
  return articles.sort((a, b) => b.date.localeCompare(a.date));
});

export const getSubmissions = cache(async (): Promise<Submission[]> => {
  const items = await readJson<Submission[]>("submissions.json");
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

export const getApplications = cache(async (): Promise<Application[]> => {
  const items = await readJson<Application[]>("applications.json");
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getJob(slug: string): Promise<Job | undefined> {
  const jobs = await getJobs();
  return jobs.find((job) => job.slug === slug);
}

export async function getService(slug: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((service) => service.slug === slug);
}
