import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { customerContext } from "@/lib/customer";
import { VIP_FEE, vipBenefits } from "@/config/vip";
import JoinMembership from "./join";

export const metadata = { title: "VIP Bloom Club | LilyPique", description: "Join LilyPique VIP Bloom Club for lifetime savings and floral privileges." };

export default async function VipMembershipPage() {
  const { user, membership } = await customerContext();
  return <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
    <div className="mb-12 text-center"><Crown aria-hidden="true" className="mx-auto mb-5 text-primary" size={40} /><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">A little more bloom, for a lifetime</p><h1 className="font-serif text-4xl sm:text-6xl">LilyPique VIP Bloom Club</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-text/60">Unlock exclusive floral elegance and save more on every special moment.</p><div className="mx-auto mt-8 w-full max-w-sm rounded-3xl border border-primary/20 bg-white px-8 py-7 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Lifetime membership</p>
      <p className="mt-4 flex items-baseline justify-center gap-2 font-sans text-text" aria-label={`${VIP_FEE.toLocaleString("en-BD")} Bangladeshi taka, one-time membership fee`}>
        <span aria-hidden="true" className="text-2xl font-medium text-primary">৳</span>
        <span aria-hidden="true" className="text-5xl font-semibold leading-none tracking-tight tabular-nums sm:text-6xl">{VIP_FEE.toLocaleString("en-BD")}</span>
        <span aria-hidden="true" className="text-xs font-semibold text-text/50">BDT</span>
      </p>
      <p className="mt-4 text-sm text-text/60">Pay once. Enjoy your benefits for life.</p>
      <div className="mt-5 border-t border-primary/10 pt-4 text-sm font-semibold text-primary">15% off every product</div>
    </div></div>
    <div className="grid gap-5 sm:grid-cols-2">{vipBenefits.map(benefit => <section key={benefit.title} className="rounded-2xl border border-primary/15 bg-white p-6"><Sparkles aria-hidden="true" className="mb-4 text-primary" size={22} /><h2 className="mb-2 font-serif text-xl font-semibold">{benefit.title}</h2><p className="text-sm leading-7 text-text/65">{benefit.text}</p></section>)}</div>
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-primary/20 bg-white p-6 sm:p-8">
      {membership?.status === "active" ? <><h2 className="font-serif text-2xl">Welcome, {membership.full_name}</h2><p className="mt-3 text-sm leading-7 text-text/70">Your lifetime membership is active for your account and registered phone {membership.phone}. Sign in to use your benefits.</p><Link href="/products" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-white">Shop your member benefits</Link><Link href="/products?vip=1" className="mt-4 block text-sm text-primary underline">Browse VIP early access</Link></> : user ? <JoinMembership pending={!!membership} /> : <><h2 className="font-serif text-2xl">Your membership starts here</h2><p className="my-4 text-sm leading-7 text-text/65">Sign in or create your account before joining. Membership belongs to your account and registered phone number.</p><Link href="/account" className="inline-block rounded-full bg-primary px-6 py-3 font-semibold text-white">Sign in to join VIP Bloom Club</Link></>}
    </div>
    <section className="mx-auto mt-10 max-w-2xl text-sm leading-7 text-text/70"><h2 className="mb-3 font-serif text-2xl text-text">Member terms</h2><ul className="list-disc space-y-2 pl-5"><li>Place all orders at least 4 days before the delivery or event date.</li><li>No Cash on Delivery. Full or partial advance payment via bKash or Nagad is required to confirm an order. Online checkout requires full payment; contact us for partial advances.</li><li>The ৳1,500 membership fee is non-refundable. Membership is personal, non-transferable and tied to your account and registered phone number.</li><li>Membership activates after payment verification. The 15% discount applies to products only, excluding delivery and membership fees.</li><li>Priority handling does not guarantee a delivery time. Early access applies to selected products while available.</li><li>Fresh floral arrangements and custom handmade items cannot be returned.</li></ul><Link href="/delivery-returns" className="mt-4 inline-block text-primary underline">Delivery charges &amp; return policy</Link></section>
  </main>;
}
