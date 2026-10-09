-- =============================================================
-- Products Table Migration for lily-pique
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/oqzxtdwmuaunzovzqwog/sql
-- =============================================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS public.products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text,
  category      text,
  category_slug text,
  sku           text,
  status        text NOT NULL DEFAULT 'active',
  tags          text[],
  variants      jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 3. Enable Row-Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Public read access (storefront can see active products)
CREATE POLICY "Allow public read access"
  ON public.products
  FOR SELECT
  USING (status = 'active');

-- 5. Authenticated full access (admins can insert/update/delete)
CREATE POLICY "Allow authenticated full access"
  ON public.products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
