import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { confirmMembershipPayment, setEarlyAccess } from "./actions";

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const db = await createClient();
  const { data: admin } = await db.rpc("is_admin");
  if (!admin) redirect("/account");
  const [{ data: members, error }, { data: products, error: productError }] = await Promise.all([
    db.from("vip_memberships").select("id, full_name, phone, email, status, created_at, activated_at, payment_method").order("created_at", { ascending: false }),
    db.from("products").select("id, name, status, vip_early_access").order("name"),
  ]);
  const { result } = await searchParams;
  const messages: Record<string, string> = { verified: "Payment verified. Lifetime membership is active.", pending: "The payment is still pending.", failed: "Payment could not be verified. Check the transaction and selected payment method.", invalid: "Enter a valid transaction ID." };
  return <div className="p-6 md:p-8">
    <h1 className="mb-2 text-3xl font-bold">VIP Bloom Club</h1><p className="mb-8 text-sm text-zinc-500">Lifetime members, pending payments and early-access products.</p>
    {result && messages[result] && <p role="status" className="mb-5 rounded-xl border bg-white p-4">{messages[result]}</p>}
    {error ? <p role="alert">Unable to load members. Check the VIP migration.</p> : <div className="space-y-4">{!members?.length && <p>No memberships yet.</p>}{members?.map(member => <section key={member.id} className="rounded-xl border border-zinc-200 bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><h2 className="font-semibold">{member.full_name}</h2><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{member.status === "active" ? "Lifetime VIP" : "Payment pending"}</span></div><p className="mt-2 break-all text-sm text-zinc-600">{member.phone} · {member.email}</p><p className="mt-2 text-xs text-zinc-500">{member.payment_method === "bkash" ? "bKash" : "Nagad"} · Registered {new Date(member.created_at).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })}</p>{member.status === "pending" && <form action={confirmMembershipPayment} className="mt-4 flex flex-wrap items-end gap-3"><input type="hidden" name="membership_id" value={member.id} /><div><label htmlFor={`txn-${member.id}`} className="mb-1 block text-xs">Provider transaction ID</label><input id={`txn-${member.id}`} name="transaction_id" required maxLength={100} className="rounded-lg border p-2 text-sm" /></div><button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">Verify payment</button></form>}</section>)}</div>}
    <h2 className="mb-2 mt-10 text-2xl font-semibold">VIP early access</h2><p className="mb-5 text-sm text-zinc-500">Marked products are available only to active VIP members while their status is active. Turn early access off to open them to everyone. Create new launches as drafts first.</p>
    {productError ? <p role="alert">Unable to load products.</p> : <div className="divide-y rounded-xl border bg-white">{products?.map(product => <form action={setEarlyAccess} key={product.id} className="flex flex-wrap items-center justify-between gap-4 p-4"><div><p className="font-medium">{product.name}</p><p className="text-xs text-zinc-500">{product.status} · {product.vip_early_access ? "VIP early access" : "Regular access"}</p></div><input type="hidden" name="product_id" value={product.id} /><input type="hidden" name="enabled" value={String(!product.vip_early_access)} /><button className="rounded-lg border px-3 py-2 text-sm">{product.vip_early_access ? "Open to everyone" : "Set VIP early access"}</button></form>)}</div>}
  </div>;
}
