-- 訂單付款資訊（超商代碼、ATM 等取號資料）
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_info jsonb DEFAULT NULL;

COMMENT ON COLUMN public.orders.payment_info IS '待付款訂單：CVS/ATM 取號資訊 JSON';
