-- 推播訂閱綁定 eSIM（訪客 / 會員共用）
-- 在 Supabase SQL Editor 執行一次

alter table push_subscriptions
  add column if not exists iccid text,
  add column if not exists guest_email text,
  add column if not exists topup_id text,
  add column if not exists iccid_bound_at timestamptz,
  add column if not exists monitor_enabled boolean default false,
  add column if not exists product_label text,
  add column if not exists order_id uuid,
  add column if not exists bind_method text;

create index if not exists idx_push_subscriptions_iccid
  on push_subscriptions (iccid)
  where iccid is not null;

create index if not exists idx_push_subscriptions_monitor
  on push_subscriptions (monitor_enabled)
  where monitor_enabled = true;
