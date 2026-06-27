/**
 * IIJ Docomo 電信商 — 產品介紹 HTML
 */
import {
  planDetailsGrid,
  otherInfoBlock,
  productIntroSection,
  paragraph,
} from "../../lib/productContentHtmlTemplate.js";

const ICON =
  "font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;";

function lteBadge(label = "LTE") {
  return `<span style="display:inline-block;background:#EEF3FF;color:#2D5BE3;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;border:1px solid #D6E4FF;">${label}</span>`;
}

function noticeBox(text) {
  return `
  <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:16px;padding:16px 20px;border-radius:12px;border:1px solid #fde68a;background:#fffbeb;">
    <span class="material-symbols-outlined" style="font-size:20px;color:#d97706;flex-shrink:0;margin-top:2px;${ICON}">warning</span>
    <div style="font-size:14px;color:#475569;line-height:1.75;">${text}</div>
  </div>`;
}

const expiryPolicy =
  "有效期於 eSIM 下載到您的裝置後立即開始計算。請在準備好使用時再安裝 eSIM。";

export const IIJ_DOCOMO_DETAILED_CONTENT_HTML = [
  planDetailsGrid(
    [
      [
        {
          iconName: "cell_tower",
          label: "訊號覆蓋範圍",
          valueHtml: "東京、京都、廣島、關東、長崎、大阪等日本各城市及旅遊目的地。",
        },
        {
          iconName: "network_cell",
          label: "電信業者",
          valueHtml: `<span>IIJ (Docomo)</span> ${lteBadge("LTE")}`,
        },
      ],
      [
        {
          iconName: "speed",
          label: "速度",
          valueHtml: "4G / LTE",
        },
        {
          iconName: "sim_card",
          label: "方案類型",
          valueHtml: "僅數據流量",
        },
      ],
      [
        {
          iconName: "wifi_tethering",
          label: "網路共用 / 熱點功能",
          valueHtml: "支持",
        },
        {
          iconName: "call",
          label: "電話號碼",
          valueHtml: "無",
        },
      ],
      [
        {
          iconName: "phone_in_talk",
          label: "通話",
          valueHtml: "不支持，只能透過應用程式（網路通話，即 VoIP）。",
        },
        {
          iconName: "sms",
          label: "簡訊",
          valueHtml: "無",
        },
      ],
      [
        {
          iconName: "badge",
          label: "eKYC（身分驗證）",
          valueHtml: "不需要",
        },
        {
          iconName: "mail",
          label: "交付",
          valueHtml:
            "eSIM 的 QR 碼會在付款完成後的幾分鐘內透過電子郵件發送給您。",
        },
      ],
      [
        {
          iconName: "public",
          label: "數據路由",
          valueHtml: "本地",
        },
        {
          iconName: "payments",
          label: "充值選項",
          valueHtml: "無",
        },
      ],
    ],
    {
      iconName: "event",
      label: "效期政策",
      valueHtml: expiryPolicy,
    },
  ),

  otherInfoBlock([
    {
      title: "APN 設置",
      html: 'Manually set the APN as <strong style="color:#1e293b;">"vmobile.jp"</strong> to access the internet in Japan.',
      marginBottom: 0,
    },
  ]),

  productIntroSection(`
    ${paragraph(
      "隆重介紹日本 Docomo eSIM，這是您在日本旅行時保持順暢連線、輕鬆探索各地的最佳旅伴。此 eSIM 僅支援數據上網，並提供<strong style=\"color:#1e293b;\">日本本地 IP 位址</strong>，讓您無需設定漫遊也能保持連線。透過 Docomo 提供的超低延遲與穩定網路覆蓋，您可以在整趟旅程中享受順暢、高速的網路連線。我們提供多種預付 eSIM 數據方案，無論您是在東京熱鬧的街道探索、在社群媒體分享旅行見聞，或與親友保持聯繫，都能隨時連線。日本 Docomo eSIM 提供您無憂旅行所需的便利性與效能。",
      20,
    )}
    ${noticeBox(
      '<strong style="color:#1e293b;">注意：</strong>此日本 eSIM IIJ NTT Docomo 方案需要手動設定 APN。您也可以考慮其他日本 eSIM。',
    )}
    ${noticeBox(
      '<strong style="color:#1e293b;">注意：</strong>根據電信業者說明，Unlimited 方案在正常使用情況下沒有流量限制。不過，部分客戶回報在大量使用時可能會被降速，通常約為每日 10GB。每日用量重置後，系統會自動解除相關降速限制。感謝您的理解。',
    )}
  `),
].join("\n");

export default IIJ_DOCOMO_DETAILED_CONTENT_HTML;
