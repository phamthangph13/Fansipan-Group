import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Globe2,
  Mail,
  MapPinned,
  Save,
  Share2,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { getSite } from "@/lib/content";
import { AdminNotice } from "@/components/admin/notice";
import { AdminField, LocalizedInput } from "@/components/admin/form-fields";
import { saveSettings } from "@/app/admin/actions";

export const metadata = { title: "Cài đặt" };

const sections = [
  { href: "#cong-ty", label: "Công ty" },
  { href: "#lien-he", label: "Liên hệ" },
  { href: "#van-phong", label: "Văn phòng" },
  { href: "#so-lieu", label: "Số liệu" },
  { href: "#catalogue", label: "Catalogue" },
  { href: "#khach-hang", label: "Khách hàng" },
];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const site = await getSite();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">Cài đặt</p>
          <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">
            Thông tin website
          </h1>
          <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-relaxed text-muted">
            Thông tin công ty, liên hệ, văn phòng, số liệu năng lực và cấu hình hiển thị trên toàn
            website.
          </p>
        </div>
        <Link href="/vi/lien-he" target="_blank" className="btn btn-outline btn-sm">
          Xem trang liên hệ
          <ExternalLink className="size-3.5" />
        </Link>
      </div>

      <div className="mt-5">
        <AdminNotice ok={params.ok} error={params.error} />
      </div>

      <nav
        aria-label="Mục cài đặt"
        className="no-scrollbar mb-5 flex gap-1 overflow-x-auto border border-line bg-white p-1.5"
      >
        {sections.map((section) => (
          <a
            key={section.href}
            href={section.href}
            className="whitespace-nowrap px-3 py-1.5 text-[0.72rem] font-medium text-muted transition-colors hover:bg-cloud hover:text-brand"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <form action={saveSettings} className="space-y-5">
        <section id="cong-ty" className="scroll-mt-28 border border-line bg-white">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
            <Building2 className="size-4 text-brand" strokeWidth={1.7} />
            <h2 className="text-[0.92rem] font-semibold text-ink">Thông tin công ty</h2>
          </div>
          <div className="grid gap-5 p-5 md:grid-cols-2">
            <AdminField label="Tên hiển thị" htmlFor="displayName">
              <input
                id="displayName"
                name="displayName"
                defaultValue={site.company.displayName}
                className="input"
              />
            </AdminField>
            <AdminField
              label="Tên viết tắt"
              htmlFor="shortName"
              hint="Dùng trong nội dung ngắn, thẻ và tiêu đề."
            >
              <input
                id="shortName"
                name="shortName"
                defaultValue={site.company.shortName}
                className="input"
              />
            </AdminField>
            <LocalizedInput base="legalName" label="Tên pháp lý" values={site.company.legalName} />
            <LocalizedInput base="slogan" label="Slogan" values={site.company.slogan} />
            <AdminField label="Mã số thuế" htmlFor="taxCode" hint="Để trống nếu chưa có.">
              <input
                id="taxCode"
                name="taxCode"
                defaultValue={site.company.taxCode}
                className="input font-mono text-[0.86rem]"
              />
            </AdminField>
            <AdminField label="Năm thành lập" htmlFor="foundedYear" hint="Để trống nếu chưa xác nhận.">
              <input
                id="foundedYear"
                name="foundedYear"
                type="number"
                min={1990}
                max={2100}
                defaultValue={site.company.foundedYear ?? ""}
                className="input"
              />
            </AdminField>
            <AdminField
              label="Tên miền"
              htmlFor="domain"
              hint="Dùng cho canonical, sitemap và dữ liệu schema."
              className="md:col-span-2"
            >
              <input
                id="domain"
                name="domain"
                defaultValue={site.company.domain}
                className="input font-mono text-[0.82rem]"
              />
            </AdminField>
          </div>
        </section>

        <section id="lien-he" className="scroll-mt-28 border border-line bg-white">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
            <Mail className="size-4 text-brand" strokeWidth={1.7} />
            <h2 className="text-[0.92rem] font-semibold text-ink">Liên hệ</h2>
          </div>
          <div className="grid gap-5 p-5 md:grid-cols-2">
            <AdminField label="Hotline / Zalo" htmlFor="hotline" hint="Dùng cho nút gọi và liên kết Zalo.">
              <input
                id="hotline"
                name="hotline"
                defaultValue={site.contact.hotline}
                className="input font-mono text-[0.86rem]"
              />
            </AdminField>
            <AdminField label="Hotline hiển thị" htmlFor="hotlineDisplay">
              <input
                id="hotlineDisplay"
                name="hotlineDisplay"
                defaultValue={site.contact.hotlineDisplay}
                className="input font-mono text-[0.86rem]"
              />
            </AdminField>
            <AdminField label="Điện thoại cố định" htmlFor="phone">
              <input
                id="phone"
                name="phone"
                defaultValue={site.contact.phone}
                className="input font-mono text-[0.86rem]"
              />
            </AdminField>
            <AdminField label="Điện thoại hiển thị" htmlFor="phoneDisplay">
              <input
                id="phoneDisplay"
                name="phoneDisplay"
                defaultValue={site.contact.phoneDisplay}
                className="input font-mono text-[0.86rem]"
              />
            </AdminField>
            <AdminField label="Email nhận yêu cầu báo giá" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={site.contact.email}
                className="input font-mono text-[0.82rem]"
              />
            </AdminField>
            <AdminField label="Email nhận hồ sơ ứng tuyển" htmlFor="careersEmail">
              <input
                id="careersEmail"
                name="careersEmail"
                type="email"
                defaultValue={site.contact.careersEmail}
                className="input font-mono text-[0.82rem]"
              />
            </AdminField>
            <AdminField label="Số Zalo" htmlFor="zalo">
              <input
                id="zalo"
                name="zalo"
                defaultValue={site.contact.zalo}
                className="input font-mono text-[0.86rem]"
              />
            </AdminField>
            <AdminField label="Giờ làm việc" htmlFor="workingHours" hint="Để trống nếu không hiển thị.">
              <input
                id="workingHours"
                name="workingHours"
                defaultValue={site.contact.workingHours}
                className="input"
                placeholder="VD: Thứ 2 – Thứ 6, 08:00 – 17:30"
              />
            </AdminField>
          </div>

          <div className="border-t border-line bg-cloud/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <Share2 className="size-3.5 text-brand" />
              <h3 className="text-[0.8rem] font-semibold text-ink">Kênh mạng xã hội</h3>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <AdminField label="Facebook" htmlFor="facebook">
                <input
                  id="facebook"
                  name="facebook"
                  defaultValue={site.social.facebook}
                  className="input font-mono text-[0.74rem]"
                  placeholder="https://facebook.com/…"
                />
              </AdminField>
              <AdminField label="YouTube" htmlFor="youtube">
                <input
                  id="youtube"
                  name="youtube"
                  defaultValue={site.social.youtube}
                  className="input font-mono text-[0.74rem]"
                  placeholder="https://youtube.com/…"
                />
              </AdminField>
              <AdminField label="LinkedIn" htmlFor="linkedin">
                <input
                  id="linkedin"
                  name="linkedin"
                  defaultValue={site.social.linkedin}
                  className="input font-mono text-[0.74rem]"
                  placeholder="https://linkedin.com/…"
                />
              </AdminField>
              <AdminField label="Zalo" htmlFor="socialZalo">
                <input
                  id="socialZalo"
                  name="socialZalo"
                  defaultValue={site.social.zalo}
                  className="input font-mono text-[0.74rem]"
                  placeholder="https://zalo.me/…"
                />
              </AdminField>
            </div>
          </div>
        </section>

        <section id="van-phong" className="scroll-mt-28 border border-line bg-white">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
            <MapPinned className="size-4 text-brand" strokeWidth={1.7} />
            <h2 className="text-[0.92rem] font-semibold text-ink">Văn phòng &amp; nhà xưởng</h2>
          </div>
          <div className="divide-y divide-line">
            {site.offices.map((office, index) => (
              <div key={office.id} className="p-5">
                <p className="mb-4 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-accent">
                  {office.kind.vi} · {office.id}
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-4">
                    <fieldset>
                      <legend className="field-label">Tên địa điểm</legend>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                        <div className="field">
                          <label
                            htmlFor={`officeNameVi${index}`}
                            className="!text-[0.7rem] !font-medium !text-muted"
                          >
                            Tiếng Việt
                          </label>
                          <input
                            id={`officeNameVi${index}`}
                            name={`officeNameVi${index}`}
                            defaultValue={office.name.vi}
                            className="input"
                          />
                        </div>
                        <div className="field">
                          <label
                            htmlFor={`officeNameEn${index}`}
                            className="!text-[0.7rem] !font-medium !text-muted"
                          >
                            English
                          </label>
                          <input
                            id={`officeNameEn${index}`}
                            name={`officeNameEn${index}`}
                            defaultValue={office.name.en}
                            className="input"
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="space-y-4">
                    <AdminField
                      label="Địa chỉ (VI)"
                      htmlFor={`officeAddressVi${index}`}
                      required
                    >
                      <input
                        id={`officeAddressVi${index}`}
                        name={`officeAddressVi${index}`}
                        defaultValue={office.address.vi}
                        className="input"
                      />
                    </AdminField>
                    <AdminField label="Địa chỉ (EN)" htmlFor={`officeAddressEn${index}`}>
                      <input
                        id={`officeAddressEn${index}`}
                        name={`officeAddressEn${index}`}
                        defaultValue={office.address.en}
                        className="input"
                      />
                    </AdminField>
                  </div>
                  <AdminField label="Liên kết Google Maps" htmlFor={`officeMapUrl${index}`}>
                    <input
                      id={`officeMapUrl${index}`}
                      name={`officeMapUrl${index}`}
                      defaultValue={office.mapUrl}
                      className="input font-mono text-[0.72rem]"
                    />
                  </AdminField>
                  <AdminField
                    label="Mã nhúng bản đồ"
                    htmlFor={`officeMapEmbed${index}`}
                    hint="Đường dẫn iframe Google Maps (output=embed)."
                  >
                    <input
                      id={`officeMapEmbed${index}`}
                      name={`officeMapEmbed${index}`}
                      defaultValue={office.mapEmbed}
                      className="input font-mono text-[0.72rem]"
                    />
                  </AdminField>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="so-lieu" className="scroll-mt-28 border border-line bg-white">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
            <Users className="size-4 text-brand" strokeWidth={1.7} />
            <h2 className="text-[0.92rem] font-semibold text-ink">Số liệu năng lực</h2>
          </div>
          <div className="p-5">
            <p className="mb-4 text-[0.72rem] leading-relaxed text-muted">
              Chỉ sử dụng các số liệu đã được xác nhận: 11 năm kinh nghiệm, 50 nhân sự &amp; chuyên
              gia, 20 dự án &amp; khách hàng. Không thêm “+” hoặc số liệu chưa kiểm chứng.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {site.stats.map((stat, index) => (
                <div key={index} className="border border-line p-4">
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted/60">
                    Số liệu {index + 1}
                  </p>
                  <div className="mt-3 space-y-3">
                    <AdminField label="Giá trị" htmlFor={`statValue${index}`}>
                      <input
                        id={`statValue${index}`}
                        name={`statValue${index}`}
                        type="number"
                        min={0}
                        defaultValue={stat.value}
                        className="input font-mono"
                      />
                    </AdminField>
                    <AdminField label="Nhãn (VI)" htmlFor={`statLabelVi${index}`}>
                      <input
                        id={`statLabelVi${index}`}
                        name={`statLabelVi${index}`}
                        defaultValue={stat.label.vi}
                        className="input"
                      />
                    </AdminField>
                    <AdminField label="Nhãn (EN)" htmlFor={`statLabelEn${index}`}>
                      <input
                        id={`statLabelEn${index}`}
                        name={`statLabelEn${index}`}
                        defaultValue={stat.label.en}
                        className="input"
                      />
                    </AdminField>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="catalogue" className="scroll-mt-28 border border-line bg-white">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
            <Globe2 className="size-4 text-brand" strokeWidth={1.7} />
            <h2 className="text-[0.92rem] font-semibold text-ink">Hồ sơ năng lực</h2>
          </div>
          <div className="grid gap-5 p-5 md:grid-cols-2">
            <AdminField
              label="Đường dẫn PDF"
              htmlFor="cataloguePdf"
              hint="Tệp đặt trong /public/catalogue/."
              className="md:col-span-2"
            >
              <input
                id="cataloguePdf"
                name="cataloguePdf"
                defaultValue={site.catalogue.pdf}
                className="input font-mono text-[0.8rem]"
              />
            </AdminField>
            <LocalizedInput base="catalogueTitle" label="Tiêu đề" values={site.catalogue.title} />
            <LocalizedInput
              base="catalogueSubtitle"
              label="Phụ đề"
              values={site.catalogue.subtitle}
            />
            <LocalizedInput
              base="catalogueNote"
              label="Ghi chú"
              values={site.catalogue.note}
              textarea
              className="md:col-span-2"
            />
          </div>
        </section>

        <section id="khach-hang" className="scroll-mt-28 border border-line bg-white">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
            <SlidersHorizontal className="size-4 text-brand" strokeWidth={1.7} />
            <h2 className="text-[0.92rem] font-semibold text-ink">Khách hàng &amp; đối tác</h2>
          </div>
          <div className="space-y-4 p-5">
            <label className="checkbox-row cursor-pointer">
              <input
                type="checkbox"
                name="showLogos"
                defaultChecked={site.clients.showLogos}
                className="accent-[var(--color-brand)]"
              />
              <span>
                <span className="block font-medium text-ink">Hiển thị lưới logo khách hàng</span>
                <span className="mt-0.5 block text-[0.7rem] text-muted">
                  Khi bật, website hiển thị lưới logo trong mục Khách hàng và đối tác. Danh sách
                  logo được cấu hình trong data/site.json, tệp ảnh đặt tại
                  public/images/clients.
                </span>
              </span>
            </label>
            <LocalizedInput base="clientsNote" label="Ghi chú" values={site.clients.note} />
          </div>
        </section>

        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 border border-line bg-white/95 p-3 shadow-[0_18px_40px_-30px_rgba(7,24,44,0.5)] backdrop-blur">
          <p className="px-1 text-[0.7rem] text-muted">
            Thay đổi áp dụng cho cả hai ngôn ngữ sau khi lưu.
          </p>
          <button type="submit" className="btn btn-primary btn-sm">
            <Save className="size-3.5" />
            Lưu cài đặt
          </button>
        </div>
      </form>
    </div>
  );
}
