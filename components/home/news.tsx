import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/news/article-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { paths, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Tin tức & kiến thức",
    title: "Góc nhìn từ công trường và phòng kỹ thuật.",
    all: "Xem tất cả tin tức",
  },
  en: {
    eyebrow: "News & insights",
    title: "Perspectives from site and engineering.",
    all: "View all news",
  },
} as const;

export function NewsSection({ locale, articles }: { locale: Locale; articles: Article[] }) {
  const c = copy[locale];

  return (
    <section id="tin-tuc" className="bg-white py-14 lg:py-20">
      <div className="wrap">
        <SectionHeading
          index="06"
          eyebrow={c.eyebrow}
          title={c.title}
          action={
            <Link href={`/${locale}${paths.news}`} className="link-arrow">
              {c.all}
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <Reveal key={article.slug} delay={index * 90}>
              <ArticleCard article={article} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
