"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  LayoutGrid,
  Loader2,
  Minimize2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

const copy = {
  vi: {
    loading: "Đang chuẩn bị hồ sơ",
    loadingHint: "Đang kết xuất trang PDF…",
    error: "Không thể hiển thị hồ sơ trực tiếp.",
    errorHint:
      "Bạn có thể tải PDF bên dưới hoặc thử lại. Trình duyệt cần hỗ trợ JavaScript để xem sách lật trang.",
    retry: "Thử lại",
    download: "Tải PDF",
    downloadShort: "PDF",
    pages: "trang",
    page: "Trang",
    of: "/",
    previous: "Trang trước",
    next: "Trang sau",
    thumbnails: "Xem trang",
    zoomIn: "Phóng to",
    zoomOut: "Thu nhỏ",
    fullscreen: "Toàn màn hình",
    exitFullscreen: "Thoát toàn màn hình",
    close: "Đóng",
    lightbox: "Xem trang ở kích thước lớn",
    hint: "Kéo góc trang hoặc dùng phím ← → để lật trang.",
    hintMobile: "Vuốt ngang hoặc chạm vào mép trang để lật.",
    contents: "Mục lục",
    downloadNote: "Bản PDF đầy đủ, dùng để lưu trữ và chia sẻ.",
  },
  en: {
    loading: "Preparing the profile",
    loadingHint: "Rendering PDF pages…",
    error: "The profile cannot be displayed inline.",
    errorHint:
      "You can download the PDF below or try again. A JavaScript-enabled browser is required for the page-turning view.",
    retry: "Try again",
    download: "Download PDF",
    downloadShort: "PDF",
    pages: "pages",
    page: "Page",
    of: "/",
    previous: "Previous page",
    next: "Next page",
    thumbnails: "Pages",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    close: "Close",
    lightbox: "View page at a larger size",
    hint: "Drag a page corner or use ← → to turn the page.",
    hintMobile: "Swipe sideways or tap the page edge to turn.",
    contents: "Contents",
    downloadNote: "The full PDF, for keeping and sharing.",
  },
} as const;

type FlipBookComponent = React.ComponentType<Record<string, unknown>>;

function ToolButton({
  label,
  onClick,
  children,
  active,
  disabled,
  className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-9 items-center justify-center border text-ink-soft transition-colors disabled:cursor-not-allowed disabled:opacity-35",
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-white hover:border-brand/40 hover:text-brand",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Flipbook({
  locale,
  pdfUrl,
  title,
}: {
  locale: Locale;
  pdfUrl: string;
  title: string;
}) {
  const c = copy[locale];
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const [FlipBook, setFlipBook] = useState<FlipBookComponent | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [current, setCurrent] = useState(0);
  const [showThumbs, setShowThumbs] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPage, setZoomPage] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1.15);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    import("react-pageflip").then((mod) => {
      if (mounted) setFlipBook(() => mod.default as unknown as FlipBookComponent);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setPages([]);
    setCurrent(0);
    setProgress({ done: 0, total: 0 });

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url: pdfUrl }).promise;
        if (cancelled) {
          void doc.destroy();
          return;
        }
        setProgress({ done: 0, total: doc.numPages });
        const rendered: string[] = [];
        for (let index = 1; index <= doc.numPages; index += 1) {
          if (cancelled) break;
          const page = await doc.getPage(index);
          const base = page.getViewport({ scale: 1 });
          const scale = Math.min(2, 1440 / base.width);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.floor(viewport.width));
          canvas.height = Math.max(1, Math.floor(viewport.height));
          const context = canvas.getContext("2d", { alpha: false });
          if (!context) throw new Error("Canvas is not available");
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: context, canvas, viewport }).promise;
          rendered.push(canvas.toDataURL("image/jpeg", 0.92));
          setProgress({ done: index, total: doc.numPages });
          page.cleanup();
        }
        if (cancelled) {
          void doc.destroy();
          return;
        }
        void doc.destroy();
        setPages(rendered);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl, attempt]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (zoomPage === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [zoomPage]);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipTo = useCallback((index: number) => {
    bookRef.current?.pageFlip()?.flip(index);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag && ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      if (zoomPage !== null) {
        if (event.key === "Escape") setZoomPage(null);
        if (event.key === "ArrowRight") {
          setZoomPage((value) =>
            value === null ? null : Math.min(pages.length - 1, value + 1),
          );
        }
        if (event.key === "ArrowLeft") {
          setZoomPage((value) => (value === null ? null : Math.max(0, value - 1)));
        }
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        flipNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        flipPrev();
      }
      if (event.key === "Home") {
        event.preventDefault();
        flipTo(0);
      }
      if (event.key === "End" && pages.length) {
        event.preventDefault();
        flipTo(pages.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipNext, flipPrev, flipTo, pages.length, zoomPage]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewerRef.current?.requestFullscreen();
      }
    } catch {
      setIsFullscreen(false);
    }
  };

  const retry = () => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  };

  return (
    <div
      ref={viewerRef}
      className={cn(
        "relative bg-[linear-gradient(135deg,#eef4fb_0%,#f8fafc_45%,#eaf1fa_100%)]",
        isFullscreen
          ? "flex min-h-screen flex-col overflow-auto px-4 py-4 sm:px-8"
          : "border border-line",
      )}
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" aria-hidden />

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-line/80 bg-white/80 px-3 py-2.5 backdrop-blur sm:px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center bg-navy text-white">
            <BookOpen className="size-4" strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.78rem] font-semibold leading-tight text-ink">
              {title}
            </p>
            <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted/60">
              {status === "ready" ? `${pages.length} ${c.pages}` : "FANSIPAN GROUP"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <ToolButton
            label={c.thumbnails}
            onClick={() => setShowThumbs((value) => !value)}
            active={showThumbs}
            disabled={status !== "ready"}
            className="hidden sm:flex"
          >
            <LayoutGrid className="size-4" strokeWidth={1.6} />
          </ToolButton>
          <ToolButton
            label={c.zoomOut}
            onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.2).toFixed(2))))}
            disabled={status !== "ready"}
          >
            <ZoomOut className="size-4" strokeWidth={1.6} />
          </ToolButton>
          <span className="hidden w-10 text-center font-mono text-[0.58rem] text-muted sm:block">
            {Math.round(zoom * 100)}%
          </span>
          <ToolButton
            label={c.zoomIn}
            onClick={() => setZoom((value) => Math.min(2, Number((value + 0.2).toFixed(2))))}
            disabled={status !== "ready"}
          >
            <ZoomIn className="size-4" strokeWidth={1.6} />
          </ToolButton>
          <ToolButton
            label={isFullscreen ? c.exitFullscreen : c.fullscreen}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" strokeWidth={1.6} />
            ) : (
              <Expand className="size-4" strokeWidth={1.6} />
            )}
          </ToolButton>
          <a
            href={pdfUrl}
            download
            className="flex h-9 items-center gap-1.5 border border-line bg-white px-2.5 text-[0.68rem] font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
          >
            <Download className="size-3.5" strokeWidth={1.6} />
            <span className="hidden sm:inline">{c.download}</span>
            <span className="sm:hidden">{c.downloadShort}</span>
          </a>
        </div>
      </div>

      {showThumbs && status === "ready" ? (
        <div className="relative border-b border-line/80 bg-white/85 px-3 py-3 backdrop-blur sm:px-4">
          <p className="mb-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted/60">
            {c.contents}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {pages.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setCurrent(index);
                  flipTo(index);
                }}
                aria-label={`${c.page} ${index + 1}`}
                className={cn(
                  "group relative overflow-hidden border bg-white p-1 transition-all",
                  current === index
                    ? "border-brand ring-1 ring-brand"
                    : "border-line hover:border-brand/50",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${c.page} ${index + 1}`}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
                <span className="mt-1 block text-center font-mono text-[0.55rem] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col items-center justify-center px-2 py-4 sm:px-6 sm:py-6">
        {status === "loading" ? (
          <div className="w-full max-w-[860px]">
            <div className="mx-auto flex aspect-[1.42/1] w-full max-w-[720px] items-center justify-center border border-line bg-white/70">
              <div className="text-center">
                <Loader2 className="mx-auto size-7 animate-spin text-brand" strokeWidth={1.6} />
                <p className="mt-4 text-[0.86rem] font-semibold text-ink">{c.loading}</p>
                <p className="mt-1 text-[0.72rem] text-muted">{c.loadingHint}</p>
                {progress.total ? (
                  <div className="mx-auto mt-4 w-44">
                    <div className="h-0.5 w-full bg-line">
                      <div
                        className="h-full bg-brand transition-[width] duration-300"
                        style={{ width: `${(progress.done / progress.total) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted/60">
                      {progress.done} / {progress.total}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="w-full max-w-md border border-line bg-white p-7 text-center">
            <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-accent/[0.07] text-accent">
              <AlertTriangle className="size-5" strokeWidth={1.7} />
            </span>
            <p className="mt-4 text-[0.95rem] font-semibold text-ink">{c.error}</p>
            <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{c.errorHint}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={retry} className="btn btn-outline btn-sm">
                <RotateCcw className="size-3.5" />
                {c.retry}
              </button>
              <a href={pdfUrl} download className="btn btn-primary btn-sm">
                <Download className="size-3.5" />
                {c.download}
              </a>
            </div>
          </div>
        ) : null}

        {status === "ready" && FlipBook ? (
          <div
            className={cn(
              "flex w-full items-center justify-center",
              isFullscreen ? "min-h-0 flex-1" : "",
            )}
          >
            <div
              className={cn(
                "w-full max-w-[920px]",
                isFullscreen
                  ? "h-[calc(100vh-190px)] min-h-[360px]"
                  : "h-[min(72vh,700px)] min-h-[420px]",
              )}
              style={{
                transform: zoom === 1 ? undefined : `scale(${zoom})`,
                transition: "transform 250ms ease",
              }}
            >
              <FlipBook
                ref={bookRef}
                className="flipbook"
                style={{ width: "100%", height: "100%" }}
                width={460}
                height={653}
                size="stretch"
                minWidth={280}
                maxWidth={460}
                minHeight={400}
                maxHeight={700}
                drawShadow
                flippingTime={700}
                usePortrait
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.45}
                showCover
                mobileScrollSupport
                clickEventForward
                useMouseEvents
                swipeDistance={30}
                showPageCorners
                disableFlipByClick={false}
                startPage={current}
                onFlip={(event: { data: number }) => setCurrent(event.data)}
              >
                {pages.map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden bg-white"
                    data-density={index === 0 || index === pages.length - 1 ? "hard" : "soft"}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${title} — ${c.page} ${index + 1}`}
                      draggable={false}
                      className="h-full w-full select-none object-contain"
                    />
                  </div>
                ))}
              </FlipBook>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-line/80 bg-white/80 px-3 py-2.5 backdrop-blur sm:px-4">
        <button
          type="button"
          onClick={flipPrev}
          disabled={status !== "ready" || current <= 0}
          className="flex items-center gap-1.5 border border-line bg-white px-2.5 py-1.5 text-[0.7rem] font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden sm:inline">{c.previous}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/60">
            {status === "ready" ? `${c.page} ${current + 1} ${c.of} ${pages.length}` : c.loading}
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <button
            type="button"
            onClick={() => {
              setZoomPage(current);
              setZoom(1.15);
            }}
            disabled={status !== "ready"}
            className="hidden font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand transition-colors hover:text-accent disabled:opacity-40 sm:inline"
          >
            {c.lightbox}
          </button>
        </div>

        <button
          type="button"
          onClick={flipNext}
          disabled={status !== "ready" || current >= pages.length - 1}
          className="flex items-center gap-1.5 border border-line bg-white px-2.5 py-1.5 text-[0.7rem] font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="hidden sm:inline">{c.next}</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>

      <p className="relative border-t border-line/60 bg-white/60 py-2 text-center text-[0.65rem] text-muted/65">
        <span className="hidden sm:inline">{c.hint}</span>
        <span className="sm:hidden">{c.hintMobile}</span>
      </p>

      {zoomPage !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${c.page} ${zoomPage + 1}`}
          className="fixed inset-0 z-[90] flex flex-col bg-navy/95 backdrop-blur-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white sm:px-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/70">
              {c.page} {zoomPage + 1} {c.of} {pages.length}
            </p>
            <div className="flex items-center gap-1.5">
              <ToolButton
                label={c.zoomOut}
                onClick={() => setZoom((value) => Math.max(0.7, Number((value - 0.2).toFixed(2))))}
                className="border-white/20 bg-white/10 text-white hover:border-white/50 hover:text-white"
              >
                <ZoomOut className="size-4" />
              </ToolButton>
              <span className="w-10 text-center font-mono text-[0.6rem] text-white/70">
                {Math.round(zoom * 100)}%
              </span>
              <ToolButton
                label={c.zoomIn}
                onClick={() => setZoom((value) => Math.min(3, Number((value + 0.2).toFixed(2))))}
                className="border-white/20 bg-white/10 text-white hover:border-white/50 hover:text-white"
              >
                <ZoomIn className="size-4" />
              </ToolButton>
              <ToolButton
                label={c.close}
                onClick={() => setZoomPage(null)}
                className="border-white/20 bg-white/10 text-white hover:border-white/50 hover:text-white"
              >
                <X className="size-4" />
              </ToolButton>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
            <div className="w-full max-w-5xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pages[zoomPage]}
                alt={`${title} — ${c.page} ${zoomPage + 1}`}
                className="mx-auto block shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]"
                style={{ width: `${Math.round(zoom * 100)}%`, maxWidth: "none" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setZoomPage((value) => Math.max(0, (value ?? 0) - 1))}
              disabled={zoomPage <= 0}
              className="inline-flex items-center gap-1.5 border border-white/20 px-3 py-1.5 text-[0.72rem] text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="size-3.5" />
              {c.previous}
            </button>
            <button
              type="button"
              onClick={() =>
                setZoomPage((value) => Math.min(pages.length - 1, (value ?? 0) + 1))
              }
              disabled={zoomPage >= pages.length - 1}
              className="inline-flex items-center gap-1.5 border border-white/20 px-3 py-1.5 text-[0.72rem] text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-30"
            >
              {c.next}
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
