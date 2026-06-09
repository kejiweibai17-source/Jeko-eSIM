"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "./Layout";
import RegisterForm from "../components/RegisterForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../components/context/UserContext";

// 🚀 補上這行：引入 NextAuth 的 signIn 函數
import { signIn } from "next-auth/react";

const LoginRegisterPage = () => {
  const router = useRouter();
  const { user: supaUser, isHydrated } = useUser();

  const [selected, setSelected] = useState("login");
  const [showForgot, setShowForgot] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // 🛠️ 終極除錯監控台狀態
  const [debugLogs, setDebugLogs] = useState([]);
  const addLog = (msg) => {
    console.log(`[Auth Debug]`, msg);
    setDebugLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} | ${msg}`,
    ]);
  };

  const isLoggedIn = isHydrated && !!supaUser;

  // 🛠️ 監聽所有底層狀態與網址參數
  useEffect(() => {
    if (typeof window === "undefined") return;

    addLog(`🚩 初始載入網址: ${window.location.href}`);

    // 捕捉從跳轉回來時，隱藏在網址列的錯誤碼
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash.includes("error") || search.includes("error")) {
      const urlParams = new URLSearchParams(hash.replace("#", "?"));
      const searchParams = new URLSearchParams(search);
      const errDesc =
        urlParams.get("error_description") ||
        searchParams.get("error_description") ||
        "未知錯誤";

      addLog(`❌ 抓到授權錯誤: ${errDesc}`);
      setMessage(`第三方登入失敗: ${errDesc}`);
    }

    // 監聽 Supabase 的事件變化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`⚡ Supabase 事件觸發: ${event}`);
      if (session) {
        addLog(`✅ 取得 Session! User ID: ${session.user.id}`);
      } else {
        addLog(`⚠️ 目前沒有 Session (未登入)`);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 自動跳轉
  useEffect(() => {
    if (isLoggedIn) {
      addLog("🚀 偵測到登入狀態，準備跳轉至會員中心...");
      const timer = setTimeout(() => {
        router.push("/account");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  // 一般 Email 登入
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);
    addLog("開始執行 Email 登入...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      if (data?.user) addLog("✅ Email 登入成功！");
    } catch (err) {
      addLog(`❌ 登入錯誤: ${err.message}`);
      setMessage("登入失敗，請檢查帳號密碼");
    } finally {
      setLoggingIn(false);
    }
  };

  // Supabase 的 OAuth 登入 (留給 Google 用)
  const handleOAuthLogin = async (provider) => {
    try {
      addLog(`準備請求 ${provider} 授權...`);
      const redirectUrl = `${window.location.origin}/login`;
      addLog(`預計回傳網址: ${redirectUrl}`);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (err) {
      addLog(`❌ 跳轉前發生錯誤: ${err.message}`);
    }
  };

  // 🛠️ 強制清除快取功能
  const clearAuthCache = async () => {
    addLog("🧹 正在清除本地快取與登出...");
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    addLog("✅ 清除完畢，請重新整理網頁！");
  };

  return (
    <Layout>
      <div className="flex bg-[#1C82E0] flex-col items-center justify-center px-4 min-h-screen pt-[140px] pb-12 relative overflow-hidden">
        <div className="w-full max-w-md mx-auto text-white relative z-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-wide">會員登入</h1>
          </div>

          {!isLoggedIn ? (
            <div>
              <div className="flex justify-around mb-6 border-b border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setSelected("login");
                    setShowForgot(false);
                    setMessage("");
                  }}
                  className={`pb-3 text-sm font-semibold tracking-widest transition-all ${
                    selected === "login"
                      ? "text-white border-b-2 border-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  登入
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected("register");
                    setShowForgot(false);
                    setMessage("");
                  }}
                  className={`pb-3 text-sm font-semibold tracking-widest transition-all ${
                    selected === "register"
                      ? "text-white border-b-2 border-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  註冊
                </button>
              </div>

              {selected === "login" && successMessage && (
                <div className="mb-4 bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 p-3 rounded text-sm font-bold text-center">
                  {successMessage}
                </div>
              )}

              {selected === "login" ? (
                !showForgot ? (
                  <>
                    {message && (
                      <div className="mb-4 bg-red-500/20 border border-red-500 text-red-100 p-3 rounded text-sm font-bold text-center">
                        {message}
                      </div>
                    )}

                    <form
                      onSubmit={handleLogin}
                      className="flex flex-col gap-5 mb-4"
                    >
                      <div>
                        <label className="text-xs uppercase tracking-[0.15em] text-white/70">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="請輸入 Email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="mt-1 block w-full bg-transparent border-0 border-b border-white/70 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.15em] text-white/70">
                          密碼
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="請輸入密碼"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          className="mt-1 block w-full bg-transparent border-0 border-b border-white/70 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loggingIn}
                        className={`mt-2 w-full rounded-full py-2.5 text-sm font-semibold tracking-wide shadow-sm transition ${
                          loggingIn
                            ? "bg-white/40 text-[#1C82E0] cursor-not-allowed"
                            : "bg-white/95 text-[#1C82E0] hover:bg-white"
                        }`}
                      >
                        {loggingIn ? "處理中..." : "登入"}
                      </button>
                    </form>

                    <div className="mb-6 text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-sm text-white/80 hover:text-white underline"
                      >
                        忘記密碼？
                      </button>
                    </div>

                    <div className="relative flex items-center py-2 mb-4">
                      <div className="flex-grow border-t border-white/20"></div>
                      <span className="flex-shrink-0 mx-4 text-[10px] text-white/60">
                        使用快速登入
                      </span>
                      <div className="flex-grow border-t border-white/20"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => handleOAuthLogin("google")}
                        className="flex justify-center items-center gap-2 bg-white/10 border border-white/30 py-2.5 rounded text-sm font-bold"
                      >
                        Google 登入
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          signIn("line", { callbackUrl: "/account" })
                        }
                        className="flex items-center justify-center gap-2.5 w-full rounded-full bg-[#06C755] border border-transparent py-2.5 text-[13px] font-semibold text-white tracking-wide transition hover:brightness-105 shadow-sm"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-4.137 2.572-5.992zM7.421 11.96H5.216V7.525a.43.43 0 00-.428-.428h-.86a.43.43 0 00-.428.428v5.295c0 .235.192.428.428.428h3.493a.43.43 0 00.428-.428v-.86a.43.43 0 00-.428-.428zm3.23-4.435v4.435a.43.43 0 01-.428.428h-.86a.43.43 0 01-.428-.428V7.525a.43.43 0 01.428-.428h.86a.43.43 0 01.428.428zm6.541 2.871c0 .235-.192.428-.428.428h-1.963v1.136h1.963a.43.43 0 01.428.428v.86a.43.43 0 01-.428.428h-3.252a.43.43 0 01-.428-.428V7.525a.43.43 0 01.428-.428h3.252a.43.43 0 01.428.428v.86a.43.43 0 01-.428.428h-1.963v1.144h1.963a.43.43 0 01.428.428v.86zm3.321-2.871l-2.063 2.924V7.525a.43.43 0 00-.428-.428h-.86a.43.43 0 00-.428.428v5.295c0 .235.192.428.428.428h.86a.43.43 0 00.35-.183l2.141-3.033v3.216a.43.43 0 00.428.428h.86a.43.43 0 00.428-.428V7.525a.43.43 0 00-.428-.428h-.86a.43.43 0 00-.428.428z" />
                        </svg>
                        LINE
                      </button>
                    </div>
                  </>
                ) : (
                  <ForgotPasswordForm onClose={() => setShowForgot(false)} />
                )
              ) : (
                <RegisterForm
                  onSuccess={(msg) => {
                    setSelected("login");
                    setSuccessMessage(
                      msg || "註冊成功！請使用 Email 與密碼登入。",
                    );
                    setShowForgot(false);
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold">登入成功！</h2>
              <p className="mt-2 text-sm text-emerald-300">
                正在導向會員中心...
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LoginRegisterPage;
