"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={formAction} className="mt-8">
      <div className="field">
        <label htmlFor="admin-password">
          Mật khẩu quản trị <span className="req">*</span>
        </label>
        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
            strokeWidth={1.6}
          />
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="input pl-9"
            placeholder="Nhập mật khẩu"
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? "admin-password-error" : undefined}
          />
        </div>
      </div>

      {state.error ? (
        <p
          id="admin-password-error"
          role="alert"
          className="mt-3 border border-accent/25 bg-accent/[0.04] px-3 py-2 text-[0.76rem] leading-relaxed text-accent"
        >
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-primary mt-5 w-full">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Đang đăng nhập…
          </>
        ) : (
          <>
            Đăng nhập
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
