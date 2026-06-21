-- ============================================================
-- eSIM 訂單表 + 退款申請（一次執行）
-- 若出現 relation "orders" does not exist，代表尚未建 orders 表
-- 本腳本會先建立 orders，再建立 refund_requests
-- ============================================================

-- 1) 訂單主表（若已存在則跳過）
CREATE TABLE IF NOT EXISTS public.orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  store_id bigint,
  partner_id bigint,
  coupon_id bigint,
  customer_email text,
  customer_name text,
  total_amount numeric(12, 2) NOT NULL DEFAULT 0,
  total_price numeric(12, 2),
  b2b_cost numeric(12, 2) NOT NULL DEFAULT 0,
  partner_profit numeric(12, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  item_details jsonb NOT NULL DEFAULT '[]'::jsonb,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  qrcode_data jsonb,
  esim_activation_status text NOT NULL DEFAULT 'unknown',
  refunded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) 若 orders 已存在（舊環境），補齊可能缺少的欄位
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS store_id bigint;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS partner_id bigint;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_id bigint;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount numeric(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_price numeric(12, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS b2b_cost numeric(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS partner_profit numeric(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS item_details jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS qrcode_data jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS esim_activation_status text DEFAULT 'unknown';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refunded_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON public.orders (partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- 3) 退款申請表
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id bigint NOT NULL,
  customer_email text NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('full_refund', 'dispute')),
  reason_type text NOT NULL,
  reason_note text,
  device_model text,
  activation_claim text CHECK (activation_claim IN ('not_activated', 'activated')),
  image_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  admin_note text,
  esim_activation_status text DEFAULT 'unknown',
  agreed_terms_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text
);

CREATE INDEX IF NOT EXISTS idx_refund_requests_order_id ON public.refund_requests (order_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON public.refund_requests (status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_email ON public.refund_requests (customer_email);

-- 外鍵（PostgREST 關聯查詢用；若已存在則跳過）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_refund_requests_order_id'
  ) THEN
    ALTER TABLE public.refund_requests
      ADD CONSTRAINT fk_refund_requests_order_id
      FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4) RLS（依需求調整；service_role API 不受 RLS 限制）
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

-- 會員只能讀自己的訂單（email 比對）
DROP POLICY IF EXISTS "orders_select_own_email" ON public.orders;
CREATE POLICY "orders_select_own_email"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_email = (auth.jwt() ->> 'email'));

-- 會員只能讀自己的退款申請
DROP POLICY IF EXISTS "refund_requests_select_own" ON public.refund_requests;
CREATE POLICY "refund_requests_select_own"
  ON public.refund_requests FOR SELECT
  TO authenticated
  USING (customer_email = (auth.jwt() ->> 'email'));

-- ============================================================
-- Storage：至 Dashboard → Storage 建立 bucket「refund-evidence」
-- 建議 Public；或 Private + signed URL（需另改 upload API）
-- ============================================================
