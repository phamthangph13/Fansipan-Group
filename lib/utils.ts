import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "./i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, locale: Locale, style: "short" | "long" = "long") {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: style === "long" ? "long" : "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(iso: string, locale: Locale) {
  return formatDate(iso, locale, "short");
}

export function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function stripLocale(pathname: string) {
  return pathname.replace(/^\/(vi|en)(?=\/|$)/, "") || "/";
}

export function absoluteUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://fansipan-group.vn").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function sanitizeFileName(name: string) {
  const cleaned = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned.slice(-120) || "file";
}

export function humanFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function readingTimeLabel(minutes: number, locale: Locale) {
  return locale === "vi" ? `${minutes} phút đọc` : `${minutes} min read`;
}
