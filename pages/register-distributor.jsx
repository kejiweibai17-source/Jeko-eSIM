import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function RegisterDistributor() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    // 🚀 將資料存入 Supabase，確保欄位與 SQL 指令一致
    const { error } = await supabase.from("partners").insert([
      {
        name: dataObj.companyName,
        slug: dataObj.slug,
        email: dataObj.email, // 對應 SQL 的 email
        status: "pending", // 對應 SQL 的 status
        description: dataObj.description, // 對應 SQL 的 description
      },
    ]);

    if (error) {
      alert("註冊失敗：" + error.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-6">📩</div>
          <h1 className="text-2xl font-bold mb-4">申請已送出！</h1>
          <p className="text-gray-500">
            Jeko 總裁將會親自審核您的資格，通過後會發送 Email 通知您。
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-8 text-blue-600 font-bold"
          >
            回到首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 font-sans">
      <Head>
        <title>經銷商加盟申請 | JEKO eSIM</title>
      </Head>
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white text-center">
          <h1 className="text-3xl font-black">成為 Jeko 合作夥伴</h1>
          <p className="text-slate-400 mt-2">
            加入我們，開啟您的 eSIM 分潤事業
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              公司或頻道名稱
            </label>
            <input
              required
              name="companyName"
              type="text"
              placeholder="例如：極客設計"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              想要使用的專屬網址代碼 (Slug)
            </label>
            <div className="flex items-center">
              <span className="bg-gray-100 px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 text-gray-400 font-mono text-sm">
                jekoesim.cc/
              </span>
              <input
                required
                name="slug"
                type="text"
                placeholder="yourname"
                className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              聯絡 Email
            </label>
            <input
              required
              name="email"
              type="email"
              placeholder="service@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              簡單自我介紹
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="請告訴我們您的推廣計畫..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-900 transition disabled:bg-gray-400 shadow-lg shadow-blue-100"
          >
            {loading ? "提交中..." : "送出加盟申請"}
          </button>
        </form>
      </div>
    </div>
  );
}
