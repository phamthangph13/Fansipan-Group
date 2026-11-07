import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  action,
  light = false,
  align = "left",
  stacked = false,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  light?: boolean;
  align?: "left" | "center";
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-px w-7 bg-accent" aria-hidden />
        <span className={cn("eyebrow", light ? "text-white/70" : "text-brand")}>{eyebrow}</span>
        {index ? (
          <span className={cn("eyebrow", light ? "text-white/35" : "text-muted/60")}>/ {index}</span>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-5 gap-x-12 gap-y-5",
          intro && !stacked ? "space-y-4 lg:grid lg:grid-cols-12 lg:items-end lg:space-y-0" : "",
          stacked && intro ? "space-y-4" : "",
          align === "center" && "text-center",
        )}
      >
        <h2
          className={cn(
            "display-2",
            intro && !stacked ? "lg:col-span-7" : "max-w-3xl",
            light ? "text-white" : "text-ink",
            align === "center" && "mx-auto max-w-3xl",
          )}
        >
          {title}
        </h2>
        {intro ? (
          <div
            className={cn(
              !stacked && "lg:col-span-5",
              align === "center" && "mx-auto max-w-2xl",
            )}
          >
            <p className={cn("lead", light ? "text-white/70" : "text-ink-soft")}>{intro}</p>
            {action ? <div className="mt-6">{action}</div> : null}
          </div>
        ) : action ? (
          <div className={cn("mt-6", align === "center" && "flex justify-center")}>{action}</div>
        ) : null}
      </div>
    </div>
  );
}
