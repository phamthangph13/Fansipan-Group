import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, EyeOff, Save, Star } from "lucide-react";
import { getProjects, getServices } from "@/lib/content";
import { projectStatusLabels } from "@/lib/labels";
import { AdminField, AdminEditorHeader, LocalizedInput } from "@/components/admin/form-fields";
import { saveProject } from "@/app/admin/actions";

export const metadata = { title: "Sửa dự án" };

const statuses = ["completed", "in_progress", "planned"] as const;

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const [projects, services] = await Promise.all([getProjects(), getServices()]);
  const project = isNew ? undefined : projects.find((item) => item.id === id);

  if (!isNew && !project) notFound();

  return (
    <div>
      <AdminEditorHeader
        eyebrow="Dự án"
        title={isNew ? "Thêm dự án" : "Sửa dự án"}
        description={
          isNew
            ? "Tạo bản ghi dự án mới. Tên và phạm vi công việc là các trường bắt buộc."
            : `Đang chỉnh sửa: ${project?.name}`
        }
        backHref="/admin/du-an"
        backLabel="Danh mục dự án"
      >
        <Link href="/admin/du-an" className="btn btn-outline btn-sm">
          <ArrowLeft className="size-3.5" />
          Quay lại
        </Link>
      </AdminEditorHeader>

      <form action={saveProject} className="mt-6 grid gap-5 xl:grid-cols-12">
        {project ? <input type="hidden" name="originalId" value={project.id} /> : null}
        <input type="hidden" name="id" value={project?.id ?? ""} />

        <div className="space-y-5 xl:col-span-8">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Thông tin dự án</h2>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Tên dự án (VI)" htmlFor="name" required>
                  <input
                    id="name"
                    name="name"
                    defaultValue={project?.name ?? ""}
                    required
                    className="input"
                    placeholder="VD: Nhà máy ABC — Hệ thống chiller"
                  />
                </AdminField>
                <AdminField
                  label="Tên dự án (EN)"
                  htmlFor="nameEn"
                  hint="Để trống sẽ dùng tên tiếng Việt."
                >
                  <input
                    id="nameEn"
                    name="nameEn"
                    defaultValue={project?.nameEn ?? ""}
                    className="input"
                    placeholder="VD: ABC Factory — Chiller system"
                  />
                </AdminField>
              </div>

              <LocalizedInput
                base="scope"
                label="Phạm vi công việc"
                values={project?.scope}
                required
                textarea
                placeholderVi="Mô tả ngắn gọn hạng mục đã thực hiện…"
                placeholderEn="Brief description of the scope delivered…"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <LocalizedInput
                  base="location"
                  label="Địa điểm"
                  values={project?.location}
                  placeholderVi="VD: KCN Thăng Long, Hà Nội"
                  placeholderEn="VD: Thang Long IP, Hanoi"
                />
                <div className="grid gap-4">
                  <AdminField label="Năm thực hiện" htmlFor="year" hint="Để trống nếu chưa xác nhận.">
                    <input
                      id="year"
                      name="year"
                      type="number"
                      min={1990}
                      max={2100}
                      defaultValue={project?.year ?? ""}
                      className="input"
                      placeholder="VD: 2024"
                    />
                  </AdminField>
                  <AdminField label="Trạng thái" htmlFor="status">
                    <select
                      id="status"
                      name="status"
                      defaultValue={project?.status ?? "completed"}
                      className="select"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {projectStatusLabels[status].vi}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                </div>
              </div>

              <fieldset>
                <legend className="field-label">Lĩnh vực</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className="flex cursor-pointer items-start gap-2.5 border border-line px-3 py-2.5 text-[0.78rem] text-ink-soft transition-colors hover:border-brand/35"
                    >
                      <input
                        type="checkbox"
                        name={`category_${service.id}`}
                        defaultChecked={project?.categories.includes(service.id) ?? false}
                        className="mt-0.5 size-4 accent-[var(--color-brand)]"
                      />
                      <span>
                        <span className="block font-medium text-ink">{service.shortTitle.vi}</span>
                        <span className="mt-0.5 block font-mono text-[0.56rem] uppercase tracking-[0.1em] text-muted/60">
                          {service.code} · {service.shortTitle.en}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Hình ảnh &amp; logo</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <AdminField
                label="Ảnh dự án"
                htmlFor="image"
                hint="Đường dẫn trong /public, ví dụ /images/projects/abc.jpg. Để trống nếu chưa có ảnh được duyệt."
              >
                <input
                  id="image"
                  name="image"
                  defaultValue={project?.image ?? ""}
                  className="input font-mono text-[0.78rem]"
                  placeholder="/images/projects/…"
                />
              </AdminField>
              <AdminField
                label="Logo khách hàng"
                htmlFor="clientLogo"
                hint="Chỉ nhập khi khách hàng đã cho phép hiển thị logo."
              >
                <input
                  id="clientLogo"
                  name="clientLogo"
                  defaultValue={project?.clientLogo ?? ""}
                  className="input font-mono text-[0.78rem]"
                  placeholder="/images/clients/…"
                />
              </AdminField>
            </div>
          </section>
        </div>

        <aside className="space-y-5 xl:col-span-4">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Hiển thị</h2>
            </div>
            <div className="space-y-3 p-5">
              <label className="checkbox-row cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={project?.featured ?? false}
                  className="accent-[var(--color-brand)]"
                />
                <span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Star className="size-3.5 text-brand" /> Dự án nổi bật
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Ưu tiên hiển thị trong phần dự án tiêu biểu trên trang chủ.
                  </span>
                </span>
              </label>

              <div className="h-px bg-line" />

              <label className="checkbox-row cursor-pointer">
                <input
                  type="checkbox"
                  name="allowPublic"
                  defaultChecked={project?.allowPublic ?? false}
                  className="accent-[var(--color-brand)]"
                />
                <span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <EyeOff className="size-3.5 text-accent" /> Công khai trên website
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Mặc định tắt. Chỉ bật khi đã có xác nhận từ khách hàng.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <section className="border border-line bg-navy p-5 text-white">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-white/50" />
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/40">
                Lưu ý nội dung
              </p>
            </div>
            <p className="mt-3 text-[0.72rem] leading-relaxed text-white/50">
              Không đưa thông tin chi tiết, dữ liệu nội bộ hoặc nội dung nhạy cảm của khách hàng
              vào phần mô tả. Chỉ mô tả phạm vi công việc ở mức tổng quát.
            </p>
          </section>

          <button type="submit" className="btn btn-primary w-full">
            <Save className="size-4" />
            {isNew ? "Tạo dự án" : "Lưu thay đổi"}
          </button>
          <p className="text-center text-[0.66rem] text-muted/60">
            Thay đổi được lưu trực tiếp vào nguồn dữ liệu của website.
          </p>
        </aside>
      </form>
    </div>
  );
}
