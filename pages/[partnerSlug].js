import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // ⚠️ 確保路徑正確
import Head from 'next/head';

export default function PartnerLandingPage({ partner, products }) {
  const [buying, setBuying] = useState(false);

  const handleBuy = async (product) => {
    setBuying(true);
    
    // 🚀 核心邏輯：客人在這裡下單，系統會自動標記是這個夥伴 (partner.slug) 賣出的
    const { error } = await supabase.from('orders').insert([
      {
        customer_email: "guest@example.com", // 之後可串接真實登入
        total_price: product.price,
        status: 'pending',
        referrer_slug: partner.slug, // 👈 把業績算給這位夥伴！
        plan_name: product.name
      }
    ]);

    if (error) {
      alert("下單失敗：" + error.message);
    } else {
      alert(`🎉 成功！您已透過 ${partner.name} 的專屬連結下單！`);
    }
    setBuying(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Head>
        <title>{partner.name} 推薦專區 | JEKO eSIM</title>
      </Head>

      {/* --- 夥伴專屬導覽列 --- */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {partner.name[0]}
          </div>
          <div>
            <h1 className="font-bold text-slate-900">{partner.name}</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Jeko 官方認證夥伴</p>
          </div>
        </div>
        <div className="text-xl font-black text-slate-900 tracking-tighter">JEKO <span className="text-blue-600">eSIM</span></div>
      </nav>

      {/* --- 歡迎橫幅 --- */}
      <header className="py-16 px-8 bg-gradient-to-br from-slate-900 to-blue-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-4 leading-tight">
            跟著 {partner.name} 一起環遊世界 🌍
          </h2>
          <p className="text-blue-100/80 text-lg">
            {partner.description || "在此專屬頁面下單，確保您獲得最優質的連線服務！"}
          </p>
        </div>
      </header>

      {/* --- 產品列表 --- */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <p className="text-center col-span-3 text-gray-400">目前沒有上架的產品</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{product.description}</p>
                <div className="flex items-end justify-between border-t pt-6">
                  <div>
                    <span className="text-slate-400 text-xs block mb-1">夥伴特惠價</span>
                    <span className="text-3xl font-black text-slate-900">NT$ {product.price}</span>
                  </div>
                  <button 
                    onClick={() => handleBuy(product)}
                    disabled={buying}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition"
                  >
                    {buying ? "處理中..." : "立即購買"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// 🚀 伺服器端邏輯：攔截網址，去資料庫找對應的夥伴
export async function getServerSideProps(context) {
  const { partnerSlug } = context.params;

  // 1. 去 partners 表格找這個網址代碼，且狀態必須是 'active' (已批准)
  const { data: partner, error: pError } = await supabase
    .from('partners')
    .select('*')
    .eq('slug', partnerSlug)
    .eq('status', 'active') // 🔒 防護罩：沒批准的夥伴頁面會顯示 404
    .single();

  // 如果找不到或還沒批准，回傳 404 找不到網頁
  if (pError || !partner) {
    return { notFound: true };
  }

  // 2. 抓取商城的產品 (假設你有 products 表格，沒有的話這裡會是空陣列)
  const { data: products } = await supabase.from('products').select('*');

  return {
    props: {
      partner,
      products: products || []
    }
  };
}