import { redirect } from "next/navigation";
import Image from "next/image";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Đăng nhập quản trị",
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#1b365d_0%,#124a78_55%,#005a9c_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 grid-lines-light opacity-40" aria-hidden />
        <svg
          className="pointer-events-none absolute bottom-0 right-0 h-[55%] w-[85%] opacity-20"
          viewBox="0 0 900 500"
          fill="none"
          aria-hidden
        >
          <path
            d="M0 470L120 410L230 440L360 320L470 390L590 240L700 340L810 200L900 300"
            stroke="white"
            strokeWidth="1.2"
          />
          <path
            d="M0 500L150 450L300 480L470 370L610 430L740 310L900 390"
            stroke="white"
            strokeWidth="0.8"
          />
        </svg>

        <div className="relative flex items-center gap-3">
          <Image src="/brand/mark-white.png" alt="" width={42} height={42} priority />
          <div>
            <p className="text-[0.82rem] font-semibold tracking-[0.08em]">FANSIPAN GROUP.,JSC</p>
            <p className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/45">
              M&amp;E · HVAC · Industrial services
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/45">
            Hệ thống quản trị nội dung
          </p>
          <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.12] tracking-[-0.035em]">
            Quản lý nội dung website, yêu cầu và hồ sơ ứng tuyển.
          </h1>
          <div className="mt-6 h-px w-14 bg-accent" />
          <p className="mt-5 text-[0.86rem] leading-relaxed text-white/55">
            Khu vực nội bộ dành cho người được cấp quyền. Mọi thay đổi được lưu trực tiếp vào
            nguồn nội dung của website.
          </p>
        </div>

        <p className="relative font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
          fansipan-group.vn · Internal
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <Image src="/brand/mark.png" alt="" width={48} height={48} priority />
            <span className="text-[0.8rem] font-semibold text-ink">FANSIPAN GROUP.,JSC</span>
          </div>

          <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-accent lg:mt-0">
            Khu vực quản trị
          </p>
          <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-ink">
            Đăng nhập
          </h2>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
            Nhập mật khẩu quản trị để tiếp tục. Phiên đăng nhập có hiệu lực trong 12 giờ.
          </p>

          <LoginForm />

          <p className="mt-8 border-t border-line pt-5 text-[0.7rem] leading-relaxed text-muted/65">
            Chỉ dành cho người được cấp quyền. Nếu bạn không phải quản trị viên, vui lòng quay lại{" "}
            <a href="/vi" className="font-medium text-brand underline underline-offset-2">
              website
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
