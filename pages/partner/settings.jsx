import { useState, useEffect } from "react";
import PartnerAdminLayout from "@/components/partner/PartnerAdminLayout";
import { usePartnerSession, SITE_URL } from "@/lib/partnerAuth";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export default function PartnerSettingsPage() {
  const { partner, store, setStore } = usePartnerSession();
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [markupRate, setMarkupRate] = useState(20);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (store) {
      setStoreName(store.store_name || "");
      setDescription(store.description || "");
      setMarkupRate(store.markup_rate ?? 20);
    }
  }, [store]);

  const handleSave = async () => {
    if (!storeName.trim()) return alert("店鋪名稱不能為空");
    setSaving(true);
    setSaved(false);

    const { data, error } = await supabase
      .from("stores")
      .update({
        store_name: storeName.trim(),
        description: description.trim() || null,
        markup_rate: parseInt(markupRate) || 20,
      })
      .eq("id", store.id)
      .select()
      .single();

    setSaving(false);
    if (error) return alert("儲存失敗：" + error.message);
    setStore(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const storeUrl = store ? `${SITE_URL}/p/${store.domain}` : null;

  return (
    <PartnerAdminLayout title="商店設定">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-800">商店設定</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          自訂您的專屬賣場品牌資訊，儲存後立即同步至前台
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：設定表單 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              分店顯示名稱 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="例如：東京旅遊小幫手"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30 focus:border-[#1a56db] transition"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              顯示於賣場首頁、導覽列、頁面標題（Title）及 Footer
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              商店描述 / Slogan
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="例如：專業日本旅遊 eSIM 推薦，出發前必備！"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30 focus:border-[#1a56db] transition resize-none"
            />
            <p className="text-xs text-slate-400 mt-1.5">用於 SEO 描述及賣場 About 區塊</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              全局加價比例 (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="200"
                value={markupRate}
                onChange={(e) => setMarkupRate(e.target.value)}
                className="w-32 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30 focus:border-[#1a56db] transition"
              />
              <span className="text-sm text-slate-500">
                底價 × (1 + {markupRate}%) = 預設售價
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              例：底價 NT$100，加價 20% → 售價 NT$120，您的分潤 NT$20
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              專屬網址 — <span className="text-red-400 normal-case">不可修改</span>
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 opacity-70">
              <span className="text-sm text-slate-400 mr-2 font-mono">jeko-esim.com.tw/p/</span>
              <span className="text-sm font-bold text-slate-600 font-mono">{store?.domain}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#1a3a6b] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#1344b5] disabled:opacity-50 transition shadow-sm"
            >
              {saving ? "儲存中..." : "儲存設定"}
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 font-bold">✅ 已儲存，前台已同步！</span>
            )}
          </div>
        </div>

        {/* 右側：預覽卡片 */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">賣場預覽</p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="font-black text-slate-800 text-base mb-1">
                {storeName || "您的店鋪名稱"}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {description || "商店描述將顯示在此..."}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-[10px] text-slate-400">頁面 Title</p>
                <p className="text-xs font-mono text-slate-600 mt-0.5 truncate">
                  {storeName || "店名"} | 官方授權專屬商城
                </p>
              </div>
            </div>
          </div>

          {storeUrl && (
            <div className="bg-[#1a3a6b] rounded-xl p-5 text-white">
              <p className="text-xs text-blue-200 font-bold uppercase mb-2">我的賣場連結</p>
              <p className="text-xs font-mono text-blue-100 break-all leading-relaxed mb-4">
                {storeUrl}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(storeUrl);
                    alert("已複製！");
                  }}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  <DocumentDuplicateIcon className="w-3.5 h-3.5" /> 複製
                </button>
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-[#4ade80] text-slate-900 text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" /> 開啟
                </a>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">帳號資訊</p>
            <p className="text-sm font-bold text-slate-800">{partner?.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{partner?.email}</p>
            <span className="inline-block mt-2 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              已核准夥伴
            </span>
          </div>
        </div>
      </div>
    </PartnerAdminLayout>
  );
}
