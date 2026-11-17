# VIP Bloom Club deployment

## Database and admin access

Apply migrations in filename order, including `20261117_add_nagad_payments.sql` and `20261117_vip_bloom_club.sql`, before deploying the new app. The VIP migration adds membership records, customer-linked orders, fulfillment fields, early access and customer-safe row-level security.

**Before enabling customer registration**, run this in the Supabase SQL Editor for each existing staff account, using its actual email:

```sql
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE lower(email) = lower('YOUR_ADMIN_EMAIL')
ON CONFLICT DO NOTHING;
```

Only these explicitly listed users can access admin pages, manage products or edit orders. Existing staff accounts keep their passwords. Never add customer accounts to this table. This replaces the previous assumption that every authenticated user is staff.

Do not roll back just the application after opening customer signups: the old app assumes all authenticated users are admins. Keep the new database restrictions and admin checks in place.

## Supabase Auth

- Enable email authentication and new-user registration; configure production SMTP and appropriate auth rate limits.
- Set the Supabase Site URL to the public HTTPS website address.
- Add `https://YOUR_DOMAIN/auth/callback` to allowed redirect URLs (and localhost for development).
- Customer sign-in is link-only. Keep a clickable `{{ .ConfirmationURL }}` link in both the **Confirm signup** and **Magic Link** email templates. The default templates work through `/auth/callback` in the same browser. Do not replace the links with OTP-only code templates; the website does not ask for a code. Email verification is required before buying membership.
- Custom links may target `/auth/callback?token_hash={{ .TokenHash }}&type=email`; the callback accepts email, signup and magic-link token hashes as well as the default PKCE code exchange. Callback failures return to the account form with a request to send a new link.
- The registered Bangladesh phone number is normalized and uniquely bound to the membership. It is a contact number, **not SMS-verified**. Account access is verified through email; no SMS provider is configured.

## Payments

Keep `RUPANTORPAY_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and HTTPS `SITE_URL` configured on the server. Enable bKash and Nagad in the RupantorPay wallet settings. The hosted checkout API does not document a method-preselection parameter; customers must use the method selected on LilyPique. Verification rejects a different method.

Membership costs ৳1,500 once. Only authenticated provider verification of a completed BDT payment with matching amount, method, transaction ID, membership ID and secret token activates lifetime membership. Browser redirects alone cannot activate it. Callback retries are idempotent. Unique account and phone constraints prevent concurrent duplicate registrations.

Pending memberships resume their saved provider checkout session. Provider timeouts retain the pending registration to prevent accidental duplicate payment. If a session is missing or expired, support should investigate in the provider dashboard; do not delete a pending record or create another payment without checking for existing charges. Admin → VIP Members can verify a provider transaction ID against the saved membership and token; it cannot activate unpaid memberships manually.

## Member benefits

- 15% off all product subtotals when signed in as an active member, rounded to two decimals. No discount on delivery or membership fees. Server prices and membership status override browser input; stale checkout totals must be refreshed.
- Full delivery charges: ৳190 inside Dhaka / ৳420 outside Dhaka.
- VIP orders have a priority badge in admin, a complimentary note-card message and an optional preferred delivery time. Times require manual confirmation and are subject to availability; this release does not reserve slot capacity.
- Delivery date must be at least four Bangladesh calendar days ahead, enforced on client and server for every order.
- Mark products as VIP early access in Admin → VIP Members. Use draft status while preparing a launch; activate after marking it. Turn early access off for public release. Database policies protect lists, direct detail URLs and variants; checkout also rejects early-access purchases by nonmembers. Product image URLs in the existing public image bucket are not private media.
- Customers see membership status and recent account-linked orders in My Account. Guest orders remain supported and are not retroactively claimed by phone/email matching.
- Online checkout collects full payment. Partial advances remain arranged through contact; automated deposits and balance collection are not implemented.

## Verification

```sh
node --test --test-isolation=none tests/rupantorpay.test.cjs tests/vip.test.cjs
npx tsc --noEmit
```

For an isolated PostgreSQL migration/RLS check without connecting to Supabase:

```sh
npm install --prefix /tmp/lily-vip-db-check --no-audit --no-fund @electric-sql/pglite
NODE_PATH=/tmp/lily-vip-db-check/node_modules node tests/vip-rls.cjs
```

This creates an in-memory PostgreSQL database, applies the actual order/payment/VIP migrations against a minimal catalog fixture, and checks anonymous, pending-member, active-member, other-customer and admin access. It also tests direct database and storage mutations against the previous broad authenticated policies. It does not change production data.

Before launch, verify on a staging project: guest and member checkout; email sign-in links for both new and returning customers; successful, cancelled and pending bKash/Nagad membership payments; repeated and late webhooks; duplicate join requests; another customer attempting admin pages, APIs and direct database writes; early-access visibility and direct product checkout; correct delivery/discount totals; complimentary note-card and time preference display in admin.

Local tests mock Supabase and the payment gateway. They do not prove that migrations, email delivery or live payments work against the deployed services.
