import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";

export function Footer({ locale, site }: { locale: Locale; site: SiteData }) {
  const t = ui[locale];
  const year = new Date().getFullYear();
  const socials = [
    { label: "Facebook", href: site.social.facebook },
    { label: "YouTube", href: site.social.youtube },
    { label: "LinkedIn", href: site.social.linkedin },
  ].filter((social) => social.href);

  const nav = [
    { label: t.nav.about, href: paths.about },
    { label: t.nav.services, href: paths.services },
    { label: t.nav.projects, href: paths.projects },
    { label: t.nav.news, href: paths.news },
    { label: t.nav.careers, href: paths.careers },
    { label: t.nav.contact, href: paths.contact },
    { label: t.nav.profile, href: paths.profile },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-[linear-gradient(180deg,#f8fcfe_0%,#edf6fb_100%)] text-ink">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full border border-brand/10"
        aria-hidden
      />

      <div className="wrap relative">
        <div className="grid gap-12 border-b border-line py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} aria-label={site.company.displayName}>
              <Logo size="md" />
            </Link>
            <p className="mt-5 max-w-sm text-[0.84rem] leading-[1.75] text-muted">
              {t.footer.statement}
            </p>
            <p className="mt-4 text-[0.8rem] font-semibold text-ink">
              {site.company.legalName[locale]}
            </p>
            <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted/80">
              {t.labels.taxCode}: {site.company.taxCode || t.labels.updating}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow text-brand">{t.labels.quickLinks}</p>
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-[0.83rem] text-ink-soft/80 transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow text-brand">{t.labels.address}</p>
            <div className="mt-5 space-y-5">
              {site.offices.map((office) => (
                <a
                  key={office.id}
                  href={office.mapUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex gap-3"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
                  <div>
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted/70">
                      {office.kind[locale]}
                    </p>
                    <p className="mt-1 text-[0.8rem] font-medium leading-relaxed text-ink-soft transition-colors group-hover:text-brand">
                      {office.address[locale]}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow text-brand">{t.labels.contactInfo}</p>
            <div className="mt-5 space-y-3.5">
              <a
                href={`tel:${site.contact.hotline}`}
                className="group flex items-start gap-3 text-ink-soft transition-colors hover:text-brand"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
                <span>
                  <span className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted/70">
                    Hotline / Zalo
                  </span>
                  <span className="num text-[0.9rem] font-medium">{site.contact.hotlineDisplay}</span>
                </span>
              </a>
              <a
                href={`tel:${site.contact.phone}`}
                className="flex items-start gap-3 text-ink-soft transition-colors hover:text-brand"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
                <span>
                  <span className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted/70">
                    {t.labels.phone}
                  </span>
                  <span className="num text-[0.9rem]">{site.contact.phoneDisplay}</span>
                </span>
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-start gap-3 break-all text-ink-soft transition-colors hover:text-brand"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
                <span>
                  <span className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted/70">
                    {t.labels.email}
                  </span>
                  <span className="text-[0.85rem]">{site.contact.email}</span>
                </span>
              </a>
            </div>

            {socials.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-1.5 text-[0.72rem] text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {social.label}
                    <ArrowUpRight className="size-3" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-5 py-6 text-[0.73rem] text-muted lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <p>
              © {year} {site.company.legalName[locale]}. {t.footer.copyright}
            </p>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted/70">
              {t.labels.taxCode}: {site.company.taxCode || t.labels.updating}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="/image-credits.html" className="transition-colors hover:text-brand">
              {locale === "vi" ? "Nguồn ảnh" : "Image credits"}
            </a>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <Link
              href={`/${locale}${paths.privacy}`}
              className="transition-colors hover:text-brand"
            >
              {t.footer.privacy}
            </Link>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted/60">
              {site.company.displayName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
