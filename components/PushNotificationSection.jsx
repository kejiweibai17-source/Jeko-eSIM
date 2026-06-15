"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PushButton from "./PushButton";
import PushIccidBind from "./PushIccidBind";
import PushMemberEsimBind from "./PushMemberEsimBind";
import GuestPushBindForm from "./GuestPushBindForm";
import IosPwaPushGuide from "./IosPwaPushGuide";
import MaterialIcon from "./MaterialIcon";
import { detectPushSupport } from "../lib/pushSupport";
import { getPushEndpoint, ICCID_STORAGE_KEY } from "../lib/pushBind";
import { useUser } from "./context/UserContext";

const REF_BLUE = "#1d5cc5";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getBannerDescription({ isGuest, isLoggedIn, memberEsims, bindPhase }) {
  if (bindPhase === "bound") {
    return "流量提醒已啟用，剩餘流量偏低時將自動通知您。";
  }
  if (isGuest) {
    return "您尚未加入會員，請在下方輸入 ICCID，一鍵開啟推播並完成綁定。";
  }
  if (isLoggedIn && memberEsims.length > 0) {
    return "會員專屬：開啟推播後可自動綁定本站 eSIM 訂單，流量偏低時自動通知。";
  }
  if (isLoggedIn) {
    return "已登入會員，但尚無本站 eSIM 訂單。請開啟推播並輸入 ICCID 綁定要監控的 eSIM。";
  }
  return "開啟推播並綁定 eSIM，流量偏低時自動通知。";
}

/**
 * 推播：訂閱 → 依身分綁定 eSIM
 * - 會員：自動 / 選訂單（不需 ICCID）
 * - 訪客：Email 驗證 或 手動 ICCID
 */
export default function PushNotificationSection({
  className = "",
  onIccidBound,
  initialIccid = "",
  variant = "default",
}) {
  const { token, user, isHydrated } = useUser();
  const isLoggedIn = isHydrated && Boolean(user || token);
  const isGuest = isHydrated && !isLoggedIn;
  const [mode, setMode] = useState("loading");
  const [bindPhase, setBindPhase] = useState("checking");
  const [boundInfo, setBoundInfo] = useState(null);
  const [memberEsims, setMemberEsims] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [showManualIccid, setShowManualIccid] = useState(false);
  const [autoBinding, setAutoBinding] = useState(false);

  const applyBound = useCallback(
    (data) => {
      setBindPhase("bound");
      setBoundInfo(data);
      if (data.iccid) {
        localStorage.setItem(ICCID_STORAGE_KEY, data.iccid);
        onIccidBound?.(data.iccid);
      }
    },
    [onIccidBound],
  );

  const loadMemberEsims = useCallback(async () => {
    try {
      const res = await fetch("/api/push/member-esims", {
        credentials: "include",
        headers: authHeaders(token),
      });
      if (res.ok) {
        const data = await res.json();
        setIsMember(true);
        setMemberEsims(data.esims || []);
        return data.esims || [];
      }
      setIsMember(false);
      setMemberEsims([]);
      return [];
    } catch {
      setIsMember(false);
      setMemberEsims([]);
      return [];
    }
  }, [token]);

  const tryAutoBindMember = useCallback(async () => {
    const endpoint = await getPushEndpoint();
    if (!endpoint) return false;

    setAutoBinding(true);
    try {
      const res = await fetch("/api/push/auto-bind-member", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ endpoint }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        applyBound(data);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setAutoBinding(false);
    }
  }, [token, applyBound]);

  const checkBindStatus = useCallback(async () => {
    const endpoint = await getPushEndpoint();
    if (!endpoint) {
      setBindPhase("needs_subscribe");
      return;
    }

    await loadMemberEsims();

    try {
      const res = await fetch(
        `/api/push/bind-status?endpoint=${encodeURIComponent(endpoint)}`,
      );
      const data = await res.json();
      if (data.bound) {
        applyBound(data);
      } else if (data.subscribed) {
        setBindPhase("unbound");
      } else {
        setBindPhase("needs_subscribe");
      }
    } catch {
      setBindPhase("unbound");
    }
  }, [loadMemberEsims, applyBound]);

  const refresh = useCallback(() => {
    detectPushSupport().then((support) => {
      setMode(support.reason === "ios-needs-pwa" ? "guide" : "button");
    });
    checkBindStatus();
  }, [checkBindStatus]);

  useEffect(() => {
    refresh();
    window.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const handleSubscribed = async () => {
    setBindPhase("unbound");
    const esims = await loadMemberEsims();
    if (esims.length > 0) {
      const ok = await tryAutoBindMember();
      if (!ok) {
        setShowManualIccid(false);
      }
    } else {
      setShowManualIccid(true);
    }
  };

  const handleBound = (data) => {
    applyBound(data);
    setShowManualIccid(false);
  };

  const boundLabel = () => {
    if (boundInfo?.productName) return boundInfo.productName;
    if (boundInfo?.topupId) return `Topup …${String(boundInfo.topupId).slice(-6)}`;
    if (boundInfo?.iccid) return `ICCID …${boundInfo.iccid.slice(-6)}`;
    return null;
  };

  const isBanner = variant === "banner";

  const boundStatus = (
    <div
      className={
        isBanner
          ? "inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/40 text-white text-sm font-bold px-5 py-2.5"
          : undefined
      }
    >
      <MaterialIcon name="notifications_active" size={20} filled className="text-white" />
      <span>已開啟流量提醒</span>
    </div>
  );

  const bindPanel =
    !isGuest && bindPhase === "unbound" && !autoBinding ? (
      isMember && memberEsims.length > 0 && !showManualIccid ? (
        <PushMemberEsimBind
          esims={memberEsims}
          onBound={handleBound}
          onManualIccid={() => setShowManualIccid(true)}
        />
      ) : (
        <PushIccidBind
          initialIccid={initialIccid}
          onBound={handleBound}
          isMember={isMember}
          isGuest={false}
          hasMemberOrders={memberEsims.length > 0}
          onBackToOrders={
            memberEsims.length > 0 ? () => setShowManualIccid(false) : undefined
          }
        />
      )
    ) : null;

  const guestPanel =
    isGuest && isHydrated && bindPhase !== "bound" && !autoBinding && mode !== "guide" ? (
      <GuestPushBindForm
        initialIccid={initialIccid}
        onBound={handleBound}
        embedded={isBanner}
      />
    ) : null;

  const memberPushButton = (
    <PushButton
      className={isBanner ? "" : "self-start"}
      theme={isBanner ? "banner" : "default"}
      showDebugPanel={false}
      requireLogin={false}
      onSubscribed={handleSubscribed}
    />
  );

  const showBannerLoading =
    !isGuest &&
    (!isHydrated || mode === "loading" || bindPhase === "checking");

  const ctaBlock =
    showBannerLoading ? (
      <div
        className={`px-6 py-3 rounded-full text-sm font-bold animate-pulse ${
          isBanner ? "bg-white/25 text-white/80" : "bg-stone-200 text-stone-500"
        }`}
      >
        載入中…
      </div>
    ) : mode === "guide" ? (
      <IosPwaPushGuide className={isBanner ? "max-w-sm" : className} />
    ) : bindPhase === "bound" ? (
      boundStatus
    ) : isGuest ? null : (
      memberPushButton
    );

  if (isBanner) {
    const guestIntegrated =
      isHydrated && isGuest && bindPhase !== "bound" && mode !== "guide";
    const bannerHydrating = !isHydrated;

    return (
      <div className={`w-full ${guestIntegrated || bannerHydrating ? "" : "space-y-4"} ${className}`}>
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row min-h-[160px]">
            <div className="relative w-full md:w-[32%] min-h-[140px] md:min-h-[180px] shrink-0">
              <Image
                src="/images/281802913ca035dc54ea9f5ed63edb52.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 32vw"
              />
            </div>
            <div
              className={`relative flex-1 flex flex-col sm:flex-row sm:items-center gap-5 p-6 md:p-8 md:pr-10 ${
                guestIntegrated || bannerHydrating ? "md:pb-6" : ""
              }`}
              style={{ backgroundColor: REF_BLUE }}
            >
              <span
                className="absolute bottom-4 left-5 w-2 h-2 rounded-full bg-[#174da8] pointer-events-none"
                aria-hidden
              />
              <div className="flex-1 min-w-0 text-white">
                <h3 className="text-2xl md:text-[28px] font-bold leading-snug">
                  流量快用完時通知我
                </h3>
                <p className="text-sm md:text-[15px] text-white/85 mt-2 leading-relaxed max-w-lg">
                  {bannerHydrating
                    ? "載入中…"
                    : getBannerDescription({
                        isGuest,
                        isLoggedIn,
                        memberEsims,
                        bindPhase,
                      })}
                </p>
                {bindPhase === "bound" && boundLabel() && (
                  <p className="text-xs text-white/70 mt-2">
                    監控中：{boundLabel()}
                  </p>
                )}
              </div>
              {!guestIntegrated && !bannerHydrating && (
                <div className="shrink-0 sm:self-center flex items-center gap-3">
                  {ctaBlock}
                  {bindPhase !== "bound" &&
                    mode !== "guide" &&
                    isHydrated &&
                    bindPhase !== "checking" && (
                      <MaterialIcon
                        name="arrow_forward"
                        size={28}
                        className="text-white/90 hidden sm:block"
                      />
                    )}
                </div>
              )}
            </div>
          </div>

          {bannerHydrating && (
            <div className="bg-white px-5 sm:px-8 py-8 animate-pulse">
              <div className="h-4 bg-stone-100 rounded w-48 mb-4" />
              <div className="h-12 bg-stone-100 rounded-xl mb-3" />
              <div className="h-12 bg-stone-100 rounded-full" />
            </div>
          )}

          {guestIntegrated && guestPanel}

          {bindPhase === "bound" && (
            <div className="bg-emerald-50 border-t border-emerald-100 px-6 py-4 flex items-center gap-2 text-emerald-800 text-sm font-bold">
              <MaterialIcon name="notifications_active" size={20} filled />
              流量提醒已啟用
              {boundLabel() && (
                <span className="text-xs font-normal text-emerald-700 ml-1">
                  · 監控中：{boundLabel()}
                </span>
              )}
            </div>
          )}
        </div>

        {autoBinding && (
          <p className="text-xs text-stone-500 flex items-center gap-2 px-1 mt-4">
            <MaterialIcon name="sync" size={16} className="animate-spin" />
            正在從您的訂單自動綁定 eSIM…
          </p>
        )}

        {!guestIntegrated && bindPanel}
      </div>
    );
  }

  if (!isHydrated || mode === "loading") {
    return (
      <div
        className={`px-6 py-3 rounded-full bg-stone-200 text-stone-500 text-sm font-bold animate-pulse ${className}`}
      >
        載入中…
      </div>
    );
  }

  if (mode === "guide") {
    return <IosPwaPushGuide className={className} />;
  }

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      {bindPhase === "bound" ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4">
          <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
            <MaterialIcon name="notifications_active" size={20} filled />
            流量提醒已啟用
          </div>
          {boundLabel() && (
            <p className="text-xs text-emerald-700 mt-1.5">
              監控中：{boundLabel()}
              {boundInfo?.bindMethod === "member_auto" && "（會員自動綁定）"}
              {boundInfo?.bindMethod === "guest_email" && "（Email 驗證）"}
              {boundInfo?.bindMethod === "guest_iccid" && "（ICCID）"}
            </p>
          )}
        </div>
      ) : isGuest ? (
        guestPanel
      ) : (
        <>
          {memberPushButton}

          {autoBinding && (
            <p className="text-xs text-stone-500 flex items-center gap-2">
              <MaterialIcon name="sync" size={16} className="animate-spin" />
              正在從您的訂單自動綁定 eSIM…
            </p>
          )}

          {bindPanel}
        </>
      )}
    </div>
  );
}
