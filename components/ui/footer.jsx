import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t relative z-[99] border-gray-200">
      <div className=" lg:max-w-[1300px] w-full md:w-[90%] 2xl:max-w-[1500px] mx-auto px-6 py-12">
        {/* ================= 上半部：Logo、橫向選單、社群圖示 ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-gray-200">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <Image
                src="/images/Logo/logo-no-bg.png"
                alt="Jeko Logo"
                width={160}
                height={60}
                className="h-auto w-[120px] object-contain"
              />
            </Link>

            {/* 頂部橫向選單 (仿照左上角小字選單) */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-medium text-gray-500">
              <Link
                href="/company"
                className="hover:text-gray-900 transition-colors"
              >
                關於我們
              </Link>
              <Link
                href="/contact"
                className="hover:text-gray-900 transition-colors"
              >
                聯絡客服
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                服務條款
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-gray-900 transition-colors"
              >
                隱私權政策
              </Link>
              <Link
                href="/refund-policy"
                className="hover:text-gray-900 transition-colors"
              >
                退換貨政策
              </Link>
            </nav>
          </div>

          {/* 社群圖示 (仿照右上角彩色圓圈) */}
          <div className="flex items-center gap-3">
            {/* X (Twitter) 樣式替代 */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.04H5.078z" />
              </svg>
            </a>
            {/* Instagram 樣式替代 */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* Facebook 樣式替代 */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* LINE 樣式替代 */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <span className="text-[10px] font-black tracking-tighter">
                LINE
              </span>
            </a>
          </div>
        </div>

        {/* ================= 下半部：三欄式資訊區塊 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 pb-10">
          {/* 第一欄：產品/方案 */}
          <div>
            <h3 className="text-xl font-bold tracking-widest text-gray-900 uppercase">
              PRODUCTS
            </h3>
            <span className="text-[11px] font-bold text-gray-900 block mt-1 mb-5">
              探索方案
            </span>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/esim/all"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  所有 eSIM 方案
                </Link>
              </li>
              <li>
                <Link
                  href="/esim/japan"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  日本原生 eSIM
                </Link>
              </li>
              <li>
                <Link
                  href="/esim/korea"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  韓國高速 eSIM
                </Link>
              </li>
              <li>
                <Link
                  href="/esim/asia"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  亞洲多國共用
                </Link>
              </li>
              <li>
                <Link
                  href="/esim/global"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  歐美長途方案
                </Link>
              </li>
            </ul>
          </div>

          {/* 第二欄：支援/教學 (雙欄排列) */}
          <div>
            <h3 className="text-xl font-bold tracking-widest text-gray-900 uppercase">
              SUPPORT
            </h3>
            <span className="text-[11px] font-bold text-gray-900 block mt-1 mb-5">
              客戶服務
            </span>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
              <li>
                <Link
                  href="/guide"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  安裝教學
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  常見問題
                </Link>
              </li>
              <li>
                <Link
                  href="/data-usage"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  查詢數據用量
                </Link>
              </li>
              <li>
                <Link
                  href="/devices"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  支援裝置列表
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  聯絡我們
                </Link>
              </li>
              <li>
                <Link
                  href="/company"
                  className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                >
                  關於極客
                </Link>
              </li>
            </ul>
          </div>

          {/* 第三欄：熱門標籤 */}
          <div>
            <h3 className="text-xl font-bold tracking-widest text-gray-900 uppercase">
              TAG
            </h3>
            <span className="text-[11px] font-bold text-gray-900 block mt-1 mb-5">
              熱門關鍵字
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              <span className="text-[13px] text-gray-600">
                <span className="text-sky-500 mr-0.5">#</span>日本eSIM
              </span>
              <span className="text-[13px] text-gray-600">
                <span className="text-sky-500 mr-0.5">#</span>不降速吃到飽
              </span>
              <span className="text-[13px] text-gray-600">
                <span className="text-sky-500 mr-0.5">#</span>韓國上網
              </span>
              <span className="text-[13px] text-gray-600">
                <span className="text-sky-500 mr-0.5">#</span>免換卡
              </span>
              <span className="text-[13px] text-gray-600">
                <span className="text-sky-500 mr-0.5">#</span>原生線路
              </span>
            </div>
          </div>
        </div>

        {/* ================= 底部：公司資訊、認證標章與版權 ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-8 border-t border-gray-200 gap-6">
          {/* 左側：聯絡資訊 & 認證 */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="text-[11px] text-gray-500 leading-relaxed font-medium">
              <p className="text-gray-900 font-bold mb-1 text-[12px]">
                藍鏈數位企業社
              </p>
              <p>臺中市北屯區平安里文心路四段750 號地下室之一</p>
              <p>(僅提供收取信件及包裹服務)</p>
              <b>60982396</b>
              <p>客服信箱：support@re-media.com</p>
            </div>

            {/* 安全認證標章 */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/sgs.png"
                alt="Secure Payment"
                width={45}
                height={45}
                className="object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
              />
              <Image
                src="/images/isms.png"
                alt="Data Privacy"
                width={45}
                height={45}
                className="object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
              />
            </div>
          </div>

          {/* 右側：版權與回到頂部 */}
          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[12px] font-bold text-gray-900 flex items-center gap-1.5 hover:text-sky-500 transition-colors"
            >
              PAGE TOP
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </button>
            <p className="text-[11px] text-gray-400">
              © 2025 Jeko Inc. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
