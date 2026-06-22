/** @type {import('next').NextConfig} */
const path = require("path");

// ★★★ 引入 PWA 套件 ★★★
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false, // 關閉可減少 SW 複雜度
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  register: false, // 由 PWARegister 元件在 _app 統一 register，與推播共用 /sw.js
  cacheStartUrl: false,

  fallbacks: {
    document: "/_offline",
  },

  // public/ 大量素材不應 precache（手機 SW install 會卡數十秒甚至失敗）
  publicExcludes: [
    "!noprecache/**/*",
    "!images/**",
    "!assets/**",
    "!fonts/**",
    "!videos/**",
    "!參考/**",
    "!nextImageExportOptimizer/**",
    "!static/**",
    "!Logo/**",
    "!Lottie/**",
    "!**/*.psd",
    "!**/*.ai",
    "!**/*.FBX",
    "!**/*.fbx",
    "!**/*.glb",
    "!**/*.mp4",
    "!**/*.ttc",
    "!**/*.TTC",
    "!**/*.TTF",
    "!AccuCities*",
    "!img*.jpg",
    "!img*.jpeg",
    "!trip*.jpg",
    "!lens-transformed.glb",
    "!shoe-draco.glb",
    "!index.html",
  ],

  workboxOptions: {
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2MB 上限，避免大檔拖垮 install
    exclude: [/index\.html$/, /\.(?:psd|ai|FBX|fbx|glb|mp4|ttc|TTC)$/i],
    manifestTransforms: [
      (entries) => ({
        manifest: entries.filter(({ url }) => {
          if (/index\.html$/i.test(url)) return false;
          if (/\.(?:psd|ai|FBX|fbx|glb|mp4|ttc|TTC|TTF)$/i.test(url)) return false;
          if (/^\/(?:images|videos|fonts|assets|參考|nextImageExportOptimizer|Logo|Lottie|static)\//.test(url)) {
            return false;
          }
          return true;
        }),
        warnings: [],
      }),
    ],
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
      {
        source: "/api/line/webhook",
        destination: "/api/line/webhook/",
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