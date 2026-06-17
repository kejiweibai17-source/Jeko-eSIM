import { fetchEsimsByLineUserId } from "../../../lib/memberEsims";
import {
  queryEsimUsage,
  formatUsageForLine,
} from "../../../lib/esimUsageService";
import {
  verifyLineSignature,
  replyLineMessage,
  isUsageKeyword,
  extractIccidFromText,
  buildUsageHelpMessage,
  getLineMessagingConfig,
  isLineBotConfigured,
} from "../../../lib/lineBot";

export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function handleTextMessage(event) {
  const text = event.message?.text || "";
  const replyToken = event.replyToken;
  const lineUserId = event.source?.userId;

  const iccid = extractIccidFromText(text);

  if (iccid) {
    const result = await queryEsimUsage({ iccid });
    const message = result.ok
      ? formatUsageForLine(result.data)
      : `❌ ${result.error || "查詢失敗"}`;
    await replyLineMessage(replyToken, { type: "text", text: message });
    return;
  }

  if (isUsageKeyword(text)) {
    let autoResult = null;
    let hasMemberOrders = false;

    if (lineUserId) {
      try {
        const esims = await fetchEsimsByLineUserId(lineUserId);
        hasMemberOrders = esims.length > 0;
        const latest = esims[0];
        if (latest?.topupId) {
          autoResult = await queryEsimUsage({
            topupId: latest.topupId,
            iccid: latest.iccid,
          });
        }
      } catch (err) {
        console.error("[LINE Bot] 自動查詢失敗", err.message);
      }
    }

    if (autoResult?.ok && autoResult.data?.remainingMb != null) {
      await replyLineMessage(replyToken, {
        type: "text",
        text: formatUsageForLine(autoResult.data),
      });
      return;
    }

    const help = buildUsageHelpMessage();
    let extra = "";
    if (autoResult?.ok === false) {
      extra = `\n\n⚠️ ${autoResult.error}`;
    } else if (lineUserId && !hasMemberOrders) {
      extra = "\n\n💡 找不到本站訂單紀錄，請直接傳送 ICCID 查詢。";
    }

    await replyLineMessage(replyToken, {
      type: "text",
      text: help + extra,
    });
    return;
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "jeko-line-esim-bot",
      configured: isLineBotConfigured(),
      hint: "POST LINE webhook events to this URL",
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { channelSecret } = getLineMessagingConfig();
  if (!channelSecret) {
    return res.status(503).json({ error: "LINE Messaging API 未設定" });
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers["x-line-signature"];

  if (!verifyLineSignature(rawBody, signature, channelSecret)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  let body;
  try {
    body = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const events = body.events || [];

  try {
    for (const event of events) {
      if (event.type === "message" && event.message?.type === "text") {
        await handleTextMessage(event);
      }
    }
  } catch (err) {
    console.error("[LINE Bot] webhook error", err);
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ ok: true });
}
