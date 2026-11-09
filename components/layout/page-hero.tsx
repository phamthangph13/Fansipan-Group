import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function PageHero({
  locale,
  eyebrow,
  title,
  intro,
  introClassName,
  breadcrumb,
  children,
  tone = "light",
}: {
  locale: Locale;
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  introClassName?: string;
  breadcrumb: { label: string; href?: string }[];
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        dark
          ? "border-white/10 bg-[linear-gradient(115deg,#1b365d,#124a78_60%,#005a9c)] text-white"
          : "border-line bg-[linear-gradient(180deg,#f8fbff,#eef5fd)]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-50",
          dark ? "grid-lines-light" : "grid-lines",
        )}
        aria-hidden
      />
      <svg
        className={cn(
          "pointer-events-none absolute -bottom-8 right-0 h-[75%] w-[62%]",
          dark ? "opacity-20" : "opacity-[0.14]",
        )}
        viewBox="0 0 900 400"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <path
          d="M0 380L120 300L230 340L360 210L470 300L590 150L700 260L810 120L900 220"
          stroke={dark ? "white" : "#005A9C"}
          strokeWidth="1.2"
        />
        <path
          d="M0 400L150 340L300 370L470 260L610 330L740 210L900 300"
          stroke={dark ? "white" : "#005A9C"}
          strokeWidth="0.8"
        />
      </svg>

      <div className="wrap relative py-11 lg:py-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.7rem]">
            {breadcrumb.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight
                    className={cn("size-3", dark ? "text-white/25" : "text-muted/40")}
                    strokeWidth={1.6}
                  />
                ) : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "transition-colors",
                      dark
                        ? "text-white/50 hover:text-white"
                        : "text-muted transition-colors hover:text-brand",
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={dark ? "text-white/80" : "text-ink-soft"} aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px w-7 bg-accent" aria-hidden />
          <p className={cn("eyebrow", dark ? "text-white/60" : "text-brand")}>{eyebrow}</p>
        </div>

        <h1
          className={cn(
            "display-2 mt-5 max-w-4xl",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h1>

        {intro ? (
          <p
            className={cn(
              "lead mt-5 max-w-2xl",
              dark ? "text-white/65" : "text-ink-soft",
              introClassName,
            )}
          >
            {intro}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
      <span className="sr-only">{locale === "vi" ? "Fansipan Group" : "Fansipan Group"}</span>
    </section>
  );
}
