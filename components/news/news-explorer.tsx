"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/news/article-card";
import { articleCategories, categoryLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { ui, type Locale } from "@/lib/i18n";
import type { Article, ArticleCategory } from "@/lib/types";

export function NewsExplorer({
  locale,
  articles,
}: {
  locale: Locale;
  articles: Article[];
}) {
  const [active, setActive] = useState<"all" | ArticleCategory>("all");
  const filtered = useMemo(
    () =>
      active === "all" ? articles : articles.filter((article) => article.category === active),
    [active, articles],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            onClick={() => setActive("all")}
            className={cn(
              "inline-flex items-center gap-2 border px-4 py-2 text-[0.78rem] font-medium transition-colors",
              active === "all"
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand",
            )}
          >
            {ui[locale].labels.all}
            <span className="font-mono text-[0.64rem] opacity-60">
              {String(articles.length).padStart(2, "0")}
            </span>
          </button>
          {articleCategories.map((category) => {
            const count = articles.filter((article) => article.category === category).length;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active === category}
                onClick={() => setActive(category)}
                className={cn(
                  "inline-flex items-center gap-2 border px-4 py-2 text-[0.78rem] font-medium transition-colors",
                  active === category
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand",
                )}
              >
                {categoryLabel(category, locale)}
                <span className="font-mono text-[0.64rem] opacity-60">
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted/60">
          {filtered.length} {locale === "vi" ? "bài viết" : "articles"}
        </p>
      </div>

      {filtered.length ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-line bg-cloud p-6 text-sm text-muted">
          {ui[locale].labels.noResults}
        </p>
      )}
    </div>
  );
}
