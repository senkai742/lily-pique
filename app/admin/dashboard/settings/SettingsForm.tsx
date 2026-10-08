"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface SettingsFormProps {
  action: (prevState: { error?: string; success?: string } | null, formData: FormData) => Promise<{ error?: string; success?: string }>
  children: React.ReactNode;
  submitLabel: string;
}

function StatusMessage({ state }: { state: { error?: string; success?: string } | null }) {
  if (!state) return null;
  if (state.success) return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      <CheckCircle2 size={16} className="shrink-0" />
      {state.success}
    </div>
  );
  if (state.error) return (
    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle size={16} className="shrink-0" />
      {state.error}
    </div>
  );
  return null;
}

export function SettingsForm({ action, children, submitLabel }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      {children}
      <StatusMessage state={state} />
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
