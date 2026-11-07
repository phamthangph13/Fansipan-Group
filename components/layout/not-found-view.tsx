import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/lib/i18n";

const copy = {
  vi: {
    code: "Lỗi 404",
    title: "Không tìm thấy trang",
    body: "Đường dẫn có thể đã thay đổi, bị xoá hoặc không tồn tại. Bạn có thể quay về trang chủ hoặc tiếp tục xem các dự án và dịch vụ của Fansipan Group.",
    home: "Về trang chủ",
    projects: "Xem dự án",
    contact: "Liên hệ",
    hint: "Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ hotline để được hỗ trợ.",
  },
  en: {
    code: "Error 404",
    title: "Page not found",
    body: "The link may have changed, been removed or never existed. You can return to the homepage or continue exploring Fansipan Group's projects and services.",
    home: "Back to home",
    projects: "View projects",
    contact: "Contact us",
    hint: "If you believe this is a mistake, please contact our hotline for assistance.",
  },
} as const;

export function NotFoundView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <section className="relative isolate overflow-hidden bg-navy px-5 py-24 text-white sm:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines-light opacity-40" aria-hidden />
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-full text-white/[0.08]"
        viewBox="0 0 1440 320"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 280L180 210L330 250L520 120L690 220L860 90L1040 200L1210 140L1440 260V320H0Z" fill="currentColor" />
        <path d="M0 320L220 260L420 300L620 220L820 290L1020 210L1220 280L1440 230" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      <div className="wrap relative">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/45">
            <Compass className="size-4" />
            {c.code}
          </p>
          <p className="mt-8 font-mono text-[6rem] font-medium leading-none tracking-[-0.06em] text-white/15 sm:text-[8rem]">
            404
          </p>
          <h1 className="mt-2 text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[2.8rem]">
            {c.title}
          </h1>
          <p className="mt-4 max-w-lg text-[0.9rem] leading-relaxed text-white/55">{c.body}</p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href={`/${locale}`} className="btn btn-light">
              <ArrowLeft className="size-4" />
              {c.home}
            </Link>
            <Link href={`/${locale}/du-an`} className="btn btn-outline-light">
              {c.projects}
              <ArrowRight className="size-4" />
            </Link>
            <Link href={`/${locale}/lien-he`} className="btn btn-outline-light">
              {c.contact}
            </Link>
          </div>

          <p className="mt-8 border-t border-white/10 pt-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/35">
            {ui[locale].labels.hotline} · 0913 339 190
          </p>
        </div>
      </div>
    </section>
  );
}
