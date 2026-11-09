"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  clearSessionCookie,
  requireAdmin,
  setSessionCookie,
} from "@/lib/auth";
import {
  getAllArticles,
  getApplications,
  getJobs,
  getProjects,
  getSite,
  getSubmissions,
  writeJson,
} from "@/lib/content";
import { deleteCv } from "@/lib/storage";
import type {
  Application,
  Article,
  ArticleCategory,
  Job,
  Project,
  ProjectStatus,
  ServiceId,
  SiteData,
  Submission,
} from "@/lib/types";

/* ------------------------------------------------------------------ Helpers */

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function localized(formData: FormData, base: string) {
  return {
    vi: value(formData, `${base}Vi`),
    en: value(formData, `${base}En`),
  };
}

function checked(formData: FormData, key: string) {
  const raw = formData.get(key);
  return raw === "on" || raw === "true" || raw === "1";
}

function slugify(input: string) {
  const base = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `item-${Date.now().toString(36)}`;
}

function numberOrNull(formData: FormData, key: string) {
  const raw = value(formData, key);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

const serviceIds: ServiceId[] = ["hvac", "me", "cooling", "maintenance"];
const projectStatuses: ProjectStatus[] = ["completed", "in_progress", "planned"];
const articleCategories: ArticleCategory[] = [
  "du-an",
  "dich-vu",
  "kien-thuc",
  "tin-tuc",
  "hoat-dong-noi-bo",
];

function refreshPublic() {
  revalidatePath("/", "layout");
}

/* -------------------------------------------------------------------- Auth */

export async function loginAction(
  _previous: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const password = value(formData, "password");
  if (!password) return { error: "Vui lòng nhập mật khẩu." };
  if (!checkPassword(password)) return { error: "Mật khẩu không đúng. Vui lòng thử lại." };
  await setSessionCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* ------------------------------------------------------------- Submissions */

export async function toggleSubmissionRead(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const items = await getSubmissions();
  const next: Submission[] = items.map((item) =>
    item.id === id ? { ...item, read: !item.read } : item,
  );
  await writeJson("submissions.json", next);
  revalidatePath("/admin/yeu-cau");
  revalidatePath("/admin");
}

export async function markAllSubmissionsRead() {
  await requireAdmin();
  const items = await getSubmissions();
  await writeJson(
    "submissions.json",
    items.map((item) => ({ ...item, read: true })),
  );
  revalidatePath("/admin/yeu-cau");
  revalidatePath("/admin");
}

export async function deleteSubmission(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const items = await getSubmissions();
  await writeJson(
    "submissions.json",
    items.filter((item) => item.id !== id),
  );
  revalidatePath("/admin/yeu-cau");
  revalidatePath("/admin");
  redirect("/admin/yeu-cau?ok=deleted");
}

/* -------------------------------------------------------------- Applications */

export async function toggleApplicationRead(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const items = await getApplications();
  const next: Application[] = items.map((item) =>
    item.id === id ? { ...item, read: !item.read } : item,
  );
  await writeJson("applications.json", next);
  revalidatePath("/admin/ung-tuyen");
  revalidatePath("/admin");
}

export async function markAllApplicationsRead() {
  await requireAdmin();
  const items = await getApplications();
  await writeJson(
    "applications.json",
    items.map((item) => ({ ...item, read: true })),
  );
  revalidatePath("/admin/ung-tuyen");
  revalidatePath("/admin");
}

export async function deleteApplication(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const items = await getApplications();
  const target = items.find((item) => item.id === id);
  if (target) await deleteCv(target.cvFile);
  await writeJson(
    "applications.json",
    items.filter((item) => item.id !== id),
  );
  revalidatePath("/admin/ung-tuyen");
  revalidatePath("/admin");
  redirect("/admin/ung-tuyen?ok=deleted");
}

/* ------------------------------------------------------------ Home sections */

export async function toggleHomeSection(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const site = await getSite();
  const next: SiteData = {
    ...site,
    homeSections: site.homeSections.map((section) =>
      section.id === id ? { ...section, enabled: !section.enabled } : section,
    ),
  };
  await writeJson("site.json", next);
  revalidatePath("/admin/trang-chu");
  refreshPublic();
}

export async function moveHomeSection(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const direction = value(formData, "direction");
  const site = await getSite();
  const sections = [...site.homeSections];
  const index = sections.findIndex((section) => section.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index >= 0 && target >= 0 && target < sections.length) {
    [sections[index], sections[target]] = [sections[target], sections[index]];
  }
  await writeJson("site.json", { ...site, homeSections: sections });
  revalidatePath("/admin/trang-chu");
  refreshPublic();
}

/* ------------------------------------------------------------------ Projects */

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const originalId = value(formData, "originalId");
  const name = value(formData, "name");
  const nameEn = value(formData, "nameEn") || name;
  if (!name) redirect("/admin/du-an?error=missing-name");

  const projects = await getProjects();
  let id = value(formData, "id") || slugify(nameEn || name);
  if (!originalId && projects.some((item) => item.id === id)) {
    id = `${id}-${Date.now().toString(36).slice(-4)}`;
  }

  const statusRaw = value(formData, "status") as ProjectStatus;
  const status = projectStatuses.includes(statusRaw) ? statusRaw : "completed";
  const categories = serviceIds.filter((serviceId) =>
    checked(formData, `category_${serviceId}`),
  );

  const project: Project = {
    id,
    name,
    nameEn,
    scope: localized(formData, "scope"),
    location: localized(formData, "location"),
    year: numberOrNull(formData, "year"),
    status,
    categories,
    featured: checked(formData, "featured"),
    allowPublic: checked(formData, "allowPublic"),
    image: value(formData, "image") || null,
    clientLogo: value(formData, "clientLogo") || null,
  };

  const next = originalId
    ? projects.map((item) => (item.id === originalId ? project : item))
    : [project, ...projects];

  await writeJson("projects.json", next);
  revalidatePath("/admin/du-an");
  refreshPublic();
  redirect("/admin/du-an?ok=saved");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const projects = await getProjects();
  await writeJson(
    "projects.json",
    projects.filter((item) => item.id !== id),
  );
  revalidatePath("/admin/du-an");
  refreshPublic();
  redirect("/admin/du-an?ok=deleted");
}

/* ---------------------------------------------------------------------- News */

export async function saveArticle(formData: FormData) {
  await requireAdmin();
  const originalSlug = value(formData, "originalSlug");
  const title = localized(formData, "title");
  if (!title.vi) redirect("/admin/tin-tuc?error=missing-title");

  const articles = await getAllArticles();
  let slug = value(formData, "slug") || slugify(title.vi);
  if (!originalSlug && articles.some((item) => item.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const categoryRaw = value(formData, "category") as ArticleCategory;
  const category = articleCategories.includes(categoryRaw) ? categoryRaw : "tin-tuc";
  const readingMinutes = Math.min(
    120,
    Math.max(1, Number(value(formData, "readingMinutes")) || 5),
  );

  const article: Article = {
    slug,
    category,
    title,
    excerpt: localized(formData, "excerpt"),
    body: localized(formData, "body"),
    date: value(formData, "date") || new Date().toISOString().slice(0, 10),
    readingMinutes,
    published: checked(formData, "published"),
    image: value(formData, "image") || null,
  };

  const next = originalSlug
    ? articles.map((item) => (item.slug === originalSlug ? article : item))
    : [article, ...articles];

  await writeJson("news.json", next);
  revalidatePath("/admin/tin-tuc");
  refreshPublic();
  redirect("/admin/tin-tuc?ok=saved");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const slug = value(formData, "slug");
  const articles = await getAllArticles();
  await writeJson(
    "news.json",
    articles.filter((item) => item.slug !== slug),
  );
  revalidatePath("/admin/tin-tuc");
  refreshPublic();
  redirect("/admin/tin-tuc?ok=deleted");
}

/* ---------------------------------------------------------------------- Jobs */

export async function saveJob(formData: FormData) {
  await requireAdmin();
  const originalSlug = value(formData, "originalSlug");
  const title = localized(formData, "title");
  if (!title.vi) redirect("/admin/tuyen-dung?error=missing-title");

  const jobs = await getJobs();
  let slug = value(formData, "slug") || slugify(title.vi);
  if (!originalSlug && jobs.some((item) => item.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const deadline = value(formData, "deadline");
  const job: Job = {
    slug,
    title,
    department: localized(formData, "department"),
    location: localized(formData, "location"),
    type: localized(formData, "type"),
    salary: localized(formData, "salary"),
    deadline: deadline || null,
    open: checked(formData, "open"),
    summary: localized(formData, "summary"),
    body: localized(formData, "body"),
  };

  const next = originalSlug
    ? jobs.map((item) => (item.slug === originalSlug ? job : item))
    : [job, ...jobs];

  await writeJson("jobs.json", next);
  revalidatePath("/admin/tuyen-dung");
  refreshPublic();
  redirect("/admin/tuyen-dung?ok=saved");
}

export async function deleteJob(formData: FormData) {
  await requireAdmin();
  const slug = value(formData, "slug");
  const jobs = await getJobs();
  await writeJson(
    "jobs.json",
    jobs.filter((item) => item.slug !== slug),
  );
  revalidatePath("/admin/tuyen-dung");
  refreshPublic();
  redirect("/admin/tuyen-dung?ok=deleted");
}

/* ------------------------------------------------------------------ Settings */

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const site = await getSite();

  const next: SiteData = {
    ...site,
    company: {
      ...site.company,
      displayName: value(formData, "displayName") || site.company.displayName,
      legalName: localized(formData, "legalName"),
      shortName: value(formData, "shortName") || site.company.shortName,
      slogan: localized(formData, "slogan"),
      taxCode: value(formData, "taxCode"),
      domain: value(formData, "domain"),
      foundedYear: numberOrNull(formData, "foundedYear"),
    },
    contact: {
      hotline: value(formData, "hotline"),
      hotlineDisplay: value(formData, "hotlineDisplay"),
      phone: value(formData, "phone"),
      phoneDisplay: value(formData, "phoneDisplay"),
      email: value(formData, "email"),
      careersEmail: value(formData, "careersEmail"),
      zalo: value(formData, "zalo"),
      workingHours: value(formData, "workingHours"),
    },
    social: {
      facebook: value(formData, "facebook"),
      youtube: value(formData, "youtube"),
      linkedin: value(formData, "linkedin"),
      zalo: value(formData, "socialZalo"),
    },
    offices: site.offices.map((office, index) => ({
      ...office,
      name: {
        vi: value(formData, `officeNameVi${index}`) || office.name.vi,
        en: value(formData, `officeNameEn${index}`) || office.name.en,
      },
      address: {
        vi: value(formData, `officeAddressVi${index}`) || office.address.vi,
        en: value(formData, `officeAddressEn${index}`) || office.address.en,
      },
      mapUrl: value(formData, `officeMapUrl${index}`) || office.mapUrl,
      mapEmbed: value(formData, `officeMapEmbed${index}`) || office.mapEmbed,
    })),
    stats: site.stats.map((stat, index) => ({
      value: numberOrNull(formData, `statValue${index}`) ?? stat.value,
      label: {
        vi: value(formData, `statLabelVi${index}`) || stat.label.vi,
        en: value(formData, `statLabelEn${index}`) || stat.label.en,
      },
    })),
    catalogue: {
      pdf: value(formData, "cataloguePdf") || site.catalogue.pdf,
      title: localized(formData, "catalogueTitle"),
      subtitle: localized(formData, "catalogueSubtitle"),
      note: localized(formData, "catalogueNote"),
    },
    clients: {
      ...site.clients,
      showLogos: checked(formData, "showLogos"),
      note: localized(formData, "clientsNote"),
    },
  };

  await writeJson("site.json", next);
  revalidatePath("/admin/cai-dat");
  refreshPublic();
  redirect("/admin/cai-dat?ok=saved");
}
