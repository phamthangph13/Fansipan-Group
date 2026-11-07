"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  Home,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/yeu-cau", label: "Yêu cầu báo giá", icon: Inbox },
  { href: "/admin/ung-tuyen", label: "Hồ sơ ứng tuyển", icon: Users },
  { href: "/admin/trang-chu", label: "Trang chủ", icon: Home },
  { href: "/admin/du-an", label: "Dự án", icon: Building2 },
  { href: "/admin/tin-tuc", label: "Tin tức", icon: Newspaper },
  { href: "/admin/tuyen-dung", label: "Tuyển dụng", icon: BriefcaseBusiness },
  { href: "/admin/cai-dat", label: "Cài đặt", icon: Settings },
];

export function AdminNav({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <nav aria-label="Điều hướng quản trị" className="no-scrollbar overflow-x-auto">
        <ul className="flex min-w-max gap-1 px-3 py-2">
          {items.map((item) => {
            const active =
              item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-[0.72rem] font-medium transition-colors",
                    active ? "bg-brand text-white" : "text-muted hover:bg-cloud hover:text-ink",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-3.5" strokeWidth={1.7} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Điều hướng quản trị" className="mt-7 flex-1">
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active =
            item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 border-l-2 px-5 py-2.5 text-[0.8rem] transition-colors",
                  active
                    ? "border-accent bg-white/[0.08] font-semibold text-white"
                    : "border-transparent text-white/55 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <Icon className="size-4" strokeWidth={1.6} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
