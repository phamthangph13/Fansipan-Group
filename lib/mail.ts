import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { Application, SiteData, Submission } from "./types";
import { readCv } from "./storage";

let cached: Transporter | null | undefined;

function getTransport(): Transporter | null {
  if (cached !== undefined) return cached;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    cached = null;
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 465);
  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 12_000,
    greetingTimeout: 8_000,
    socketTimeout: 20_000,
  });
  return cached;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function shell(title: string, rows: [string, string][], body?: string) {
  const table = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:150px;color:#596a7f;font-size:13px;border-bottom:1px solid #e7edf5;">${escapeHtml(label)}</td>
        <td style="padding:10px 0;vertical-align:top;color:#07182c;font-size:14px;border-bottom:1px solid #e7edf5;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td>
      </tr>`,
    )
    .join("");

  return `
  <div style="background:#f4f7fb;padding:28px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e1e8f1;">
      <div style="background:#1b365d;padding:22px 26px;">
        <div style="color:#fff;font-size:16px;font-weight:bold;letter-spacing:.06em;">FANSIPAN GROUP.,JSC</div>
        <div style="color:#8fb0de;font-size:11px;letter-spacing:.18em;margin-top:5px;text-transform:uppercase;">M&amp;E · HVAC · INDUSTRIAL SERVICES</div>
      </div>
      <div style="height:4px;background:#db0114;"></div>
      <div style="padding:26px;">
        <h1 style="margin:0 0 18px;color:#07182c;font-size:20px;line-height:1.3;">${escapeHtml(title)}</h1>
        <table style="width:100%;border-collapse:collapse;">${table}</table>
        ${
          body
            ? `<div style="margin-top:22px;padding:16px 18px;background:#f7fafd;border-left:3px solid #005a9c;color:#25384d;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(
                body,
              )}</div>`
            : ""
        }
        <p style="margin:26px 0 0;color:#8a99ab;font-size:12px;">Email được gửi tự động từ website fansipan-group.vn.</p>
      </div>
    </div>
  </div>`;
}

async function send(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const transport = getTransport();
  if (!transport) {
    console.info(`[mail] SMTP not configured — skipped email: ${options.subject}`);
    return { sent: false as const, reason: "not-configured" };
  }
  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || `"FANSIPAN GROUP" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
      attachments: options.attachments,
    });
    return { sent: true as const };
  } catch (error) {
    console.error("[mail] send failed", error instanceof Error ? error.message : error);
    return { sent: false as const, reason: "send-failed" };
  }
}

export async function sendContactNotification(submission: Submission, site: SiteData) {
  const rows: [string, string][] = [
    ["Mã yêu cầu", submission.id],
    ["Họ tên", submission.name],
    ["Điện thoại", submission.phone],
    ["Email", submission.email],
    ["Công ty", submission.company || "—"],
    ["Nhu cầu", submission.need],
    ["Ngôn ngữ", submission.locale.toUpperCase()],
    ["Thời gian", submission.createdAt],
  ];
  const to = process.env.MAIL_TO || site.contact.email;
  return send({
    to,
    replyTo: submission.email,
    subject: `[Website] Yêu cầu báo giá — ${submission.name}${submission.company ? ` · ${submission.company}` : ""}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nNội dung:\n${submission.message}`,
    html: shell("Yêu cầu báo giá / khảo sát mới", rows, submission.message),
  });
}

export async function sendApplicationNotification(
  application: Application,
  site: SiteData,
) {
  const rows: [string, string][] = [
    ["Mã hồ sơ", application.id],
    ["Họ tên", application.name],
    ["Điện thoại", application.phone],
    ["Email", application.email],
    ["Vị trí", application.jobTitle],
    ["Ngôn ngữ", application.locale.toUpperCase()],
    ["Thời gian", application.createdAt],
  ];

  let attachments: { filename: string; content: Buffer }[] | undefined;
  if (application.cvFile) {
    try {
      const { buffer } = await readCv(application.cvFile);
      attachments = [
        {
          filename: application.cvOriginalName || application.cvFile,
          content: buffer,
        },
      ];
    } catch {
      attachments = undefined;
    }
  }

  const to = process.env.CAREERS_MAIL_TO || site.contact.careersEmail || site.contact.email;
  return send({
    to,
    replyTo: application.email,
    subject: `[Website] Ứng tuyển — ${application.jobTitle} — ${application.name}`,
    text:
      rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
      `\n\nThư giới thiệu:\n${application.coverLetter || "—"}`,
    html: shell("Hồ sơ ứng tuyển mới", rows, application.coverLetter || undefined),
    attachments,
  });
}
