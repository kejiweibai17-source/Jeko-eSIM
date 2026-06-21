-- 流量監控 + LINE 推播提醒（Cron 用）
-- 在 Supabase SQL Editor 執行一次（若未跑過 20260608，此檔已含必要欄位）

alter table push_subscriptions
  add column if not exists iccid text,
  add column if not exists guest_email text,
  add column if not exists topup_id text,
  add column if not exists iccid_bound_at timestamptz,
  add column if not exists monitor_enabled boolean default false,
  add column if not exists product_label text,
  add column if not exists order_id uuid,
  add column if not exists bind_method text,
  add column if not exists line_user_id text,
  add column if not exists line_alert_enabled boolean default false,
  add column if not exists last_checked_at timestamptz,
  add column if not exists last_remaining_mb numeric,
  add column if not exists last_alert_at timestamptz;

create index if not exists idx_push_subscriptions_line_user
  on push_subscriptions (line_user_id)
  where line_user_id is not null;

-- LINE 專用監控（未開 Web Push、僅 LINE 推播的用戶）
create table if not exists line_traffic_alerts (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null,
  topup_id text,
  iccid text,
  product_label text,
  order_id uuid,
  guest_email text,
  monitor_enabled boolean default true,
  last_checked_at timestamptz,
  last_remaining_mb numeric,
  last_alert_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists idx_line_traffic_alerts_user_topup
  on line_traffic_alerts (line_user_id, topup_id);

alter table line_traffic_alerts
  drop constraint if exists line_traffic_alerts_user_topup_unique;

alter table line_traffic_alerts
  add constraint line_traffic_alerts_user_topup_unique
  unique (line_user_id, topup_id);

create index if not exists idx_line_traffic_alerts_monitor
  on line_traffic_alerts (monitor_enabled)
  where monitor_enabled = true;

-- LINE 官方帳號好友（follow 事件寫入，供推播權限判斷）
create table if not exists line_oa_friends (
  line_user_id text primary key,
  display_name text,
  followed_at timestamptz default now(),
  unfollowed_at timestamptz
);
