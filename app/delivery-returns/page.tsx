import Link from "next/link";
import { additionalItemDeliveryMessage, deliveryCharges, freeDeliveryMessage, orderPolicies } from "@/config/order-policy";

export const metadata = {
  title: "Delivery & Returns | LilyPique",
  description: "Order notice, advance payments, returns and delivery charges at LilyPique.",
};

export default function DeliveryReturnsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Before you order</p>
      <h1 className="mb-10 font-serif text-4xl font-bold text-text">Delivery &amp; Returns</h1>
      <div className="space-y-5">
        {orderPolicies.map(({ title, text }) => (
          <section key={title} className="rounded-2xl border border-primary/15 bg-white p-6">
            <h2 className="mb-2 font-serif text-xl font-semibold text-text">{title}</h2>
            <p className="text-sm leading-7 text-text/70">{text}</p>
          </section>
        ))}
        <section className="rounded-2xl border border-primary/15 bg-white p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold text-text">Delivery charges for the first item</h2>
          <dl className="space-y-3 text-sm text-text/70">
            <div className="flex justify-between gap-4"><dt>Inside Dhaka</dt><dd className="font-semibold text-text">৳{deliveryCharges.inside}</dd></div>
            <div className="flex justify-between gap-4"><dt>Outside Dhaka</dt><dd className="font-semibold text-text">৳{deliveryCharges.outside}</dd></div>
          </dl>
          <p className="mt-4 text-sm text-text/70">{additionalItemDeliveryMessage}</p>
          <p className="mt-5 rounded-xl bg-primary/10 p-4 text-sm font-medium text-text">{freeDeliveryMessage}</p>
        </section>
      </div>
      <Link href="/contact" className="mt-8 inline-block font-medium text-primary underline underline-offset-4">Contact us about your order</Link>
    </main>
  );
}
