"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

const copy = {
  vi: {
    eyebrow: "Đã xảy ra lỗi",
    title: "Không thể tải nội dung",
    body: "Có lỗi trong quá trình xử lý. Vui lòng thử lại. Nếu lỗi tiếp tục xuất hiện, hãy liên hệ Fansipan Group để được hỗ trợ.",
    retry: "Thử lại",
    home: "Về trang chủ",
    contact: "Liên hệ",
    ref: "Mã tham chiếu",
  },
  en: {
    eyebrow: "Something went wrong",
    title: "We could not load this content",
    body: "An error occurred while processing your request. Please try again. If the problem persists, contact Fansipan Group for assistance.",
    retry: "Try again",
    home: "Back to home",
    contact: "Contact us",
    ref: "Reference",
  },
} as const;

export default function LocaleError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "vi";
  const c = copy[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;

  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="wrap">
        <div className="max-w-xl border border-line bg-white p-7 sm:p-9">
          <span className="flex size-11 items-center justify-center bg-accent/[0.07] text-accent">
            <AlertTriangle className="size-5" strokeWidth={1.7} />
          </span>
          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-accent">
            {c.eyebrow}
          </p>
          <h1 className="mt-3 text-[1.9rem] font-semibold leading-[1.12] tracking-[-0.035em] text-ink">
            {c.title}
          </h1>
          <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">{c.body}</p>

          {digest ? (
            <p className="mt-4 font-mono text-[0.6rem] text-muted/60">
              {c.ref}: {digest}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => retry()} className="btn btn-primary">
              <RotateCcw className="size-4" />
              {c.retry}
            </button>
            <Link href={`/${locale}`} className="btn btn-outline">
              <Home className="size-4" />
              {c.home}
            </Link>
            <Link href={`/${locale}/lien-he`} className="btn btn-outline">
              {c.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
