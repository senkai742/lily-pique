import Link from "next/link";
import { customerContext } from "@/lib/customer";
import AccountSignIn from "./sign-in";
import { signOut } from "./actions";

export const metadata = { title: "My Account | LilyPique" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ signin?: string }> }) {
  const { signin } = await searchParams;
  const { db, user, membership } = await customerContext();
  if (!user) return <main className="mx-auto max-w-lg px-6 py-20"><h1 className="mb-3 font-serif text-4xl">Your LilyPique account</h1><p className="mb-8 text-sm text-text/60">Sign in or create an account to join VIP Bloom Club and view your orders.</p><AccountSignIn />{signin === "expired" && <p role="alert" className="mt-4 text-sm text-red-600">This sign-in link is invalid or expired. Request a new email and open it in the same browser.</p>}</main>;
  const { data: orders, error } = await db.from("orders")
    .select("id, created_at, grand_total, status, payment_status, vip_discount")
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><h1 className="font-serif text-4xl">My account</h1><form action={signOut}><button className="text-sm text-primary underline">Sign out</button></form></div>
      <p className="mb-6 break-all text-sm text-text/60">{user.email}</p>
      <section className="rounded-2xl border border-primary/20 bg-white p-6">
        <h2 className="font-serif text-2xl">{membership?.status === "active" ? "VIP Bloom Club · Lifetime member" : "VIP Bloom Club"}</h2>
        {membership?.status === "active" ? <p className="mt-3 text-sm text-text/70">Your 15% product discount is active. Registered phone: {membership.phone}</p> : <p className="mt-3 text-sm text-text/70">{membership ? "Your membership payment is pending verification." : "Join for ৳1,500 and enjoy lifetime member benefits."}</p>}
        <Link href="/vip-membership" className="mt-4 inline-block font-medium text-primary underline">{membership?.status === "active" ? "View your benefits" : membership ? "Continue membership payment" : "Explore membership"}</Link>
      </section>
      <h2 className="mb-4 mt-10 font-serif text-2xl">Recent orders</h2>
      {error ? <p role="alert">Unable to load orders. Please refresh.</p> : !orders?.length ? <p className="text-sm text-text/60">Your new orders will appear here when you check out while signed in.</p> : <ul className="space-y-3">{orders.map(order => <li key={order.id} className="rounded-xl border border-primary/15 bg-white p-4"><Link href={`/track-order?id=${order.id}`} className="font-semibold text-primary underline">#{order.id.slice(0, 8).toUpperCase()}</Link><p className="mt-2 text-sm capitalize text-text/70">{order.status} · Payment {order.payment_status} · ৳{Number(order.grand_total).toLocaleString("en-BD")}</p>{Number(order.vip_discount) > 0 && <p className="mt-1 text-xs text-primary">VIP savings: ৳{Number(order.vip_discount).toLocaleString("en-BD")}</p>}</li>)}</ul>}
    </main>
  );
}
