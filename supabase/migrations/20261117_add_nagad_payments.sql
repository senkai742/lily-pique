-- Keep historical cash-on-delivery orders readable; new checkout orders are online only.
ALTER TABLE public.orders
  DROP CONSTRAINT orders_payment_method_check,
  ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('cod', 'bkash', 'nagad')),
  ALTER COLUMN payment_method SET DEFAULT 'bkash',
  ALTER COLUMN payment_status SET DEFAULT 'pending';
