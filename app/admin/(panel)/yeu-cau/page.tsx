import Link from "next/link";
import {
  Building2,
  CheckCheck,
  ChevronDown,
  Mail,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import { getSubmissions } from "@/lib/content";
import { AdminNotice } from "@/components/admin/notice";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import {
  deleteSubmission,
  markAllSubmissionsRead,
  toggleSubmissionRead,
} from "@/app/admin/actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Yêu cầu báo giá" };

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[]; q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const all = await getSubmissions();
  const items = query
    ? all.filter((item) =>
        [item.name, item.phone, item.email, item.company, item.need]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : all;
  const unread = all.filter((item) => !item.read).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Yêu cầu báo giá
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Hộp thư yêu cầu
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">
            {all.length} yêu cầu · {unread} chưa đọc
          </p>
        </div>
        {unread > 0 ? (
          <form action={markAllSubmissionsRead}>
            <button type="submit" className="btn btn-outline btn-sm">
              <CheckCheck className="size-3.5" />
              Đánh dấu tất cả đã đọc
            </button>
          </form>
        ) : null}
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <form action="/admin/yeu-cau" className="flex flex-col gap-2 border border-line bg-white p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
            strokeWidth={1.7}
          />
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Tìm theo tên, điện thoại, email, công ty…"
            className="input pl-9"
          />
        </div>
        <button type="submit" className="btn btn-dark btn-sm">
          Tìm kiếm
        </button>
        {query ? (
          <Link href="/admin/yeu-cau" className="btn btn-outline btn-sm">
            Xoá lọc
          </Link>
        ) : null}
      </form>

      <div className="mt-4 space-y-2.5">
        {items.length ? (
          items.map((item, index) => (
            <details
              key={item.id}
              open={index === 0 && !item.read}
              className="group border border-line bg-white open:border-brand/25"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-start justify-between gap-4 p-4 marker:hidden sm:p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={
                      item.read
                        ? "mt-1.5 size-2 shrink-0 rounded-full bg-line"
                        : "mt-1.5 size-2 shrink-0 rounded-full bg-accent"
                    }
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-[0.9rem] font-semibold text-ink">
                      {item.name}
                      {!item.read ? (
                        <span className="bg-accent px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-white">
                          Mới
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-[0.75rem] text-muted">
                      {item.need}
                      {item.company ? ` · ${item.company}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.62rem] text-muted/70">
                      <span>{item.id}</span>
                      <span>{formatDate(item.createdAt.slice(0, 10), "vi")}</span>
                      <span>{item.locale.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown className="mt-1 size-4 shrink-0 text-muted/40 transition-transform group-open:rotate-180" />
              </summary>

              <div className="border-t border-line px-4 pb-5 pt-4 sm:px-5">
                <div className="grid gap-5 md:grid-cols-12">
                  <div className="md:col-span-8">
                    <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted/55">
                      Nội dung yêu cầu
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-[0.84rem] leading-[1.75] text-ink-soft">
                      {item.message}
                    </p>
                  </div>

                  <div className="md:col-span-4">
                    <div className="space-y-2 border border-line bg-cloud p-4">
                      <a
                        href={`tel:${item.phone}`}
                        className="flex items-center gap-2 text-[0.78rem] font-medium text-ink hover:text-brand"
                      >
                        <Phone className="size-3.5 text-brand" />
                        {item.phone}
                      </a>
                      <a
                        href={`mailto:${item.email}`}
                        className="flex items-center gap-2 break-all text-[0.76rem] text-ink-soft hover:text-brand"
                      >
                        <Mail className="size-3.5 shrink-0 text-brand" />
                        {item.email}
                      </a>
                      {item.company ? (
                        <p className="flex items-center gap-2 text-[0.76rem] text-muted">
                          <Building2 className="size-3.5 shrink-0 text-brand" />
                          {item.company}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <form action={toggleSubmissionRead}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="btn btn-outline btn-sm">
                      <CheckCheck className="size-3.5" />
                      {item.read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                    </button>
                  </form>
                  <a href={`mailto:${item.email}`} className="btn btn-outline btn-sm">
                    <Mail className="size-3.5" />
                    Trả lời email
                  </a>
                  <form action={deleteSubmission} className="sm:ml-auto">
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit
                      message={`Xoá yêu cầu ${item.id} của ${item.name}? Thao tác này không thể hoàn tác.`}
                      className="btn btn-outline btn-sm border-accent/25 text-accent hover:border-accent hover:bg-accent/[0.04]"
                    >
                      <Trash2 className="size-3.5" />
                      Xoá yêu cầu
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </details>
          ))
        ) : (
          <div className="border border-line bg-white px-6 py-14 text-center">
            <p className="text-[0.9rem] font-semibold text-ink">Không có yêu cầu phù hợp.</p>
            <p className="mt-1.5 text-[0.78rem] text-muted">
              {query ? "Thử từ khoá khác hoặc xoá bộ lọc." : "Yêu cầu mới sẽ xuất hiện tại đây."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
