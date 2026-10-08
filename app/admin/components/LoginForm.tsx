"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Lock, Mail, ArrowRight } from "lucide-react";

const initialState = null;

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 border border-red-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign In"}
        {!isPending && (
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
}
