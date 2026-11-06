import Link from "next/link";
import { ArrowRight, BadgeCheck, Quote, UserRound } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { paths, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

const pending = {
  vi: "Nội dung đang được cập nhật.",
  en: "Content is being updated.",
};

function PendingCard({ label, locale }: { label: string; locale: Locale }) {
  return (
    <div className="border border-dashed border-line bg-cloud p-6">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/50">{label}</p>
      <p className="mt-3 text-[0.82rem] text-muted">{pending[locale]}</p>
      <div className="mt-5 h-px w-8 bg-accent/40" />
    </div>
  );
}

export function StorySection({ locale }: { locale: Locale }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow={locale === "vi" ? "Câu chuyện hình thành" : "Our story"}
          title={
            locale === "vi"
              ? "Một chặng đường được viết bằng công trình."
              : "A journey written in projects."
          }
          intro={pending[locale]}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <PendingCard key={index} label={`0${index}`} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CertificationsSection({ locale }: { locale: Locale }) {
  return (
    <section className="bg-cloud py-20 lg:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow={locale === "vi" ? "Chứng chỉ & giải thưởng" : "Certifications & awards"}
          title={
            locale === "vi"
              ? "Minh chứng cho chất lượng và trách nhiệm."
              : "Evidence of quality and responsibility."
          }
          intro={pending[locale]}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="border border-line bg-white p-6">
              <BadgeCheck className="size-6 text-brand/50" strokeWidth={1.4} />
              <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/50">
                {locale === "vi" ? "Đang cập nhật" : "To be updated"}
              </p>
              <div className="mt-5 h-px w-8 bg-accent/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LeadershipSection({ locale }: { locale: Locale }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow={locale === "vi" ? "Ban lãnh đạo" : "Leadership"}
          title={
            locale === "vi" ? "Những người dẫn dắt đội ngũ." : "The people leading the team."
          }
          intro={pending[locale]}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="border border-line bg-cloud">
              <div className="flex aspect-[4/5] items-center justify-center bg-sky/60">
                <UserRound className="size-10 text-brand/25" strokeWidth={1} />
              </div>
              <div className="border-t border-line bg-white p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/50">
                  {pending[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FacilitiesSection({ locale }: { locale: Locale }) {
  return (
    <section className="bg-cloud py-20 lg:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow={locale === "vi" ? "Cơ sở vật chất" : "Facilities"}
          title={
            locale === "vi"
              ? "Văn phòng và nhà xưởng trên hai địa điểm."
              : "Office and factory across two locations."
          }
          intro={pending[locale]}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[1, 2].map((index) => (
            <div key={index} className="aspect-[16/10] border border-dashed border-line bg-white p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/50">
                0{index} — {pending[locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ locale }: { locale: Locale }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow={locale === "vi" ? "Cảm nhận khách hàng" : "Testimonials"}
          title={
            locale === "vi" ? "Chia sẻ từ những người đồng hành." : "Words from our partners."
          }
          intro={pending[locale]}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-line bg-cloud p-6">
              <Quote className="size-6 text-accent/40" />
              <p className="mt-4 text-[0.85rem] leading-relaxed text-muted">{pending[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ locale, site }: { locale: Locale; site: SiteData }) {
  const faqs =
    locale === "vi"
      ? [
          {
            q: "Fansipan Group cung cấp những dịch vụ nào?",
            a: "Cơ điện (M&E), điều hòa – làm lạnh (HVAC), tháp giải nhiệt & thiết bị công nghiệp, và bảo trì hệ thống.",
          },
          {
            q: "Làm thế nào để yêu cầu khảo sát hoặc báo giá?",
            a: "Bạn có thể gửi form trên website, gọi hotline hoặc email. Đội ngũ sẽ liên hệ để xác nhận nhu cầu và sắp xếp khảo sát khi cần.",
          },
          {
            q: "Fansipan Group đang hoạt động tại những khu vực nào?",
            a: "Thị trường hiện tại gồm Hà Nội, Hưng Yên, Hải Phòng và Thanh Hóa; mục tiêu mở rộng sang Bắc Ninh, Thái Nguyên và Phú Thọ.",
          },
          {
            q: "Có thể xem hồ sơ năng lực ở đâu?",
            a: "Hồ sơ năng lực được trình bày dạng sách lật tại trang Hồ sơ năng lực và có thể tải xuống dạng PDF.",
          },
        ]
      : [
          {
            q: "What services does Fansipan Group provide?",
            a: "M&E, HVAC, cooling towers and industrial equipment, and system maintenance.",
          },
          {
            q: "How can I request a survey or quotation?",
            a: "Send the form on this website, call the hotline or email us. Our team will confirm your requirements and arrange a survey if required.",
          },
          {
            q: "Where does Fansipan Group operate?",
            a: "Our current markets are Hanoi, Hung Yen, Hai Phong and Thanh Hoa, with plans to expand to Bac Ninh, Thai Nguyen and Phu Tho.",
          },
          {
            q: "Where can I find the company profile?",
            a: "The profile is available as a page-turning book on the Company profile page and can be downloaded as a PDF.",
          },
        ];

  return (
    <section className="bg-cloud py-20 lg:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow={locale === "vi" ? "Câu hỏi thường gặp" : "FAQ"}
          title={locale === "vi" ? "Câu hỏi trước khi bắt đầu." : "Questions before we start."}
          intro={
            locale === "vi"
              ? "Một số câu hỏi thường gặp. Nếu chưa có câu trả lời bạn cần, hãy liên hệ trực tiếp."
              : "A few common questions. If yours is not covered, contact us directly."
          }
          action={
            <Link href={`/${locale}${paths.contact}`} className="link-arrow">
              {site.contact.hotlineDisplay}
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-10 max-w-4xl border-t border-line">
          {faqs.map((faq, index) => (
            <details key={faq.q} className="group border-b border-line bg-white/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-1 py-5 text-[0.92rem] font-medium text-ink">
                <span className="flex gap-4">
                  <span className="font-mono text-[0.65rem] text-accent">0{index + 1}</span>
                  {faq.q}
                </span>
                <span className="text-brand transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-5 pl-10 pr-8 text-[0.85rem] leading-relaxed text-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
