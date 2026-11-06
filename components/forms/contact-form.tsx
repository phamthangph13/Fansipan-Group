"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { sendContactRequest } from "@/app/actions/contact";
import { initialActionState } from "@/lib/form-types";
import { paths, ui, type Locale } from "@/lib/i18n";
import type { Service } from "@/lib/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[0.7rem] leading-snug text-accent" role="alert">
      {message}
    </p>
  );
}

export function ContactForm({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  const t = ui[locale];
  const [state, formAction, pending] = useActionState(sendContactRequest, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);

  const armTimer = () => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  };

  useEffect(() => {
    armTimer();
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      armTimer();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="relative border border-line bg-white p-6 shadow-[0_30px_70px_-50px_rgba(7,24,44,0.5)] sm:p-8"
      noValidate
    >
      <div className="flex items-start justify-between gap-6 border-b border-line pb-5">
        <div>
          <p className="eyebrow text-brand">{t.forms.contactTitle}</p>
          <h3 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">
            {locale === "vi" ? "Thông tin yêu cầu" : "Your request"}
          </h3>
        </div>
        <span className="mt-1 hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent sm:block">
          {locale === "vi" ? "Bắt buộc *" : "Required *"}
        </span>
      </div>

      {state.status !== "idle" ? (
        <div
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={
            state.status === "success"
              ? "mt-5 border border-green/25 bg-green/[0.06] px-4 py-3 text-[0.8rem] leading-relaxed text-green"
              : "mt-5 border border-accent/25 bg-accent/[0.04] px-4 py-3 text-[0.8rem] leading-relaxed text-accent"
          }
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="contact-name">
            {t.forms.name} <span className="req">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            className="input"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            aria-invalid={Boolean(state.errors.name)}
            aria-describedby={state.errors.name ? "contact-name-error" : undefined}
          />
          <span id="contact-name-error">
            <FieldError message={state.errors.name} />
          </span>
        </div>

        <div className="field">
          <label htmlFor="contact-phone">
            {t.forms.phone} <span className="req">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="input"
            autoComplete="tel"
            required
            pattern="[0-9+\s().-]{8,20}"
            aria-invalid={Boolean(state.errors.phone)}
            aria-describedby={state.errors.phone ? "contact-phone-error" : undefined}
          />
          <span id="contact-phone-error">
            <FieldError message={state.errors.phone} />
          </span>
        </div>

        <div className="field">
          <label htmlFor="contact-email">
            {t.forms.email} <span className="req">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            required
            aria-invalid={Boolean(state.errors.email)}
            aria-describedby={state.errors.email ? "contact-email-error" : undefined}
          />
          <span id="contact-email-error">
            <FieldError message={state.errors.email} />
          </span>
        </div>

        <div className="field">
          <label htmlFor="contact-company">{t.forms.company}</label>
          <input
            id="contact-company"
            name="company"
            className="input"
            autoComplete="organization"
            maxLength={120}
          />
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor="contact-need">
            {t.forms.need} <span className="req">*</span>
          </label>
          <select
            id="contact-need"
            name="need"
            className="select"
            required
            defaultValue=""
            aria-invalid={Boolean(state.errors.need)}
            aria-describedby={state.errors.need ? "contact-need-error" : undefined}
          >
            <option value="" disabled>
              {t.forms.needPlaceholder}
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title[locale]}
              </option>
            ))}
            <option value="other">{t.forms.needOther}</option>
          </select>
          <span id="contact-need-error">
            <FieldError message={state.errors.need} />
          </span>
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor="contact-message">
            {t.forms.message} <span className="req">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            className="textarea"
            placeholder={t.forms.messagePlaceholder}
            required
            minLength={10}
            maxLength={3000}
            aria-invalid={Boolean(state.errors.message)}
            aria-describedby={state.errors.message ? "contact-message-error" : undefined}
          />
          <span id="contact-message-error">
            <FieldError message={state.errors.message} />
          </span>
        </div>
      </div>

      <div className="mt-5">
        <label className="checkbox-row">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(state.errors.consent)}
          />
          <span>
            {t.forms.consent}{" "}
            <Link
              href={`/${locale}${paths.privacy}`}
              className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              {t.forms.privacy}
            </Link>
            .
          </span>
        </label>
        <FieldError message={state.errors.consent} />
      </div>

      <input type="hidden" name="locale" value={locale} />
      <input ref={startedRef} type="hidden" name="startedAt" defaultValue="" />
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t.forms.sending}
          </>
        ) : (
          <>
            {t.actions.sendRequest}
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-muted/65">
        {locale === "vi"
          ? "Thông tin của bạn được sử dụng để phản hồi yêu cầu và không chia sẻ cho bên thứ ba."
          : "Your details are used to respond to your request and are not shared with third parties."}
      </p>
    </form>
  );
}
