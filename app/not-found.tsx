import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { NotFoundView } from "@/components/layout/not-found-view";

export default async function GlobalNotFound() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") === "en" ? "en" : "vi";

  return (
    <div className="flex min-h-screen flex-col bg-navy">
      <header className="border-b border-white/10 px-5 py-4 sm:px-8">
        <Link href={`/${locale}`} className="inline-flex items-center gap-3">
          <Image src="/brand/mark-white.png" alt="" width={34} height={34} />
          <span>
            <span className="block text-[0.78rem] font-semibold tracking-[0.06em] text-white">
              FANSIPAN GROUP
            </span>
            <span className="mt-0.5 block font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/35">
              M&amp;E · HVAC · Industrial services
            </span>
          </span>
        </Link>
      </header>
      <main className="flex-1">
        <NotFoundView locale={locale} />
      </main>
      <footer className="border-t border-white/10 px-5 py-4 text-center font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white/30 sm:px-8">
        fansipan-group.vn
      </footer>
    </div>
  );
}
