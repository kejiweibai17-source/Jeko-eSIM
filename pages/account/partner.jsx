import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CubeIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  AdjustmentsHorizontalIcon,
  PaintBrushIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("partner");
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // 🌟 新增：控制「修改策略」彈出視窗的狀態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMarkupRate, setNewMarkupRate] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserEmail(user.email);

      const { data: store, error } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (store) {
        setStoreData(store);
        setNewMarkupRate(store.markup_rate); // 預設把目前的趴數放進輸入框
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 新增：將新加價策略寫回 Supabase 的函式
  const handleUpdateMarkup = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("stores")
        .update({ markup_rate: parseInt(newMarkupRate) })
        .eq("id", storeData.id); // 指定更新目前這間店

      if (error) throw error;

      alert("加價策略更新成功！");
      setIsModalOpen(false);
      // 更新成功後，重新撈取一次最新資料更新畫面
      fetchStoreData();
    } catch (error) {
      console.error("更新失敗:", error);
      alert("更新失敗，請稍後再試。");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9]">
        <div className="text-blue-500 font-bold text-xl animate-pulse">
          載入店鋪資料中...
        </div>
      </div>
    );

  if (!storeData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F9] p-6">
        <BriefcaseIcon className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">
          您尚未開通合作夥伴專屬店鋪
        </h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          請先前往申請頁面填寫資料，審核通過後即可在此查看您的專屬網域與分潤成效。
        </p>
        <button className="bg-[#115498] text-white px-6 py-2.5 rounded-lg font-bold shadow-md">
          前往申請成為合作夥伴
        </button>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F4F7F9] font-sans relative">
      {/* 🌟 新增：修改加價策略的彈出視窗 (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">修改全局加價策略</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                設定新加價比例 (%)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={newMarkupRate}
                  onChange={(e) => setNewMarkupRate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#115498]/50 focus:border-[#115498]"
                  min="0"
                />
                <span className="absolute right-4 text-slate-400 font-bold">
                  %
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                提示：若設定為 25%，當 Jeko eSIM 底價為 100
                元時，您的店鋪售價將自動顯示為 125 元，差額 25 元即為您的利潤。
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
              >
                取消
              </button>
              <button
                onClick={handleUpdateMarkup}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#115498] hover:bg-[#0c4076] disabled:opacity-50 transition flex items-center gap-2"
              >
                {isUpdating ? "儲存中..." : "確認儲存"}
              </button>
            </div>
          </div>
        </div>
      )}

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
            onClick={() => setActiveTab("orders")}
          />
          <SidebarItem
            icon={<UserIcon className="w-5 h-5" />}
            label="個人帳號設定"
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <SidebarItem
            icon={<QuestionMarkCircleIcon className="w-5 h-5" />}
            label="使用教學 / 客服"
            isActive={activeTab === "support"}
            onClick={() => setActiveTab("support")}
          />
          <div className="my-4 border-t border-white/10 mx-6"></div>
          <div className="px-6 text-[11px] text-slate-500 font-bold mb-2 tracking-widest uppercase">
            店長專區
          </div>
          <SidebarItem
            icon={<BriefcaseIcon className="w-5 h-5" />}
            label="合作夥伴中心"
            isActive={activeTab === "partner"}
            onClick={() => setActiveTab("partner")}
          />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white h-[72px] px-8 flex items-center justify-between border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">合作夥伴中心</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">
              {userEmail}
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-sm uppercase">
              {userEmail ? userEmail.charAt(0) : "U"}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <GlobeAltIcon className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-slate-800">
                    {storeData.store_name}
                  </h3>
                  {storeData.status === "active" && (
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircleIcon className="w-3.5 h-3.5" /> 已上線
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <a
                    href={storeData.domain}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                  >
                    {storeData.domain}{" "}
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(storeData.domain);
                  alert("網址已複製！");
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition shadow-sm"
              >
                <DocumentDuplicateIcon className="w-4 h-4" /> 複製網址
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="text-sm font-bold text-slate-500">
                  店鋪總營收 (客戶付款)
                </h4>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <ChartBarIcon className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-800 relative z-10">
                <span className="text-lg mr-1 text-slate-400">NT$</span>
                {(storeData.total_revenue || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="text-sm font-bold text-slate-500">
                  產品成本 (Jeko eSIM 結算)
                </h4>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <CubeIcon className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-800 relative z-10">
                <span className="text-lg mr-1 text-slate-400">NT$</span>
                {(storeData.system_cost || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#115498] to-[#1A73E8] rounded-2xl p-6 border border-blue-600 shadow-[0_10px_30px_rgba(17,84,152,0.2)] flex flex-col relative overflow-hidden text-white">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="text-sm font-bold text-blue-100">
                  我的累計淨利 (分潤)
                </h4>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-4xl font-black relative z-10 mb-1">
                <span className="text-xl mr-1 text-blue-200">NT$</span>
                {(storeData.net_profit || 0).toLocaleString()}
              </div>
              <div className="text-xs text-blue-200 font-medium mt-auto relative z-10">
                包含已提領與未結算之全額淨利
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-[#115498]" />
                  <h3 className="font-bold text-slate-800">商品定價管理</h3>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 h-full">
                <p className="text-sm text-slate-500 leading-relaxed">
                  您可以在此調整您專屬店鋪中所有 eSIM
                  方案的零售價格。價格由您全權決定，差額即為您的淨利潤。
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center mt-auto">
                  <div>
                    <div className="text-xs text-slate-500 font-bold mb-1">
                      目前全局加價策略
                    </div>
                    <div className="font-black text-slate-800">
                      底價 + {storeData.markup_rate || 0}%
                    </div>
                  </div>
                  {/* 🌟 觸發彈出視窗的按鈕 */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white border border-slate-300 px-4 py-2 rounded shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    修改策略
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <BanknotesIcon className="w-5 h-5 text-[#115498]" />
                  <h3 className="font-bold text-slate-800">淨利提領申請</h3>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 h-full">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <div className="text-xs text-slate-500 font-bold mb-1">
                      可提領餘額
                    </div>
                    <div className="text-3xl font-black text-emerald-600">
                      NT$ {(storeData.unpaid_profit || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">
                    最低提領門檻: NT$ 1,000
                  </div>
                </div>
                <button className="w-full bg-[#115498] text-white py-3 rounded-xl font-bold hover:bg-[#0c4076] transition shadow-md flex items-center justify-center gap-2 mt-auto">
                  <CurrencyDollarIcon className="w-5 h-5" /> 申請提領匯款
                </button>
              </div>
            </div>
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
