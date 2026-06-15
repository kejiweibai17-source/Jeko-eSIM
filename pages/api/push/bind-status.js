import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const endpoint = req.query.endpoint;
  if (!endpoint) {
    return res.status(400).json({ error: "缺少 endpoint" });
  }

  const { data, error } = await supabaseAdmin
    .from("push_subscriptions")
    .select(
      "iccid, guest_email, topup_id, monitor_enabled, iccid_bound_at, product_label, bind_method, order_id",
    )
    .eq("endpoint", endpoint)
    .maybeSingle();

  if (error) {
    const missing =
      error.message?.includes("does not exist") || error.code === "42P01";
    return res.status(500).json({
      error: "查詢失敗",
      hint: missing
        ? "請執行 supabase/migrations/20260608_push_esim_bind.sql"
        : error.message,
    });
  }

  if (!data) {
    return res.status(200).json({
      subscribed: false,
      bound: false,
      needsIccid: false,
    });
  }

  const bound = Boolean(
    data.monitor_enabled && (data.iccid || data.topup_id),
  );

  return res.status(200).json({
    subscribed: true,
    bound,
    needsIccid: !bound,
    iccid: data.iccid || null,
    guestEmail: data.guest_email || null,
    topupId: data.topup_id || null,
    productName: data.product_label || null,
    bindMethod: data.bind_method || null,
    orderId: data.order_id || null,
    boundAt: data.iccid_bound_at || null,
  });
}
