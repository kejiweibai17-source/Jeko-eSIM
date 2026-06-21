import crypto from "crypto";
import { getPublicSiteUrl } from "./siteUrl";

const LINE_REPLY_URL = "https://api.line.me/v2/bot/message/reply";
const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";

export function getLineMessagingConfig() {
  const channelSecret =
    process.env.LINE_MESSAGE_CHANNEL_SECRET ||
    process.env.LINE_MESSAGING_CHANNEL_SECRET ||
    "";
  const channelAccessToken =
    process.env.LINE_MESSAGE_CHANNEL_ACCESS_TOKEN ||
    process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN ||
    "";
  return { channelSecret, channelAccessToken };
}

export function isLineBotConfigured() {
  const { channelSecret, channelAccessToken } = getLineMessagingConfig();
  return !!(channelSecret && channelAccessToken);
}

export function verifyLineSignature(rawBody, signature, channelSecret) {
  if (!signature || !channelSecret) return false;
  const hash = crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  return hash === signature;
}

export async function replyLineMessage(replyToken, messages) {
  const { channelAccessToken } = getLineMessagingConfig();
  if (!channelAccessToken) {
    throw new Error("LINE Messaging API 未設定");
  }
  const res = await fetch(LINE_REPLY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: Array.isArray(messages) ? messages : [messages],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LINE reply 失敗：${err}`);
  }
}

export async function pushLineMessage(userId, messages) {
  const { channelAccessToken } = getLineMessagingConfig();
  const res = await fetch(LINE_PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: Array.isArray(messages) ? messages : [messages],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LINE push 失敗：${err}`);
  }
}

export const USAGE_KEYWORDS = [
  "用量",
  "查詢用量",
  "查用量",
  "流量",
  "剩餘流量",
  "查詢",
  "usage",
];

export function isUsageKeyword(text) {
  const t = String(text || "").trim().toLowerCase();
  if (!t) return false;
  return USAGE_KEYWORDS.some((kw) => t === kw.toLowerCase() || t.includes(kw));
}

export function extractIccidFromText(text) {
  const compact = String(text || "").replace(/\s+/g, "");
  const match = compact.match(/\d{18,22}/);
  return match ? match[0] : null;
}

export function buildUsageHelpMessage() {
  const siteUrl = getPublicSiteUrl();
  return [
    "📱 eSIM 用量查詢",
    "",
    "請選擇以下方式：",
    "",
    "① 直接傳送 ICCID（19～20 碼數字）",
    "② 輸入「查詢用量」— 若您曾用 LINE 登入本站，可自動查最近一筆 eSIM",
    "",
    `🌐 也可至網站查詢：${siteUrl}/data-query`,
  ].join("\n");
}
