CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES menus(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  customer_name text,
  customer_phone text,
  order_type text NOT NULL DEFAULT 'dine-in',
  table_number text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_public" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update_own" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "orders_delete_own" ON orders FOR DELETE USING (auth.uid() = user_id);
