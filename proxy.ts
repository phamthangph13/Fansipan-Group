import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

const PUBLIC_FILE =
  /\.(?:png|jpe?g|gif|svg|webp|avif|ico|pdf|txt|xml|json|webmanifest|woff2?|ttf|otf|mp4|webm)$/i;

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segment = pathname.split("/").filter(Boolean)[0];

  if (locales.includes(segment as (typeof locales)[number])) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", segment as string);
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|images|catalogue).*)"],
};
