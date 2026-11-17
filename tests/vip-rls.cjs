const { PGlite } = require('@electric-sql/pglite');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const db = new PGlite();
 await db.exec(`
 CREATE ROLE anon; CREATE ROLE authenticated;
 CREATE SCHEMA auth; CREATE SCHEMA storage;
 CREATE TABLE auth.users(id uuid PRIMARY KEY, email text);
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
 CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bucket_id text);
 ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
 CREATE POLICY old_storage ON storage.objects FOR ALL TO authenticated USING (true) WITH CHECK (true);
 CREATE TABLE public.categories(id uuid PRIMARY KEY, name text);
 CREATE TABLE public.products(id uuid PRIMARY KEY, name text, status text);
 CREATE TABLE public.product_variants(id uuid PRIMARY KEY, product_id uuid REFERENCES public.products(id));
 ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
 CREATE POLICY old_categories ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
 CREATE POLICY old_products ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
 CREATE POLICY old_variants ON public.product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
 CREATE POLICY public_products ON public.products FOR SELECT USING (status = 'active');
 CREATE POLICY public_variants ON public.product_variants FOR SELECT USING (true);
 `);
 for (const file of ['20261009_create_orders.sql','20261110_add_order_payments.sql','20261117_add_nagad_payments.sql','20261117_vip_bloom_club.sql']) {
   await db.exec(fs.readFileSync(`${process.cwd()}/supabase/migrations/${file}`, 'utf8'));
 }
 console.log('All order/payment/VIP migrations executed successfully');
 await db.exec(`
 GRANT USAGE ON SCHEMA public, auth, storage TO anon, authenticated;
 GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public, storage TO anon, authenticated;
 INSERT INTO auth.users VALUES ('11111111-1111-1111-1111-111111111111','admin@example.com'), ('22222222-2222-2222-2222-222222222222','customer@example.com'), ('33333333-3333-3333-3333-333333333333','other@example.com');
 INSERT INTO public.admin_users VALUES ('11111111-1111-1111-1111-111111111111');
 INSERT INTO public.products VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Public bouquet','active',false), ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','VIP lily','active',true);
 INSERT INTO public.product_variants VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), ('dddddddd-dddd-dddd-dddd-dddddddddddd','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
 INSERT INTO public.vip_memberships(user_id,full_name,phone,email,payment_method) VALUES ('22222222-2222-2222-2222-222222222222','Buyer','+8801712345678','customer@example.com','bkash');
 INSERT INTO public.orders(first_name,last_name,email,phone,address,city,district,postal_code,subtotal,shipping,grand_total,user_id) VALUES ('Buyer','Test','customer@example.com','01712345678','Street','Dhaka','Dhaka','1200',1000,190,1190,'22222222-2222-2222-2222-222222222222'), ('Other','Test','other@example.com','01812345678','Street','Dhaka','Dhaka','1200',1000,190,1190,'33333333-3333-3333-3333-333333333333');
 `);
 async function as(role, user) { await db.exec(`RESET ROLE; SET ROLE ${role}; SELECT set_config('request.jwt.claim.sub', '${user || ''}', false);`); }
 async function count(table) { return (await db.query(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n; }
 await as('anon'); assert.equal(await count('public.products'), 1); assert.equal(await count('public.product_variants'), 1); assert.equal(await count('public.vip_memberships'), 0);
 console.log('Anonymous users cannot read VIP products, variants or memberships');
 await as('authenticated','22222222-2222-2222-2222-222222222222');
 assert.equal((await db.query('SELECT public.is_admin() AS v')).rows[0].v,false);
 assert.equal(await count('public.products'),1); assert.equal(await count('public.orders'),1); assert.equal(await count('public.vip_memberships'),1);
 for (const sql of ["INSERT INTO public.products(id,name,status) VALUES (gen_random_uuid(),'Hack','active')", "INSERT INTO public.admin_users VALUES ('22222222-2222-2222-2222-222222222222')", "INSERT INTO storage.objects(bucket_id) VALUES ('product-images')"]) {
   await assert.rejects(() => db.exec(sql));
 }
 assert.equal((await db.query("UPDATE public.products SET name='Hack' RETURNING id")).rows.length,0);
 assert.equal((await db.query("UPDATE public.orders SET status='delivered' RETURNING id")).rows.length,0);
 assert.equal((await db.query("UPDATE public.vip_memberships SET status='active',activated_at=now(),payment_transaction_id='hack' RETURNING id")).rows.length,0);
 console.log('Pending member has only own data and cannot modify products/orders/membership, upload files or promote itself');
 await db.exec("RESET ROLE; UPDATE public.vip_memberships SET status='active',activated_at=now(),payment_transaction_id='verified-test';");
 await as('authenticated','22222222-2222-2222-2222-222222222222'); assert.equal(await count('public.products'),2); assert.equal(await count('public.product_variants'),2);
 await as('authenticated','33333333-3333-3333-3333-333333333333'); assert.equal(await count('public.products'),1); assert.equal(await count('public.vip_memberships'),0); assert.equal(await count('public.orders'),1);
 console.log('Active VIP gains early access; another customer cannot read their membership or orders');
 await as('authenticated','11111111-1111-1111-1111-111111111111'); assert.equal((await db.query('SELECT public.is_admin() AS v')).rows[0].v,true); assert.equal(await count('public.orders'),2);
 assert.equal((await db.query("UPDATE public.products SET name='Staff update' WHERE id='bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' RETURNING id")).rows.length,1);
 console.log('Explicit admin retains data access and product management');
 await db.close();
})().catch(error => { console.error(error.message); process.exitCode = 1; });
