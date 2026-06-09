import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function AdminBossDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 總裁專屬密碼 (你可以自己改成更複雜的)
  const BOSS_PASSWORD = "jeko";

  // 登入邏輯
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === BOSS_PASSWORD) {
      setIsAuthenticated(true);
      fetchPartners();
    } else {
      alert("密碼錯誤！保全系統已鎖定。");
    }
  };

  // 抓取所有夥伴名單
  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("id", { ascending: false }); // 越新的申請排越上面

    if (error) {
      console.error("抓取失敗", error);
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  // 🚀 核心功能：改變夥伴狀態 (批准 / 停用)
  const updateStatus = async (id, newStatus, partnerName, partnerSlug) => {
    const isConfirm = window.confirm(
      `確定要將 ${partnerName} 的狀態改為 ${newStatus} 嗎？`,
    );
    if (!isConfirm) return;

    const { error } = await supabase
      .from("partners")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("更新失敗：" + error.message + " (請檢查 Supabase RLS 權限)");
    } else {
      if (newStatus === "active") {
        alert(
          `✅ 已批准！\n${partnerName} 的專屬網址 https://jekoesim.cc/${partnerSlug} 已經瞬間生效！`,
        );
      } else {
        alert(`❌ 已將 ${partnerName} 設為停用。`);
      }
      fetchPartners(); // 重新整理列表
    }
  };

  // --- 畫面 1：密碼登入頁 ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center"
        >
          <div className="text-5xl mb-6">💼</div>
          <h1 className="text-2xl font-black mb-2 text-slate-900">
            總裁控制台
          </h1>
          <p className="text-gray-400 text-sm mb-6">請輸入最高權限密碼</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition"
          >
            解鎖進入
          </button>
        </form>
      </div>
    );
  }

  // --- 畫面 2：總裁管理面板 ---
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <Head>
        <title>Jeko eSIM 總裁後台</title>
      </Head>

      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900">經銷商管理系統</h1>
          <p className="text-gray-500 mt-1">
            目前共有 {partners.length} 筆資料
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200"
        >
          返回商城首頁
        </button>
      </header>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold">
          讀取機密資料中...
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-gray-100">
                <th className="p-4 font-bold">夥伴名稱 / Email</th>
                <th className="p-4 font-bold">專屬網址代碼 (Slug)</th>
                <th className="p-4 font-bold">簡介計畫</th>
                <th className="p-4 font-bold">目前狀態</th>
                <th className="p-4 font-bold text-right">總裁裁決</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 hover:bg-blue-50/50 transition"
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-md font-mono text-sm text-blue-600">
                      /{p.slug}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                    {p.description || "無"}
                  </td>
                  <td className="p-4">
                    {p.status === "pending" && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                        待審核
                      </span>
                    )}
                    {p.status === "active" && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        已開通
                      </span>
                    )}
                    {p.status === "rejected" && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        已拒絕
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {p.status !== "active" && (
                      <button
                        onClick={() =>
                          updateStatus(p.id, "active", p.name, p.slug)
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200"
                      >
                        ✅ 批准
                      </button>
                    )}
                    {p.status !== "rejected" && (
                      <button
                        onClick={() =>
                          updateStatus(p.id, "rejected", p.name, p.slug)
                        }
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100"
                      >
                        停用
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
