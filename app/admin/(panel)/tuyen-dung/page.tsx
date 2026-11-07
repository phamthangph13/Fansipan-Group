import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  Eye,
  EyeOff,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { getJobs } from "@/lib/content";
import { AdminNotice } from "@/components/admin/notice";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { deleteJob } from "@/app/admin/actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tuyển dụng" };

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const jobs = await getJobs();
  const open = jobs.filter((job) => job.open).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Tuyển dụng
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Vị trí tuyển dụng
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">
            {jobs.length} vị trí · {open} đang mở
          </p>
        </div>
        <Link href="/admin/tuyen-dung/new" className="btn btn-primary btn-sm">
          <Plus className="size-3.5" />
          Thêm vị trí
        </Link>
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      {jobs.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article key={job.slug} className="flex flex-col border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <span
                  className={
                    job.open
                      ? "inline-flex items-center gap-1 bg-green/10 px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.08em] text-green"
                      : "inline-flex items-center gap-1 bg-line/70 px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.08em] text-muted"
                  }
                >
                  {job.open ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
                  {job.open ? "Đang tuyển" : "Đã đóng"}
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/tuyen-dung/${job.slug}`}
                    aria-label={`Sửa ${job.title.vi}`}
                    className="flex size-7 items-center justify-center border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    <Pencil className="size-3" />
                  </Link>
                  <form action={deleteJob}>
                    <input type="hidden" name="slug" value={job.slug} />
                    <ConfirmSubmit
                      message={`Xoá vị trí "${job.title.vi}"? Thao tác này không thể hoàn tác.`}
                      title="Xoá vị trí"
                      className="flex size-7 items-center justify-center border border-line text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <Trash2 className="size-3" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>

              <Link
                href={`/admin/tuyen-dung/${job.slug}`}
                className="mt-3 text-[0.96rem] font-semibold leading-snug text-ink transition-colors hover:text-brand"
              >
                {job.title.vi}
              </Link>
              <p className="mt-1 text-[0.7rem] text-muted">{job.department.vi}</p>

              <p className="mt-3 line-clamp-2 text-[0.76rem] leading-relaxed text-ink-soft">
                {job.summary.vi}
              </p>

              <dl className="mt-4 grid gap-1.5 border-t border-line pt-3 font-mono text-[0.6rem] text-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3 text-brand" />
                  {job.location.vi || "Chưa cập nhật địa điểm"}
                </div>
                <div className="flex items-center gap-1.5">
                  <BriefcaseBusiness className="size-3 text-brand" />
                  {job.type.vi || "Chưa cập nhật hình thức"}
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="size-3 text-brand" />
                  {job.deadline ? `Hạn nộp ${formatDate(job.deadline, "vi")}` : "Không đặt hạn nộp"}
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-line bg-white px-6 py-16 text-center">
          <span className="mx-auto flex size-11 items-center justify-center bg-brand-050 text-brand">
            <BriefcaseBusiness className="size-5" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[0.9rem] font-semibold text-ink">Chưa có vị trí tuyển dụng.</p>
          <p className="mt-1.5 text-[0.78rem] text-muted">
            Thêm vị trí đầu tiên để nhận hồ sơ ứng viên qua website.
          </p>
          <Link href="/admin/tuyen-dung/new" className="btn btn-primary btn-sm mt-5">
            <Plus className="size-3.5" />
            Thêm vị trí
          </Link>
        </div>
      )}
    </div>
  );
}
