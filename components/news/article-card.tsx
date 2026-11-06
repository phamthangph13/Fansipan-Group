import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleArt } from "@/components/illustrations/article-art";
import { categoryLabel } from "@/lib/labels";
import { paths, ui, type Locale } from "@/lib/i18n";
import { formatDate, readingTimeLabel } from "@/lib/utils";
import type { Article } from "@/lib/types";

export function ArticleCard({
  article,
  locale,
  featured = false,
}: {
  article: Article;
  locale: Locale;
  featured?: boolean;
}) {
  const t = ui[locale];

  return (
    <Link
      href={`/${locale}${paths.news}/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_28px_60px_-34px_rgba(7,24,44,0.35)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-sky">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title[locale]}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ArticleArt
            category={article.category}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute left-4 top-4 border border-brand/15 bg-white/95 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-brand backdrop-blur">
          {categoryLabel(article.category, locale)}
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink/40">
          {readingTimeLabel(article.readingMinutes, locale)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.13em] text-muted/70">
          {formatDate(article.date, locale)}
        </p>
        <h3
          className={
            featured
              ? "mt-3 text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-ink"
              : "mt-3 text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-ink"
          }
        >
          {article.title[locale]}
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.8rem] leading-[1.7] text-muted">
          {article.excerpt[locale]}
        </p>
        <span className="mt-auto flex items-center gap-1.5 border-t border-line pt-4 text-[0.76rem] font-semibold text-brand">
          {t.actions.readMore}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
