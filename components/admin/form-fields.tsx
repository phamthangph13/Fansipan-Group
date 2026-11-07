import Link from "next/link";

export function AdminField({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`field ${className ?? ""}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required ? <span className="req"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="text-[0.68rem] leading-relaxed text-muted/70">{hint}</p> : null}
    </div>
  );
}

export function LocalizedInput({
  base,
  label,
  values,
  placeholderVi,
  placeholderEn,
  required,
  hint,
  textarea,
  className,
}: {
  base: string;
  label: string;
  values?: { vi: string; en: string };
  placeholderVi?: string;
  placeholderEn?: string;
  required?: boolean;
  hint?: string;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="field-label">
        {label}
        {required ? <span className="req"> *</span> : null}
      </legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${base}Vi`} className="!text-[0.7rem] !font-medium !text-muted">
            Tiếng Việt
          </label>
          {textarea ? (
            <textarea
              id={`${base}Vi`}
              name={`${base}Vi`}
              defaultValue={values?.vi ?? ""}
              placeholder={placeholderVi}
              required={required}
              className="textarea min-h-24 text-[0.86rem]"
            />
          ) : (
            <input
              id={`${base}Vi`}
              name={`${base}Vi`}
              defaultValue={values?.vi ?? ""}
              placeholder={placeholderVi}
              required={required}
              className="input text-[0.86rem]"
            />
          )}
        </div>
        <div className="field">
          <label htmlFor={`${base}En`} className="!text-[0.7rem] !font-medium !text-muted">
            English
          </label>
          {textarea ? (
            <textarea
              id={`${base}En`}
              name={`${base}En`}
              defaultValue={values?.en ?? ""}
              placeholder={placeholderEn}
              className="textarea min-h-24 text-[0.86rem]"
            />
          ) : (
            <input
              id={`${base}En`}
              name={`${base}En`}
              defaultValue={values?.en ?? ""}
              placeholder={placeholderEn}
              className="input text-[0.86rem]"
            />
          )}
        </div>
      </div>
      {hint ? <p className="mt-1.5 text-[0.68rem] leading-relaxed text-muted/70">{hint}</p> : null}
    </fieldset>
  );
}

export function AdminEditorHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  backHref: string;
  backLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Link
          href={backHref}
          className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted/60 transition-colors hover:text-brand"
        >
          ← {backLabel}
        </Link>
        <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
