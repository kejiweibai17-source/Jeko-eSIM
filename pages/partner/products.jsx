import { useEffect, useState } from "react";
import Link from "next/link";
import PartnerAdminLayout from "@/components/partner/PartnerAdminLayout";
import { usePartnerSession } from "@/lib/partnerAuth";
import { supabase } from "@/lib/supabaseClient";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function PartnerProductsPage() {
  const { store } = usePartnerSession();
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingPrices, setEditingPrices] = useState({});
  const [savingId, setSavingId] = useState(null);

  const loadProducts = async () => {
    if (!store) return;
    const { data } = await supabase
      .from("store_products")
      .select(
        `id, product_id, custom_prices,
         products ( id, name, product_variations ( id, sku, b2b_price, attributes ) )`,
      )
      .eq("store_id", store.id)
      .order("created_at", { ascending: false });
    setMyProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [store]);

  const handleSave = async (spId, existing) => {
    setSavingId(spId);
    const updated = { ...(existing || {}), ...(editingPrices[spId] || {}) };
    const { error } = await supabase
      .from("store_products")
      .update({ custom_prices: updated })
      .eq("id", spId);
    setSavingId(null);
    if (error) return alert("儲存失敗：" + error.message);
    alert("✅ 定價已更新！");
    loadProducts();
  };

  const handleRemove = async (spId, name) => {
    if (!confirm(`確定下架「${name}」？`)) return;
    await supabase.from("store_products").delete().eq("id", spId);
    setMyProducts((prev) => prev.filter((p) => p.id !== spId));
  };

  return (
    <PartnerAdminLayout title="我的商品">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800">我的商品</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            管理已上架商品，設定各方案自訂售價（全局加價 +{store?.markup_rate || 20}%）
          </p>
        </div>
        <Link
          href="/partner/catalog"
          className="text-sm bg-[#1a3a6b] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#1344b5] transition"
        >
          + 加入新商品
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm animate-pulse">載入中...</p>
      ) : myProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">您的店鋪目前沒有商品</p>
          <Link
            href="/partner/catalog"
            className="inline-block bg-[#1a3a6b] text-white font-bold px-6 py-2.5 rounded-xl"
          >
            前往選品管理
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myProducts.map((sp) => {
            const product = sp.products;
            const vars = product?.product_variations || [];
            const isOpen = expandedId === sp.id;
            const customPrices = sp.custom_prices || {};

            return (
              <div key={sp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpandedId(isOpen ? null : sp.id)}
                >
                  <div>
                    <h3 className="font-bold text-slate-800">{product?.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{vars.length} 種方案變體</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(sp.id, product?.name);
                      }}
                      className="text-slate-300 hover:text-red-500 transition p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    {isOpen ? (
                      <ChevronUpIcon className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50 p-5">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-500 uppercase">
                          <th className="pb-3 text-left font-bold">方案</th>
                          <th className="pb-3 text-left font-bold">底價</th>
                          <th className="pb-3 text-left font-bold">預設售價</th>
                          <th className="pb-3 text-left font-bold text-[#1a56db]">自訂售價</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vars.map((v) => {
                          const b2b = v.b2b_price || 0;
                          const defaultPrice = Math.round(
                            b2b * (1 + (store?.markup_rate || 20) / 100),
                          );
                          const val =
                            editingPrices[sp.id]?.[v.id] ??
                            customPrices[v.id] ??
                            "";
                          const label = v.attributes?.days
                            ? `${v.attributes.days} 天`
                            : v.sku;

                          return (
                            <tr key={v.id} className="border-t border-slate-100">
                              <td className="py-3 font-medium text-slate-700">{label}</td>
                              <td className="py-3 text-slate-500">NT$ {b2b}</td>
                              <td className="py-3 text-slate-500">NT$ {defaultPrice}</td>
                              <td className="py-3">
                                <input
                                  type="number"
                                  placeholder={String(defaultPrice)}
                                  value={val}
                                  onChange={(e) =>
                                    setEditingPrices((prev) => ({
                                      ...prev,
                                      [sp.id]: { ...(prev[sp.id] || {}), [v.id]: e.target.value },
                                    }))
                                  }
                                  className="w-28 px-2 py-1 text-sm border border-slate-300 rounded-lg focus:border-[#1a56db] outline-none"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleSave(sp.id, customPrices)}
                        disabled={savingId === sp.id}
                        className="flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#1344b5] disabled:opacity-50 transition"
                      >
                        <CheckIcon className="w-4 h-4" />
                        {savingId === sp.id ? "儲存中..." : "儲存定價"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PartnerAdminLayout>
  );
}
