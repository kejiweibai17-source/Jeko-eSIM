"use client";

import Layout from "./Layout";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const lastUpdated = "2026 年 2 月 28 日";

  const ArrowIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-transform group-hover:translate-x-[2px]"
    >
      <path
        d="M8 5l8 7-8 7"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // 🌟 將內容定義為簡單的數據結構，方便在下方以普通段落渲染
  const policySections = [
    {
      number: "1",
      title: "資訊收集",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">
            當您使用我們的服務、註冊帳號或進行購買時，我們可能會收集以下資訊：
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 marker:text-blue-500">
            <li>基本資料：姓名、電子郵件地址。</li>
            <li>
              社群登入資訊：當您使用 Google、Facebook 或 LINE
              登入時，我們會取得您授權提供的公開資訊。
            </li>
            <li>交易紀錄：購買的 eSIM 方案、付款狀態與訂單編號。</li>
          </ul>
        </>
      ),
    },
    {
      number: "2",
      title: "資訊使用方式",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">
            收集到的資訊將用於以下用途：
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 marker:text-blue-500">
            <li>發送您購買的 eSIM QR Code 郵件。</li>
            <li>維護您的會員帳戶權益與歷史訂單查詢。</li>
            <li>提供客戶支援與售後服務。</li>
            <li>確保交易安全與防止詐欺。</li>
          </ul>
        </>
      ),
    },
    {
      number: "3",
      title: "資料安全性與第三方服務",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">
            我們致力於保護您的個人資料，並使用業界標準的技術（如 Supabase
            安全驗證）來保護您的帳密與資訊。
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            我們不會將您的個人資料出售或出租給第三方。但在必要情況下，我們會與以下服務商合作以完成交易：
          </p>
          <div className="bg-slate-50 p-5 rounded-2xl text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-2">
            <span>
              <strong>Supabase</strong>：負責帳號驗證與資料庫儲存。
            </span>
            <span>
              <strong>藍新金流</strong>：負責處理付款程序。
            </span>
            <span>
              <strong>MicroEsim</strong>：負責發送與啟用您的數位網卡。
            </span>
          </div>
        </>
      ),
    },
    {
      number: "4",
      title: "您的權利",
      content: (
        <p className="text-slate-600 leading-relaxed">
          您隨時可以登入會員中心修改您的個人資訊。若您希望刪除帳號及相關所有個人資料，請透過官方
          LINE 或電子郵件與我們聯繫。
        </p>
      ),
    },
    {
      number: "5",
      title: "聯絡我們",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed">
            如果您對本隱私權政策有任何疑問，請聯繫：
          </p>
          <div className="bg-slate-50 p-5 rounded-2xl mt-5 text-sm text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">
              極客網頁設計 - Jeko eSIM 團隊
            </p>
            <p>官方 LINE: @jeko_esim (範例)</p>
            <p>Email: support@jeko.esim (範例)</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-slate-50 pb-24 sm:pb-32"
      >
        {/* === 🌟 最上方 Hero Section === */}
        <div className=" py-20 px-4 md:py-28 relative overflow-hidden text-stone-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block text-xs font-bold  px-3 py-1 rounded-full mb-4">
                Jeko eSIM - 隱私安全承諾
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                隱私權政策
              </h1>

              <p className="  text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                Jeko eSIM
                團隊（「我們」）致力於保護並尊重您的隱私權。本政策說明我們收集、使用和儲存您資訊的方式。
              </p>

              {/* 外層容器：設定 group 以便控制內部所有動畫 */}
              <a
                href="/"
                className="group relative mt-5 inline-flex items-center justify-center"
              >
                {/* 動畫效果 3 (背景影子層)：
            這層固定在底部，當上方按鈕移動時，這層會露出來形成「殘影」或「立體厚度」。
            顏色設定為比主色稍深的 Cyan (#0891b2) 
          */}
                <div className="absolute inset-0 h-full w-full rounded-full bg-[#2d70db] opacity-0 transition-all duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:opacity-100" />

                {/* 主按鈕層 (Button 1 的樣式基礎)：
            包含背景色 #0BAFD7、陰影、圓角。
            Hover 時會向左上方移動 (-translate)，配合下方的影子層創造立體感。
          */}
                <div className="relative z-10 inline-flex items-center justify-center overflow-hidden rounded-full bg-[#1D55AE] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#0BAFD7]/30 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[#243671]/40  ">
                  {/* 動畫效果 2 (文字傾斜滑動)：
              包含兩組完全相同的內容 (文字+Icon)。
            */}
                  <span className="relative inline-flex overflow-hidden">
                    {/* 第一組內容：原本顯示的。Hover 時向右滑出並傾斜 (+150%, skew) */}
                    <div className="flex items-center gap-3 transition-transform duration-500 group-hover:translate-x-[150%] group-hover:skew-x-12">
                      查看其他條款
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                        <ArrowIcon />
                      </span>
                    </div>

                    {/* 第二組內容：原本隱藏在左側。Hover 時歸位並取消傾斜 (0%, no skew) */}
                    <div className="absolute inset-0 flex items-center gap-3 transition-transform duration-500 -translate-x-[150%] skew-x-12 group-hover:translate-x-0 group-hover:skew-x-0">
                      查看其他條款
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                        <ArrowIcon />
                      </span>
                    </div>
                  </span>
                </div>
              </a>
            </div>

            {/* 右側示意主圖 */}
            <div className="w-[300px] h-[350px] bg-black rounded-3xl border-4 border-dashed border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              <span className="text-xs text-white/30 tracking-widest">
                [ 主圖位置 ]
              </span>
            </div>
          </div>
        </div>

        {/* === 🌟 下方內容區域 (普通文字段落設計) === */}
        <div className="max-w-4xl mx-auto px-4 mt-[-20px] md:mt-[-40px] relative z-20">
          <div className=" p-8 md:p-16    max-w-none  ">
            {/* 最後更新日期 */}
            <p className="text-sm text-slate-400 mb-12 text-center border border-slate-100 inline-block px-4 py-1.5 rounded-full mx-auto flex justify-center w-fit">
              最後更新日期：{lastUpdated}
            </p>

            {/* 🌟 渲染文字段落 */}
            {policySections.map((section) => (
              <section key={section.number} className="mb-12 last:mb-0">
                <h2 className="text-2xl font-bold text-slate-800 mb-6  flex items-baseline gap-2">
                  {section.title}
                </h2>
                <div className="content-block">{section.content}</div>
              </section>
            ))}

            {/* 版權 Footer */}
            <div className="mt-20 pt-10 border-t border-slate-100 text-center text-xs text-slate-400">
              © 2026 極客網頁設計. All rights reserved. Jeko eSIM 團隊
            </div>
          </div>
        </div>

        {/* 🌟 已修正：將 </div> 改回 </motion.div> */}
      </motion.div>
    </Layout>
  );
};

export default PrivacyPolicy;
