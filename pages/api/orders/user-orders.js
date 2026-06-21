// 檔案位置: pages/api/orders/user-orders.js
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // ⚠️ 這裡請換成你專案中 NextAuth 設定檔的實際路徑

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const targetEmail = req.query.email;
  if (!targetEmail) {
    return res.status(400).json({ message: "缺少 Email 參數" });
  }

  let isAuthenticated = false;
  let userEmail = null;

  try {
    // 🛡️ 1. 檢查 Supabase Token (Google / Email 登入)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        isAuthenticated = true;
        userEmail = user.email;
      }
    }

    // 🛡️ 2. 檢查 NextAuth Session (LINE 登入)
    if (!isAuthenticated) {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.user) {
        isAuthenticated = true;
        // 如果 LINE 沒給 Email，使用我們前端配發的虛擬 Email
        userEmail = session.user.email || `${session.user.id}@line.jekoesim.com`;
      }
    }

    // 🛡️ 3. 資安防護：確保請求查詢的 Email，真的是登入者本人的 Email
    if (!isAuthenticated || userEmail !== targetEmail) {
      return res.status(401).json({ message: "未授權的存取，無法查詢他人訂單" });
    }

    // 🚀 4. 驗證通過，使用 Service Role Key (萬能鑰匙) 撈取資料
    // 注意：SERVICE_ROLE_KEY 擁有最高權限，絕對只能在後端 API 使用！
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY 
    );

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("customer_email", targetEmail)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const orderList = orders || [];
    const orderIds = orderList.map((o) => o.id).filter(Boolean);

    let refundsByOrder = {};
    if (orderIds.length) {
      const { data: refunds, error: refundErr } = await supabaseAdmin
        .from("refund_requests")
        .select("id, order_id, status, request_type, reason_type, reason_note, admin_note, created_at, reviewed_at")
        .in("order_id", orderIds)
        .order("created_at", { ascending: false });

      if (refundErr) throw refundErr;

      for (const r of refunds || []) {
        if (!refundsByOrder[r.order_id]) refundsByOrder[r.order_id] = [];
        refundsByOrder[r.order_id].push(r);
      }
    }

    const normalized = orderList.map((order) => ({
      ...order,
      refund_requests: refundsByOrder[order.id] || [],
    }));

    return res.status(200).json({ success: true, data: normalized });

  } catch (error) {
    console.error("[Get Orders Error]:", error);
    return res.status(500).json({ message: "系統讀取訂單失敗" });
  }
}