/**
 * 插入會員中心測試訂單：
 * 1) 已付款、尚未開通 eSIM（可測 QR / 退款）
 * 2) 待付款 — 超商代碼繳費（可測待付款流程）
 *
 * 執行：node scripts/seed-demo-orders.mjs
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
  process.env.SEED_TEST_EMAIL ||
  process.env.GMAIL_USER ||
  "bob112722761236tom@gmail.com";

if (!url || !key) {
  console.error("缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ts = Date.now();

/** ① 已付款、QR 已發但 eSIM 尚未開通（未掃 QR）→ 全額退款表單 */
const unactivatedOrder = {
  customer_email: testEmail,
  customer_name: "Bob",
  total_amount: 699,
  total_price: 699,
  b2b_cost: 490,
  partner_profit: 209,
  status: "completed",
  esim_activation_status: "not_activated",
  item_details: [
    {
      name: "【測試·未開通】韓國 eSIM 5日",
      productName: "【測試·未開通】韓國 eSIM 5日",
      quantity: 1,
      price: 699,
      planId: "KR-TEST-5D-UNL",
    },
  ],
  items: [
    {
      name: "【測試·未開通】韓國 eSIM 5日",
      quantity: 1,
      planId: "KR-TEST-5D-UNL",
    },
  ],
  qrcode_data: [
    {
      productName: "【測試·未開通】韓國 eSIM 5日",
      qrcodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UNACTIVATED-${ts}`,
      topupId: `DEMO-UNACT-${ts}`,
    },
  ],
};

/** ③ 已掃 QR 開通 → 售後爭議（須上傳舉證） */
const activatedOrder = {
  customer_email: testEmail,
  customer_name: "Bob",
  total_amount: 799,
  total_price: 799,
  b2b_cost: 560,
  partner_profit: 239,
  status: "completed",
  esim_activation_status: "activated",
  item_details: [
    {
      name: "【測試·已開通】泰國 eSIM 8日",
      productName: "【測試·已開通】泰國 eSIM 8日",
      quantity: 1,
      price: 799,
      planId: "TH-TEST-8D",
    },
  ],
  items: [
    {
      name: "【測試·已開通】泰國 eSIM 8日",
      quantity: 1,
      planId: "TH-TEST-8D",
    },
  ],
  qrcode_data: [
    {
      productName: "【測試·已開通】泰國 eSIM 8日",
      qrcodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ACTIVATED-${ts}`,
      topupId: `DEMO-ACT-${ts}`,
    },
  ],
};

/** ② 待付款 — 超商代碼繳費（7-11） */
const expire = new Date();
expire.setDate(expire.getDate() + 3);
const expireStr = `${expire.getFullYear()}/${String(expire.getMonth() + 1).padStart(2, "0")}/${String(expire.getDate()).padStart(2, "0")} 23:59`;

const pendingCvsOrder = {
  customer_email: testEmail,
  customer_name: "Bob",
  total_amount: 499,
  total_price: 499,
  b2b_cost: 350,
  partner_profit: 149,
  status: "pending",
  esim_activation_status: "unknown",
  item_details: [
    {
      name: "【測試】日本 eSIM 7日 3GB",
      productName: "【測試】日本 eSIM 7日 3GB",
      quantity: 1,
      price: 499,
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
  qrcode_data: null,
  payment_info: {
    payment_type: "CVS",
    payment_method_label: "超商代碼繳費",
    store_type: "7-ELEVEN",
    code_no: `CVS${String(ts).slice(-8)}`,
    payment_no: `CVS${String(ts).slice(-8)}`,
    expire_date: expireStr,
    trade_no: `NW${String(ts).slice(-10)}`,
    amount: 499,
    merchant_order_no: `JEKO-DEMO-${ts}`,
  },
};

async function ensurePaymentInfoColumn() {
  const { error } = await supabase.from("orders").select("payment_info").limit(1);
  if (error?.message?.includes("payment_info")) {
    console.warn(
      "⚠️ orders.payment_info 欄位不存在 — 超商代碼寫入 item_details._payment_demo",
    );
    console.warn("   建議執行: supabase/migrations/20260621_orders_payment_info.sql");
    return false;
  }
  return true;
}

async function main() {
  console.log("🔗 Supabase:", url);
  console.log("📧 測試 Email:", testEmail);
  console.log("---");

  const { error: probeErr } = await supabase.from("orders").select("id").limit(1);
  if (probeErr) {
    console.error("❌ orders 表無法讀取:", probeErr.message);
    process.exit(1);
  }

  const hasPaymentInfoCol = await ensurePaymentInfoColumn();
  const payMeta = pendingCvsOrder.payment_info;

  const pendingPayload = { ...pendingCvsOrder };
  if (!hasPaymentInfoCol) {
    delete pendingPayload.payment_info;
    pendingPayload.item_details = [
      {
        ...pendingCvsOrder.item_details[0],
        _payment_demo: payMeta,
      },
    ];
  }

  const { data: unact, error: e1 } = await supabase
    .from("orders")
    .insert(unactivatedOrder)
    .select("id, status, total_amount, esim_activation_status")
    .single();

  if (e1) {
    console.error("❌ 插入「尚未開通」訂單失敗:", e1.message);
    process.exit(1);
  }

  const pendingSelect = hasPaymentInfoCol ? "id, status, total_amount, payment_info" : "id, status, total_amount, item_details";
  const { data: pending, error: e2 } = await supabase
    .from("orders")
    .insert(pendingPayload)
    .select(pendingSelect)
    .single();

  if (e2) {
    console.error("❌ 插入「待付款」訂單失敗:", e2.message);
    process.exit(1);
  }

  const { data: activated, error: e3 } = await supabase
    .from("orders")
    .insert(activatedOrder)
    .select("id, status, total_amount, esim_activation_status")
    .single();

  if (e3) {
    console.error("❌ 插入「已開通」訂單失敗:", e3.message);
    process.exit(1);
  }

  const pendingPay = pending.payment_info || pending.item_details?.[0]?._payment_demo;

  console.log("✅ 測試訂單已建立\n");

  console.log("📦 ① 尚未掃 QR（未開通）→ 全額退款表單");
  console.log("   訂單 ID:", unact.id);
  console.log("   狀態:", unact.status, "| 開通:", unact.esim_activation_status);
  console.log("   → 點「詳情」：勾選未掃 QR、選原因、無須上傳截圖\n");

  console.log("📱 ③ 已掃 QR 開通 → 售後爭議（舉證）");
  console.log("   訂單 ID:", activated.id);
  console.log("   狀態:", activated.status, "| 開通:", activated.esim_activation_status);
  console.log("   → 點「詳情」：填手機型號、問題說明、上傳截圖\n");

  console.log("🏪 ② 待付款 — 超商代碼繳費");
  console.log("   訂單 ID:", pending.id);
  console.log("   狀態:", pending.status);
  if (pendingPay) {
    console.log("   超商:", pendingPay.store_type);
    console.log("   繳費代碼:", pendingPay.code_no);
    console.log("   期限:", pendingPay.expire_date);
  }
  console.log("   → 會員中心可：查看繳費資訊、複製代碼\n");

  console.log("---");
  console.log("請至 http://localhost:3000/account");
  console.log(`使用 ${testEmail} 登入 →「我的 eSIM 訂單」`);
  console.log("待辦事項 / 首頁總覽也會顯示待付款筆數");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
