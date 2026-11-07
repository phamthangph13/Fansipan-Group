import Link from "next/link";
import Image from "next/image";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/nav";
import { logoutAction } from "@/app/admin/actions";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-cloud">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-[linear-gradient(180deg,#071a35,#0a2346)] lg:flex">
        <Link href="/admin" className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <Image src="/brand/mark-white.png" alt="" width={34} height={34} />
          <span>
            <span className="block text-[0.76rem] font-semibold tracking-[0.06em] text-white">
              FANSIPAN GROUP
            </span>
            <span className="mt-0.5 block font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/35">
              Quản trị nội dung
            </span>
          </span>
        </Link>

        <AdminNav />

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2">
            <ShieldCheck className="size-3.5 text-green" strokeWidth={1.7} />
            <span className="text-[0.7rem] text-white/60">Quản trị viên</span>
          </div>
          <Link
            href="/vi"
            target="_blank"
            className="mt-2 flex items-center gap-2 px-1 py-1.5 text-[0.7rem] text-white/45 transition-colors hover:text-white"
          >
            <ExternalLink className="size-3.5" />
            Xem website
          </Link>
          <form action={logoutAction} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-1 py-1.5 text-left text-[0.7rem] text-white/45 transition-colors hover:text-white"
            >
              <LogOut className="size-3.5" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4 lg:h-16 lg:px-8">
            <Link href="/admin" className="flex items-center gap-2.5 lg:hidden">
              <Image src="/brand/mark.png" alt="" width={30} height={30} />
              <span className="text-[0.74rem] font-semibold text-ink">FANSIPAN GROUP</span>
            </Link>
            <div className="hidden items-center gap-2 lg:flex">
              <span className="size-1.5 rounded-full bg-green" aria-hidden />
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted/60">
                Bảng điều khiển nội dung
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/vi"
                target="_blank"
                className="hidden items-center gap-1.5 text-[0.7rem] font-medium text-muted transition-colors hover:text-brand sm:flex"
              >
                Xem website
                <ExternalLink className="size-3.5" />
              </Link>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-[0.68rem] font-medium text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <LogOut className="size-3.5" />
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-line bg-white lg:hidden">
            <AdminNav variant="mobile" />
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
