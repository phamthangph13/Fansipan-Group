import type { ArticleCategory, Localized, ProjectStatus } from "./types";
import type { Locale } from "./i18n";

export const articleCategoryLabels: Record<ArticleCategory, Localized> = {
  "du-an": { vi: "Dự án", en: "Projects" },
  "dich-vu": { vi: "Dịch vụ", en: "Services" },
  "kien-thuc": { vi: "Kiến thức", en: "Knowledge" },
  "tin-tuc": { vi: "Tin tức", en: "News" },
};

export const articleCategories = Object.keys(articleCategoryLabels) as ArticleCategory[];

export const projectStatusLabels: Record<ProjectStatus, Localized> = {
  completed: { vi: "Hoàn thành", en: "Completed" },
  in_progress: { vi: "Đang thực hiện", en: "In progress" },
  planned: { vi: "Dự kiến", en: "Planned" },
};

export function categoryLabel(category: ArticleCategory, locale: Locale) {
  return articleCategoryLabels[category][locale];
}
