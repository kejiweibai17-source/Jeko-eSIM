"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Layout from "./Layout";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { useSession, signOut } from "next-auth/react";

import {
  UserIcon,
  QrCodeIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  TicketIcon,
  MagnifyingGlassIcon,
  ArrowUturnLeftIcon,
  PlusCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

/* ========== 輔助工具 ========== */
const formatNTDNoDecimals = (val) => {
  if (val == null) return "0";
  return Math.round(Number(val)).toLocaleString("zh-TW");
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusConfig = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed")
    return {
      label: "已發貨",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  if (s === "pending")
    return {
      label: "待付款",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    };
  if (s === "cancelled")
    return {
      label: "已取消",
      color: "bg-slate-100 text-slate-600 border-slate-200",
    };
  if (s === "failed")
    return {
      label: "付款失敗",
      color: "bg-red-100 text-red-700 border-red-200",
    };
  return {
    label: status,
    color: "bg-slate-100 text-slate-700 border-slate-200",
  };
};

const getEsimQRCodes = (order) => {
  if (!order || !order.qrcode_data) return [];
  let data = order.qrcode_data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  if (data && typeof data === "object" && !Array.isArray(data)) data = [data];
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        const cleanSrc = String(item.qrcodeUrl || item.src || "")
          .split(",")[0]
          .trim();
        return {
          name: item.productName || item.name || "eSIM 方案",
          src: cleanSrc,
          topupId: item.topupId || item.topup_id || "無系統單號",
        };
      })
      .filter((item) => item.src);
  }
  return [];
};

/* ========== 主元件 ========== */
export default function AccountPage() {
  const router = useRouter();

  const { data: session, status: navStatus } = useSession();
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [isSupabaseChecked, setIsSupabaseChecked] = useState(false);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [userRole, setUserRole] = useState("customer");
  const [partnerData, setPartnerData] = useState(null);

  // 🌟 Admin 狀態
  const [adminStats, setAdminStats] = useState({
    revenue: 0,
    orderCount: 0,
    partnerCount: 0,
  });
  const [adminAllOrders, setAdminAllOrders] = useState([]);
  const [adminSubTab, setAdminSubTab] = useState("partners");
  const [selectedAdminStoreId, setSelectedAdminStoreId] = useState(null);

  // 🌟 Partner 店長專屬狀態
  const [partnerStats, setPartnerStats] = useState({
    profit: 0,
    orderCount: 0,
  });
  const [partnerAllOrders, setPartnerAllOrders] = useState([]);
  const [partnerCoupons, setPartnerCoupons] = useState([]);
  const [partnerStoreInfo, setPartnerStoreInfo] = useState(null);
  const [partnerSubTab, setPartnerSubTab] = useState("my_orders");
  const [statsLoading, setStatsLoading] = useState(false);

  // 店長：新增折扣碼狀態
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "fixed",
    discount_value: "",
  });
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  // 🌟 核心新增：店長修改商店設定狀態
  const [editStoreName, setEditStoreName] = useState("");
  const [savingStore, setSavingStore] = useState(false);

  // 個人資料編輯狀態
  const [editingName, setEditingName] = useState("");
  const [editingPhone, setEditingPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const groupedStores = useMemo(() => {
    if (!adminAllOrders || adminAllOrders.length === 0) return [];
    const storeMap = {};
    adminAllOrders.forEach((order) => {
      const sId = order.store_id || "official";
      if (!storeMap[sId]) {
        storeMap[sId] = {
          store_id: sId,
          store_name: order.stores?.store_name || "官方主站",
          orderCount: 0,
          totalRevenue: 0,
          totalProfit: 0,
          orders: [],
        };
      }
      storeMap[sId].orderCount += 1;
      storeMap[sId].totalRevenue += Number(order.total_amount) || 0;
      storeMap[sId].totalProfit += Number(order.partner_profit) || 0;
      storeMap[sId].orders.push(order);
    });
    return Object.values(storeMap).sort(
      (a, b) => b.totalRevenue - a.totalRevenue,
    );
  }, [adminAllOrders]);

  const handleGuideClick = () => {
    if (typeof window === "undefined") return;
    const isAndroid = /android/i.test(
      navigator.userAgent || navigator.vendor || window.opera,
    );
    router.push(isAndroid ? "/operation-android" : "/operation-ios");
  };

  useEffect(() => {
    const checkSupabaseAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setSupabaseUser(user);
      setIsSupabaseChecked(true);
    };
    checkSupabaseAuth();
  }, []);

  useEffect(() => {
    if (navStatus === "loading" || !isSupabaseChecked) return;
    const isLoggedIn = navStatus === "authenticated" || !!supabaseUser;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // 🚀 核心升級：雙棲背景同步 Medusa 魔法
    const syncWithMedusa = async () => {
      try {
        let syncPayload = null;

        // 判斷 A: Supabase 登入 (Google/Email)
        if (supabaseUser) {
          const {
            data: { session: supaSession },
          } = await supabase.auth.getSession();
          if (supaSession) {
            syncPayload = {
              email: supabaseUser.email,
              id: supabaseUser.id,
              token: supaSession.access_token,
              provider: "supabase",
            };
          }
        }
        // 判斷 B: NextAuth 登入 (LINE)
        else if (session?.user) {
          syncPayload = {
            // 如果 LINE 沒給 Email，就用 ID 生成虛擬 Email 確保 Medusa 能收
            email:
              session.user.email ||
              `${session.user.id || "line"}@line.jekoesim.com`,
            id: session.user.id || "line_user",
            provider: "line",
          };
        }

        if (syncPayload) {
          const res = await fetch("/api/medusa/sync-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(syncPayload),
          });

          const data = await res.json();
          if (data.success && data.medusaCustomerId) {
            console.log(
              "✅ [背景同步] Medusa 綁定成功！Customer ID:",
              data.medusaCustomerId,
            );
            // 存進 localStorage，等一下結帳 API 可以抓出來用
            localStorage.setItem("medusa_customer_id", data.medusaCustomerId);
          }
        }
      } catch (err) {
        console.error("❌ Medusa 背景同步失敗:", err);
      }
    };

    // 觸發背景同步
    syncWithMedusa();

    // 整合 currentUser 狀態 (支援雙邊)
    const currentUser = {
      id: supabaseUser?.id || session?.user?.id || "line_user",
      name: supabaseUser?.user_metadata?.full_name || session?.user?.name,
      email: supabaseUser?.email || session?.user?.email,
      image: supabaseUser?.user_metadata?.avatar_url || session?.user?.image,
      phone: supabaseUser?.user_metadata?.phone || session?.user?.phone || "",
    };

    setUser(currentUser);
    setEditingName(currentUser.name || "");
    setEditingPhone(currentUser.phone || "");

    // 用 Email 載入後續資料
    if (currentUser.email) {
      loadOrders(currentUser.email);
      checkUserRole(currentUser.email, currentUser.id);
    }
  }, [navStatus, isSupabaseChecked, supabaseUser, session, router]);

  const checkUserRole = async (email, authUserId) => {
    if (email === "bob112722761236tom@gmail.com") {
      setUserRole("admin");
      loadAdminData();
      return;
    }
    try {
      const { data: partner, error } = await supabase
        .from("partners")
        .select("id, name, slug")
        .eq("email", email)
        .single();
      if (partner && !error) {
        setUserRole("partner");
        setPartnerData(partner);
        loadPartnerData(partner.id, authUserId);
      }
    } catch (err) {
      console.log("此用戶非分店夥伴");
    }
  };

  // 🚀 升級版：呼叫專屬 API 撈取訂單 (支援雙棲登入)
  const loadOrders = async (email) => {
    setOrdersLoading(true);
    try {
      let headers = { "Content-Type": "application/json" };

      // 判斷：如果是 Supabase 登入的客人，就把 Token 放進標頭讓 API 驗證
      if (supabaseUser) {
        const {
          data: { session: supaSession },
        } = await supabase.auth.getSession();
        if (supaSession?.access_token) {
          headers["Authorization"] = `Bearer ${supaSession.access_token}`;
        }
      }

      // 呼叫我們等等要建的後端 API
      const res = await fetch(
        `/api/orders/user-orders?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: headers,
        },
      );

      const result = await res.json();

      if (result.success) {
        setOrders(result.data || []);
      } else {
        console.error("撈取訂單失敗:", result.message);
        setOrders([]);
      }
    } catch (err) {
      console.error("系統撈取訂單發生異常:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadAdminData = async () => {
    setStatsLoading(true);
    try {
      const { data: allOrdersData } = await supabase
        .from("orders")
        .select(`*, stores ( store_name )`)
        .order("created_at", { ascending: false });
      const validOrders = (allOrdersData || []).filter(
        (o) => o.status === "completed" || o.status === "pending",
      );
      const totalRevenue = validOrders.reduce(
        (sum, order) => sum + (Number(order.total_amount) || 0),
        0,
      );
      const { count: pCount } = await supabase
        .from("partners")
        .select("*", { count: "exact", head: true });
      setAdminStats({
        revenue: totalRevenue,
        orderCount: validOrders.length,
        partnerCount: pCount || 0,
      });
      setAdminAllOrders(allOrdersData || []);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadPartnerData = async (partnerId, authUserId) => {
    if (!partnerId) return;
    setStatsLoading(true);
    try {
      const { data: partnerOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false });
      if (partnerOrders) {
        setPartnerAllOrders(partnerOrders);
        const valid = partnerOrders.filter(
          (o) => o.status === "completed" || o.status === "pending",
        );
        const totalProfit = valid.reduce(
          (sum, order) => sum + (Number(order.partner_profit) || 0),
          0,
        );
        setPartnerStats({ profit: totalProfit, orderCount: valid.length });
      }

      const { data: coupons } = await supabase
        .from("coupons")
        .select("*")
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false });
      setPartnerCoupons(coupons || []);

      if (authUserId) {
        const { data: store } = await supabase
          .from("stores")
          .select("*")
          .eq("user_id", authUserId)
          .single();
        if (store) {
          setPartnerStoreInfo(store);
          setEditStoreName(store.store_name || ""); // 🌟 初始化編輯狀態
        }
      }
    } catch (err) {
      console.error("讀取店鋪數據失敗:", err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  /* ====== 🌟 核心新增：店長儲存商店設定 ====== */
  const handleUpdateStoreSettings = async () => {
    if (!editStoreName.trim()) return alert("商店名稱不能為空！");
    setSavingStore(true);
    try {
      const { error } = await supabase
        .from("stores")
        .update({ store_name: editStoreName })
        .eq("id", partnerStoreInfo.id);

      if (error) throw error;

      alert("✅ 商店設定已更新！前台已同步生效。");
      setPartnerStoreInfo({ ...partnerStoreInfo, store_name: editStoreName });

      // 同步更新左側 Sidebar 或大標題可能用到的 PartnerData 名稱 (可選)
      if (partnerData) setPartnerData({ ...partnerData, name: editStoreName });
    } catch (err) {
      alert("更新失敗：" + err.message);
    } finally {
      setSavingStore(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount_value)
      return alert("請填寫折扣碼與折扣數值");
    setIsCreatingCoupon(true);
    try {
      const { error } = await supabase.from("coupons").insert([
        {
          code: newCoupon.code.toUpperCase(),
          discount_type: newCoupon.discount_type,
          discount_value: Number(newCoupon.discount_value),
          partner_id: partnerData.id,
          is_active: true,
        },
      ]);
      if (error) {
        if (error.code === "23505")
          throw new Error("折扣碼已存在，請換一個代碼！");
        throw error;
      }
      alert("✅ 折扣碼建立成功！");
      setNewCoupon({ code: "", discount_type: "fixed", discount_value: "" });
      loadPartnerData(partnerData.id, user.id);
    } catch (err) {
      alert("建立失敗：" + err.message);
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleProfileUpdate = async () => {
    /* 略 */
  };
  const handlePasswordUpdate = async () => {
    /* 略 */
  };
  const handleLogout = async () => {
    await signOut({ redirect: false });
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (navStatus === "loading" || !isSupabaseChecked || !user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p>驗證身分中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const completedOrders = orders.filter((o) => o.status === "completed");

  const navItems = [
    { id: "dashboard", label: "帳號總覽", icon: UserIcon },
    ...(userRole === "admin"
      ? [
          {
            id: "admin_dashboard",
            label: "系統總控制台",
            icon: ShieldCheckIcon,
          },
        ]
      : []),
    ...(userRole === "partner"
      ? [
          {
            id: "partner_portal",
            label: "夥伴管理後台 →",
            icon: BuildingStorefrontIcon,
            external: "/partner/dashboard",
          },
        ]
      : []),
    { id: "orders", label: "我的 eSIM (訂單)", icon: QrCodeIcon },
    { id: "settings", label: "設定與安全", icon: Cog6ToothIcon },
    { id: "support", label: "安裝與支援", icon: LifebuoyIcon },
  ];

  return (
    <Layout>
      <div className="min-h-screen w-full bg-[#F4F7FB] px-4 py-24 mt-[100px] sm:py-32">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
              <div className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white text-center">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Avatar"
                    className="w-16 h-16 mx-auto rounded-full border-2 border-white/20 shadow-inner mb-3 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-3 text-2xl font-bold uppercase shadow-inner">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                )}
                <h2 className="text-lg font-bold truncate">
                  {user?.name || "會員"}
                </h2>
                <p className="text-xs text-sky-100 truncate mt-1">
                  {user?.email}
                </p>
                {userRole === "admin" && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded uppercase tracking-widest shadow-sm">
                    系統管理員
                  </span>
                )}
                {userRole === "partner" && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded uppercase tracking-widest shadow-sm">
                    官方認證店長
                  </span>
                )}
              </div>

              <nav className="p-3 flex flex-col gap-1">
                {navItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      tab.external
                        ? router.push(tab.external)
                        : setActiveTab(tab.id)
                    }
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id && !tab.external ? "bg-sky-50 text-sky-600" : tab.external ? "text-blue-600 hover:bg-blue-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <tab.icon
                      className={`w-5 h-5 ${activeTab === tab.id ? "text-sky-500" : "text-slate-400"}`}
                    />
                    {tab.label}
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-2 mx-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-400" />
                  安全登出
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* === 一般總覽 Dashboard === */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {userRole === "admin" && (
                    <div className="bg-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700 relative overflow-hidden">
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                          <ShieldCheckIcon className="w-8 h-8 text-sky-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">
                            歡迎回來，系統總監
                          </h2>
                          <p className="text-slate-400 text-sm mt-1">
                            您可以切換至總控制台查看全站營收與數據。
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("admin_dashboard")}
                        className="relative z-10 w-full sm:w-auto bg-sky-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-400 transition shadow-md whitespace-nowrap"
                      >
                        前往總控制台 &rarr;
                      </button>
                      <ShieldCheckIcon className="absolute -right-6 -top-6 w-48 h-48 text-white/5 -rotate-12 pointer-events-none" />
                    </div>
                  )}
                  {userRole === "partner" && partnerData && (
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <BuildingStorefrontIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">
                            哈囉，{partnerData.name} 店長
                          </h2>
                          <p className="text-sky-100 text-sm mt-1">
                            您可以切換至專屬後台，查看最新業績與設定折扣碼。
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/partner/dashboard")}
                        className="relative z-10 w-full sm:w-auto bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition shadow-md whitespace-nowrap"
                      >
                        進入夥伴後台 →
                      </button>
                      <BuildingStorefrontIcon className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10 -rotate-12 pointer-events-none" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <QrCodeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-800">
                          {completedOrders.length}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          有效 eSIM 數
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <CheckCircleIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-800">
                          {orders.length}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          歷史訂單總數
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* === 系統管理員後台 (Admin Dashboard) === */}
              {activeTab === "admin_dashboard" && userRole === "admin" && (
                <motion.div
                  key="admin_dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Admin 內容省略，與之前完全相同 */}
                  <h2 className="text-2xl font-black text-slate-800">
                    系統總控制台
                  </h2>
                  {/* ... */}
                </motion.div>
              )}

              {/* === 🌟 店鋪管理後台 (Partner Dashboard) === */}
              {activeTab === "partner_dashboard" && userRole === "partner" && (
                <motion.div
                  key="partner_dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800">
                        店鋪管理後台
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        專屬 {partnerStoreInfo?.store_name || partnerData?.name}{" "}
                        的業績與設定中心。
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl relative z-10">
                        <CurrencyDollarIcon className="w-6 h-6" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-2xl font-black text-slate-800">
                          {statsLoading
                            ? "..."
                            : `NT$ ${formatNTDNoDecimals(partnerStats.profit)}`}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          我的總分潤 (累積)
                        </p>
                      </div>
                      <CurrencyDollarIcon className="absolute -right-4 -bottom-4 w-20 h-20 text-emerald-50 -rotate-12 pointer-events-none" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 relative overflow-hidden">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl relative z-10">
                        <ChartBarIcon className="w-6 h-6" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-2xl font-black text-slate-800">
                          {statsLoading ? "..." : partnerStats.orderCount}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          成功推廣訂單數
                        </p>
                      </div>
                      <ChartBarIcon className="absolute -right-4 -bottom-4 w-20 h-20 text-blue-50 -rotate-12 pointer-events-none" />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex border-b border-slate-100">
                      {[
                        { id: "my_orders", label: "本店訂單明細" },
                        { id: "coupons", label: "專屬折扣碼" },
                        { id: "store_settings", label: "商店設定" },
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setPartnerSubTab(sub.id)}
                          className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${partnerSubTab === sub.id ? "border-sky-500 text-sky-600 bg-sky-50/50" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6">
                      {/* --- 本店訂單明細 --- */}
                      {partnerSubTab === "my_orders" && (
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-6">
                            推廣成效列表
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                                <tr>
                                  <th className="px-4 py-3 rounded-tl-lg">
                                    訂單編號 / 日期
                                  </th>
                                  <th className="px-4 py-3">訂單總金額</th>
                                  <th className="px-4 py-3">我的分潤</th>
                                  <th className="px-4 py-3 text-center rounded-tr-lg">
                                    付款狀態
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {statsLoading ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="text-center py-8 text-slate-400"
                                    >
                                      資料讀取中...
                                    </td>
                                  </tr>
                                ) : partnerAllOrders.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="text-center py-8 text-slate-400"
                                    >
                                      目前還沒有推廣成功紀錄喔！
                                    </td>
                                  </tr>
                                ) : (
                                  partnerAllOrders.map((order) => {
                                    const conf = statusConfig(order.status);
                                    return (
                                      <tr
                                        key={order.id}
                                        className="hover:bg-slate-50/50 transition"
                                      >
                                        <td className="px-4 py-4">
                                          <div className="font-mono font-bold text-slate-700">
                                            {order.id.substring(0, 8)}
                                          </div>
                                          <div className="text-xs text-slate-400 mt-1">
                                            {formatDate(order.created_at)}
                                          </div>
                                        </td>
                                        <td className="px-4 py-4 font-bold text-slate-800">
                                          NT${" "}
                                          {formatNTDNoDecimals(
                                            order.total_amount,
                                          )}
                                        </td>
                                        <td className="px-4 py-4 font-black text-emerald-600">
                                          + NT${" "}
                                          {formatNTDNoDecimals(
                                            order.partner_profit,
                                          )}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                          <span
                                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${conf.color}`}
                                          >
                                            {conf.label}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* --- 專屬折扣碼系統 --- */}
                      {partnerSubTab === "coupons" && (
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-6">
                            折扣碼管理
                          </h3>
                        </div>
                      )}

                      {/* --- 🌟 核心修改：商店設定 (可編輯狀態) --- */}
                      {partnerSubTab === "store_settings" && (
                        <div className="max-w-xl">
                          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <PencilSquareIcon className="w-5 h-5 text-sky-500" />{" "}
                            前台商店設定
                          </h3>
                          <p className="text-sm text-slate-500 mb-6">
                            在此修改您的店鋪外觀資訊，儲存後將立即同步至您的專屬商店前台。
                          </p>

                          {partnerStoreInfo ? (
                            <div className="space-y-6">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                  分店顯示名稱
                                </label>
                                <input
                                  type="text"
                                  value={editStoreName}
                                  onChange={(e) =>
                                    setEditStoreName(e.target.value)
                                  }
                                  placeholder="請輸入您的店鋪名稱"
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                />
                                <p className="text-[11px] text-slate-400 mt-1.5">
                                  這將會顯示在您的商店首頁、結帳畫面與導覽列上。
                                </p>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                                  專屬網址 (Slug) -{" "}
                                  <span className="text-red-400">不可修改</span>
                                </label>
                                <div className="flex items-center bg-slate-100/70 border border-slate-200 rounded-xl px-4 overflow-hidden opacity-70">
                                  <span className="text-sm text-slate-400 py-2.5 border-r border-slate-200 pr-3 mr-3">
                                    jekoesim.com/p/
                                  </span>
                                  <input
                                    type="text"
                                    disabled
                                    value={partnerStoreInfo.domain}
                                    className="w-full py-2.5 bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-0 cursor-not-allowed"
                                  />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5">
                                  為確保客人的連結不失效，網址綁定後如需修改請聯繫官方客服。
                                </p>
                              </div>

                              <div className="pt-4">
                                <button
                                  onClick={handleUpdateStoreSettings}
                                  disabled={
                                    savingStore ||
                                    editStoreName ===
                                      partnerStoreInfo.store_name
                                  }
                                  className="w-full sm:w-auto px-8 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                  {savingStore ? "儲存中..." : "儲存設定"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm font-bold border border-amber-200">
                              總部審核中，或尚未為您開通專屬網址，請聯繫管理員。
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* === 我的 eSIM (略) === */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-slate-800">
                    我的 eSIM 與訂單
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Layout>
  );
}
