import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ArticleArt } from "@/components/illustrations/article-art";
import { NewsExplorer } from "@/components/news/news-explorer";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getArticles, getSite } from "@/lib/content";
import { isLocale, paths, type Locale } from "@/lib/i18n";
import { categoryLabel } from "@/lib/labels";
import { buildMetadata } from "@/lib/seo";
import { formatDate, readingTimeLabel } from "@/lib/utils";

const copy = {
  vi: {
    eyebrow: "Tin tức & kiến thức",
    title: "Góc nhìn kỹ thuật, ghi nhận từ công trình.",
    intro:
      "Kinh nghiệm triển khai, kiến thức vận hành và những ghi nhận từ các dự án công nghiệp của Fansipan Group.",
    featured: "Bài viết nổi bật",
    all: "Tất cả bài viết",
    articles: "bài viết",
    topics: "Chủ đề",
    read: "Đọc bài viết",
    ctaTitle: "Cần trao đổi về một hệ thống cụ thể?",
    ctaBody:
      "Đội ngũ kỹ thuật sẵn sàng trao đổi về hiện trạng, phạm vi công việc và phương án phù hợp với công trình của bạn.",
    cta: "Liên hệ đội ngũ kỹ thuật",
  },
  en: {
    eyebrow: "News & insights",
    title: "Engineering perspective, notes from site.",
    intro:
      "Delivery experience, operational knowledge and notes from Fansipan Group's industrial projects.",
    featured: "Featured article",
    all: "All articles",
    articles: "articles",
    topics: "Topics",
    read: "Read the article",
    ctaTitle: "Need to discuss a specific system?",
    ctaBody:
      "Our engineering team is ready to discuss the current situation, scope of work and a suitable approach for your facility.",
    cta: "Contact our engineering team",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: paths.news,
    title: lang === "vi" ? "Tin tức & kiến thức" : "News & insights",
    description:
      lang === "vi"
        ? "Tin tức, kiến thức kỹ thuật và ghi nhận từ các dự án cơ điện, HVAC, tháp giải nhiệt và bảo trì hệ thống của Fansipan Group."
        : "News, technical knowledge and project notes on M&E, HVAC, cooling towers and system maintenance from Fansipan Group.",
  });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [articles, site] = await Promise.all([getArticles(), getSite()]);
  const c = copy[locale];
  const featured = articles[0];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: locale === "vi" ? "Trang chủ" : "Home", href: `/${locale}` },
          { label: c.eyebrow },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-5 text-[0.74rem] text-muted">
          <span>
            <span className="num text-[1.15rem] font-semibold text-ink">
              {String(articles.length).padStart(2, "0")}
            </span>{" "}
            {c.articles}
          </span>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-muted/70">
            {c.topics}: {["Dự án", "Dịch vụ", "Kiến thức", "Tin tức"].join(" · ")}
          </span>
        </div>
      </PageHero>

      {featured ? (
        <section className="bg-white py-12 lg:py-16">
          <div className="wrap">
            <p className="eyebrow text-brand">{c.featured}</p>
            <Link
              href={`/${locale}${paths.news}/${featured.slug}`}
              className="group mt-5 grid overflow-hidden border border-line bg-white transition-all duration-300 hover:border-brand/35 hover:shadow-[0_30px_70px_-40px_rgba(7,24,44,0.35)] lg:grid-cols-2"
            >
              <div className="relative min-h-[240px] overflow-hidden border-b border-line bg-sky lg:min-h-[340px] lg:border-b-0 lg:border-r">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title[locale]}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <ArticleArt
                    category={featured.category}
                    className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}
                <span className="absolute left-5 top-5 border border-brand/15 bg-white/95 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-brand">
                  {categoryLabel(featured.category, locale)}
                </span>
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-muted/70">
                    <span>{formatDate(featured.date, locale)}</span>
                    <span className="h-3 w-px bg-line" />
                    <span>{readingTimeLabel(featured.readingMinutes, locale)}</span>
                  </div>
                  <h2 className="mt-4 max-w-2xl text-[1.45rem] font-semibold leading-[1.25] tracking-[-0.025em] text-ink sm:text-[1.7rem]">
                    {featured.title[locale]}
                  </h2>
                  <p className="mt-4 max-w-xl text-[0.88rem] leading-[1.75] text-muted">
                    {featured.excerpt[locale]}
                  </p>
                </div>
                <span className="mt-7 inline-flex items-center gap-2 border-t border-line pt-5 text-[0.8rem] font-semibold text-brand">
                  {c.read}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="border-t border-line bg-cloud py-12 lg:py-16">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-brand">{c.all}</p>
              <h2 className="display-3 mt-3 text-ink">
                {locale === "vi" ? "Bài viết theo chủ đề." : "Articles by topic."}
              </h2>
            </div>
            <Link href={`/${locale}${paths.contact}`} className="link-arrow">
              {locale === "vi" ? "Gửi câu hỏi" : "Ask a question"}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8">
            <NewsExplorer locale={locale} articles={articles} />
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-white py-14 lg:py-16">
        <div className="wrap flex flex-col items-start justify-between gap-6 border border-line bg-cloud p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="display-3 text-ink">{c.ctaTitle}</h2>
            <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-muted">{c.ctaBody}</p>
          </div>
          <Link href={`/${locale}${paths.contact}#quote`} className="btn btn-primary shrink-0">
            {c.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
