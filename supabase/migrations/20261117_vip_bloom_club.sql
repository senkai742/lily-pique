BEGIN;

-- Add existing staff accounts here through SQL before enabling customer signups.
-- INSERT INTO public.admin_users(user_id) SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL';
CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

CREATE TABLE public.vip_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  full_name text NOT NULL,
  phone text NOT NULL UNIQUE CHECK (phone ~ '^\+8801[3-9][0-9]{8}$'),
  email text NOT NULL,
  fee numeric(10,2) NOT NULL DEFAULT 1500 CHECK (fee = 1500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  payment_method text NOT NULL CHECK (payment_method IN ('bkash', 'nagad')),
  payment_token uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_transaction_id text UNIQUE,
  checkout_url text,
  terms_accepted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  CHECK (status <> 'active' OR (activated_at IS NOT NULL AND payment_transaction_id IS NOT NULL))
);
ALTER TABLE public.vip_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY vip_read ON public.vip_memberships FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
GRANT SELECT ON public.vip_memberships TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.vip_memberships FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_vip() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.vip_memberships WHERE user_id = auth.uid() AND status = 'active');
$$;
REVOKE ALL ON FUNCTION public.is_vip() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_vip() TO anon, authenticated;

ALTER TABLE public.products ADD COLUMN vip_early_access boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders
  ADD COLUMN user_id uuid REFERENCES auth.users(id),
  ADD COLUMN vip_member boolean NOT NULL DEFAULT false,
  ADD COLUMN vip_discount numeric(10,2) NOT NULL DEFAULT 0 CHECK (vip_discount >= 0),
  ADD COLUMN note_card_message text,
  ADD COLUMN delivery_date date,
  ADD COLUMN preferred_delivery_time text;
CREATE INDEX orders_user_id_idx ON public.orders(user_id);

-- Restrictive policies also constrain existing broad authenticated policies.
-- Customer registration must never grant the previous implicit admin access.
DO $$
DECLARE t text; command text;
BEGIN
  FOREACH t IN ARRAY ARRAY['products','product_variants','categories','orders','order_items','settings'] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      FOREACH command IN ARRAY ARRAY['INSERT','UPDATE','DELETE'] LOOP
        IF command = 'INSERT' THEN
          EXECUTE format('CREATE POLICY vip_guard_insert ON public.%I AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin())', t);
        ELSIF command = 'UPDATE' THEN
          EXECUTE format('CREATE POLICY vip_guard_update ON public.%I AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
        ELSE
          EXECUTE format('CREATE POLICY vip_guard_delete ON public.%I AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_admin())', t);
        END IF;
      END LOOP;
    END IF;
  END LOOP;
END $$;

CREATE POLICY vip_product_visibility ON public.products AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR (lower(status) = 'active' AND (NOT vip_early_access OR public.is_vip())));
CREATE POLICY vip_variant_visibility ON public.product_variants AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id));
CREATE POLICY customer_orders_read ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY customer_orders_guard ON public.orders AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR user_id = auth.uid());
CREATE POLICY customer_items_guard ON public.order_items AS RESTRICTIVE FOR SELECT TO anon, authenticated
  USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- Existing storage policies may grant all authenticated users write access.
CREATE POLICY vip_storage_insert_guard ON storage.objects AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY vip_storage_update_guard ON storage.objects AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY vip_storage_delete_guard ON storage.objects AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_admin());

COMMIT;
