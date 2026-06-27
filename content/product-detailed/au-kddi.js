/**
 * AU(KDDI) 電信商 — 產品介紹 HTML（貼至 Medusa 前台編輯器 → 產品介紹 → HTML 原始碼）
 * 設計規範見 lib/productContentHtmlTemplate.js
 */
import {
  planDetailsGrid,
  badge5G,
  otherInfoBlock,
  productIntroSection,
  bulletList,
  paragraph,
  dataTable,
} from "../../lib/productContentHtmlTemplate.js";

const expiryPolicy = `一旦 eSIM 連接到支援的網路並開始產生數據訪問互聯網，有效期限即開始。我們建議您在到達目的地後添加 eSIM。您也可以提前安裝 eSIM，<span style="color:#ea580c;font-weight:700;">但請記得安裝後立即將其關閉</span>，以避免有效期提前開始。`;

const apnBlock = `<strong>APN:</strong> uad5gn.au-net.ne.jp
<strong>用戶名:</strong> au@uad5gn.au-net.ne.jp
<strong>密碼:</strong> au
<strong>身份驗證類型:</strong> CHAP

或者

<strong>APN:</strong> au.5g.au-net.ne.jp
<strong>用戶名:</strong> user@au.5g.au-net.ne.jp
<strong>密碼:</strong> au
<strong>身份驗證類型:</strong> CHAP

如果在應用上述設置後仍無法連接數據，請嘗試以下 4G 專用 APN：

<strong>APN:</strong> uno.au-net.ne.jp
<strong>用戶名:</strong> 685840734641020@uno.au-net.ne.jp
<strong>密碼:</strong> KpyrR6BP
<strong>身份驗證類型:</strong> CHAP`;

const introBullets = [
  `本方案由日本主要電信商 <strong style="color:#1e293b;">au（KDDI）</strong> 提供。作為日本領先的電信運營商之一，日本 KDDI 的 eSIM 解決方案特別適合經常前往日本的旅客或短期訪客。包含多種規格可選。`,
  "遊客只需掃描 QR Code 即可輕鬆啟動日本 eSIM，並享受高品質的語音和數據服務。",
  `此方案直接連接到 KDDI 的本地訊號塔，確保低延遲。下載 ping 低至 <strong style="color:#1e293b;">僅 40ms</strong>，在 5G 模式下可體驗高達 <strong style="color:#1e293b;">500Mbps</strong> 的下載速度。`,
  "使用日本 eSIM 遊覽日本 13 個最值得一遊的地方。在整個旅程中保持訊號暢通，不用擔心拍下的美照無法發送到社群媒體或與朋友分享。",
  `此日本 eSIM 方案支援 <strong style="color:#1e293b;">Google、YouTube、Facebook、Instagram、ChatGPT 和 TikTok</strong> 等應用程式。`,
  `儘管 5G 覆蓋範圍可能因地而異，但此 eSIM 在日本全境提供可靠的 4G/LTE 服務。在東京、大阪和京都等主要城市，您將獲得出色的 5G 速度。如果您在多個城市旅行並想要最穩定、最無縫的網路，我們推薦我們的雙網路 <strong style="color:#1e293b;">日本 eSIM 5G SoftBank / KDDI</strong>，可在 Softbank 和 KDDI 網路之間切換以找到最佳訊號。`,
];

export const AU_KDDI_DETAILED_CONTENT_HTML = [
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
          valueHtml: `<span>KDDI</span> ${badge5G("5G")}`,
        },
      ],
      [
        {
          iconName: "speed",
          label: "速度",
          valueHtml: "4G / LTE / 5G",
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
      title: "⚠️ 重要",
      html: "一旦刪除，此 eSIM 無法重新安裝。",
      marginBottom: 16,
    },
    {
      title: "📅 服務天數",
      html: "以日本時間（UTC +9）計算，從啟動日開始。",
      marginBottom: 20,
    },
    {
      title: "APN 設置",
      html: `大多數情況下，APN 會自動設置。如果需要手動配置，請按照以下步驟操作：\n\n${apnBlock}`,
      marginBottom: 20,
    },
    {
      html: "購買後請於 <strong style=\"color:#1e293b;\">150 天</strong>內掃描 QR Code 並完成啟用。",
      marginBottom: 16,
    },
    {
      html: "這個 eSIM 由當地運營商提供，MicroEsim 作為授權經銷商進行銷售。購買後，該方案是不可取消且不可退款。發行運營商保留在不通知的情況下修改套餐細節的權利，MicroEsim 可能無法及時通知客戶這些變更。感謝您的理解。",
      marginBottom: 0,
    },
  ]),

  productIntroSection(`
    ${paragraph(introBullets[0], 20)}
    ${dataTable(
      ["方案", "描述", "熱點分享"],
      [
        [
          `<div style="font-weight:700;color:#1e293b;">總計 XX GB</div>`,
          "固定高速數據量，直到數據用完前沒有速度限制。",
          "熱點分享將消耗您分配的總 GB 數據量，沒有其他限制。",
        ],
        [
          `<div style="font-weight:700;color:#1e293b;">無限流量 10Mbps</div>`,
          "以 10Mbps 速度提供無限數據。",
          `熱點分享可使用的總 GB 數，依所選天數計算，公式為「天數 - 1」GB。例如，7 天方案可分享 <strong style="color:#1e293b;">6 GB</strong>。`,
        ],
        [
          `<div style="font-weight:700;color:#1e293b;">無限流量</div>`,
          "真正的無限高速數據。",
          `例如，若購買 7 天的「無限流量」或「無限流量 10Mbps」方案，可供分享的熱點數據為 7 - 1 = <strong style="color:#1e293b;">6 GB</strong>。`,
        ],
      ],
    )}
    ${paragraph("對於「總計 XX GB」方案，熱點分享沒有限制，您可以根據購買的總數據量自由使用熱點數據，直到用完為止。", 16)}
    ${paragraph("您可以根據自己的需求選擇最適合的方案，所有方案都以實惠的價格提供。", 24)}
    ${bulletList(introBullets.slice(1))}
  `),
].join("\n");

export default AU_KDDI_DETAILED_CONTENT_HTML;
