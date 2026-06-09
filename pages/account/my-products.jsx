import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CubeIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  ArchiveBoxIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function MyStoreProducts() {
  const [activeTab, setActiveTab] = useState("my-products");
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);
  const [myProducts, setMyProducts] = useState([]);

  // 控制哪個商品被展開檢視變體
  const [expandedProductId, setExpandedProductId] = useState(null);

  // 紀錄正在編輯的自訂價格 { [store_product_id]: { [variation_id]: price } }
  const [editingPrices, setEditingPrices] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. 抓取店鋪資料 (需要 markup_rate)
      const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!store) return;
      setStoreInfo(store);

      // 2. 抓取該店鋪上架的商品，並 Join 主商品與變體
      const { data: spData, error } = await supabase
        .from("store_products")
        .select(
          `
          id,
          product_id,
          custom_prices,
          products (
            id,
            name,
            product_variations (
              id,
              sku,
              b2b_price,
              attributes
            )
          )
        `,
        )
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyProducts(spData || []);
    } catch (err) {
      console.error("載入失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  // 處理輸入框變化
  const handlePriceChange = (storeProductId, variationId, value) => {
    setEditingPrices((prev) => ({
      ...prev,
      [storeProductId]: {
        ...(prev[storeProductId] || {}),
        [variationId]: value,
      },
    }));
  };

  // 儲存自訂價格到 Supabase
  const handleSaveCustomPrices = async (
    storeProductId,
    existingCustomPrices,
  ) => {
    try {
      setSavingId(storeProductId);

      // 合併舊的自訂價格與這次新輸入的價格
      const updatedPrices = {
        ...(existingCustomPrices || {}),
        ...(editingPrices[storeProductId] || {}),
      };

      const { error } = await supabase
        .from("store_products")
        .update({ custom_prices: updatedPrices })
        .eq("id", storeProductId);

      if (error) throw error;

      alert("✅ 變體定價已更新！前台將以此價格售出。");
      fetchMyProducts(); // 重新整理資料
    } catch (err) {
      console.error("更新失敗:", err);
      alert("更新失敗，請稍後再試");
    } finally {
      setSavingId(null);
    }
  };

  // 下架商品
  const handleRemoveProduct = async (storeProductId, productName) => {
    if (!window.confirm(`確定要將「${productName}」從您的店鋪下架嗎？`)) return;

    try {
      const { error } = await supabase
        .from("store_products")
        .delete()
        .eq("id", storeProductId);

      if (error) throw error;
      setMyProducts((prev) => prev.filter((p) => p.id !== storeProductId));
    } catch (err) {
      console.error("下架失敗:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9]">
        <div className="text-blue-500 font-bold animate-pulse">
          載入店鋪商品中...
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F4F7F9] font-sans">
      {/* --- 左側側邊欄 --- */}
      <aside className="w-[240px] bg-[#161C2D] text-white flex flex-col shrink-0 hidden md:flex">
        <div className="px-6 py-8 border-b border-white/10">
          <h1 className="text-2xl font-black text-blue-400 tracking-wider">
            JEKO eSIM
          </h1>
          <p className="text-xs text-slate-400 mt-1">極客數位企業社</p>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-1">
          <SidebarItem
            icon={<CubeIcon className="w-5 h-5" />}
            label="我的 eSIM 訂單"
          />
          <SidebarItem
            icon={<UserIcon className="w-5 h-5" />}
            label="個人帳號設定"
          />
          <div className="my-4 border-t border-white/10 mx-6"></div>
          <div className="px-6 text-[11px] text-slate-500 font-bold mb-2 tracking-widest uppercase">
            店長專區
          </div>
          <SidebarItem
            icon={<BriefcaseIcon className="w-5 h-5" />}
            label="合作夥伴中心"
          />
          <SidebarItem
            icon={<ShoppingBagIcon className="w-5 h-5" />}
            label="商店選品管理"
          />
          {/* 🌟 新增：我的店鋪商品 */}
          <SidebarItem
            icon={<ArchiveBoxIcon className="w-5 h-5" />}
            label="我的店鋪商品"
            isActive={true}
          />
        </nav>
      </aside>

      {/* --- 右側主內容區 --- */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white h-[72px] px-8 flex items-center justify-between border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">
            我的店鋪商品 (定價管理)
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-full">
              全局加價策略：底價 + {storeInfo?.markup_rate || 0}%
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-[1000px] w-full mx-auto flex flex-col gap-4">
          <div className="mb-4">
            <h3 className="text-xl font-black text-slate-800 mb-1">
              已上架商品清單
            </h3>
            <p className="text-sm text-slate-500">
              點擊展開商品，可針對不同的天數/流量變體設定專屬的特價。若未設定，系統將自動套用全局加價。
            </p>
          </div>

          {myProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <ArchiveBoxIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-700 mb-2">
                您的店鋪目前沒有商品
              </h4>
              <p className="text-slate-500 mb-6">
                請前往「商店選品管理」大廳挑選熱銷 eSIM 上架。
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myProducts.map((sp) => {
                const product = sp.products;
                const variations = product.product_variations || [];
                const isExpanded = expandedProductId === sp.id;
                const customPrices = sp.custom_prices || {}; // 該商品的自訂價格紀錄

                return (
                  <div
                    key={sp.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                  >
                    {/* 主商品橫幅 (點擊可展開) */}
                    <div
                      className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                      onClick={() =>
                        setExpandedProductId(isExpanded ? null : sp.id)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                          <GlobeAltIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            包含 {variations.length} 種方案變體
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProduct(sp.id, product.name);
                          }}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2"
                          title="下架商品"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        {isExpanded ? (
                          <ChevronUpIcon className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* 展開後的變體定價表格 */}
                    {isExpanded && (
                      <div className="bg-slate-50 border-t border-slate-200 p-6">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200">
                                <th className="pb-3 text-sm font-bold text-slate-500">
                                  方案變體 (天數/數據)
                                </th>
                                <th className="pb-3 text-sm font-bold text-slate-500">
                                  總部底價
                                </th>
                                <th className="pb-3 text-sm font-bold text-slate-500">
                                  全局策略售價
                                </th>
                                <th className="pb-3 text-sm font-bold text-[#115498]">
                                  您的自訂售價 (可覆蓋)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {variations.map((v) => {
                                const b2bPrice = v.b2b_price || 0;
                                const markup = storeInfo.markup_rate || 0;
                                // 系統預設幫他算好的價格
                                const defaultPrice = Math.round(
                                  b2bPrice * (1 + markup / 100),
                                );

                                // 取出他目前的編輯值，或資料庫存的值
                                const currentCustomPrice =
                                  editingPrices[sp.id]?.[v.id] ??
                                  customPrices[v.id] ??
                                  "";

                                // 解析 attributes 顯示方案名稱 (例如 3天)
                                const variantName = v.attributes?.days
                                  ? `${v.attributes.days}天方案`
                                  : v.sku;

                                return (
                                  <tr
                                    key={v.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50"
                                  >
                                    <td className="py-4 text-sm font-bold text-slate-700">
                                      {variantName}
                                    </td>
                                    <td className="py-4 text-sm text-slate-500">
                                      NT$ {b2bPrice}
                                    </td>
                                    <td className="py-4 text-sm text-slate-500">
                                      NT$ {defaultPrice}
                                    </td>
                                    <td className="py-4">
                                      <div className="relative w-32">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                          NT$
                                        </span>
                                        <input
                                          type="number"
                                          placeholder={defaultPrice}
                                          value={currentCustomPrice}
                                          onChange={(e) =>
                                            handlePriceChange(
                                              sp.id,
                                              v.id,
                                              e.target.value,
                                            )
                                          }
                                          className="w-full pl-10 pr-3 py-1.5 text-sm border border-slate-300 rounded focus:border-[#115498] focus:ring-1 focus:ring-[#115498] outline-none"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() =>
                              handleSaveCustomPrices(sp.id, customPrices)
                            }
                            disabled={savingId === sp.id}
                            className="bg-[#115498] hover:bg-[#0c4076] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 disabled:opacity-50"
                          >
                            {savingId === sp.id ? (
                              "儲存中..."
                            ) : (
                              <>
                                <CheckIcon className="w-4 h-4" /> 儲存變體定價
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// 輔助組件 (缺少會報錯)
function GlobeAltIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

function SidebarItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-3 border-l-4 transition-all duration-200 text-left ${isActive ? "border-blue-500 bg-blue-600/10 text-blue-400 font-bold" : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200 font-medium"}`}
    >
      {icon}
      <span className="text-[14px]">{label}</span>
    </button>
  );
}
