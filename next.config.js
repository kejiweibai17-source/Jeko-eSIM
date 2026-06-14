/** @type {import('next').NextConfig} */
const path = require("path");

// ★★★ 引入 PWA 套件 ★★★
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true, // 邊走邊存：客人點過的頁面自動快取
  aggressiveFrontEndNavCaching: true, 
  reloadOnOnline: true, // 當網路恢復時自動重新載入
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", // 開發環境關閉 PWA
  
  // ★★★ 殺手級防護：明確指定斷線時要顯示的頁面 ★★★
  fallbacks: {
    document: "/_offline", // 當找不到快取且沒網路時，強制顯示這頁
  },
  
  workboxOptions: {
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 5000000,
    // public/index.html 在 Next.js 路由下會 404，precache 失敗會讓 SW 無法 ready（推播卡住）
    exclude: [/index\.html$/],
  },
});

const nextConfig = {
  reactStrictMode: true, 
  trailingSlash: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  async rewrites() {
    return [
      {
        source: "/api/newebpay-notify",
        destination: "/api/newebpay-notify/",
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader"], 
    });
    return config;
  },
};

module.exports = withPWA(nextConfig);