/**
 * POST /api/subscribe
 *
 * 接收前端傳來的 Web Push 訂閱憑證，存入 Supabase push_subscriptions 表，
 * 並發送一則「訂閱成功」測試推播。
 *
 * Supabase 建表 SQL（只需執行一次）：
 * ─────────────────────────────────────────────────────────
 * create table if not exists push_subscriptions (
 *   id          uuid primary key default gen_random_uuid(),
 *   user_id     uuid references auth.users(id) on delete cascade,
 *   endpoint    text unique not null,
 *   p256dh      text not null,
 *   auth        text not null,
 *   created_at  timestamptz default now()
 * );
 * alter table push_subscriptions enable row level security;
 * create policy "Users manage own subscriptions"
 *   on push_subscriptions for all
 *   using (auth.uid() = user_id)
 *   with check (auth.uid() = user_id);
 * ─────────────────────────────────────────────────────────
 */

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  "mailto:bob112722761236tom@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Server-side Supabase admin client（可繞過 RLS）
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  // 1. 從 Authorization header 取得 user_id
  let userId = null;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (token) {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    userId = user?.id ?? null;
  }

  // 2. 解析訂閱憑證
  const { endpoint, keys } = req.body ?? {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ error: "訂閱憑證格式不完整" });
  }

  // 3. 存入 Supabase（upsert 避免重複）
  const { error: dbError } = await supabaseAdmin
    .from("push_subscriptions")
    .upsert(
      { user_id: userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
      { onConflict: "endpoint" }
    );

  if (dbError) {
    console.error("[subscribe] Supabase 寫入失敗:", dbError.message);
    return res.status(500).json({ error: "儲存訂閱憑證失敗" });
  }

  // 4. 發送「訂閱成功」測試推播
  const payload = JSON.stringify({
    title: "✈️ Jeko eSIM 已就緒",
    body: "推播通知已成功開啟！流量快用完時我們會立即提醒您喔！",
    url: "/data-query/",
  });

  try {
    await webpush.sendNotification({ endpoint, keys }, payload);
  } catch (pushErr) {
    // 推播失敗不影響主流程（已存 DB 就算成功）
    console.warn("[subscribe] 測試推播失敗:", pushErr.message);
  }

  return res.status(201).json({ success: true, message: "訂閱成功！" });
}
