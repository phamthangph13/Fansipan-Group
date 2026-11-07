# FANSIPAN GROUP — Website

Website song ngữ (Tiếng Việt / English) của Công ty cổ phần Fansipan Group: giới thiệu năng lực, dịch vụ cơ điện – HVAC – tháp giải nhiệt – bảo trì, dự án, tin tức, hồ sơ năng lực dạng sách lật trang, tuyển dụng và khu vực quản trị nội dung.

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, font Be Vietnam Pro / IBM Plex Mono / Lora
- Nội dung lưu trong `data/*.json` (CMS giai đoạn 1), chỉnh sửa trực tiếp qua `/admin`
- Biểu mẫu liên hệ và ứng tuyển: lưu vào JSON + gửi email qua SMTP, có honeypot và giới hạn tần suất

## Yêu cầu

- Node.js 20.19 trở lên (khuyến nghị 20 LTS)
- npm

> Ghi chú phiên bản: dự án đang dùng `pdfjs-dist@5.4.624`. Không nâng lên v6 nếu máy chủ vẫn chạy Node 20, vì v6 yêu cầu Node >= 22.13.

## Cài đặt

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`. Trang mặc định sẽ chuyển về `/vi`.

### Biến môi trường

Sao chép `.env.example` thành `.env.local` và điền giá trị thật:

| Biến | Mô tả |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Tên miền production, dùng cho canonical, sitemap, schema. Mặc định `https://fansipan-group.vn`. |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập `/admin`. Bắt buộc đặt khi production; ở môi trường dev, nếu để trống sẽ dùng `fansipan2026`. |
| `ADMIN_SESSION_SECRET` | Chuỗi bí mật ký cookie phiên quản trị. Bắt buộc đặt khi production. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Cấu hình SMTP gửi email. Nếu thiếu, biểu mẫu vẫn lưu dữ liệu nhưng bỏ qua bước gửi mail và ghi log. |
| `SMTP_FROM` | Địa chỉ người gửi, ví dụ `"FANSIPAN GROUP" <no-reply@fansipan-group.vn>`. |
| `MAIL_TO` | Email nhận yêu cầu báo giá. Mặc định lấy `site.contact.email`. |
| `CAREERS_MAIL_TO` | Email nhận hồ sơ ứng tuyển. Mặc định lấy `site.contact.careersEmail`. |

## Scripts

```bash
npm run dev         # chạy dev server
npm run build       # build production
npm run start       # chạy bản build
npm run typecheck   # kiểm tra TypeScript
npm run catalogue   # tạo lại PDF hồ sơ năng lực
```

## Cấu trúc chính

```
app/
  [locale]/            Trang công khai: chủ, giới thiệu, dịch vụ, dự án, tin tức,
                       hồ sơ năng lực, tuyển dụng, liên hệ, chính sách bảo mật
  actions/             Server actions cho biểu mẫu liên hệ và ứng tuyển
  admin/               Đăng nhập và khu vực quản trị
  sitemap.ts           Sitemap song ngữ
  robots.ts            robots.txt
components/
  home/                Các section của trang chủ
  layout/              Header, footer, page hero, floating contact
  projects/            Bộ lọc dự án
  news/                Danh sách và chi tiết bài viết
  profile/             Sách lật trang PDF
  admin/               Thành phần dùng chung cho khu quản trị
data/
  site.json            Thông tin công ty, liên hệ, văn phòng, số liệu, thứ tự section
  services.json        4 lĩnh vực dịch vụ
  projects.json        Danh mục dự án
  news.json            Bài viết
  jobs.json            Vị trí tuyển dụng
  submissions.json     Yêu cầu báo giá (sinh ra khi khách gửi form)
  applications.json    Hồ sơ ứng tuyển (sinh ra khi ứng viên gửi form)
  uploads/applications/ CV tải lên
lib/                   Types, đọc/ghi nội dung, auth, mail, validation, SEO
public/
  brand/               Logo, icon
  images/              Ảnh hero, OG
  catalogue/           PDF hồ sơ năng lực
  pdf/                 Worker của pdf.js
scripts/
  generate-catalogue.mjs  Tạo PDF hồ sơ năng lực
```

## Khu quản trị

Đăng nhập tại `https://<domain>/admin/login`.

Các mục hiện có:

- **Tổng quan** — số liệu nhanh về yêu cầu báo giá và hồ sơ ứng tuyển.
- **Yêu cầu báo giá** — danh sách, đánh dấu đã đọc, xoá.
- **Hồ sơ ứng tuyển** — danh sách, tải CV, đánh dấu đã đọc, xoá.
- **Trang chủ** — bật/tắt và sắp xếp thứ tự các section.
- **Dự án** — thêm/sửa/xoá dự án, bật công khai, đánh dấu nổi bật, gán lĩnh vực.
- **Tin tức** — viết/sửa/xoá bài, chọn chuyên mục, xuất bản hoặc lưu nháp.
- **Tuyển dụng** — thêm/sửa/xoá vị trí, trạng thái đang tuyển, hạn nộp.
- **Cài đặt** — thông tin công ty, liên hệ, mạng xã hội, văn phòng/nhà xưởng, số liệu năng lực, catalogue, khách hàng & đối tác.

Mọi thay đổi được ghi vào `data/*.json` và áp dụng cho cả hai ngôn ngữ.

### Lưu ý quan trọng khi triển khai

Cách lưu nội dung bằng file JSON phù hợp với server có ổ đĩa ghi được (VPS, máy chủ riêng, Docker volume). Trên nền tảng serverless/read-only filesystem (ví dụ Vercel), thay đổi từ `/admin` và file CV tải lên sẽ **không được giữ lại** sau khi triển khai hoặc khởi động lại. Khi cần chạy serverless, hãy thay lớp `lib/content.ts` bằng cơ sở dữ liệu và `lib/storage.ts` bằng object storage.

## Nội dung & dữ liệu

### Quy tắc nội dung

- Số liệu năng lực chỉ dùng đúng: **11 năm kinh nghiệm**, **50 nhân sự & chuyên gia**, **20 dự án & khách hàng**. Không thêm “+” hoặc số liệu chưa xác nhận.
- Tất cả dự án đang để `allowPublic: false`; chỉ bật khi có xác nhận của khách hàng. Không đưa dữ liệu nội bộ hoặc thông tin nhạy cảm vào mô tả.
- Logo khách hàng nằm trong `site.clients` và được bật bằng `showLogos`. Hiện website dùng 6 logo demo (An Phat, VAECO, Panasonic, j-TECH, Vitto, Toyoda Gosei) để trình bày bố cục; thay bằng tệp logo chính thức trong `public/images/clients/` trước khi công bố.
- Hình ảnh dự án, dịch vụ, tin tức và tuyển dụng hiện là ảnh minh họa (demo) từ Wikimedia Commons. Danh sách tác giả, giấy phép và nguồn nằm tại `/image-credits.html`.
- Không hiển thị thông tin liên hệ nội bộ (chị Hảo – 0339529934) trên website.

### Trang chủ

Thứ tự và trạng thái bật/tắt của từng section nằm trong `data/site.json` → `homeSections`. Có thể chỉnh trong `/admin/trang-chu`. Các section tuỳ chọn (chứng chỉ, ban lãnh đạo, cơ sở vật chất, cảm nhận khách hàng, FAQ, câu chuyện công ty) đã được xây dựng nhưng mặc định tắt.

### Dự án

Mỗi dự án gồm: tên VI/EN, phạm vi, địa điểm, năm (có thể để trống), trạng thái, lĩnh vực, ảnh minh họa, cờ `featured` và `allowPublic`. Ảnh dự án hiện là ảnh demo, không phải ảnh công trình thực tế; website hiển thị ghi chú tương ứng. Chỉ bật `allowPublic` khi có xác nhận của khách hàng.

### Tin tức & tuyển dụng

Nội dung chi tiết hỗ trợ định dạng đơn giản:

- `## Tiêu đề mục`
- `### Tiêu đề phụ`
- Dòng bắt đầu bằng `- ` cho danh sách
- `**chữ đậm**`
- Các khối cách nhau bằng một dòng trống

## Hồ sơ năng lực (PDF + sách lật trang)

- PDF nằm tại `public/catalogue/fansipan-group-profile.pdf`.
- Trang `/vi/ho-so-nang-luc` và `/en/ho-so-nang-luc` hiển thị sách lật trang, có tải PDF, phóng to, toàn màn hình, xem trang và điều hướng bằng bàn phím/vuốt.
- PDF được kết xuất phía client bằng `pdfjs-dist`; worker nằm tại `public/pdf/pdf.worker.min.mjs`. Khi nâng cấp `pdfjs-dist`, phải chép lại worker tương ứng:

```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf/pdf.worker.min.mjs
```

### Tạo lại catalogue

```bash
npm run catalogue
```

Script dùng `pdf-lib` + font hệ thống Arial/Arial Bold (hỗ trợ tiếng Việt). Có thể chỉ định font khác:

```bash
CATALOGUE_FONT_REGULAR="/path/to/font.ttf" \
CATALOGUE_FONT_BOLD="/path/to/font-bold.ttf" \
npm run catalogue
```

Khi có PDF chính thức, chỉ cần thay file trong `public/catalogue/` và cập nhật đường dẫn trong `/admin/cai-dat` nếu cần.

## Hình ảnh & tài nguyên

Các vị trí ảnh chính:

| Vị trí | Đường dẫn / ghi chú |
| --- | --- |
| Ảnh hero Fansipan | `public/images/hero-fansipan.jpg` (ảnh toàn cảnh đỉnh Fansipan, khách hàng cung cấp) |
| Ảnh OG chia sẻ | `public/images/og-cover.jpg` |
| Logo | `public/brand/logo-full.png`, `mark.png`, `mark-white.png`, `icon.png`, `apple-icon.png` |
| Ảnh dịch vụ | `public/images/services/` — gán trong `data/services.json` |
| Ảnh dự án | `public/images/projects/` — gán trong `data/projects.json` hoặc `/admin/du-an` |
| Logo khách hàng | `public/images/clients/` — cấu hình trong `data/site.json` → `clients.logos` |
| Ảnh tin tức | `public/images/news/` — gán trong `data/news.json` |
| Ảnh tuyển dụng / giới thiệu | `public/images/careers/`, `public/images/about/` |
| Catalogue PDF | `public/catalogue/` |

Ảnh demo được lấy từ Wikimedia Commons (public domain, CC0, CC BY, CC BY-SA). Trang `/image-credits.html` ghi nhận đầy đủ tác giả, giấy phép và liên kết nguồn; liên kết này nằm ở chân trang. Khi thay bằng ảnh thật của công ty, cập nhật lại trang ghi nhận và xóa các ảnh không còn sử dụng.

Logo khách hàng hiện là phiên bản mô phỏng đơn giản cho mục đích trình bày. Thay bằng tệp chính thức do khách hàng cung cấp trước khi công bố.

Nếu một dịch vụ, dự án hoặc bài viết chưa có ảnh, website tự động dùng hình minh hoạ SVG theo chuyên mục.

## Biểu mẫu & email

- **Yêu cầu báo giá**: họ tên, điện thoại, email, công ty, nhu cầu, nội dung, đồng ý chính sách bảo mật. Dữ liệu lưu vào `data/submissions.json`.
- **Ứng tuyển**: họ tên, điện thoại, email, vị trí (điền sẵn), thư giới thiệu, CV (PDF/DOC/DOCX, tối đa 5 MB), đồng ý chính sách. Dữ liệu lưu vào `data/applications.json`; CV lưu trong `data/uploads/applications/`.
- Honeypot `website` và trường `startedAt`, kèm giới hạn 5 lượt / IP / 10 phút.
- Nếu chưa cấu hình SMTP, server ghi log `[mail] skipped` và dữ liệu vẫn được lưu bình thường.

## SEO & accessibility

- Metadata song ngữ, canonical, `hreflang`, Open Graph, Twitter card.
- `sitemap.xml`, `robots.txt`.
- Schema.org `Organization` / `LocalBusiness`.
- Skip link, focus state, điều hướng bàn phím, tôn trọng `prefers-reduced-motion`.
- Ảnh dùng `next/image`, ưu tiên ảnh hero, lazy-load phần còn lại.

## Triển khai

1. Cài biến môi trường production (đặc biệt `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, SMTP).
2. `npm ci && npm run build && npm run start`.
3. Đảm bảo thư mục `data/` và `data/uploads/` có quyền ghi cho tiến trình Node.
4. Cấu hình reverse proxy (Nginx/Caddy) trỏ về cổng 3000 và bật HTTPS.
5. Kiểm tra `robots.txt`, `sitemap.xml`, `https://<domain>/vi` và `/en`.
6. Sao lưu định kỳ `data/*.json` và `data/uploads/`.

### Kiểm tra nhanh sau triển khai

```bash
npm run typecheck
npm run build
curl -I https://<domain>/vi
curl -I https://<domain>/en
curl -I https://<domain>/sitemap.xml
```

## Giấy phép

Website nội bộ của Công ty cổ phần Fansipan Group. Mọi nội dung, hình ảnh và thương hiệu thuộc quyền sở hữu của công ty.
