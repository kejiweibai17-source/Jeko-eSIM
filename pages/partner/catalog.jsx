import { useEffect, useState } from "react";
import Link from "next/link";
import PartnerAdminLayout from "@/components/partner/PartnerAdminLayout";
import { usePartnerSession } from "@/lib/partnerAuth";
import { supabase } from "@/lib/supabaseClient";
import { MagnifyingGlassIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function PartnerCatalogPage() {
  const { store } = usePartnerSession();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [addedIds, setAddedIds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!store) return;
    async function load() {
      const { data: allProducts } = await supabase
        .from("products")
        .select(`id, name, description, product_variations ( id, b2b_price )`)
        .order("created_at", { ascending: false });

      const { data: added } = await supabase
        .from("store_products")
        .select("product_id")
        .eq("store_id", store.id);

      setProducts(allProducts || []);
      setAddedIds((added || []).map((a) => a.product_id));
      setLoading(false);
    }
    load();
  }, [store]);

  const handleAdd = async (productId) => {
    const { error } = await supabase
      .from("store_products")
      .insert([{ store_id: store.id, product_id: productId }]);
    if (error) return alert("上架失敗：" + error.message);
    setAddedIds([...addedIds, productId]);
    alert("🎉 已加入您的店鋪！");
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PartnerAdminLayout title="選品管理">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800">選品管理</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            從 Jeko eSIM 商品池選擇方案，加入您的專屬賣場
          </p>
        </div>
        <Link
          href="/partner/products"
          className="text-sm text-[#1a56db] font-bold hover:underline"
        >
          管理已上架商品 →
        </Link>
      </div>

      <div className="relative max-w-sm mb-6">
        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="搜尋商品..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[#1a56db] shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm animate-pulse">載入商品池...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">目前沒有可選商品，請聯繫 Jeko eSIM 總部上架。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const vars = product.product_variations || [];
            const minPrice =
              vars.length > 0 ? Math.min(...vars.map((v) => v.b2b_price || 0)) : 0;
            const markup = store?.markup_rate || 20;
            const sellPrice = Math.round(minPrice * (1 + markup / 100));
            const profit = sellPrice - minPrice;
            const isAdded = addedIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-3xl">
                  🌐
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    {vars.length} 種方案 · 底價 NT$ {minPrice}
                  </p>
                  <div className="bg-slate-50 rounded-lg p-2.5 flex justify-between text-xs mb-3 mt-auto">
                    <span className="text-slate-500">
                      售價 <strong className="text-slate-800">NT$ {sellPrice}</strong>
                    </span>
                    <span className="text-emerald-600 font-bold">+NT$ {profit}</span>
                  </div>
                  {isAdded ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-400 flex items-center justify-center gap-1"
                    >
                      <CheckIcon className="w-3.5 h-3.5" /> 已上架
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAdd(product.id)}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-[#1a3a6b] text-white hover:bg-[#1344b5] flex items-center justify-center gap-1 transition"
                    >
                      <PlusIcon className="w-3.5 h-3.5" /> 加入店鋪
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PartnerAdminLayout>
  );
}
