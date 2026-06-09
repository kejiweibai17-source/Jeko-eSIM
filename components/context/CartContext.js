"use client";

import { createContext, useState, useContext, useEffect, useMemo } from "react";

const CartContext = createContext();
const CART_ID_KEY = "medusa_cart_id";
const CART_SPECS_KEY = "medusa_cart_specs";

const readSpecMap = () => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CART_SPECS_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeSpecMap = (map) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_SPECS_KEY, JSON.stringify(map));
};

const saveVariantSpec = (variantId, specLabel) => {
  if (!variantId || !specLabel) return;
  const map = readSpecMap();
  map[variantId] = specLabel;
  writeSpecMap(map);
};

const buildSpecFromLineItem = (item) => {
  if (item?.metadata?.spec_label) return String(item.metadata.spec_label);
  if (item?.metadata?.options) return String(item.metadata.options);

  const optionValues = item?.variant?.options
    ?.map((o) => o?.value)
    .filter(Boolean);
  if (optionValues?.length) return optionValues.join(" · ");

  if (item?.variant?.title && item.variant.title !== item?.title) {
    return item.variant.title;
  }

  return null;
};

const resolveLineItemSpec = (item) => {
  const fromItem = buildSpecFromLineItem(item);
  if (fromItem) return fromItem;
  const fromLocal = readSpecMap()[item?.variant_id];
  if (fromLocal) return fromLocal;
  return "未指定規格";
};

const cartFieldsQuery = "fields=*items,*items.variant,*items.variant.options";

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 取得環境變數
  const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
  const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

  const headers = {
    "Content-Type": "application/json",
    ...(PUBLISHABLE_KEY && { "x-publishable-api-key": PUBLISHABLE_KEY }),
  };

  const isCartActive = (cart) => cart && !cart.completed_at;

  const createEmptyCart = async () => {
    const res = await fetch(`${MEDUSA_URL}/store/carts`, { method: "POST", headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[CartContext] ❌ 建立購物車失敗:", errData);
      return null;
    }
    const data = await res.json();
    const newId = data.cart.id;
    setCartId(newId);
    localStorage.setItem(CART_ID_KEY, newId);
    formatAndSetCartItems(data.cart);
    console.log("[CartContext] 🎉 新購物車 ID:", newId);
    return newId;
  };

  /** 購物車已結帳完成時，建立新 cart 並還原品項 */
  const recreateCartWithItems = async (lineItems = []) => {
    localStorage.removeItem(CART_ID_KEY);
    setCartId(null);
    setCartItems([]);
    const newId = await createEmptyCart();
    if (!newId || !lineItems.length) return newId;

    for (const item of lineItems) {
      const variantId = item.variant_id;
      if (!variantId) continue;
      try {
        const res = await fetch(`${MEDUSA_URL}/store/carts/${newId}/line-items`, {
          method: "POST",
          headers,
          body: JSON.stringify({ variant_id: variantId, quantity: item.quantity || 1 }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn("[CartContext] 還原品項失敗:", variantId, err);
        }
      } catch (e) {
        console.warn("[CartContext] 還原品項網路錯誤:", e);
      }
    }

    const refreshed = await fetch(
      `${MEDUSA_URL}/store/carts/${newId}?${cartFieldsQuery}`,
      { headers },
    );
    if (refreshed.ok) {
      const data = await refreshed.json();
      formatAndSetCartItems(data.cart);
    }
    return newId;
  };

  const isCartCompletedError = (errData) => {
    const msg = (errData?.message || "").toLowerCase();
    return msg.includes("already completed") || msg.includes("completed");
  };

  // 🌟 1. 初始化購物車
  useEffect(() => {
    const initCart = async () => {
      let localCartId = localStorage.getItem(CART_ID_KEY);

      if (localCartId) {
        console.log(`[CartContext] 🔍 驗證購物車: ${localCartId}`);
        try {
          const res = await fetch(
            `${MEDUSA_URL}/store/carts/${localCartId}?${cartFieldsQuery}`,
            { headers },
          );
          if (res.ok) {
            const data = await res.json();
            const cart = data.cart;

            if (isCartActive(cart)) {
              console.log("[CartContext] ✅ 購物車有效");
              setCartId(cart.id);
              formatAndSetCartItems(cart);
              return;
            }

            console.warn("[CartContext] ⚠️ 購物車已完成結帳，自動建立新購物車並還原商品");
            await recreateCartWithItems(cart.items || []);
            return;
          }
          const errData = await res.json().catch(() => ({}));
          console.warn("[CartContext] ⚠️ 舊購物車失效:", errData);
        } catch (e) {
          console.error("[CartContext] ❌ 驗證購物車錯誤:", e);
        }
        localStorage.removeItem(CART_ID_KEY);
      }

      console.log("[CartContext] 🆕 建立新購物車...");
      await createEmptyCart();
    };

    initCart();
  }, [MEDUSA_URL]);

 // 在 CartContext.js 裡面找到這個函式並覆蓋：
const formatAndSetCartItems = (cart) => {
  if (!cart || !cart.items) {
    console.log("[CartContext] 🈳 購物車目前沒有商品");
    return setCartItems([]);
  }
  
  const formattedItems = cart.items.map((item) => {
    const specLabel = resolveLineItemSpec(item);
    return {
      id: item.id,
      variant_id: item.variant_id,
      name: item.title,
      price: item.unit_price,
      quantity: item.quantity,
      image: item.thumbnail || "/images/default-image.jpg",
      specLabel,
      options: specLabel,
      color: specLabel,
      size: "",
    };
  });
  
  console.log("[CartContext] 📦 當前購物車商品清單更新:", formattedItems);
  setCartItems(formattedItems);
};

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  // 🌟 2. 加入購物車 (打 Medusa API)
  const addToCart = async (product) => {
    console.log("\n==================================");
    console.log("[CartContext] 🛒 觸發加入購物車 (addToCart)");
    console.log("[CartContext] 📥 接收到的原始商品資料:", product);
    
    if (!cartId) {
      console.error("[CartContext] ❌ 錯誤：尚未取得 cartId，無法加入購物車");
      alert("系統正在初始化購物車，請稍後再試。");
      return;
    }

    const qtyToAdd = Number(product.quantity) || 1;
    
    // 💡 Medusa 必須使用 variant_id，我們來做個防呆與日誌
    // 嘗試從 product 中找尋 variant_id，如果沒有就退而求其次用 id (可能還是錯的)
    const targetVariantId = product.variant_id || product.variantId || product.id;
    const specLabel =
      product.options ||
      product.specLabel ||
      [product.telecom, product.days, product.data_amount]
        .filter(Boolean)
        .join(" · ");

    if (specLabel && targetVariantId) {
      saveVariantSpec(targetVariantId, specLabel);
    }

    const payload = {
      variant_id: targetVariantId,
      quantity: qtyToAdd,
      ...(specLabel && {
        metadata: {
          spec_label: specLabel,
          options: specLabel,
        },
      }),
    };

    console.log(`[CartContext] 🚀 發送 POST 請求至 /store/carts/${cartId}/line-items`);
    console.log("[CartContext] 📦 Payload:", payload);

    try {
      const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        console.error("[CartContext] ❌ 加入購物車失敗:", errData);
        if (isCartCompletedError(errData)) {
          await recreateCartWithItems([{ variant_id: targetVariantId, quantity: qtyToAdd }]);
          setIsCartOpen(true);
          return;
        }
        alert(`無法加入購物車：${errData.message || "發生未知錯誤"}`);
        return;
      }

      const data = await res.json();
      console.log("[CartContext] ✅ 成功加入購物車！最新購物車狀態:", data.cart);

      const refreshed = await fetch(
        `${MEDUSA_URL}/store/carts/${cartId}?${cartFieldsQuery}`,
        { headers },
      );
      if (refreshed.ok) {
        const refreshedData = await refreshed.json();
        formatAndSetCartItems(refreshedData.cart);
      } else {
        formatAndSetCartItems(data.cart);
      }
      setIsCartOpen(true);
    } catch (e) {
      console.error("[CartContext] ❌ 加入購物車時發生網路錯誤:", e);
      alert("加入購物車失敗，請檢查網路連線。");
    }
  };

  // 🌟 3. 移除品項
  const removeFromCart = async (...args) => {
    if (!cartId) return;
    const lineItemId = args[0]; 
    console.log(`[CartContext] 🗑️ 準備移除購物車品項 (line_item_id: ${lineItemId})...`);
    
    try {
      const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: "DELETE",
        headers
      });
      
      if (!res.ok) {
        const errData = await res.json();
        console.error("[CartContext] ❌ 移除商品失敗:", errData);
        return;
      }
      
      const data = await res.json();
      console.log("[CartContext] ✅ 移除成功");
      formatAndSetCartItems(data.cart);
    } catch (e) {
      console.error("[CartContext] ❌ 移除商品網路錯誤:", e);
    }
  };

  // 🌟 4. 更新數量
  const updateQuantity = async (...args) => {
    if (!cartId) return;
    let lineItemId = args[0];
    let newQuantity = args.length > 2 ? args[args.length - 1] : args[1]; 
    const nextQty = Math.max(1, Number(newQuantity) || 1);
    
    console.log(`[CartContext] 🔄 準備更新數量 (line_item_id: ${lineItemId}, 新數量: ${nextQty})...`);

    try {
      const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ quantity: nextQty })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        console.error("[CartContext] ❌ 更新數量失敗:", errData);
        return;
      }

      const data = await res.json();
      console.log("[CartContext] ✅ 數量更新成功");
      formatAndSetCartItems(data.cart);
    } catch (e) {
      console.error("[CartContext] ❌ 更新數量網路錯誤:", e);
    }
  };

  const clearCart = () => {
    console.log("[CartContext] 🧹 清空購物車...");
    setCartItems([]);
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(CART_SPECS_KEY);
    setCartId(null);
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartId, 
        cartItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        recreateCartWithItems,
        isCartOpen,
        setIsCartOpen,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);