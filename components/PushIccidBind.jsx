"use client";

import { useState } from "react";
import MaterialIcon from "./MaterialIcon";
import { useUser } from "./context/UserContext";
import {
  getPushEndpoint,
  isValidIccid,
  normalizeIccid,
  ICCID_STORAGE_KEY,
} from "../lib/pushBind";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * 訪客 / 無本站訂單會員：ICCID 或 Email 驗證綁定
 */
export default function PushIccidBind({
  onBound,
  className = "",
  initialIccid = "",
  isMember = false,
  isGuest = false,
  hasMemberOrders = false,
  onBackToOrders,
}) {
  const { token } = useUser();
  const [mode, setMode] = useState("iccid");
  const [iccid, setIccid] = useState(initialIccid);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    setError("");
    setMessage("");
    if (!email.includes("@")) {
      setError("請輸入有效 Email");
      return;
    }
    setSendingCode(true);
    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "push_bind" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "發送失敗");
      setMessage("驗證碼已寄出，請查收 Email（10 分鐘內有效）");
    } catch (e) {
      setError(e.message || "發送驗證碼失敗");
    } finally {
      setSendingCode(false);
    }
  };

  const handleBind = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const endpoint = await getPushEndpoint();
      if (!endpoint) {
        throw new Error("找不到推播訂閱，請先開啟流量提醒通知");
      }

      const body =
        mode === "iccid"
          ? { endpoint, iccid: normalizeIccid(iccid), email: email || undefined }
          : { endpoint, email, code };

      if (mode === "iccid" && !isValidIccid(iccid)) {
        throw new Error("請輸入 18～22 碼 ICCID");
      }
      if (mode === "email" && (!email || !code)) {
        throw new Error("請輸入 Email 與驗證碼");
      }

      const res = await fetch("/api/push/bind-esim", {
        method: "POST",
        credentials: "include",
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.needsIccid) {
          setMode("iccid");
          throw new Error(data.hint || data.error);
        }
        throw new Error(data.error || data.detail || "綁定失敗");
      }

      if (data.iccid) {
        localStorage.setItem(ICCID_STORAGE_KEY, data.iccid);
      }
      setMessage("已綁定！流量偏低時將推播通知您");
      onBound?.(data);
    } catch (e) {
      setError(e.message || "綁定失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl border border-[#0A6CD0]/30 bg-white p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#0A6CD0]/10 flex items-center justify-center shrink-0">
          <MaterialIcon name="sim_card" size={22} className="text-[#0A6CD0]" />
        </div>
        <div>
          <p className="font-bold text-stone-900 text-sm">
            {isGuest ? "步驟 2：訪客請留下 ICCID" : "步驟 2：綁定要監控的 eSIM"}
          </p>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {isGuest
              ? "推播已開啟。因尚未加入會員，請在下方輸入 ICCID 完成綁定，系統才能辨識要監控的 eSIM 並在流量偏低時通知您。"
              : isMember && !hasMemberOrders
              ? "您已登入但尚無本站 eSIM 訂單，請輸入 ICCID 綁定。"
              : "推播已開啟。請綁定一次 eSIM：可輸入 ICCID，或驗證購買 Email。"}
          </p>
        </div>
      </div>

      {isGuest && (
        <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-[11px] text-blue-900 leading-relaxed">
          <p className="font-bold flex items-center gap-1.5 mb-1.5">
            <MaterialIcon name="info" size={14} />
            為什麼訪客一定要填 ICCID？
          </p>
          <p>
            會員可從本站訂單自動找到 eSIM；訪客沒有會員訂單紀錄，系統無法自動對應您的方案，因此必須手動留下
            ICCID 才能啟用流量提醒。
          </p>
        </div>
      )}

      {onBackToOrders && (
        <button
          type="button"
          onClick={onBackToOrders}
          className="mb-3 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
        >
          <MaterialIcon name="arrow_back" size={14} />
          返回選擇本站訂單
        </button>
      )}

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("iccid")}
          className={`flex-1 text-xs font-bold py-2 rounded-lg border transition-colors ${
            mode === "iccid"
              ? "bg-[#0A6CD0] text-white border-[#0A6CD0]"
              : "bg-stone-50 text-stone-600 border-stone-200"
          }`}
        >
          輸入 ICCID
        </button>
        <button
          type="button"
          onClick={() => setMode("email")}
          className={`flex-1 text-xs font-bold py-2 rounded-lg border transition-colors ${
            mode === "email"
              ? "bg-[#0A6CD0] text-white border-[#0A6CD0]"
              : "bg-stone-50 text-stone-600 border-stone-200"
          }`}
        >
          Email 驗證（訪客購買）
        </button>
      </div>

      <form onSubmit={handleBind} className="space-y-3">
        {mode === "iccid" ? (
          <>
            <div className="flex items-center bg-stone-50 rounded-xl border border-stone-200 px-4 py-3">
              <MaterialIcon
                name="description"
                size={20}
                className="text-stone-400 shrink-0 mr-3"
              />
              <input
                type="text"
                inputMode="numeric"
                value={iccid}
                onChange={(e) => setIccid(e.target.value)}
                placeholder="ICCID（19～20 碼，僅需輸入一次）"
                className="flex-1 bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 text-sm"
              />
            </div>
            <p className="text-[11px] text-stone-500 px-1 leading-relaxed space-y-1">
              <span className="block font-bold text-stone-600">ICCID 哪裡找？</span>
              <span className="block">
                iPhone：設定 → 行動服務 → 點選 eSIM →「數字服務 ID」
              </span>
              <span className="block">
                Android：設定 → 網路和網際網路 → SIM 卡 → ICCID
              </span>
              <span className="block">或查看購買後 Email 內的 eSIM 安裝說明</span>
            </p>
          </>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="購買 eSIM 時使用的 Email"
              className="w-full bg-stone-50 rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#0A6CD0]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6 碼驗證碼"
                className="flex-1 bg-stone-50 rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#0A6CD0]"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode}
                className="shrink-0 px-4 py-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 disabled:opacity-50"
              >
                {sendingCode ? "寄送中…" : "寄驗證碼"}
              </button>
            </div>
          </>
        )}

        {error && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <MaterialIcon name="error" size={16} />
            {error}
          </p>
        )}
        {message && (
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <MaterialIcon name="check_circle" size={16} filled />
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0A6CD0] hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <MaterialIcon name="link" size={18} />
          {loading ? "綁定中…" : isGuest ? "留下 ICCID 並啟用流量提醒" : "完成綁定並啟用流量提醒"}
        </button>
      </form>
    </div>
  );
}
