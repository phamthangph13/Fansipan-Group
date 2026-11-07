import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  BriefcaseBusiness,
  FileText,
  Inbox,
  Layers,
  Newspaper,
  Users,
} from "lucide-react";
import {
  getAllArticles,
  getApplications,
  getJobs,
  getProjects,
  getSite,
  getSubmissions,
} from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tổng quan" };

function StatCard({
  label,
  value,
  note,
  href,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  note: string;
  href: string;
  icon: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <Link
      href={href}
      className="group border border-line bg-white p-4 transition-all hover:border-brand/35 hover:shadow-[0_20px_50px_-35px_rgba(7,24,44,0.35)] sm:p-5"
    >
      <div className="flex items-start justify-between">
        <span
          className={
            tone === "accent"
              ? "flex size-8 items-center justify-center bg-accent/[0.07] text-accent"
              : "flex size-8 items-center justify-center bg-brand-050 text-brand"
          }
        >
          {icon}
        </span>
        <ArrowUpRight className="size-4 text-muted/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
      </div>
      <p className="mt-4 text-[1.7rem] font-semibold leading-none tracking-[-0.04em] text-ink">
        {value}
      </p>
      <p className="mt-1.5 text-[0.78rem] font-medium text-ink-soft">{label}</p>
      <p className="mt-0.5 text-[0.68rem] text-muted">{note}</p>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [submissions, applications, projects, articles, jobs, site] = await Promise.all([
    getSubmissions(),
    getApplications(),
    getProjects(),
    getAllArticles(),
    getJobs(),
    getSite(),
  ]);

  const unreadSubmissions = submissions.filter((item) => !item.read);
  const unreadApplications = applications.filter((item) => !item.read);
  const publicProjects = projects.filter((item) => item.allowPublic);
  const publishedArticles = articles.filter((item) => item.published);
  const openJobs = jobs.filter((item) => item.open);
  const enabledSections = site.homeSections.filter((section) => section.enabled);
  const today = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
            Bảng điều khiển
          </p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Tổng quan nội dung
          </h1>
          <p className="mt-1.5 text-[0.8rem] text-muted">{today}</p>
        </div>
        <Link href="/vi" target="_blank" className="btn btn-outline btn-sm">
          Mở website
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Yêu cầu báo giá"
          value={submissions.length}
          note={`${unreadSubmissions.length} chưa đọc`}
          href="/admin/yeu-cau"
          icon={<Inbox className="size-4" strokeWidth={1.7} />}
          tone={unreadSubmissions.length ? "accent" : "default"}
        />
        <StatCard
          label="Hồ sơ ứng tuyển"
          value={applications.length}
          note={`${unreadApplications.length} chưa đọc`}
          href="/admin/ung-tuyen"
          icon={<Users className="size-4" strokeWidth={1.7} />}
          tone={unreadApplications.length ? "accent" : "default"}
        />
        <StatCard
          label="Dự án"
          value={projects.length}
          note={`${publicProjects.length} đang công khai`}
          href="/admin/du-an"
          icon={<Building2 className="size-4" strokeWidth={1.7} />}
        />
        <StatCard
          label="Bài viết"
          value={articles.length}
          note={`${publishedArticles.length} đã xuất bản`}
          href="/admin/tin-tuc"
          icon={<Newspaper className="size-4" strokeWidth={1.7} />}
        />
        <StatCard
          label="Vị trí tuyển dụng"
          value={jobs.length}
          note={`${openJobs.length} đang mở`}
          href="/admin/tuyen-dung"
          icon={<BriefcaseBusiness className="size-4" strokeWidth={1.7} />}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-12">
        <section className="border border-line bg-white xl:col-span-7">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-[0.95rem] font-semibold text-ink">Yêu cầu mới nhất</h2>
              <p className="mt-0.5 text-[0.7rem] text-muted">5 yêu cầu gần đây từ form báo giá.</p>
            </div>
            <Link href="/admin/yeu-cau" className="link-arrow text-[0.72rem]">
              Xem tất cả
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {submissions.length ? (
            <ul className="divide-y divide-line">
              {submissions.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    href="/admin/yeu-cau"
                    className="flex items-start justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-cloud"
                  >
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-[0.82rem] font-medium text-ink">
                        {item.name}
                        {!item.read ? (
                          <span className="bg-accent px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-white">
                            Mới
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 truncate text-[0.72rem] text-muted">
                        {item.need} · {item.phone}
                      </p>
                    </div>
                    <span className="shrink-0 text-right font-mono text-[0.58rem] text-muted/60">
                      {formatDate(item.createdAt.slice(0, 10), "vi")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-[0.78rem] text-muted">
              Chưa có yêu cầu nào.
            </p>
          )}
        </section>

        <section className="border border-line bg-white xl:col-span-5">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-[0.95rem] font-semibold text-ink">Hồ sơ mới nhất</h2>
              <p className="mt-0.5 text-[0.7rem] text-muted">Ứng viên gửi qua website.</p>
            </div>
            <Link href="/admin/ung-tuyen" className="link-arrow text-[0.72rem]">
              Xem tất cả
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {applications.length ? (
            <ul className="divide-y divide-line">
              {applications.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    href="/admin/ung-tuyen"
                    className="flex items-start justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-cloud"
                  >
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-[0.82rem] font-medium text-ink">
                        {item.name}
                        {!item.read ? (
                          <span className="bg-accent px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-white">
                            Mới
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 truncate text-[0.7rem] text-muted">{item.jobTitle}</p>
                    </div>
                    <span className="shrink-0 text-right font-mono text-[0.58rem] text-muted/60">
                      {formatDate(item.createdAt.slice(0, 10), "vi")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-[0.78rem] text-muted">
              Chưa có hồ sơ nào.
            </p>
          )}
        </section>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/trang-chu"
          className="group flex items-start gap-4 border border-line bg-white p-5 transition-colors hover:border-brand/35"
        >
          <span className="flex size-9 shrink-0 items-center justify-center bg-brand-050 text-brand">
            <Layers className="size-4" strokeWidth={1.7} />
          </span>
          <span>
            <span className="block text-[0.86rem] font-semibold text-ink">Bố cục trang chủ</span>
            <span className="mt-1 block text-[0.74rem] leading-relaxed text-muted">
              {enabledSections.length} / {site.homeSections.length} phần đang bật. Bật/tắt và sắp
              xếp thứ tự hiển thị.
            </span>
          </span>
          <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>

        <Link
          href="/admin/cai-dat"
          className="group flex items-start gap-4 border border-line bg-white p-5 transition-colors hover:border-brand/35"
        >
          <span className="flex size-9 shrink-0 items-center justify-center bg-brand-050 text-brand">
            <FileText className="size-4" strokeWidth={1.7} />
          </span>
          <span>
            <span className="block text-[0.86rem] font-semibold text-ink">Thông tin & hồ sơ</span>
            <span className="mt-1 block text-[0.74rem] leading-relaxed text-muted">
              Liên hệ, văn phòng, số liệu năng lực, catalogue và cấu hình hiển thị khách hàng.
            </span>
          </span>
          <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>

        <div className="border border-line bg-navy p-5 text-white">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/40">
            Tình trạng nội dung
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="num text-[1.4rem] font-semibold leading-none">
                {publishedArticles.length}/{articles.length}
              </p>
              <p className="mt-1 text-[0.68rem] text-white/50">Bài viết xuất bản</p>
            </div>
            <div>
              <p className="num text-[1.4rem] font-semibold leading-none">
                {openJobs.length}/{jobs.length}
              </p>
              <p className="mt-1 text-[0.68rem] text-white/50">Vị trí đang mở</p>
            </div>
          </div>
          <div className="mt-4 h-px bg-white/10" />
          <p className="mt-3 text-[0.68rem] leading-relaxed text-white/45">
            Dự án công khai: {publicProjects.length}/{projects.length}. Hình ảnh và logo chỉ hiển thị
            khi được xác nhận.
          </p>
        </div>
      </div>
    </div>
  );
}
