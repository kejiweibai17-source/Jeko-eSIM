// 檔案位置：pages/api/create-order.js
import { createClient } from '@supabase/supabase-js';

// ⚠️ 注意：這裡使用的是 SERVICE_ROLE_KEY，因為這是在後端 API 執行，
// 可以繞過 RLS 安全規則，確保客人還沒登入也能建立訂單。
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // 1. 從前端接收購物車傳來的訂單資料
    const {
      store_id,
      total_amount,
      b2b_cost,
      partner_profit,
      coupon_id,
      partner_id,
      items // 購物車的商品明細陣列
    } = req.body;

    // 2. 寫入 Supabase orders 資料表
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([
        {
          store_id: store_id || null,
          total_amount: total_amount,
          b2b_cost: b2b_cost,
          partner_profit: partner_profit,
          coupon_id: coupon_id || null,
          partner_id: partner_id || null,
          item_details: items,         // 將購物車商品陣列直接存為 JSON
          status: 'pending'            // 剛建立的訂單都是待付款
        }
      ])
      .select() // 寫入後把新增的那筆資料抓回來
      .single();

    if (error) throw error;

    // 3. 回傳成功訊息與新建立的訂單 ID
    return res.status(200).json({
      success: true,
      message: '訂單建立成功',
      orderId: newOrder.id
    });

  } catch (error) {
    console.error('建立訂單失敗:', error);
    return res.status(500).json({ success: false, message: '伺服器發生錯誤，無法建立訂單' });
  }
}