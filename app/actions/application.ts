"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getApplications, getJob, getSite, writeJson } from "@/lib/content";
import { sendApplicationNotification } from "@/lib/mail";
import { checkRateLimit, clientIpFromHeaders, isLikelySpam } from "@/lib/rate-limit";
import { deleteCv, saveCv } from "@/lib/storage";
import { applicationSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/form-types";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/lib/i18n";
import type { Application } from "@/lib/types";

function newId() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UT-${date}-${random}`;
}

export async function submitApplication(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = (formData.get("locale") === "en" ? "en" : "vi") as Locale;
  const t = ui[locale];

  const requestHeaders = await headers();
  const ip = clientIpFromHeaders(requestHeaders);
  const limit = checkRateLimit(`apply:${ip}`, 5, 10 * 60 * 1000);

  if (!limit.ok) {
    return {
      status: "error",
      message:
        locale === "vi"
          ? "Bạn đã gửi quá nhiều hồ sơ. Vui lòng thử lại sau ít phút."
          : "Too many applications. Please try again in a few minutes.",
      errors: {},
    };
  }

  const spam = isLikelySpam({
    honeypot: formData.get("website"),
    startedAt: formData.get("startedAt"),
  });

  if (spam) {
    return { status: "success", message: t.forms.successApplication, errors: {} };
  }

  const parsed = applicationSchema(locale).safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    jobSlug: formData.get("jobSlug"),
    coverLetter: formData.get("coverLetter") ?? "",
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

  const cvEntry = formData.get("cv");
  const file = cvEntry instanceof File && cvEntry.size > 0 ? cvEntry : null;
  if (!file) {
    return {
      status: "error",
      message: t.forms.errorRequired,
      errors: { cv: locale === "vi" ? "Vui lòng đính kèm CV." : "Please attach your CV." },
    };
  }

  try {
    const job = await getJob(parsed.data.jobSlug);
    if (!job || !job.open) {
      return {
        status: "error",
        message:
          locale === "vi"
            ? "Vị trí này hiện không còn nhận hồ sơ."
            : "This position is no longer accepting applications.",
        errors: {},
      };
    }

    const [site, existing] = await Promise.all([getSite(), getApplications()]);
    const id = newId();
    const stored = await saveCv(file, id);

    if (!stored.ok) {
      return {
        status: "error",
        message: t.forms.errorFile,
        errors: { cv: t.forms.errorFile },
      };
    }

    const application: Application = {
      id,
      createdAt: new Date().toISOString(),
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      jobSlug: job.slug,
      jobTitle: job.title[locale],
      coverLetter: parsed.data.coverLetter ?? "",
      cvFile: stored.stored,
      cvOriginalName: stored.original,
      locale,
      read: false,
    };

    try {
      await writeJson("applications.json", [application, ...existing]);
    } catch (error) {
      await deleteCv(stored.stored);
      throw error;
    }

    await sendApplicationNotification(application, site);

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/ung-tuyen");

    return { status: "success", message: t.forms.successApplication, errors: {} };
  } catch (error) {
    console.error("[application] failed", error instanceof Error ? error.message : error);
    return { status: "error", message: t.forms.errorGeneric, errors: {} };
  }
}
