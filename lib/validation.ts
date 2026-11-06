import { z } from "zod";
import type { Locale } from "./i18n";

type Messages = {
  name: string;
  phone: string;
  email: string;
  emailInvalid: string;
  need: string;
  message: string;
  consent: string;
  job: string;
  cover: string;
  password: string;
};

function messages(locale: Locale): Messages {
  if (locale === "en") {
    return {
      name: "Please enter your full name.",
      phone: "Please enter a valid phone number.",
      email: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      need: "Please choose a requirement.",
      message: "Please describe your requirement (at least 10 characters).",
      consent: "Please agree to the privacy policy.",
      job: "Please choose a position.",
      cover: "Your cover letter is too long.",
      password: "Please enter the administrator password.",
    };
  }
  return {
    name: "Vui lòng nhập họ tên.",
    phone: "Vui lòng nhập số điện thoại hợp lệ.",
    email: "Vui lòng nhập email.",
    emailInvalid: "Email chưa đúng định dạng.",
    need: "Vui lòng chọn nhu cầu.",
    message: "Vui lòng mô tả nhu cầu (tối thiểu 10 ký tự).",
    consent: "Vui lòng đồng ý với chính sách bảo mật.",
    job: "Vui lòng chọn vị trí ứng tuyển.",
    cover: "Thư giới thiệu quá dài.",
    password: "Vui lòng nhập mật khẩu quản trị.",
  };
}

export function contactSchema(locale: Locale) {
  const m = messages(locale);
  return z.object({
    name: z.string().trim().min(2, m.name).max(80, m.name),
    phone: z
      .string()
      .trim()
      .min(8, m.phone)
      .max(20, m.phone)
      .regex(/^[0-9+\s().-]+$/, m.phone),
    email: z.string().trim().min(1, m.email).email(m.emailInvalid).max(120),
    company: z.string().trim().max(120).optional().default(""),
    need: z.string().trim().min(1, m.need).max(120),
    message: z.string().trim().min(10, m.message).max(3000, m.message),
    consent: z.string().optional().refine((value) => value === "on", m.consent),
    locale: z.enum(["vi", "en"]),
  });
}

export function applicationSchema(locale: Locale) {
  const m = messages(locale);
  return z.object({
    name: z.string().trim().min(2, m.name).max(80, m.name),
    phone: z
      .string()
      .trim()
      .min(8, m.phone)
      .max(20, m.phone)
      .regex(/^[0-9+\s().-]+$/, m.phone),
    email: z.string().trim().min(1, m.email).email(m.emailInvalid).max(120),
    jobSlug: z.string().trim().min(1, m.job),
    coverLetter: z.string().trim().max(3000, m.cover).optional().default(""),
    consent: z.string().optional().refine((value) => value === "on", m.consent),
    locale: z.enum(["vi", "en"]),
  });
}

export const loginSchema = z.object({
  password: z.string().min(1, "Vui lòng nhập mật khẩu quản trị."),
});
