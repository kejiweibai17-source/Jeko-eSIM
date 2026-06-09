import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CubeIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function PartnerCatalog() {
  const [activeTab, setActiveTab] = useState("catalog");
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (store) {
        setStoreInfo(store);

        // 🌟 核心更新：同時撈取主商品與它的變體 (為了抓出最低的 b2b_price)
        const { data: allProducts } = await supabase
          .from("products")
          .select(
            `
            id, 
            name,
            product_variations ( b2b_price )
          `,
          )
          .order("created_at", { ascending: false });

        const { data: addedProducts } = await supabase
          .from("store_products")
          .select("product_id")
          .eq("store_id", store.id);

        setProducts(allProducts || []);
        const addedIds = addedProducts
          ? addedProducts.map((sp) => sp.product_id)
          : [];
        setStoreProducts(addedIds);
      }
    } catch (err) {
      console.error("載入資料失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 第二階段核心功能：將商品寫入資料庫
  const handleAddToStore = async (productId) => {
    try {
      if (!storeInfo) return alert("找不到您的店鋪資訊");

      // 寫入關聯表
      const { error } = await supabase
        .from("store_products")
        .insert([{ store_id: storeInfo.id, product_id: productId }]);

      if (error) throw error;

      alert("🎉 已成功加入您的專屬店鋪！");

      // 更新前端畫面狀態，讓按鈕變成「已加入」
      setStoreProducts([...storeProducts, productId]);
    } catch (err) {
      console.error("上架失敗:", err);
      alert("上架失敗，可能已經在您的店鋪中了！");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9]">
        <div className="text-blue-500 font-bold animate-pulse">
          載入商品池中...
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F4F7F9] font-sans">
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
            isActive={activeTab === "orders"}
            onClick={() => {}}
          />
          <SidebarItem
            icon={<UserIcon className="w-5 h-5" />}
            label="個人帳號設定"
            isActive={activeTab === "profile"}
            onClick={() => {}}
          />
          <div className="my-4 border-t border-white/10 mx-6"></div>
          <div className="px-6 text-[11px] text-slate-500 font-bold mb-2 tracking-widest uppercase">
            店長專區
          </div>
          <SidebarItem
            icon={<BriefcaseIcon className="w-5 h-5" />}
            label="合作夥伴中心"
            isActive={activeTab === "partner"}
            onClick={() => {}}
          />
          <SidebarItem
            icon={<ShoppingBagIcon className="w-5 h-5" />}
            label="商店選品管理"
            isActive={activeTab === "catalog"}
            onClick={() => setActiveTab("catalog")}
          />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white h-[72px] px-8 flex items-center justify-between border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">商店選品管理</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-full">
              目前全局加價策略：底價 + {storeInfo?.markup_rate || 0}%
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              // 🌟 從變體中找出最便宜的底價當作「起步價」
              const variations = product.product_variations || [];
              const minB2bPrice =
                variations.length > 0
                  ? Math.min(...variations.map((v) => v.b2b_price || 0))
                  : 0;

              const markup = storeInfo?.markup_rate || 0;
              const storePrice = Math.round(minB2bPrice * (1 + markup / 100));
              const estimatedProfit = storePrice - minB2bPrice;
              const isAdded = storeProducts.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative"
                >
                  <div className="h-32 bg-slate-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#115498]/10 to-transparent"></div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="font-black text-[16px] text-slate-800 mb-4 line-clamp-2 leading-snug">
                      {product.name}
                    </h4>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[12px] font-bold text-slate-500">
                          底價
                        </span>
                        <span className="text-[13px] font-black text-slate-700">
                          NT$ {minB2bPrice}{" "}
                          <span className="font-normal text-[11px]">起</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                        <span className="text-[12px] font-bold text-slate-500">
                          建議分潤售價
                        </span>
                        <span className="text-[14px] font-black text-[#115498]">
                          NT$ {storePrice}{" "}
                          <span className="font-normal text-[11px]">起</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[13px] font-black text-emerald-600 flex items-center gap-1">
                          <SparklesIcon className="w-4 h-4" /> 預估每筆淨利
                        </span>
                        <span className="text-[16px] font-black text-emerald-600">
                          NT$ {estimatedProfit}{" "}
                          <span className="font-normal text-[11px]">+</span>
                        </span>
                      </div>
                    </div>

                    {isAdded ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <CheckIcon className="w-5 h-5" /> 已在您的店鋪中
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToStore(product.id)}
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-white border border-[#115498] text-[#115498] hover:bg-[#115498] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <PlusIcon className="w-5 h-5" /> 加入我的店鋪
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
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
