"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { paths, switchLocalePath, ui, type Locale } from "@/lib/i18n";
import type { Project, Service, SiteData } from "@/lib/types";

type MenuKey = "services" | "projects" | null;

export function Header({
  locale,
  site,
  services,
  projects,
}: {
  locale: Locale;
  site: SiteData;
  services: Service[];
  projects: Project[];
}) {
  const pathname = usePathname();
  const t = ui[locale];
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [drawer, setDrawer] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuKey>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setDrawer(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (path: string) => {
    const full = `/${locale}${path}`;
    if (!path) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  const navLink = (path: string, label: string) => (
    <Link
      href={`/${locale}${path}`}
      className={cn(
        "relative flex h-full items-center px-1 text-[0.83rem] font-medium text-ink/80 transition-colors hover:text-brand",
        "after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300",
        "hover:after:scale-x-100",
        isActive(path) && "text-brand after:scale-x-100",
      )}
    >
      {label}
    </Link>
  );

  const megaLink = (path: string) => `/${locale}${path}`;
  const projectCounts = (id: string) =>
    projects.filter((project) => project.categories.includes(id as never)).length;

  const openWithDelay = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };

  const closeWithDelay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[box-shadow,background-color] duration-300",
        scrolled ? "bg-white shadow-[0_10px_36px_-24px_rgba(7,24,44,0.4)]" : "bg-white/95 backdrop-blur",
      )}
      onMouseLeave={closeWithDelay}
    >
      <div className="hidden border-b border-white/10 bg-navy text-white/70 lg:block">
        <div className="wrap flex h-8 items-center justify-between gap-6 text-[0.69rem]">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${site.contact.hotline}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="size-3" strokeWidth={1.8} />
              <span className="num">{site.contact.hotlineDisplay}</span>
              <span className="text-white/30">·</span>
              <span>{t.labels.hotline}</span>
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="size-3" strokeWidth={1.8} />
              {site.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-mono uppercase tracking-[0.18em] text-white/40">
              {t.footer.statement ? `${site.company.shortName} · M&E / HVAC` : null}
            </span>
            <Link
              href={`/${locale}${paths.profile}`}
              className="inline-flex items-center gap-1 text-white/75 transition-colors hover:text-white"
            >
              {t.nav.profile}
              <ArrowUpRight className="size-3" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "wrap flex items-center justify-between gap-6 transition-[height] duration-300",
          scrolled ? "h-[64px]" : "h-[76px]",
        )}
      >
        <Link href={`/${locale}`} aria-label={site.company.displayName} className="shrink-0">
          <Logo size={scrolled ? "sm" : "md"} />
        </Link>

        <nav className="hidden h-full items-center gap-7 lg:flex" aria-label={t.labels.menu}>
          {navLink("", t.nav.home)}
          {navLink(paths.about, t.nav.about)}

          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => openWithDelay("services")}
          >
            <button
              type="button"
              aria-expanded={openMenu === "services"}
              aria-controls="mega-services"
              onClick={() => setOpenMenu(openMenu === "services" ? null : "services")}
              className={cn(
                "inline-flex items-center gap-1 text-[0.83rem] font-medium text-ink/80 transition-colors hover:text-brand",
                openMenu === "services" && "text-brand",
              )}
            >
              {t.nav.services}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  openMenu === "services" && "rotate-180",
                )}
                strokeWidth={2}
              />
            </button>
            {openMenu === "services" ? (
              <div
                id="mega-services"
                className="absolute left-1/2 top-full w-[min(920px,92vw)] -translate-x-1/2 border border-line bg-white shadow-[0_32px_80px_-40px_rgba(7,24,44,0.5)]"
              >
                <div className="grid grid-cols-2">
                  <div className="grid grid-cols-2 gap-px bg-line">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={megaLink(`${paths.services}/${service.slug}`)}
                        className="group flex min-h-[148px] flex-col justify-between bg-white p-5 transition-colors hover:bg-brand-050"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-mono text-[0.68rem] tracking-[0.18em] text-brand">
                            {service.code}
                          </span>
                          <ArrowUpRight
                            className="size-4 text-muted/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                            strokeWidth={1.6}
                          />
                        </div>
                        <div>
                          <p className="text-[0.95rem] font-semibold leading-snug text-ink">
                            {service.title[locale]}
                          </p>
                          <p className="mt-2 line-clamp-2 text-[0.76rem] leading-relaxed text-muted">
                            {service.short[locale]}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col justify-between bg-navy p-7 text-white">
                    <div>
                      <p className="eyebrow text-white/45">Fansipan Group</p>
                      <p className="mt-4 font-serif text-[1.35rem] italic leading-snug text-white">
                        {locale === "vi"
                          ? "Một đầu mối cho toàn bộ vòng đời hệ thống kỹ thuật."
                          : "One partner across the whole technical system lifecycle."}
                      </p>
                    </div>
                    <div className="mt-8 space-y-4">
                      <Link
                        href={`/${locale}${paths.services}`}
                        className="group inline-flex items-center gap-2 text-[0.82rem] font-semibold text-white"
                      >
                        {locale === "vi" ? "Tất cả dịch vụ" : "All services"}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <div className="h-px bg-white/12" />
                      <Link
                        href={`/${locale}${paths.contact}`}
                        className="group inline-flex items-center gap-2 text-[0.82rem] text-white/65 transition-colors hover:text-white"
                      >
                        {t.actions.contactConsult}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => openWithDelay("projects")}
          >
            <button
              type="button"
              aria-expanded={openMenu === "projects"}
              aria-controls="mega-projects"
              onClick={() => setOpenMenu(openMenu === "projects" ? null : "projects")}
              className={cn(
                "inline-flex items-center gap-1 text-[0.83rem] font-medium text-ink/80 transition-colors hover:text-brand",
                openMenu === "projects" && "text-brand",
              )}
            >
              {t.nav.projects}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  openMenu === "projects" && "rotate-180",
                )}
                strokeWidth={2}
              />
            </button>
            {openMenu === "projects" ? (
              <div
                id="mega-projects"
                className="absolute left-1/2 top-full w-[min(760px,90vw)] -translate-x-1/2 border border-line bg-white shadow-[0_32px_80px_-40px_rgba(7,24,44,0.5)]"
              >
                <div className="grid grid-cols-[1.25fr_0.75fr]">
                  <div className="grid grid-cols-2 gap-px bg-line">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`${megaLink(paths.projects)}?category=${service.id}`}
                        className="group flex items-center justify-between gap-4 bg-white p-5 transition-colors hover:bg-brand-050"
                      >
                        <div>
                          <p className="text-[0.88rem] font-semibold text-ink">
                            {service.shortTitle[locale]}
                          </p>
                          <p className="mt-1 text-[0.72rem] text-muted">
                            {projectCounts(service.id)} {locale === "vi" ? "dự án" : "projects"}
                          </p>
                        </div>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-muted/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                          strokeWidth={1.6}
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col justify-between bg-sky p-6">
                    <div>
                      <p className="eyebrow text-brand/70">{t.labels.project}</p>
                      <p className="mt-3 text-[0.9rem] font-medium leading-snug text-ink">
                        {locale === "vi"
                          ? "11 dự án tiêu biểu trên 7 lĩnh vực công nghiệp."
                          : "11 representative projects across 7 industrial sectors."}
                      </p>
                    </div>
                    <Link
                      href={`/${locale}${paths.projects}`}
                      className="group mt-6 inline-flex items-center gap-2 text-[0.8rem] font-semibold text-brand"
                    >
                      {t.actions.allProjects}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {navLink(paths.news, t.nav.news)}
          {navLink(paths.careers, t.nav.careers)}
          {navLink(paths.contact, t.nav.contact)}
        </nav>

        <div className="flex items-center gap-2.5">
          <div
            className="hidden items-center border border-line p-0.5 font-mono text-[0.64rem] font-medium tracking-[0.08em] md:flex"
            role="group"
            aria-label="Language"
          >
            {(["vi", "en"] as const).map((code) => (
              <Link
                key={code}
                href={switchLocalePath(pathname, code)}
                hrefLang={code}
                className={cn(
                  "px-2 py-1 uppercase transition-colors",
                  locale === code ? "bg-brand text-white" : "text-muted hover:text-ink",
                )}
                aria-current={locale === code ? "true" : undefined}
              >
                {code}
              </Link>
            ))}
          </div>

          <Link
            href={`/${locale}${paths.contact}#quote`}
            className="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            {t.actions.quote}
            <ArrowRight className="size-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label={t.labels.menu}
            aria-expanded={drawer}
            className="inline-flex size-10 items-center justify-center text-ink lg:hidden"
          >
            <Menu className="size-6" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label={t.actions.close}
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(88vw,400px)] flex-col bg-white shadow-2xl">
            <div className="flex h-[76px] items-center justify-between border-b border-line px-5">
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label={t.actions.close}
                className="inline-flex size-10 items-center justify-center text-ink"
              >
                <X className="size-6" strokeWidth={1.7} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label={t.labels.menu}>
              <Link href={`/${locale}`} className="block border-b border-line py-3.5 text-[0.95rem] font-medium">
                {t.nav.home}
              </Link>
              <Link
                href={`/${locale}${paths.about}`}
                className="block border-b border-line py-3.5 text-[0.95rem] font-medium"
              >
                {t.nav.about}
              </Link>

              <div className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setMobileSection(mobileSection === "services" ? null : "services")}
                  aria-expanded={mobileSection === "services"}
                  className="flex w-full items-center justify-between py-3.5 text-left text-[0.95rem] font-medium"
                >
                  {t.nav.services}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      mobileSection === "services" && "rotate-180",
                    )}
                  />
                </button>
                {mobileSection === "services" ? (
                  <div className="pb-3">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/${locale}${paths.services}/${service.slug}`}
                        className="flex items-start gap-3 py-2.5 pl-1 text-[0.84rem] text-ink-soft"
                      >
                        <span className="font-mono text-[0.65rem] text-brand">{service.code}</span>
                        {service.title[locale]}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setMobileSection(mobileSection === "projects" ? null : "projects")}
                  aria-expanded={mobileSection === "projects"}
                  className="flex w-full items-center justify-between py-3.5 text-left text-[0.95rem] font-medium"
                >
                  {t.nav.projects}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      mobileSection === "projects" && "rotate-180",
                    )}
                  />
                </button>
                {mobileSection === "projects" ? (
                  <div className="pb-3">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/${locale}${paths.projects}?category=${service.id}`}
                        className="flex items-start gap-3 py-2.5 pl-1 text-[0.84rem] text-ink-soft"
                      >
                        <span className="font-mono text-[0.65rem] text-brand">{service.code}</span>
                        {service.shortTitle[locale]}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <Link
                href={`/${locale}${paths.news}`}
                className="block border-b border-line py-3.5 text-[0.95rem] font-medium"
              >
                {t.nav.news}
              </Link>
              <Link
                href={`/${locale}${paths.careers}`}
                className="block border-b border-line py-3.5 text-[0.95rem] font-medium"
              >
                {t.nav.careers}
              </Link>
              <Link
                href={`/${locale}${paths.contact}`}
                className="block border-b border-line py-3.5 text-[0.95rem] font-medium"
              >
                {t.nav.contact}
              </Link>
              <Link
                href={`/${locale}${paths.profile}`}
                className="block border-b border-line py-3.5 text-[0.95rem] font-medium"
              >
                {t.nav.profile}
              </Link>

              <div className="mt-5 flex items-center gap-2">
                {(["vi", "en"] as const).map((code) => (
                  <Link
                    key={code}
                    href={switchLocalePath(pathname, code)}
                    className={cn(
                      "border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em]",
                      locale === code
                        ? "border-brand bg-brand text-white"
                        : "border-line text-muted",
                    )}
                  >
                    {code}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-t border-line p-5">
              <Link
                href={`/${locale}${paths.contact}#quote`}
                className="btn btn-primary w-full"
                onClick={() => setDrawer(false)}
              >
                {t.actions.quote}
                <ArrowRight className="size-4" />
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[0.76rem]">
                <a
                  href={`tel:${site.contact.hotline}`}
                  className="flex items-center gap-2 text-ink-soft"
                >
                  <Phone className="size-3.5 text-brand" />
                  <span className="num">{site.contact.hotlineDisplay}</span>
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex items-center gap-2 text-ink-soft"
                >
                  <Mail className="size-3.5 text-brand" />
                  <span className="truncate">{site.contact.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
