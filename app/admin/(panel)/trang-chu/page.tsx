import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, Lock, Power } from "lucide-react";
import { getSite } from "@/lib/content";
import { AdminNotice } from "@/components/admin/notice";
import { moveHomeSection, toggleHomeSection } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata = { title: "Trang chủ" };

const fixedSections = new Set(["hero", "contact"]);

export default async function HomeSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const site = await getSite();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Bố cục trang chủ
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Bật/tắt &amp; sắp xếp phần nội dung
          </h1>
          <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-relaxed text-muted">
            Thứ tự bên dưới là thứ tự hiển thị trên trang chủ. Các phần không bật sẽ không được
            render và không ảnh hưởng đến phần còn lại.
          </p>
        </div>
        <Link href="/vi#top" target="_blank" className="btn btn-outline btn-sm">
          Xem trang chủ
          <ExternalLink className="size-3.5" />
        </Link>
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <section className="border border-line bg-white xl:col-span-8">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
            <h2 className="text-[0.92rem] font-semibold text-ink">Các phần trên trang chủ</h2>
            <span className="font-mono text-[0.6rem] text-muted/60">
              {site.homeSections.filter((section) => section.enabled).length} /{" "}
              {site.homeSections.length} đang bật
            </span>
          </div>

          <ol className="divide-y divide-line">
            {site.homeSections.map((section, index) => {
              const locked = fixedSections.has(section.id);
              return (
                <li
                  key={section.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5",
                    section.enabled ? "bg-white" : "bg-cloud/60",
                  )}
                >
                  <span className="w-6 shrink-0 font-mono text-[0.6rem] text-muted/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center",
                      section.enabled ? "bg-brand-050 text-brand" : "bg-line/60 text-muted",
                    )}
                  >
                    <Power className="size-3.5" strokeWidth={1.8} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[0.84rem] font-medium text-ink">
                      {section.label.vi}
                      {locked ? (
                        <span className="inline-flex items-center gap-1 border border-line px-1.5 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.08em] text-muted">
                          <Lock className="size-2.5" /> Bắt buộc
                        </span>
                      ) : null}
                      {!section.enabled ? (
                        <span className="bg-line px-1.5 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.08em] text-muted">
                          Đang tắt
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-[0.66rem] text-muted/70">{section.label.en}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <form action={moveHomeSection}>
                      <input type="hidden" name="id" value={section.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label={`Chuyển ${section.label.vi} lên`}
                        className="flex size-8 items-center justify-center border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                    </form>
                    <form action={moveHomeSection}>
                      <input type="hidden" name="id" value={section.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === site.homeSections.length - 1}
                        aria-label={`Chuyển ${section.label.vi} xuống`}
                        className="flex size-8 items-center justify-center border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                    </form>

                    <form action={toggleHomeSection}>
                      <input type="hidden" name="id" value={section.id} />
                      <button
                        type="submit"
                        className={cn(
                          "ml-1 h-7 w-12 border text-[0.55rem] font-mono uppercase tracking-[0.08em] transition-colors",
                          section.enabled
                            ? "border-brand bg-brand text-white hover:bg-brand-600"
                            : "border-line bg-white text-muted hover:border-brand/40 hover:text-brand",
                        )}
                        aria-pressed={section.enabled}
                      >
                        {section.enabled ? "Bật" : "Tắt"}
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="space-y-4 xl:col-span-4">
          <div className="border border-line bg-white p-5">
            <h2 className="text-[0.9rem] font-semibold text-ink">Cách hoạt động</h2>
            <ul className="mt-3 space-y-3 text-[0.76rem] leading-relaxed text-muted">
              <li className="flex gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                Dùng mũi tên để đổi thứ tự. Thay đổi được lưu ngay và áp dụng cho cả hai ngôn ngữ.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                Nút Bật/Tắt chỉ ẩn phần khỏi trang chủ, nội dung gốc vẫn được giữ nguyên.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                Các phần tuỳ chọn như chứng chỉ, ban lãnh đạo, cảm nhận khách hàng… đang tắt cho
                đến khi có thông tin được xác nhận.
              </li>
            </ul>
          </div>

          <div className="border border-line bg-navy p-5 text-white">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/40">
              Thứ tự hiện tại
            </p>
            <p className="mt-2 text-[0.8rem] leading-relaxed text-white/70">
              {site.homeSections
                .filter((section) => section.enabled)
                .map((section) => section.label.vi)
                .join(" → ")}
            </p>
            <div className="mt-4 h-px bg-white/10" />
            <p className="mt-3 text-[0.68rem] leading-relaxed text-white/45">
              Khuyến nghị giữ phần Liên hệ ở cuối trang chủ và phần Khách hàng &amp; đối tác ngay
              trước đó.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
