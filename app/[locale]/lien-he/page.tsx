import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { OfficeMaps } from "@/components/contact/office-maps";
import { ClientsStrip } from "@/components/clients/clients-strip";
import { getServices, getSite } from "@/lib/content";
import { isLocale, paths, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

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
    quote: "Yêu cầu báo giá / Khảo sát",
    quoteIntro:
      "Điền thông tin bên dưới để đội ngũ kỹ thuật liên hệ lại. Các trường có dấu * là bắt buộc.",
    offices: "Văn phòng & nhà xưởng",
    officesIntro:
      "Fansipan Group làm việc tại văn phòng Hà Nội và nhà xưởng Hưng Yên. Vui lòng liên hệ trước khi đến để được sắp xếp tiếp đón.",
    contactTitle: "Kênh liên hệ trực tiếp",
    careers: "Tuyển dụng",
    careersBody: "Xem vị trí đang tuyển và gửi hồ sơ trực tuyến.",
    profile: "Hồ sơ năng lực",
    profileBody: "Xem năng lực, dịch vụ và dự án tiêu biểu của Fansipan Group.",
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
    quote: "Request a quote / survey",
    quoteIntro:
      "Complete the form below and our engineering team will get back to you. Fields marked * are required.",
    offices: "Office & factory",
    officesIntro:
      "Fansipan Group operates from our Hanoi office and Hung Yen factory. Please contact us in advance so we can arrange to receive you.",
    contactTitle: "Direct contact channels",
    careers: "Careers",
    careersBody: "View open positions and apply online.",
    profile: "Company profile",
    profileBody: "Explore Fansipan Group's capability, services and selected projects.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "vi";
  return buildMetadata({
    locale: lang,
    path: paths.contact,
    title: lang === "vi" ? "Liên hệ" : "Contact",
    description:
      lang === "vi"
        ? "Liên hệ Fansipan Group: hotline 0913 339 190, email sales.fansipan@gmail.com. Văn phòng Hà Nội, nhà xưởng Hưng Yên. Gửi yêu cầu báo giá và khảo sát."
        : "Contact Fansipan Group: hotline 0913 339 190, email sales.fansipan@gmail.com. Hanoi office, Hung Yen factory. Send a quote or survey request.",
  });
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="group flex items-center justify-between gap-4 border border-line bg-white p-5 transition-colors hover:bg-brand-050"
    >
      <span className="flex min-w-0 items-center gap-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center border border-line bg-cloud text-brand transition-colors group-hover:border-brand/25 group-hover:bg-white">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted/65">
            {label}
          </span>
          <span className="mt-1 block truncate text-[0.9rem] font-medium text-ink">{value}</span>
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
    </a>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [site, services] = await Promise.all([getSite(), getServices()]);
  const c = copy[locale];
  const t = uiFor(locale);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
        breadcrumb={[
          { label: t.home, href: `/${locale}` },
          { label: c.eyebrow },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <a href={`tel:${site.contact.hotline}`} className="btn btn-primary btn-sm">
            <Phone className="size-3.5" />
            <span className="num">{site.contact.hotlineDisplay}</span>
          </a>
          <a href={`mailto:${site.contact.email}`} className="btn btn-outline btn-sm">
            <Mail className="size-3.5" />
            {site.contact.email}
          </a>
        </div>
      </PageHero>

      <section id="quote" className="scroll-mt-28 bg-white py-12 lg:py-16">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brand">{c.contactTitle}</p>
            <h2 className="display-3 mt-3 text-ink">
              {locale === "vi" ? "Gọi, nhắn hoặc gửi yêu cầu." : "Call, message or send a request."}
            </h2>
            <div className="mt-6 space-y-3">
              <ContactCard
                icon={<Phone className="size-4" strokeWidth={1.7} />}
                label={c.hotline}
                value={site.contact.hotlineDisplay}
                href={`tel:${site.contact.hotline}`}
              />
              <ContactCard
                icon={<Phone className="size-4" strokeWidth={1.7} />}
                label={c.phone}
                value={site.contact.phoneDisplay}
                href={`tel:${site.contact.phone}`}
              />
              <ContactCard
                icon={<Mail className="size-4" strokeWidth={1.7} />}
                label={c.email}
                value={site.contact.email}
                href={`mailto:${site.contact.email}`}
              />
              <ContactCard
                icon={<MessageCircle className="size-4" strokeWidth={1.7} />}
                label={c.zalo}
                value={site.contact.hotlineDisplay}
                href={`https://zalo.me/${site.contact.zalo}`}
                external
              />
            </div>

            <div className="mt-8 border border-line bg-cloud p-5">
              <p className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/65">
                <MapPin className="size-3.5 text-brand" />
                {c.offices}
              </p>
              <div className="mt-3 space-y-3">
                {site.offices.map((office) => (
                  <div key={office.id}>
                    <p className="text-[0.78rem] font-semibold text-ink">{office.name[locale]}</p>
                    <p className="mt-0.5 text-[0.76rem] leading-relaxed text-muted">
                      {office.address[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <QuickLink
                href={`/${locale}${paths.careers}`}
                title={c.careers}
                body={c.careersBody}
              />
              <QuickLink
                href={`/${locale}${paths.profile}`}
                title={c.profile}
                body={c.profileBody}
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-5 flex items-start gap-3 border-l-2 border-accent pl-4">
              <div>
                <p className="text-[0.95rem] font-semibold text-ink">{c.quote}</p>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{c.quoteIntro}</p>
              </div>
            </div>
            <ContactForm locale={locale} services={services} />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-cloud py-12 lg:py-16">
        <div className="wrap">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand">{c.offices}</p>
            <h2 className="display-3 mt-3 text-ink">
              {locale === "vi" ? "Hai địa điểm, một đầu mối." : "Two locations, one point of contact."}
            </h2>
            <p className="mt-4 text-[0.88rem] leading-relaxed text-muted">{c.officesIntro}</p>
          </div>
          <div className="mt-8">
            <OfficeMaps locale={locale} site={site} mode="grid" />
          </div>
        </div>
      </section>

      <ClientsStrip locale={locale} site={site} compact />

      <section className="bg-white py-10">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 border border-line bg-cloud px-6 py-5">
          <p className="flex items-center gap-2 text-[0.8rem] text-muted">
            <Clock3 className="size-4 text-brand" strokeWidth={1.6} />
            {site.contact.workingHours
              ? site.contact.workingHours
              : locale === "vi"
                ? "Vui lòng liên hệ trước khi đến văn phòng hoặc nhà xưởng."
                : "Please contact us before visiting the office or factory."}
          </p>
          <Link href={`/${locale}${paths.about}`} className="link-arrow">
            {locale === "vi" ? "Tìm hiểu về Fansipan Group" : "More about Fansipan Group"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function QuickLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group border border-line bg-white p-4 transition-colors hover:border-brand/35 hover:bg-brand-050/40"
    >
      <span className="flex items-center justify-between gap-2 text-[0.82rem] font-semibold text-ink">
        {title}
        <ArrowUpRight className="size-3.5 text-muted/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
      </span>
      <span className="mt-1 block text-[0.72rem] leading-relaxed text-muted">{body}</span>
    </Link>
  );
}

function uiFor(locale: Locale) {
  return {
    home: locale === "vi" ? "Trang chủ" : "Home",
  };
}
