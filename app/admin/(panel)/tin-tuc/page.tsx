import Link from "next/link";
import {
  CalendarDays,
  Eye,
  EyeOff,
  FileText,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { getAllArticles } from "@/lib/content";
import { articleCategoryLabels } from "@/lib/labels";
import { AdminNotice } from "@/components/admin/notice";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { deleteArticle } from "@/app/admin/actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tin tức" };

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const articles = await getAllArticles();
  const published = articles.filter((article) => article.published).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">Tin tức</p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Bài viết &amp; kiến thức
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">
            {articles.length} bài viết · {published} đã xuất bản · {articles.length - published} bản
            nháp
          </p>
        </div>
        <Link href="/admin/tin-tuc/new" className="btn btn-primary btn-sm">
          <Plus className="size-3.5" />
          Viết bài mới
        </Link>
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      {articles.length ? (
        <div className="overflow-hidden border border-line bg-white">
          <div className="hidden grid-cols-[minmax(0,1fr)_110px_120px_90px_100px] items-center gap-4 border-b border-line bg-cloud px-5 py-2.5 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted/60 md:grid">
            <span>Tiêu đề</span>
            <span>Chuyên mục</span>
            <span>Ngày đăng</span>
            <span>Trạng thái</span>
            <span className="text-right">Thao tác</span>
          </div>
          <ul className="divide-y divide-line">
            {articles.map((article) => (
              <li
                key={article.slug}
                className="grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,1fr)_110px_120px_90px_100px] md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/tin-tuc/${article.slug}`}
                    className="line-clamp-2 text-[0.86rem] font-semibold leading-snug text-ink transition-colors hover:text-brand"
                  >
                    {article.title.vi}
                  </Link>
                  <p className="mt-1 truncate text-[0.7rem] text-muted">{article.title.en}</p>
                  <p className="mt-0.5 font-mono text-[0.56rem] text-muted/50">{article.slug}</p>
                </div>

                <span className="w-fit bg-brand-050 px-2 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.08em] text-brand">
                  {articleCategoryLabels[article.category].vi}
                </span>

                <span className="flex items-center gap-1.5 font-mono text-[0.64rem] text-muted">
                  <CalendarDays className="size-3" />
                  {formatDate(article.date, "vi")}
                </span>

                <div>
                  {article.published ? (
                    <span className="inline-flex items-center gap-1 bg-green/10 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.08em] text-green">
                      <Eye className="size-2.5" /> Xuất bản
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-line/70 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.08em] text-muted">
                      <EyeOff className="size-2.5" /> Nháp
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 md:justify-end">
                  <Link
                    href={`/admin/tin-tuc/${article.slug}`}
                    aria-label={`Sửa ${article.title.vi}`}
                    className="flex size-8 items-center justify-center border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <form action={deleteArticle}>
                    <input type="hidden" name="slug" value={article.slug} />
                    <ConfirmSubmit
                      message={`Xoá bài viết "${article.title.vi}"? Thao tác này không thể hoàn tác.`}
                      title="Xoá bài viết"
                      className="flex size-8 items-center justify-center border border-line text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <Trash2 className="size-3.5" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="border border-line bg-white px-6 py-16 text-center">
          <span className="mx-auto flex size-11 items-center justify-center bg-brand-050 text-brand">
            <Newspaper className="size-5" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[0.9rem] font-semibold text-ink">Chưa có bài viết nào.</p>
          <p className="mt-1.5 text-[0.78rem] text-muted">
            Viết bài đầu tiên để chia sẻ kiến thức và cập nhật dự án.
          </p>
          <Link href="/admin/tin-tuc/new" className="btn btn-primary btn-sm mt-5">
            <Plus className="size-3.5" />
            Viết bài mới
          </Link>
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-[0.68rem] text-muted/60">
        <FileText className="size-3.5" />
        Bài viết ở trạng thái nháp chỉ hiển thị trong khu vực quản trị.
      </p>
    </div>
  );
}
