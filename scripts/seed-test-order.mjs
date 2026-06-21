/**
 * 一次性測試：插入 completed 訂單並驗證 refund 資格
 * 執行：node scripts/seed-test-order.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

function loadEnv() {
  try {
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch (e) {
    console.error("無法讀取 .env.local:", e.message);
    process.exit(1);
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testEmail =
  process.env.GMAIL_USER || "bob112722761236tom@gmail.com";

if (!url || !key) {
  console.error("缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const mockQrcode = [
  {
    productName: "【測試】日本 eSIM 7日 3GB",
    qrcodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TEST-ESIM-ORDER",
    topupId: `TEST-${Date.now()}`,
  },
];

const testOrder = {
  customer_email: testEmail,
  customer_name: "測試會員",
  total_amount: 599,
  total_price: 599,
  b2b_cost: 420,
  partner_profit: 179,
  status: "completed",
  item_details: [
    {
      name: "【測試】日本 eSIM 7日 3GB",
      productName: "【測試】日本 eSIM 7日 3GB",
      quantity: 1,
      price: 599,
      planId: "JP-TEST-7D-3GB",
    },
  ],
  items: [
    {
      name: "【測試】日本 eSIM 7日 3GB",
      quantity: 1,
      planId: "JP-TEST-7D-3GB",
    },
  ],
  qrcode_data: mockQrcode,
  esim_activation_status: "unknown",
};

async function main() {
  console.log("🔗 Supabase:", url);
  console.log("📧 測試 Email:", testEmail);
  console.log("---");

  // 1) 確認 orders 表存在
  const { error: probeErr } = await supabase.from("orders").select("id").limit(1);
  if (probeErr) {
    console.error("❌ orders 表無法讀取:", probeErr.message);
    console.error("   請先在 Supabase 執行 migration: supabase/migrations/20260621_refund_requests.sql");
    process.exit(1);
  }
  console.log("✅ orders 表可連線");

  // 2) 插入測試訂單
  const { data: inserted, error: insertErr } = await supabase
    .from("orders")
    .insert(testOrder)
    .select("*")
    .single();

  if (insertErr) {
    console.error("❌ 插入測試訂單失敗:", insertErr.message);
    process.exit(1);
  }

  console.log("✅ 測試訂單已建立");
  console.log("   訂單 ID:", inserted.id);
  console.log("   狀態:", inserted.status);
  console.log("   金額: NT$", inserted.total_amount);

  // 3) 依 email 查詢（模擬 user-orders API 邏輯）
  const { data: byEmail, error: qErr } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", testEmail)
    .eq("id", inserted.id)
    .single();

  if (qErr) {
    console.error("❌ 查詢訂單失敗:", qErr.message);
    process.exit(1);
  }

  const { data: refunds } = await supabase
    .from("refund_requests")
    .select("*")
    .eq("order_id", inserted.id);

  console.log(
    "✅ 依 Email 查詢成功，QR 筆數:",
    Array.isArray(byEmail.qrcode_data) ? byEmail.qrcode_data.length : 0,
    "| 退款申請:",
    refunds?.length ?? 0,
  );

  // 4) 確認 refund_requests 表 + 模擬 pending 申請（不真的送審，只 probe）
  const { error: rrProbe } = await supabase.from("refund_requests").select("id").limit(1);
  if (rrProbe) {
    console.error("❌ refund_requests 表無法讀取:", rrProbe.message);
    process.exit(1);
  }
  console.log("✅ refund_requests 表可連線");

  // 5) 退款資格（7 日內 completed → 可申請 full_refund）
  const ageDays =
    (Date.now() - new Date(inserted.created_at).getTime()) / (1000 * 60 * 60 * 24);
  const canRefund = inserted.status === "completed" && ageDays <= 7;
  console.log("✅ 退款資格:", canRefund ? "可申請未開通全額退款" : "不可申請");

  // 6) 測試 create-order API（localhost）
  try {
    const res = await fetch("http://localhost:3000/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total_amount: 299,
        b2b_cost: 200,
        partner_profit: 99,
        items: [{ name: "API 測試方案", quantity: 1 }],
      }),
    });
    const apiData = await res.json();
    if (res.ok && apiData.success) {
      console.log("✅ /api/create-order 正常，新訂單 ID:", apiData.orderId);
      // 標記為 completed 方便 UI 測試
      await supabase
        .from("orders")
        .update({
          status: "completed",
          customer_email: testEmail,
          customer_name: "API 測試",
          qrcode_data: mockQrcode,
        })
        .eq("id", apiData.orderId);
      console.log("   已更新為 completed + 綁定測試 Email");
    } else {
      console.warn("⚠️ /api/create-order 回應:", apiData.message || apiData);
    }
  } catch (e) {
    console.warn("⚠️ 無法連 localhost:3000（請確認 npm run dev 有在跑）:", e.message);
  }

  console.log("\n--- 完成 ---");
  console.log("請至 http://localhost:3000/account →「我的 eSIM (訂單)」");
  console.log(`使用 ${testEmail} 登入後應可看到測試訂單 #${inserted.id}`);
  console.log("可點「詳情」→「申請退款（未開通）」測試表單");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
