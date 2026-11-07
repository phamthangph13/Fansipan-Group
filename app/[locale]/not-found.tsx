import { headers } from "next/headers";
import { NotFoundView } from "@/components/layout/not-found-view";

export default async function LocaleNotFound() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") === "en" ? "en" : "vi";
  return <NotFoundView locale={locale} />;
}
