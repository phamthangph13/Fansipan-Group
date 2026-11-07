import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { getJobs } from "@/lib/content";
import { AdminEditorHeader, AdminField, LocalizedInput } from "@/components/admin/form-fields";
import { saveJob } from "@/app/admin/actions";

export const metadata = { title: "Sửa vị trí tuyển dụng" };

export default async function JobEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === "new";
  const jobs = await getJobs();
  const job = isNew ? undefined : jobs.find((item) => item.slug === slug);

  if (!isNew && !job) notFound();

  return (
    <div>
      <AdminEditorHeader
        eyebrow="Tuyển dụng"
        title={isNew ? "Thêm vị trí tuyển dụng" : "Sửa vị trí tuyển dụng"}
        description={
          isNew
            ? "Vị trí mới sẽ hiển thị trên trang tuyển dụng khi bật trạng thái đang tuyển."
            : `Đang chỉnh sửa: ${job?.title.vi}`
        }
        backHref="/admin/tuyen-dung"
        backLabel="Danh sách vị trí"
      >
        <Link href="/admin/tuyen-dung" className="btn btn-outline btn-sm">
          <ArrowLeft className="size-3.5" />
          Quay lại
        </Link>
      </AdminEditorHeader>

      <form action={saveJob} className="mt-6 grid gap-5 xl:grid-cols-12">
        {job ? <input type="hidden" name="originalSlug" value={job.slug} /> : null}
        <input type="hidden" name="slug" value={job?.slug ?? ""} />

        <div className="space-y-5 xl:col-span-8">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Thông tin vị trí</h2>
            </div>
            <div className="space-y-5 p-5">
              <LocalizedInput
                base="title"
                label="Tên vị trí"
                values={job?.title}
                required
                placeholderVi="VD: Kỹ sư cơ điện (M&E)"
                placeholderEn="VD: M&E Engineer"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <LocalizedInput
                  base="department"
                  label="Phòng ban"
                  values={job?.department}
                  placeholderVi="VD: Phòng Kỹ thuật"
                  placeholderEn="VD: Engineering Department"
                />
                <LocalizedInput
                  base="location"
                  label="Địa điểm làm việc"
                  values={job?.location}
                  placeholderVi="VD: Hà Nội / Hưng Yên"
                  placeholderEn="VD: Hanoi / Hung Yen"
                />
                <LocalizedInput
                  base="type"
                  label="Hình thức làm việc"
                  values={job?.type}
                  placeholderVi="VD: Toàn thời gian"
                  placeholderEn="VD: Full-time"
                />
                <LocalizedInput
                  base="salary"
                  label="Mức lương"
                  values={job?.salary}
                  placeholderVi="VD: Thoả thuận"
                  placeholderEn="VD: Negotiable"
                />
              </div>

              <LocalizedInput
                base="summary"
                label="Tóm tắt vị trí"
                values={job?.summary}
                textarea
                placeholderVi="Mô tả ngắn về vai trò…"
                placeholderEn="Short description of the role…"
              />
            </div>
          </section>

          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Mô tả chi tiết</h2>
            </div>
            <div className="p-5">
              <p className="text-[0.68rem] leading-relaxed text-muted/70">
                Hỗ trợ <code className="font-mono">## Tiêu đề mục</code>,{" "}
                <code className="font-mono">### Tiêu đề phụ</code>, dòng bắt đầu bằng{" "}
                <code className="font-mono">- </code> cho danh sách và{" "}
                <code className="font-mono">**chữ đậm**</code>. Cách nhau bằng một dòng trống.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="field">
                  <label htmlFor="bodyVi" className="!text-[0.7rem] !font-medium !text-muted">
                    Tiếng Việt
                  </label>
                  <textarea
                    id="bodyVi"
                    name="bodyVi"
                    defaultValue={job?.body.vi ?? ""}
                    className="textarea min-h-72 font-mono text-[0.8rem] leading-relaxed"
                    placeholder={"## Mô tả công việc\n\n- Nội dung…\n\n## Yêu cầu\n\n- Nội dung…"}
                  />
                </div>
                <div className="field">
                  <label htmlFor="bodyEn" className="!text-[0.7rem] !font-medium !text-muted">
                    English
                  </label>
                  <textarea
                    id="bodyEn"
                    name="bodyEn"
                    defaultValue={job?.body.en ?? ""}
                    className="textarea min-h-72 font-mono text-[0.8rem] leading-relaxed"
                    placeholder={"## Responsibilities\n\n- …\n\n## Requirements\n\n- …"}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 xl:col-span-4">
          <section className="border border-line bg-white">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-[0.92rem] font-semibold text-ink">Trạng thái</h2>
            </div>
            <div className="space-y-4 p-5">
              <label className="checkbox-row cursor-pointer">
                <input
                  type="checkbox"
                  name="open"
                  defaultChecked={job?.open ?? true}
                  className="accent-[var(--color-brand)]"
                />
                <span>
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <Eye className="size-3.5 text-brand" /> Đang tuyển
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Hiển thị công khai và nhận hồ sơ ứng tuyển.
                  </span>
                </span>
              </label>

              <div className="h-px bg-line" />

              <AdminField
                label="Hạn nộp hồ sơ"
                htmlFor="deadline"
                hint="Để trống nếu không đặt hạn nộp."
              >
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  defaultValue={job?.deadline ?? ""}
                  className="input font-mono text-[0.78rem]"
                />
              </AdminField>

              <AdminField
                label="Đường dẫn (slug)"
                htmlFor="slugDisplay"
                hint="Tự động tạo từ tên vị trí nếu để trống."
              >
                <input
                  id="slugDisplay"
                  value={job?.slug ?? ""}
                  readOnly
                  className="input bg-cloud font-mono text-[0.74rem] text-muted"
                  placeholder="Tự động khi lưu"
                />
              </AdminField>
            </div>
          </section>

          <button type="submit" className="btn btn-primary w-full">
            <Save className="size-4" />
            {isNew ? "Tạo vị trí" : "Lưu thay đổi"}
          </button>
          <p className="text-center text-[0.66rem] text-muted/60">
            Hồ sơ ứng tuyển gửi về mục “Hồ sơ ứng tuyển”.
          </p>
        </aside>
      </form>
    </div>
  );
}
