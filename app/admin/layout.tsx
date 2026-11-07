import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Quản trị nội dung",
    template: "%s | Quản trị Fansipan Group",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
