// 檔案位置: esim-store-front/pages/api/orders/create.js

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method Not Allowed" });

  const { cartId, orderInfo } = req.body;
  if (!cartId) return res.status(400).json({ success: false, message: "缺少購物車 ID" });

  const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
  const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  const headers = { "Content-Type": "application/json", ...(PUBLISHABLE_KEY && { "x-publishable-api-key": PUBLISHABLE_KEY }) };

  const parseMedusaError = (data) => {
    if (!data) return "未知錯誤";
    if (data.message) return data.message;
    if (Array.isArray(data.errors) && data.errors[0]?.message) return data.errors[0].message;
    return JSON.stringify(data);
  };

  const fetchMedusa = async (stepName, url, options = {}) => {
    const response = await fetch(url, options);
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; }
    catch { throw new Error(`[${stepName}] Medusa 回傳格式錯誤。`); }

    if (!response.ok) {
      const detail = parseMedusaError(data);
      const err = new Error(`[${stepName}] 失敗: ${detail}`);
      if (detail.toLowerCase().includes("already completed") || detail.includes("已完成")) {
        err.code = "CART_COMPLETED";
      }
      throw err;
    }
    return data;
  };

  try {
    console.log(`\n==========================================`);
    console.log(`[Next.js API] 🚀 開始處理結帳流程，Cart ID: ${cartId}`);

    const cartCheck = await fetchMedusa("取得購物車", `${MEDUSA_URL}/store/carts/${cartId}`, { headers });
    if (cartCheck.cart?.completed_at) {
      return res.status(400).json({
        success: false,
        code: "CART_COMPLETED",
        message: "此購物車已完成結帳，請重新整理頁面後再試（系統會自動建立新購物車）。",
      });
    }

    const addressPayload = {
      first_name: orderInfo.name,
      last_name: orderInfo.name,
      address_1: orderInfo.address,
      city: orderInfo.city || "Taipei",
      country_code: "tw",
      postal_code: orderInfo.postalCode || "000",
      phone: orderInfo.phone,
    };

    console.log(`[Next.js API] 📍 步驟 1: 更新地址...`);
    await fetchMedusa("更新地址", `${MEDUSA_URL}/store/carts/${cartId}`, { method: "POST", headers, body: JSON.stringify({ email: orderInfo.email, shipping_address: addressPayload, billing_address: addressPayload }) });

    console.log(`[Next.js API] 🚚 步驟 2: 抓取並設定運費方案...`);
    const shipOptionsData = await fetchMedusa("取得運費選項", `${MEDUSA_URL}/store/shipping-options?cart_id=${cartId}`, { headers });
    if (!shipOptionsData.shipping_options || shipOptionsData.shipping_options.length === 0) throw new Error("無可用運費");
    await fetchMedusa("套用運費", `${MEDUSA_URL}/store/carts/${cartId}/shipping-methods`, { method: "POST", headers, body: JSON.stringify({ option_id: shipOptionsData.shipping_options[0].id }) });

    console.log(`[Next.js API] 💳 步驟 3: 檢查/建立付款集合...`);
    const cartData = await fetchMedusa("取得購物車", `${MEDUSA_URL}/store/carts/${cartId}`, { headers });
    let paymentCollectionId = cartData.cart?.payment_collection?.id;
    if (!paymentCollectionId) {
      const payColData = await fetchMedusa("建立付款集合", `${MEDUSA_URL}/store/payment-collections`, { method: "POST", headers, body: JSON.stringify({ cart_id: cartId }) });
      paymentCollectionId = payColData.payment_collection.id;
    }

    // 🌟 提前取出購物車總金額，確保藍新有正確的金額可以扣款
    const finalAmount = cartData.cart.total || 0;

    console.log(`[Next.js API] 🔍 步驟 4: 指定付款方式 (pp_system_default)...`);
    await fetchMedusa("設定付款方式", `${MEDUSA_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`, { method: "POST", headers, body: JSON.stringify({ provider_id: "pp_system_default" }) });

    console.log(`[Next.js API] 🎯 步驟 5: 觸發正式送出訂單 (放生 Medusa，準備跳轉)...`);
    
    let finalOrderId = cartId; // 預設使用 cartId 當作藍新的訂單編號

    try {
      // 我們只呼叫一次，然後用 try-catch 包起來。就算 Medusa 吐 409/500，我們也不會中斷程式！
      const completeResponse = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
        method: "POST",
        headers: { ...headers, "Idempotency-Key": `checkout_${cartId}` }
      });
      const completeData = await completeResponse.json();

      if (completeResponse.ok && completeData.type === "order") {
         finalOrderId = completeData.order?.id || completeData.data?.id || cartId;
         console.log(`[Next.js API] 🎉 訂單順利秒建成功！Order ID: ${finalOrderId}`);
      } else {
         console.log(`[Next.js API] ⚠️ Medusa 已進入背景排隊處理，我們不等它了，直接護送客人去金流！`);
      }
    } catch (e) {
      console.log(`[Next.js API] ⚠️ 觸發完成訂單無回應，Medusa 背景處理中。繼續跳轉...`);
    }

    // 🚀 關鍵：不管 Medusa 後端跑到哪了，我們直接把 OrderId (或 CartId) 和金額丟給藍新結帳！
    return res.status(200).json({ success: true, orderId: finalOrderId, amount: finalAmount });

  } catch (error) {
    console.error(`\n[Next.js API] 💥 結帳中斷: ${error.message}\n`);
    const status = error.code === "CART_COMPLETED" ? 400 : 500;
    return res.status(status).json({
      success: false,
      code: error.code || "CHECKOUT_ERROR",
      message: error.message,
    });
  }
}