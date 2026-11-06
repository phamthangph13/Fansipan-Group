import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  className,
  size = "md",
  withTagline = true,
}: {
  variant?: "dark" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}) {
  const mark = variant === "light" ? "/brand/mark-white.png" : "/brand/mark.png";
  const markSize = size === "lg" ? 64 : size === "sm" ? 34 : 44;
  const wordSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-[15px]" : "text-[18px]";
  const tagSize = size === "lg" ? "text-[9px]" : "text-[7.5px]";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={mark}
        alt=""
        width={markSize}
        height={markSize}
        className="shrink-0"
        priority
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-semibold tracking-[-0.05em]",
            wordSize,
            variant === "light" ? "text-white" : "text-ink",
          )}
        >
          FANSIPAN <span className={variant === "light" ? "text-white" : "text-brand"}>GROUP</span>
          <span className="text-accent">.</span>
          <span
            className={cn(
              "font-medium tracking-[-0.02em]",
              variant === "light" ? "text-white/60" : "text-muted",
            )}
          >
            ,JSC
          </span>
        </span>
        {withTagline ? (
          <span
            className={cn(
              "mt-1.5 font-mono uppercase tracking-[0.22em]",
              tagSize,
              variant === "light" ? "text-white/40" : "text-muted/70",
            )}
          >
            M&amp;E · HVAC · Industrial services
          </span>
        ) : null}
      </span>
    </span>
  );
}
