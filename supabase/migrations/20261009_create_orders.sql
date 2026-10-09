-- =============================================================
-- Orders Table Migration for lily-pique
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/oqzxtdwmuaunzovzqwog/sql
-- =============================================================

-- 1. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- contact
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL,
  -- delivery
  address       text NOT NULL,
  city          text NOT NULL,
  district      text NOT NULL,
  postal_code   text NOT NULL,
  note          text,
  delivery_zone text NOT NULL DEFAULT 'inside',   -- 'inside' | 'outside'
  -- financials
  subtotal      numeric(10,2) NOT NULL,
  shipping      numeric(10,2) NOT NULL,
  grand_total   numeric(10,2) NOT NULL,
  -- status
  status        text NOT NULL DEFAULT 'pending',  -- pending | processing | shipped | delivered | cancelled
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. Order items (one row per cart item)
CREATE TABLE IF NOT EXISTS public.order_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    text NOT NULL,
  product_name  text NOT NULL,
  color         text,
  color_hex     text,
  image         text,
  price         numeric(10,2) NOT NULL,
  quantity      int NOT NULL DEFAULT 1
);

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_orders_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.handle_orders_updated_at();

-- 4. RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can insert orders (place an order without logging in)
CREATE POLICY "Anon can insert orders"
  ON public.orders FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can insert order items"
  ON public.order_items FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users (admins) can read / update / delete
CREATE POLICY "Authenticated full access to orders"
  ON public.orders FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated full access to order items"
  ON public.order_items FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
