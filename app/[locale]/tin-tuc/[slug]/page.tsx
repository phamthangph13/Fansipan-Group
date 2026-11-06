import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Facebook, Linkedin } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ArticleArt } from "@/components/illustrations/article-art";
import { ArticleCard } from "@/components/news/article-card";
import { RichText } from "@/components/content/rich-text";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getArticle, getArticles, getSite } from "@/lib/content";
import { isLocale, paths, ui, type Locale } from "@/lib/i18n";
import { categoryLabel } from "@/lib/labels";
import { articleJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/utils";

const copy = {
  vi: {
    back: "Về trang tin tức",
    share: "Chia sẻ bài viết",
    related: "Bài viết liên quan",
    ctaTitle: "Cần tư vấn cho công trình của bạn?",
    ctaBody:
      "Gửi hiện trạng hoặc mục tiêu vận hành, đội ngũ kỹ thuật Fansipan Group sẽ phản hồi với hướng trao đổi phù hợp.",
    cta: "Yêu cầu tư vấn",
    author: "Fansipan Group",
    authorRole: "Đội ngũ kỹ thuật",
  },
  en: {
    back: "Back to news",
    share: "Share this article",
    related: "Related articles",
    ctaTitle: "Need advice for your facility?",
    ctaBody:
      "Send the current situation or operating objective and the Fansipan Group engineering team will respond with a suitable next step.",
    cta: "Request consultation",
    author: "Fansipan Group",
    authorRole: "Engineering team",
  },
} as const;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.flatMap((article) => [
    { locale: "vi", slug: article.slug },
    { locale: "en", slug: article.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang: Locale = locale === "en" ? "en" : "vi";
  const article = await getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    locale: lang,
    path: `${paths.news}/${article.slug}`,
    title: article.title[lang],
    description: article.excerpt[lang],
    type: "article",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [article, articles, site] = await Promise.all([
    getArticle(slug),
    getArticles(),
    getSite(),
  ]);

  if (!article) notFound();

  const c = copy[locale];
  const t = ui[locale];
  const related = [
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category === article.category,
    ),
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category !== article.category,
    ),
  ].slice(0, 3);
  const url = absoluteUrl(`/${locale}${paths.news}/${article.slug}`);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={`${categoryLabel(article.category, locale)} — ${formatDate(article.date, locale)}`}
        title={article.title[locale]}
        intro={article.excerpt[locale]}
        breadcrumb={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.news, href: `/${locale}${paths.news}` },
          { label: article.title[locale] },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[0.64rem] uppercase tracking-[0.13em] text-muted/70">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" strokeWidth={1.7} />
            {article.readingMinutes} {locale === "vi" ? "phút đọc" : "min read"}
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <Link
            href={`/${locale}${paths.news}`}
            className="inline-flex items-center gap-1.5 text-brand transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-3.5" />
            {c.back}
          </Link>
        </div>
      </PageHero>

      <article className="bg-white py-12 lg:py-16">
        <div className="wrap">
          <div className="relative aspect-[21/9] overflow-hidden border border-line bg-sky">
            <ArticleArt category={article.category} className="absolute inset-0 h-full w-full" />
            <span className="absolute left-5 top-5 border border-brand/15 bg-white/95 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-brand">
              {categoryLabel(article.category, locale)}
            </span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <RichText content={article.body[locale]} />

              <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center bg-navy font-mono text-[0.7rem] font-semibold text-white">
                    FSG
                  </span>
                  <div>
                    <p className="text-[0.82rem] font-semibold text-ink">{c.author}</p>
                    <p className="text-[0.7rem] text-muted">{c.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/60">
                    {c.share}
                  </span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Facebook"
                    className="flex size-8 items-center justify-center border border-line text-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    <Facebook className="size-3.5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="LinkedIn"
                    className="flex size-8 items-center justify-center border border-line text-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    <Linkedin className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-32 space-y-5">
                <div className="border border-line bg-cloud p-6">
                  <p className="eyebrow text-brand">{t.nav.services}</p>
                  <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">
                    {locale === "vi"
                      ? "Xem phạm vi công việc và quy trình triển khai cho từng lĩnh vực."
                      : "Review the scope of work and delivery process for each discipline."}
                  </p>
                  <Link
                    href={`/${locale}${paths.services}`}
                    className="link-arrow mt-4"
                  >
                    {t.actions.viewService}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="border border-line bg-navy p-6 text-white">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/45">
                    {site.company.displayName}
                  </p>
                  <p className="mt-3 font-serif text-[1.2rem] italic leading-snug text-white/85">
                    “{site.company.slogan[locale]}”
                  </p>
                  <div className="mt-5 h-px bg-white/10" />
                  <Link
                    href={`/${locale}${paths.contact}#quote`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white"
                  >
                    {t.actions.contactConsult}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="border-t border-line bg-cloud py-14 lg:py-20">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-brand">{c.related}</p>
                <h2 className="display-3 mt-3 text-ink">
                  {locale === "vi" ? "Đọc tiếp." : "Continue reading."}
                </h2>
              </div>
              <Link href={`/${locale}${paths.news}`} className="link-arrow">
                {t.actions.allNews}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(article, locale)) }}
      />
    </>
  );
}
