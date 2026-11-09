import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { OfficeMaps } from "@/components/contact/office-maps";
import { paths, type Locale } from "@/lib/i18n";
import type { Service, SiteData } from "@/lib/types";

const copy = {
  vi: {
    eyebrow: "Liên hệ",
    title: "Trao đổi về công trình của bạn.",
    intro:
      "Gửi nhu cầu khảo sát, báo giá hoặc câu hỏi kỹ thuật. Đội ngũ Fansipan Group sẽ liên hệ để làm rõ phạm vi công việc và đề xuất bước tiếp theo.",
    hotline: "Hotline / Zalo",
    phone: "Điện thoại",
    email: "Email",
    zalo: "Chat Zalo",
  },
  en: {
    eyebrow: "Contact",
    title: "Let's talk about your facility.",
    intro:
      "Send a survey request, ask for a quotation or raise a technical question. Our team will contact you to clarify the scope and propose the next step.",
    hotline: "Hotline / Zalo",
    phone: "Phone",
    email: "Email",
    zalo: "Chat on Zalo",
  },
} as const;

export function ContactSection({
  locale,
  site,
  services,
}: {
  locale: Locale;
  site: SiteData;
  services: Service[];
}) {
  const c = copy[locale];
  const office = site.offices[0];

  return (
    <section
      id="lien-he"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fafd_0%,#eef4fc_100%)] py-14 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <div className="wrap relative">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-accent" aria-hidden />
            <p className="eyebrow text-brand">{c.eyebrow}</p>
            <span className="eyebrow text-muted/50">/ 10</span>
          </div>
          <h2 className="display-2 mt-5 text-ink">{c.title}</h2>
          <p className="lead mt-5 max-w-xl">{c.intro}</p>
        </div>

        <div className="mt-11 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="border border-line bg-white">
              <a
                href={`tel:${site.contact.hotline}`}
                className="group flex items-center justify-between gap-4 border-b border-line p-5 transition-colors hover:bg-brand-050 sm:p-6"
              >
                <span>
                  <span className="block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted/70">
                    {c.hotline}
                  </span>
                  <span className="num mt-1 block text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">
                    {site.contact.hotlineDisplay}
                  </span>
                </span>
                <span className="flex size-11 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:scale-105">
                  <Phone className="size-5" strokeWidth={1.8} />
                </span>
              </a>

              <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
                <a
                  href={`tel:${site.contact.phone}`}
                  className="group p-5 transition-colors hover:bg-brand-050"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted/70">
                    <Phone className="size-3" />
                    {c.phone}
                  </span>
                  <span className="num mt-2 block text-[0.88rem] font-medium text-ink">
                    {site.contact.phoneDisplay}
                  </span>
                </a>
                <a
                  href={`https://zalo.me/${site.contact.zalo}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group p-5 transition-colors hover:bg-brand-050"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted/70">
                    <MessageCircle className="size-3" />
                    Zalo
                  </span>
                  <span className="mt-2 block text-[0.88rem] font-medium text-ink">{c.zalo}</span>
                </a>
              </div>

              <a
                href={`mailto:${site.contact.email}`}
                className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-brand-050 sm:p-6"
              >
                <span>
                  <span className="block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted/70">
                    {c.email}
                  </span>
                  <span className="mt-1 block break-all text-[0.88rem] font-medium text-ink">
                    {site.contact.email}
                  </span>
                </span>
                <Mail className="size-4 text-brand" />
              </a>
            </div>

            <div className="mt-5">
              <OfficeMaps locale={locale} site={site} mode="tabs" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.74rem] text-muted">
              <Link
                href={`/${locale}${paths.contact}`}
                className="inline-flex items-center gap-1 font-medium text-brand"
              >
                {locale === "vi" ? "Trang liên hệ đầy đủ" : "Full contact page"}
                <ArrowUpRight className="size-3.5" />
              </Link>
              <span className="text-muted/50">{office?.name[locale]}</span>
            </div>
          </div>

          <div id="quote" className="order-1 scroll-mt-28 lg:order-2 lg:col-span-7">
            <ContactForm locale={locale} services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}
