"use client";
import { useState } from "react";
import Link from "next/link";

export default function JoinMembership({ pending }: { pending: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/vip-membership", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: data.get("full_name"), phone: data.get("phone"), payment_method: data.get("payment_method"), terms_accepted: data.get("terms_accepted") === "on" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.assign(result.paymentUrl || "/vip-membership");
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to start payment. Please try again."); setBusy(false); }
  }
  return <form onSubmit={submit} className="space-y-5">
    <h2 className="font-serif text-2xl">{pending ? "Continue your membership payment" : "Join VIP Bloom Club"}</h2>
    {pending ? <p className="text-sm leading-7 text-text/65">Your registration is saved. Resume the existing payment session. If you already paid, allow time for confirmation or contact us before paying again.</p> : <>
      <div><label htmlFor="vip-name" className="mb-2 block text-sm font-medium">Full name</label><input id="vip-name" name="full_name" autoComplete="name" required maxLength={120} className="w-full rounded-xl border border-primary/20 p-3" /></div>
      <div><label htmlFor="vip-phone" className="mb-2 block text-sm font-medium">Registered phone number</label><input id="vip-phone" name="phone" type="tel" autoComplete="tel" required placeholder="01XXXXXXXXX" maxLength={25} className="w-full rounded-xl border border-primary/20 p-3" /><p className="mt-2 text-xs text-text/60">This number stays linked to your membership.</p></div>
      <div><label htmlFor="vip-method" className="mb-2 block text-sm font-medium">Payment method</label><select id="vip-method" name="payment_method" className="w-full rounded-xl border border-primary/20 p-3"><option value="bkash">bKash</option><option value="nagad">Nagad</option></select><p className="mt-2 text-xs text-text/60">Use this same method on the payment page.</p></div>
      <label className="flex items-start gap-3 text-xs leading-6"><input type="checkbox" name="terms_accepted" required className="mt-1 accent-primary" /><span>I accept the member terms below, including the non-refundable ৳1,500 fee and personal, non-transferable lifetime membership.</span></label>
    </>}
    {error && <p role="alert" className="text-sm text-red-600">{error} <Link href="/contact" className="underline">Contact us</Link></p>}
    <button disabled={busy} className="w-full rounded-full bg-primary px-5 py-3.5 font-semibold text-white disabled:opacity-50">{busy ? "Please wait…" : pending ? "Resume payment" : "Join VIP Bloom Club — ৳1,500"}</button>
  </form>;
}
