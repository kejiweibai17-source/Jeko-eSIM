// lib/calculateOrder.js (或放在你習慣的 utils 檔案中)專門用來計算最終價格與利潤的函式。這個函式會拿「客人輸入的折扣碼」、「原本的售價」跟「你的底價」來算出結果
import { supabase } from '@/lib/supabaseClient';

export async function validateAndCalculate(couponCode, currentPrice, b2bCost) {
  // 1. 如果沒有輸入折扣碼，直接回傳預設利潤
  if (!couponCode) {
    return {
      success: true,
      finalPrice: currentPrice,
      b2bCost: b2bCost,
      partnerProfit: currentPrice - b2bCost,
      couponId: null,
      partnerId: null // 這裡的 partnerId 可以從前面的 store 關聯帶進來
    };
  }

  // 2. 去資料庫驗證折扣碼
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', couponCode.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !coupon) {
    return { success: false, message: '無效或已過期的折扣碼' };
  }

  // 3. 計算折扣後的客人實付金額
  let discountAmount = 0;
  if (coupon.discount_type === 'percent') {
    discountAmount = currentPrice * (coupon.discount_value / 100);
  } else if (coupon.discount_type === 'fixed') {
    discountAmount = coupon.discount_value;
  }

  let finalPrice = currentPrice - discountAmount;
  finalPrice = Math.max(0, finalPrice); // 確保不為負數

  // 4. 計算這筆訂單的利潤分配 (核心邏輯)
  // 夥伴的利潤 = 客人實付金額 - 你的底價
  let partnerProfit = finalPrice - b2bCost;

  // 防呆機制：如果夥伴設定折扣折太多，導致賠本（甚至低於你的底價）
  if (partnerProfit < 0) {
    return { success: false, message: '折扣碼設定錯誤，低於成本無法結帳' };
  }

  return {
    success: true,
    finalPrice: finalPrice,
    b2bCost: b2bCost,
    partnerProfit: partnerProfit,
    couponId: coupon.id,
    partnerId: coupon.partner_id
  };
}