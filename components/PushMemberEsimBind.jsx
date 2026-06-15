"use client";

import { useState } from "react";
import MaterialIcon from "./MaterialIcon";
import { useUser } from "./context/UserContext";
import { getPushEndpoint, ICCID_STORAGE_KEY } from "../lib/pushBind";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * 會員：從本站訂單選擇 eSIM 綁定（不需手打 ICCID）
 */
export default function PushMemberEsimBind({
  esims = [],
  onBound,
  onManualIccid,
  className = "",
}) {
  const { token } = useUser();
  const [selected, setSelected] = useState(esims[0]?.topupId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBind = async (topupIdOverride) => {
    setError("");
    setLoading(true);
    try {
      const endpoint = await getPushEndpoint();
      if (!endpoint) throw new Error("請先開啟流量提醒通知");

      const tid = topupIdOverride || selected;
      const res = await fetch("/api/push/auto-bind-member", {
        method: "POST",
        credentials: "include",
        headers: authHeaders(token),
        body: JSON.stringify({ endpoint, topupId: tid || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.hint || "綁定失敗");

      if (data.iccid) localStorage.setItem(ICCID_STORAGE_KEY, data.iccid);
      onBound?.(data);
    } catch (e) {
      setError(e.message || "綁定失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <MaterialIcon name="verified_user" size={22} className="text-emerald-700" />
        </div>
        <div>
          <p className="font-bold text-stone-900 text-sm">會員快速綁定</p>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            已偵測到您在本站購買的 eSIM，可直接選擇方案綁定，<strong>無需輸入 ICCID</strong>。
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {esims.map((esim) => (
          <label
            key={esim.topupId}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              selected === esim.topupId
                ? "border-emerald-500 bg-white shadow-sm"
                : "border-stone-200 bg-white/80 hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              name="member-esim"
              value={esim.topupId}
              checked={selected === esim.topupId}
              onChange={() => setSelected(esim.topupId)}
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-stone-900 truncate">
                {esim.productName}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                訂單 {String(esim.orderId || "").slice(0, 8)}… · Topup {esim.topupId}
              </p>
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
          <MaterialIcon name="error" size={16} />
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          disabled={loading || !selected}
          onClick={() => handleBind()}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <MaterialIcon name="link" size={18} />
          {loading ? "綁定中…" : "綁定所選 eSIM"}
        </button>
        {esims.length > 1 && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleBind(esims[0].topupId)}
            className="sm:shrink-0 px-4 py-3 rounded-xl border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-white"
          >
            綁定最新一筆
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onManualIccid}
        className="mt-3 text-xs text-stone-500 hover:text-[#0A6CD0] underline w-full text-left"
      >
        非本站購買？改用手動輸入 ICCID
      </button>
    </div>
  );
}
