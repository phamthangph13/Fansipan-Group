"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getServices, getSite, getSubmissions, writeJson } from "@/lib/content";
import { sendContactNotification } from "@/lib/mail";
import { checkRateLimit, clientIpFromHeaders, hashIp, isLikelySpam } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/form-types";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/lib/i18n";
import type { Submission } from "@/lib/types";

function newId() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `YC-${date}-${random}`;
}

export async function sendContactRequest(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = (formData.get("locale") === "en" ? "en" : "vi") as Locale;
  const t = ui[locale];

  const requestHeaders = await headers();
  const ip = clientIpFromHeaders(requestHeaders);
  const limit = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);

  if (!limit.ok) {
    return {
      status: "error",
      message:
        locale === "vi"
          ? "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút."
          : "Too many requests. Please try again in a few minutes.",
      errors: {},
    };
  }

  const spam = isLikelySpam({
    honeypot: formData.get("website"),
    startedAt: formData.get("startedAt"),
  });

  if (spam) {
    return { status: "success", message: t.forms.successContact, errors: {} };
  }

  const parsed = contactSchema(locale).safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    company: formData.get("company") ?? "",
    need: formData.get("need"),
    message: formData.get("message"),
    consent: formData.get("consent") ?? undefined,
    locale,
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors: Record<string, string> = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (value?.[0]) errors[key] = value[0];
    }
    return { status: "error", message: t.forms.errorRequired, errors };
  }

  try {
    const [services, site, existing] = await Promise.all([
      getServices(),
      getSite(),
      getSubmissions(),
    ]);

    const data = parsed.data;
    const service = services.find((item) => item.id === data.need);
    const need =
      service?.title[locale] ?? (locale === "vi" ? "Khác / Tư vấn chung" : "Other / General enquiry");

    const submission: Submission = {
      id: newId(),
      createdAt: new Date().toISOString(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      company: data.company ?? "",
      need,
      message: data.message,
      locale,
      read: false,
      ipHash: hashIp(ip),
    };

    await writeJson("submissions.json", [submission, ...existing]);
    await sendContactNotification(submission, site);

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/yeu-cau");
    revalidatePath("/admin/ung-tuyen");

    return { status: "success", message: t.forms.successContact, errors: {} };
  } catch (error) {
    console.error("[contact] failed", error instanceof Error ? error.message : error);
    return { status: "error", message: t.forms.errorGeneric, errors: {} };
  }
}
