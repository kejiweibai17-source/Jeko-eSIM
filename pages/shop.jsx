"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 模擬目前登入的客人 (之後會換成真實登入系統)
  const testUser = {
    name: "Bob 總裁",
    email: "bob112722761236tom@gmail.com",
  };

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (!error) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // 🚀 核心功能：購買並自動新增訂單
  const handleBuy = async (product) => {
    const confirmBuy = confirm(`確定要購買 ${product.name} 嗎？`);
    if (!confirmBuy) return;

    // 這裡是在 orders 表格新增一筆資料的魔法
    const { error } = await supabase.from("orders").insert([
      {
        customer_name: testUser.name,
        customer_email: testUser.email,
        total_price: product.price,
        status: "pending", // 剛買完預設是處理中
        // 這裡可以根據你的欄位多加資訊
      },
    ]);

    if (error) {
      alert("購買失敗，請檢查資料庫權限！");
      console.error(error);
    } else {
      alert("🎉 購買成功！即將前往您的 eSIM 行李箱。");
      router.push("/my-esim"); // 自動跳轉回剛才做好的後台
    }
  };

  if (loading)
    return <div className="p-20 text-center">正在為您準備最佳方案...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            JEKO eSIM 全球通 🌎
          </h1>
          <p className="text-gray-500 text-lg">
            選擇您的目的地，即刻享受高速 5G 上網
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group"
            >
              {/* 圖片區 */}
              <div className="h-48 bg-slate-200 relative">
                <img
                  src={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1526481280693-3bfa756160f3?auto=format&fit=crop&q=80&w=800"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  🔥 熱銷中
                </div>
              </div>

              {/* 內容區 */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm h-12 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block uppercase font-bold tracking-widest">
                      單一售價
                    </span>
                    <span className="text-3xl font-black text-blue-600">
                      NT$ {product.price}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBuy(product)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
                  >
                    立即購買
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
