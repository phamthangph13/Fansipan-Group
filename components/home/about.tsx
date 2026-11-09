import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { paths, type Locale } from "@/lib/i18n";

const copy = {
  vi: {
    eyebrow: "Về Fansipan Group",
    title: "Chuyên gia Cơ điện (M&E), HVAC, Tháp giải nhiệt và Bảo trì hệ thống",
    intro:
      "Fansipan Group cung cấp giải pháp cơ điện toàn diện, từ tư vấn, thiết kế, cung cấp thiết bị, thi công đến vận hành và bảo trì hệ thống.",
    second:
      "Với đội ngũ kỹ sư giàu kinh nghiệm và quy trình chuyên nghiệp, chúng tôi cam kết tối ưu hiệu suất, tiết kiệm năng lượng, đảm bảo an toàn và kéo dài tuổi thọ thiết bị.",
    more: "Tìm hiểu thêm về Fansipan Group",
  },
  en: {
    eyebrow: "About Fansipan Group",
    title: "Specialists in M&E, HVAC, cooling towers and system maintenance",
    intro:
      "Fansipan Group delivers integrated M&E solutions, from consultancy, design and equipment supply to installation, operation and system maintenance.",
    second:
      "With an experienced engineering team and disciplined processes, we are committed to optimising performance, saving energy, ensuring safety and extending equipment life.",
    more: "More about Fansipan Group",
  },
} as const;

export function AboutSection({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <section id="gioi-thieu" className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] border-l border-line bg-[linear-gradient(160deg,var(--color-brand-050),#fff_72%)] lg:block" aria-hidden />
      <div className="wrap relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-accent" aria-hidden />
              <p className="eyebrow text-brand">{c.eyebrow}</p>
              <span className="eyebrow text-muted/50">/ 01</span>
            </div>
            <h2 className="display-2 mt-5 max-w-[22ch] text-ink">{c.title}</h2>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="text-[1rem] leading-[1.85] text-ink-soft">{c.intro}</p>
            <p className="mt-4 text-[0.92rem] leading-[1.8] text-muted">{c.second}</p>
            <div className="mt-7 border-t border-line pt-5">
              <Link href={`/${locale}${paths.about}`} className="link-arrow">
                {c.more}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
