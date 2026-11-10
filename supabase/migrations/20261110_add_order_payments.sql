ALTER TABLE public.orders
  ADD COLUMN payment_method text NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'bkash')),
  ADD COLUMN payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid')),
  ADD COLUMN payment_token uuid,
  ADD COLUMN payment_transaction_id text UNIQUE,
  ADD COLUMN paid_at timestamptz;

-- Public checkout writes must pass through the server's validation.
DROP POLICY IF EXISTS "Anon can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can insert order items" ON public.order_items;
