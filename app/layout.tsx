import type { Metadata } from "next";
import { Be_Vietnam_Pro, IBM_Plex_Mono, Lora } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const serif = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fansipan-group.vn"),
  title: {
    default: "FANSIPAN GROUP — Cơ điện, HVAC & Bảo trì hệ thống",
    template: "%s | FANSIPAN GROUP",
  },
  description:
    "Fansipan Group cung cấp giải pháp cơ điện (M&E), HVAC, tháp giải nhiệt, thiết bị công nghiệp và bảo trì hệ thống toàn diện cho nhà máy, khu công nghiệp.",
  applicationName: "FANSIPAN GROUP",
  authors: [{ name: "Công ty cổ phần Fansipan Group" }],
  creator: "FANSIPAN GROUP",
  icons: {
    icon: [{ url: "/brand/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/brand/apple-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") === "en" ? "en" : "vi";

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
