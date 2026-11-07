import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  EyeOff,
  Lock,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { getProjects, getServices } from "@/lib/content";
import { projectStatusLabels } from "@/lib/labels";
import { AdminNotice } from "@/components/admin/notice";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { deleteProject } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dự án" };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const [projects, services] = await Promise.all([getProjects(), getServices()]);
  const serviceName = new Map(services.map((service) => [service.id, service.shortTitle.vi]));
  const publicCount = projects.filter((project) => project.allowPublic).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">Dự án</p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Danh mục dự án
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">
            {projects.length} dự án · {publicCount} đang công khai ·{" "}
            {projects.filter((project) => project.featured).length} nổi bật
          </p>
        </div>
        <Link href="/admin/du-an/new" className="btn btn-primary btn-sm">
          <Plus className="size-3.5" />
          Thêm dự án
        </Link>
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <div className="mb-4 flex items-start gap-2.5 border border-amber-300/60 bg-amber-50 px-4 py-3 text-[0.74rem] leading-relaxed text-amber-900">
        <Lock className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.8} />
        <p>
          Tất cả dự án đang để <strong>không công khai</strong>. Chỉ bật công khai sau khi khách
          hàng cho phép. Hình ảnh và logo khách hàng cũng chỉ hiển thị khi đã được xác nhận.
        </p>
      </div>

      {projects.length ? (
        <div className="overflow-hidden border border-line bg-white">
          <div className="hidden grid-cols-[minmax(0,1fr)_130px_120px_90px_110px] items-center gap-4 border-b border-line bg-cloud px-5 py-2.5 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted/60 md:grid">
            <span>Dự án</span>
            <span>Lĩnh vực</span>
            <span>Trạng thái</span>
            <span>Năm</span>
            <span className="text-right">Thao tác</span>
          </div>
          <ul className="divide-y divide-line">
            {projects.map((project) => (
              <li
                key={project.id}
                className="grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,1fr)_130px_120px_90px_110px] md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/du-an/${project.id}`}
                      className="text-[0.86rem] font-semibold text-ink transition-colors hover:text-brand"
                    >
                      {project.name}
                    </Link>
                    {project.featured ? (
                      <span className="inline-flex items-center gap-1 bg-brand-050 px-1.5 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.08em] text-brand">
                        <Star className="size-2.5" /> Nổi bật
                      </span>
                    ) : null}
                    {!project.allowPublic ? (
                      <span className="inline-flex items-center gap-1 bg-line/70 px-1.5 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.08em] text-muted">
                        <EyeOff className="size-2.5" /> Ẩn
                      </span>
                    ) : (
                      <span className="bg-green/10 px-1.5 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.08em] text-green">
                        Công khai
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-[0.72rem] text-muted">
                    {project.location.vi}
                    {project.nameEn && project.nameEn !== project.name ? ` · ${project.nameEn}` : ""}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.56rem] text-muted/50">{project.id}</p>
                </div>

                <div className="flex flex-wrap gap-1 md:block">
                  {project.categories.length ? (
                    <span className="text-[0.7rem] leading-relaxed text-ink-soft">
                      {project.categories.map((category) => serviceName.get(category)).join(", ")}
                    </span>
                  ) : (
                    <span className="text-[0.68rem] text-muted/50">Chưa phân loại</span>
                  )}
                </div>

                <div>
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.08em]",
                      project.status === "completed" && "bg-green/10 text-green",
                      project.status === "in_progress" && "bg-brand-050 text-brand",
                      project.status === "planned" && "bg-line/70 text-muted",
                    )}
                  >
                    {projectStatusLabels[project.status].vi}
                  </span>
                </div>

                <span className="font-mono text-[0.68rem] text-muted">
                  {project.year ?? "—"}
                </span>

                <div className="flex items-center gap-1 md:justify-end">
                  <Link
                    href={`/admin/du-an/${project.id}`}
                    aria-label={`Sửa ${project.name}`}
                    className="flex size-8 items-center justify-center border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <ConfirmSubmit
                      message={`Xoá dự án "${project.name}"? Thao tác này không thể hoàn tác.`}
                      title="Xoá dự án"
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
            <Building2 className="size-5" strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[0.9rem] font-semibold text-ink">Chưa có dự án nào.</p>
          <p className="mt-1.5 text-[0.78rem] text-muted">
            Thêm dự án đầu tiên để bắt đầu xây dựng danh mục.
          </p>
          <Link href="/admin/du-an/new" className="btn btn-primary btn-sm mt-5">
            <Plus className="size-3.5" />
            Thêm dự án
          </Link>
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-[0.68rem] text-muted/60">
        <ArrowUpRight className="size-3.5" />
        Dự án chỉ hiển thị trên website công khai khi bật “Công khai” và có đủ nội dung.
      </p>
    </div>
  );
}
