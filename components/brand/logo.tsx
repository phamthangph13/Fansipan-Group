import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  className,
  size = "md",
}: {
  variant?: "dark" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const mark = variant === "light" ? "/brand/mark-white.png" : "/brand/mark.png";
  const wordmark = variant === "light" ? "/brand/wordmark-white.png" : "/brand/wordmark.png";
  const markSize = size === "lg" ? 64 : size === "sm" ? 34 : 44;
  const wordmarkClass = size === "lg" ? "h-[50px]" : size === "sm" ? "h-[29px]" : "h-[37px]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={mark}
        alt=""
        width={markSize}
        height={markSize}
        className="shrink-0"
        priority
      />
      <Image
        src={wordmark}
        alt="FANSIPAN GROUP.,JSC"
        width={1200}
        height={241}
        sizes="(min-width: 1024px) 200px, 184px"
        className={cn("w-auto shrink-0", wordmarkClass)}
        priority
      />
    </span>
  );
}
