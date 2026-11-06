import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const COLORS = {
  navy: "#071A35",
  navySoft: "#0A2346",
  brand: "#0027AA",
  brandLight: "#DFE9FF",
  accent: "#DB0114",
  ink: "#0B1B33",
  muted: "#5B6B7F",
  line: "#D6E1EE",
  cloud: "#F3F7FC",
  sky: "#EAF3FD",
  white: "#FFFFFF",
};

const PAGE = { w: 595.28, h: 841.89 };
const MARGIN = 52;

function color(hex) {
  return rgb(
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  );
}

function readFont(primary, fallback) {
  return fs
    .readFile(primary)
    .catch(() => fs.readFile(fallback))
    .catch(() => {
      throw new Error(
        "No suitable TTF font found. Set CATALOGUE_FONT_REGULAR and CATALOGUE_FONT_BOLD.",
      );
    });
}

async function main() {
  const [site, services, projects] = await Promise.all([
    fs.readFile(path.join(root, "data", "site.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, "data", "services.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, "data", "projects.json"), "utf8").then(JSON.parse),
  ]);

  const regularBytes = await readFont(
    process.env.CATALOGUE_FONT_REGULAR ||
      "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
  );
  const boldBytes = await readFont(
    process.env.CATALOGUE_FONT_BOLD ||
      "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
  );

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(regularBytes, { subset: true });
  const bold = await pdf.embedFont(boldBytes, { subset: true });
  const logoBytes = await fs.readFile(path.join(root, "public", "brand", "mark-white.png"));
  const logo = await pdf.embedPng(logoBytes);

  pdf.setTitle("Hồ sơ năng lực — Fansipan Group");
  pdf.setAuthor("Công ty cổ phần Fansipan Group");
  pdf.setSubject("M&E · HVAC · Tháp giải nhiệt · Bảo trì hệ thống");
  pdf.setCreator("FANSIPAN GROUP");
  pdf.setLanguage("vi-VN");

  const totalPages = 8;
  let pageNumber = 0;

  const newPage = (bg = COLORS.white) => {
    const page = pdf.addPage([PAGE.w, PAGE.h]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE.w, height: PAGE.h, color: color(bg) });
    pageNumber += 1;
    return page;
  };

  const wrap = (text, typeface, size, maxWidth) => {
    const lines = [];
    for (const paragraph of text.split("\n")) {
      if (!paragraph.trim()) {
        lines.push("");
        continue;
      }
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (typeface.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
          line = candidate;
        } else {
          lines.push(line);
          line = word;
        }
      }
      if (line) lines.push(line);
    }
    return lines;
  };

  const text = (
    page,
    value,
    {
      x,
      y,
      size = 10,
      typeface = font,
      fill = COLORS.ink,
      maxWidth,
      lineHeight = 1.5,
      opacity = 1,
    },
  ) => {
    const lines = maxWidth ? wrap(value, typeface, size, maxWidth) : value.split("\n");
    lines.forEach((line, index) => {
      page.drawText(line, {
        x,
        y: y - index * size * lineHeight,
        size,
        font: typeface,
        color: color(fill),
        opacity,
      });
    });
    return y - lines.length * size * lineHeight;
  };

  const eyebrow = (page, value, x, y, fill = COLORS.brand) => {
    page.drawText(value.toUpperCase(), {
      x,
      y,
      size: 7,
      font: bold,
      color: color(fill),
    });
  };

  const rule = (page, x1, y, x2, fill = COLORS.line, thickness = 0.6) => {
    page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness,
      color: color(fill),
    });
  };

  const grid = (page, step = 44, fill = COLORS.white, opacity = 0.035) => {
    for (let x = 0; x <= PAGE.w; x += step) {
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: PAGE.h },
        thickness: 0.4,
        color: color(fill),
        opacity,
      });
    }
    for (let y = 0; y <= PAGE.h; y += step) {
      page.drawLine({
        start: { x: 0, y },
        end: { x: PAGE.w, y },
        thickness: 0.4,
        color: color(fill),
        opacity,
      });
    }
  };

  const ridge = (page, baseY, amplitude, fill, opacity, shift = 0) => {
    const points = [];
    const count = 12;
    for (let i = 0; i <= count; i += 1) {
      const x = (PAGE.w / count) * i;
      const peak = i % 2 === 0 ? amplitude : amplitude * 0.35;
      const y = baseY + peak + Math.sin((i + shift) * 1.7) * 8;
      points.push({ x, y });
    }
    for (let i = 0; i < points.length - 1; i += 1) {
      page.drawLine({
        start: points[i],
        end: points[i + 1],
        thickness: 0.9,
        color: color(fill),
        opacity,
      });
    }
  };

  const footer = (page, dark = false) => {
    const fill = dark ? COLORS.white : COLORS.muted;
    const opacity = dark ? 0.45 : 0.7;
    rule(page, MARGIN, 40, PAGE.w - MARGIN, dark ? COLORS.white : COLORS.line, 0.4);
    page.drawText("FANSIPAN GROUP.,JSC", {
      x: MARGIN,
      y: 27,
      size: 6.5,
      font: bold,
      color: color(fill),
      opacity,
    });
    page.drawText("fansipan-group.vn", {
      x: PAGE.w / 2 - 26,
      y: 27,
      size: 6.5,
      font,
      color: color(fill),
      opacity,
    });
    page.drawText(`${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`, {
      x: PAGE.w - MARGIN - 34,
      y: 27,
      size: 6.5,
      font,
      color: color(fill),
      opacity,
    });
  };

  const sectionHeader = (page, number, title, intro) => {
    eyebrow(page, `Fansipan Group — ${number}`, MARGIN, PAGE.h - 66, COLORS.brand);
    const titleSize = 25;
    const titleY = PAGE.h - 106;
    const titleLines = wrap(title, bold, titleSize, PAGE.w - MARGIN * 2);
    titleLines.forEach((line, index) => {
      page.drawText(line, {
        x: MARGIN,
        y: titleY - index * titleSize * 1.18,
        size: titleSize,
        font: bold,
        color: color(COLORS.ink),
      });
    });
    let cursor = titleY - titleLines.length * titleSize * 1.18;
    if (intro) {
      cursor = text(page, intro, {
        x: MARGIN,
        y: cursor,
        size: 9.5,
        fill: COLORS.muted,
        maxWidth: PAGE.w - MARGIN * 2,
        lineHeight: 1.55,
      });
    }
    const ruleY = cursor - 8;
    rule(page, MARGIN, ruleY, PAGE.w - MARGIN);
    return ruleY - 26;
  };

  /* ---------------------------------------------------------------- Cover */
  {
    const page = newPage(COLORS.navy);
    grid(page);
    ridge(page, 190, 120, COLORS.white, 0.14, 0);
    ridge(page, 120, 80, COLORS.white, 0.09, 2);

    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE.w,
      height: 12,
      color: color(COLORS.accent),
    });

    page.drawImage(logo, { x: MARGIN, y: PAGE.h - 120, width: 46, height: 46 });
    page.drawText("FANSIPAN GROUP.,JSC", {
      x: MARGIN + 60,
      y: PAGE.h - 98,
      size: 11,
      font: bold,
      color: color(COLORS.white),
    });
    page.drawText("M&E · HVAC · COOLING TOWERS · MAINTENANCE", {
      x: MARGIN + 60,
      y: PAGE.h - 112,
      size: 6.5,
      font,
      color: color(COLORS.white),
      opacity: 0.55,
    });

    page.drawText("HỒ SƠ", {
      x: MARGIN,
      y: PAGE.h - 300,
      size: 66,
      font: bold,
      color: color(COLORS.white),
    });
    page.drawText("NĂNG LỰC", {
      x: MARGIN,
      y: PAGE.h - 366,
      size: 66,
      font: bold,
      color: color(COLORS.white),
    });
    page.drawRectangle({
      x: MARGIN,
      y: PAGE.h - 392,
      width: 64,
      height: 3,
      color: color(COLORS.accent),
    });
    page.drawText("COMPANY PROFILE", {
      x: MARGIN,
      y: PAGE.h - 418,
      size: 10,
      font,
      color: color(COLORS.white),
      opacity: 0.6,
    });

    text(page, site.company.slogan.vi, {
      x: MARGIN,
      y: PAGE.h - 470,
      size: 20,
      typeface: bold,
      fill: COLORS.white,
      maxWidth: 380,
    });

    const bottomY = 180;
    rule(page, MARGIN, bottomY, PAGE.w - MARGIN, COLORS.white, 0.4);
    const columns = [
      { title: "LĨNH VỰC", lines: services.map((service) => service.shortTitle.vi) },
      { title: "THỊ TRƯỜNG", lines: ["Hà Nội", "Hưng Yên", "Hải Phòng", "Thanh Hóa"] },
      { title: "LIÊN HỆ", lines: [site.contact.hotlineDisplay, site.contact.email] },
    ];
    columns.forEach((column, index) => {
      const x = MARGIN + index * ((PAGE.w - MARGIN * 2) / 3);
      page.drawText(column.title, {
        x,
        y: bottomY - 20,
        size: 6.5,
        font: bold,
        color: color(COLORS.white),
        opacity: 0.45,
      });
      column.lines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x,
          y: bottomY - 38 - lineIndex * 13,
          size: 8,
          font,
          color: color(COLORS.white),
          opacity: 0.8,
        });
      });
    });

    page.drawText("2026", {
      x: PAGE.w - MARGIN - 40,
      y: 27,
      size: 7,
      font: bold,
      color: color(COLORS.white),
      opacity: 0.45,
    });
    pageNumber = 1;
  }

  /* ------------------------------------------------------------- Overview */
  {
    const page = newPage();
    grid(page, 44, COLORS.brand, 0.025);
    const top = sectionHeader(
      page,
      "01 / GIỚI THIỆU",
      "Năng lực được kiểm chứng qua từng công trình.",
      "Fansipan Group cung cấp giải pháp cơ điện, HVAC, tháp giải nhiệt và bảo trì hệ thống cho nhà máy và khu công nghiệp — từ khảo sát, thiết kế, cung cấp thiết bị, thi công đến vận hành.",
    );

    const paragraphs = site.about.intro.vi.split(/\n{2,}/).filter(Boolean);
    let y = top - 8;
    paragraphs.slice(0, 3).forEach((paragraph) => {
      y = text(page, paragraph, {
        x: MARGIN,
        y,
        size: 9.5,
        fill: COLORS.muted,
        maxWidth: PAGE.w - MARGIN * 2,
        lineHeight: 1.7,
      });
      y -= 16;
    });

    const statsY = y - 26;
    rule(page, MARGIN, statsY + 76, PAGE.w - MARGIN);
    const statWidth = (PAGE.w - MARGIN * 2) / 3;
    site.stats.slice(0, 3).forEach((stat, index) => {
      const x = MARGIN + index * statWidth;
      page.drawText(String(stat.value).padStart(2, "0"), {
        x,
        y: statsY,
        size: 44,
        font: bold,
        color: color(COLORS.brand),
      });
      text(page, stat.label.vi, {
        x,
        y: statsY - 26,
        size: 8,
        fill: COLORS.muted,
        maxWidth: statWidth - 20,
        lineHeight: 1.5,
      });
      if (index > 0) {
        page.drawLine({
          start: { x: x - 18, y: statsY - 6 },
          end: { x: x - 18, y: statsY + 52 },
          thickness: 0.5,
          color: color(COLORS.line),
        });
      }
    });

    rule(page, MARGIN, statsY - 80, PAGE.w - MARGIN);
    const half = (PAGE.w - MARGIN * 2 - 24) / 2;
    eyebrow(page, "Tầm nhìn", MARGIN, statsY - 108);
    text(page, site.about.vision[0].vi, {
      x: MARGIN,
      y: statsY - 128,
      size: 8.5,
      fill: COLORS.ink,
      maxWidth: half,
      lineHeight: 1.65,
    });
    eyebrow(page, "Sứ mệnh", MARGIN + half + 24, statsY - 108);
    text(page, site.about.mission[0].vi, {
      x: MARGIN + half + 24,
      y: statsY - 128,
      size: 8.5,
      fill: COLORS.ink,
      maxWidth: half,
      lineHeight: 1.65,
    });

    const valuesY = statsY - 250;
    rule(page, MARGIN, valuesY + 22, PAGE.w - MARGIN);
    eyebrow(page, "Giá trị cốt lõi", MARGIN, valuesY + 4);
    const valueW = (PAGE.w - MARGIN * 2 - 32) / 3;
    site.about.values.forEach((value, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = MARGIN + column * (valueW + 16);
      const y = valuesY - 22 - row * 72;
      text(page, value.title.vi, {
        x,
        y,
        size: 9,
        typeface: bold,
        fill: COLORS.ink,
        maxWidth: valueW,
        lineHeight: 1.3,
      });
      text(page, value.body.vi, {
        x,
        y: y - 18,
        size: 7.4,
        fill: COLORS.muted,
        maxWidth: valueW,
        lineHeight: 1.5,
      });
    });

    footer(page);
  }

  /* ------------------------------------------------------------- Services */
  {
    const page = newPage(COLORS.cloud);
    const top = sectionHeader(
      page,
      "02 / LĨNH VỰC HOẠT ĐỘNG",
      "Bốn lĩnh vực, một chuẩn kỹ thuật.",
      "Mỗi hạng mục được triển khai theo cùng một cách: khảo sát kỹ, thi công chuẩn và bàn giao rõ ràng.",
    );

    const cardW = (PAGE.w - MARGIN * 2 - 16) / 2;
    const cardH = 216;
    services.forEach((service, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = MARGIN + column * (cardW + 16);
      const y = top - row * (cardH + 16);
      page.drawRectangle({
        x,
        y: y - cardH,
        width: cardW,
        height: cardH,
        color: color(COLORS.white),
        borderColor: color(COLORS.line),
        borderWidth: 0.6,
      });
      page.drawRectangle({
        x,
        y: y - 4,
        width: cardW,
        height: 4,
        color: color(COLORS.brand),
      });
      page.drawText(service.code, {
        x: x + 20,
        y: y - 30,
        size: 7,
        font: bold,
        color: color(COLORS.brand),
      });
      text(page, service.title.vi, {
        x: x + 20,
        y: y - 58,
        size: 13,
        typeface: bold,
        fill: COLORS.ink,
        maxWidth: cardW - 40,
        lineHeight: 1.35,
      });
      text(page, service.short.vi, {
        x: x + 20,
        y: y - 96,
        size: 8,
        fill: COLORS.muted,
        maxWidth: cardW - 40,
        lineHeight: 1.6,
      });
      rule(page, x + 20, y - cardH + 34, x + cardW - 20);
      page.drawText(`${service.scope.length} nhóm hạng mục`, {
        x: x + 20,
        y: y - cardH + 20,
        size: 7,
        font,
        color: color(COLORS.muted),
      });
    });

    footer(page);
  }

  /* ------------------------------------------------------ Service details */
  const servicePages = [
    services.slice(0, 2),
    services.slice(2, 4),
  ];
  servicePages.forEach((group, groupIndex) => {
    const page = newPage();
    const top = sectionHeader(
      page,
      `03.${groupIndex + 1} / DỊCH VỤ`,
      groupIndex === 0 ? "Cơ điện & HVAC." : "Tháp giải nhiệt & Bảo trì.",
      "Phạm vi công việc được xác định theo hồ sơ kỹ thuật và điều kiện thực tế của từng công trình.",
    );

    group.forEach((service, index) => {
      const y = top - 22 - index * 292;
      page.drawText(service.code, {
        x: MARGIN,
        y,
        size: 7,
        font: bold,
        color: color(COLORS.accent),
      });
      text(page, service.title.vi, {
        x: MARGIN,
        y: y - 24,
        size: 15,
        typeface: bold,
        fill: COLORS.ink,
        maxWidth: PAGE.w - MARGIN * 2,
      });
      const introEnd = text(page, service.intro.vi, {
        x: MARGIN,
        y: y - 48,
        size: 8.5,
        fill: COLORS.muted,
        maxWidth: PAGE.w - MARGIN * 2,
        lineHeight: 1.6,
      });
      let bulletY = introEnd - 18;
      const items = service.scope.flatMap((scope) => scope.items).slice(0, 6);
      items.forEach((item) => {
        page.drawCircle({
          x: MARGIN + 2,
          y: bulletY + 2.5,
          size: 1.4,
          color: color(COLORS.accent),
        });
        text(page, item.vi, {
          x: MARGIN + 12,
          y: bulletY,
          size: 8,
          fill: COLORS.ink,
          maxWidth: PAGE.w - MARGIN * 2 - 12,
        });
        const lines = wrap(item.vi, font, 8, PAGE.w - MARGIN * 2 - 12);
        bulletY -= lines.length * 12 + 6;
      });
      if (index === 0) rule(page, MARGIN, y - 262, PAGE.w - MARGIN);
    });

    footer(page);
  });

  /* -------------------------------------------------------------- Projects */
  {
    const page = newPage(COLORS.cloud);
    const top = sectionHeader(
      page,
      "04 / DỰ ÁN TIÊU BIỂU",
      "Công trình trải dài từ hàng không đến nhiệt điện.",
      "Thông tin dự án được công bố ở mức cơ bản. Logo, hình ảnh và tài liệu chi tiết chỉ hiển thị khi được khách hàng xác nhận.",
    );

    const tableY = top - 14;
    const columns = [
      { label: "DỰ ÁN", x: MARGIN, width: 150 },
      { label: "HẠNG MỤC", x: MARGIN + 158, width: 176 },
      { label: "ĐỊA ĐIỂM", x: MARGIN + 342, width: 86 },
      { label: "NĂM", x: MARGIN + 436, width: 28 },
    ];
    columns.forEach((column) => {
      page.drawText(column.label, {
        x: column.x,
        y: tableY,
        size: 6.5,
        font: bold,
        color: color(COLORS.brand),
      });
    });
    rule(page, MARGIN, tableY - 8, PAGE.w - MARGIN, COLORS.brand, 0.8);

    let rowY = tableY - 26;
    projects.forEach((project) => {
      text(page, project.name, {
        x: MARGIN,
        y: rowY,
        size: 7.2,
        typeface: bold,
        fill: COLORS.ink,
        maxWidth: 150,
        lineHeight: 1.35,
      });
      text(page, project.scope.vi, {
        x: MARGIN + 158,
        y: rowY,
        size: 7,
        fill: COLORS.muted,
        maxWidth: 176,
        lineHeight: 1.35,
      });
      text(page, project.location.vi, {
        x: MARGIN + 342,
        y: rowY,
        size: 7,
        fill: COLORS.muted,
        maxWidth: 86,
        lineHeight: 1.35,
      });
      if (project.year) {
        page.drawText(String(project.year), {
          x: MARGIN + 436,
          y: rowY,
          size: 7,
          font,
          color: color(COLORS.muted),
        });
      }
      rowY -= 34;
      rule(page, MARGIN, rowY + 13, PAGE.w - MARGIN, COLORS.line, 0.4);
    });

    text(page, "Tổng cộng 11 dự án tiêu biểu trên 7 lĩnh vực công nghiệp.", {
      x: MARGIN,
      y: rowY - 4,
      size: 7,
      fill: COLORS.muted,
      maxWidth: PAGE.w - MARGIN * 2,
    });

    footer(page);
  }

  /* --------------------------------------------------------------- Process */
  {
    const page = newPage();
    const top = sectionHeader(
      page,
      "05 / QUY TRÌNH",
      "Từ yêu cầu đến bàn giao, có lộ trình.",
      "Mỗi dự án được triển khai theo một quy trình rõ ràng, có kiểm soát ở từng bước và được điều chỉnh theo phạm vi công việc thực tế.",
    );

    const cardW = (PAGE.w - MARGIN * 2 - 18) / 2;
    const cardH = 136;
    site.process.forEach((step, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = MARGIN + column * (cardW + 18);
      const y = top - 10 - row * (cardH + 12);
      page.drawRectangle({
        x,
        y: y - cardH,
        width: cardW,
        height: cardH,
        color: color(COLORS.cloud),
      });
      page.drawText(String(index + 1).padStart(2, "0"), {
        x: x + 16,
        y: y - 30,
        size: 20,
        font: bold,
        color: color(COLORS.brand),
        opacity: 0.35,
      });
      text(page, step.title.vi, {
        x: x + 16,
        y: y - 58,
        size: 10.5,
        typeface: bold,
        fill: COLORS.ink,
        maxWidth: cardW - 32,
      });
      text(page, step.body.vi, {
        x: x + 16,
        y: y - 80,
        size: 7.6,
        fill: COLORS.muted,
        maxWidth: cardW - 32,
        lineHeight: 1.5,
      });
    });

    const quoteY = top - 10 - 3 * (cardH + 12) - 30;
    rule(page, MARGIN, quoteY + 18, PAGE.w - MARGIN, COLORS.line, 0.5);
    text(page, `“${site.processIntro.vi}”`, {
      x: MARGIN,
      y: quoteY,
      size: 9.5,
      fill: COLORS.navy,
      maxWidth: PAGE.w - MARGIN * 2,
      lineHeight: 1.5,
    });

    footer(page);
  }

  /* --------------------------------------------------------------- Contact */
  {
    const page = newPage(COLORS.navy);
    grid(page);
    ridge(page, 120, 90, COLORS.white, 0.1, 1);

    page.drawImage(logo, { x: MARGIN, y: PAGE.h - 118, width: 40, height: 40 });
    page.drawText("FANSIPAN GROUP.,JSC", {
      x: MARGIN,
      y: PAGE.h - 140,
      size: 9,
      font: bold,
      color: color(COLORS.white),
      opacity: 0.8,
    });

    page.drawText("LIÊN HỆ", {
      x: MARGIN,
      y: PAGE.h - 250,
      size: 46,
      font: bold,
      color: color(COLORS.white),
    });
    page.drawRectangle({
      x: MARGIN,
      y: PAGE.h - 270,
      width: 54,
      height: 3,
      color: color(COLORS.accent),
    });
    text(page, site.company.slogan.vi, {
      x: MARGIN,
      y: PAGE.h - 310,
      size: 16,
      typeface: bold,
      fill: COLORS.white,
      maxWidth: 420,
    });

    const contactY = PAGE.h - 390;
    const hotline = site.contact.hotlineDisplay;
    page.drawText("HOTLINE / ZALO", {
      x: MARGIN,
      y: contactY,
      size: 6.5,
      font: bold,
      color: color(COLORS.white),
      opacity: 0.45,
    });
    page.drawText(hotline, {
      x: MARGIN,
      y: contactY - 28,
      size: 24,
      font: bold,
      color: color(COLORS.white),
    });
    page.drawText(site.contact.email, {
      x: MARGIN,
      y: contactY - 54,
      size: 10,
      font,
      color: color(COLORS.white),
      opacity: 0.75,
    });

    rule(page, MARGIN, contactY - 84, PAGE.w - MARGIN, COLORS.white, 0.4);

    const officesY = contactY - 116;
    site.offices.forEach((office, index) => {
      const x = MARGIN + index * ((PAGE.w - MARGIN * 2) / 2);
      page.drawText(office.kind.vi.toUpperCase(), {
        x,
        y: officesY,
        size: 6,
        font: bold,
        color: color(COLORS.white),
        opacity: 0.4,
      });
      text(page, office.name.vi, {
        x,
        y: officesY - 16,
        size: 9,
        typeface: bold,
        fill: COLORS.white,
        maxWidth: (PAGE.w - MARGIN * 2) / 2 - 20,
      });
      text(page, office.address.vi, {
        x,
        y: officesY - 34,
        size: 8,
        fill: COLORS.white,
        maxWidth: (PAGE.w - MARGIN * 2) / 2 - 20,
        lineHeight: 1.5,
        opacity: 0.65,
      });
    });

    page.drawText("fansipan-group.vn", {
      x: MARGIN,
      y: 64,
      size: 11,
      font: bold,
      color: color(COLORS.white),
      opacity: 0.9,
    });
    page.drawText("M&E · HVAC · COOLING TOWERS · MAINTENANCE", {
      x: MARGIN,
      y: 48,
      size: 6.5,
      font,
      color: color(COLORS.white),
      opacity: 0.45,
    });
    pageNumber = 8;
  }

  const bytes = await pdf.save();
  const output = path.join(root, "public", "catalogue", "fansipan-group-profile.pdf");
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, bytes);
  const size = (bytes.length / 1024).toFixed(0);
  console.log(`Catalogue written to ${path.relative(root, output)} (${size} KB, ${pdf.getPageCount()} pages)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
