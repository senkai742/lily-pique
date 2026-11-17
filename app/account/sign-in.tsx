"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AccountSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const db = createClient();
    const { data: { subscription } } = db.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const db = createClient();
      const { error } = await db.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to send your sign-in link. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-primary/20 bg-white p-6">
      <div>
        <label htmlFor="account-email" className="mb-2 block text-sm font-medium">Email address</label>
        <input id="account-email" type="email" autoComplete="email" required value={email} readOnly={sent} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-primary/20 p-3" />
      </div>
      {sent ? (
        <div role="status" className="rounded-xl bg-primary/5 p-4 text-sm leading-7 text-text/70">
          <p className="font-semibold text-text">Check your inbox</p>
          <p>We sent a sign-in link to <span className="break-all font-medium">{email.trim()}</span>. Open the link in this browser to finish signing in.</p>
          <p className="mt-2">If this is your first visit, the email may say “Confirm your signup”. That link also signs you in. No code or password is needed.</p>
        </div>
      ) : <p className="text-sm leading-6 text-text/60">We’ll email you a secure sign-in link. No password needed.</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">
        {busy ? "Sending link…" : sent ? "Send another sign-in link" : "Email me a sign-in link"}
      </button>
      {sent && <button type="button" disabled={busy} onClick={() => { setSent(false); setError(""); }} className="text-sm text-primary underline">Use a different email</button>}
    </form>
  );
}
