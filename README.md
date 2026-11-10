This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## bKash payments through RupantorPay

1. Run `supabase/migrations/20261110_add_order_payments.sql` in Supabase SQL Editor before deploying the code.
2. Set the server environment variables `SITE_URL` (your public HTTPS origin) and `RUPANTORPAY_API_KEY` (the key for that registered brand). Keep the API key private; see `.env.example` for all required variables.
3. In RupantorPay, activate your plan, register the website/brand, enable the bKash wallet, and complete the mobile device/app setup. Enable only bKash for this brand: the documented checkout API does not expose a payment-method restriction parameter.
4. Redeploy and test a payment, cancellation, pending payment, and webhook on the public domain. Orders must remain `payment_status=pending` until authenticated verification confirms the transaction, BDT amount, bKash method, and order metadata. A cancelled or interrupted session remains pending, allowing a late webhook to confirm payment. Fulfillment status is separate from payment status.

Customers retain their cart after cancellation. A confirmed payment clears the original cart when they return; a cart changed in another tab is retained. Webhook notifications use `/api/payments/rupantorpay` and always reverify with the provider. Repeated confirmations are safe, and each provider transaction can belong to only one order. If checkout initialization times out, the pending order is retained in case the provider created a session.

API reference: https://rupantorpay.com/developers/docs
