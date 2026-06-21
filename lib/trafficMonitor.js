import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { queryEsimUsage } from "./esimUsageService";
import { formatMb } from "./esimUsageFormat";
import { pushLineMessage, isLineBotConfigured } from "./lineBot";
import { getPublicSiteUrl } from "./siteUrl";

const SITE_URL = getPublicSiteUrl();

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getAlertThresholds() {
  return {
    pct: Number(process.env.TRAFFIC_ALERT_THRESHOLD_PCT || 20),
    mb: Number(process.env.TRAFFIC_ALERT_THRESHOLD_MB || 500),
    cooldownHours: Number(process.env.TRAFFIC_ALERT_COOLDOWN_HOURS || 24),
  };
}

/** 是否應發送低流量提醒 */
export function shouldSendTrafficAlert({
  remainingMb,
  totalMb,
  lastAlertAt,
  lastRemainingMb,
}) {
  if (remainingMb == null || Number.isNaN(Number(remainingMb))) return false;

  const { pct, mb, cooldownHours } = getAlertThresholds();
  const remaining = Number(remainingMb);
  const total = totalMb != null ? Number(totalMb) : null;

  let isLow = false;
  if (total && total > 0) {
    isLow = (remaining / total) * 100 <= pct;
  } else {
    isLow = remaining <= mb;
  }
  if (!isLow) return false;

  if (lastAlertAt) {
    const hoursSince =
      (Date.now() - new Date(lastAlertAt).getTime()) / 3600000;
    if (hoursSince < cooldownHours) {
      const prev = lastRemainingMb != null ? Number(lastRemainingMb) : null;
      if (prev == null || remaining >= prev * 0.85) return false;
    }
  }
  return true;
}

export function buildLowTrafficWebPayload(target) {
  const remaining = formatMb(target.remainingMb);
  const total = formatMb(target.totalMb);
  const label = target.productName || target.product_label || "eSIM";
  const body =
    remaining && total
      ? `${label} 剩餘 ${remaining} / ${total}，建議盡快加購或充值。`
      : remaining
        ? `${label} 剩餘 ${remaining}，流量偏低，建議盡快加購。`
        : `${label} 流量偏低，建議盡快加購或充值。`;

  return JSON.stringify({
    title: "⚠️ eSIM 流量偏低提醒",
    body,
    url: "/account?tab=traffic",
  });
}

export function buildLowTrafficLineText(target) {
  const remaining = formatMb(target.remainingMb);
  const total = formatMb(target.totalMb);
  const label = target.productName || target.product_label || "eSIM";
  return [
    "⚠️ eSIM 流量偏低提醒",
    "",
    `方案：${label}`,
    remaining && total
      ? `剩餘流量：${remaining} / ${total}`
      : remaining
        ? `剩餘流量：${remaining}`
        : null,
    "",
    `👉 查詢詳情：${SITE_URL}/account?tab=traffic`,
    "※ 數據依供應商更新，可能有延遲",
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendWebPush(subscription, payload) {
  if (
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY
  ) {
    return { ok: false, error: "VAPID 未設定" };
  }
  webpush.setVapidDetails(
    "mailto:bob112722761236tom@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      payload,
    );
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err.message,
      gone: err.statusCode === 410 || err.statusCode === 404,
    };
  }
}

async function fetchPushTargets(supabaseAdmin) {
  const attempts = [
    {
      select:
        "id, endpoint, p256dh, auth, topup_id, iccid, line_user_id, line_alert_enabled, last_alert_at, last_remaining_mb",
      filterMonitor: true,
    },
    {
      select:
        "id, endpoint, p256dh, auth, topup_id, iccid, last_alert_at, last_remaining_mb",
      filterMonitor: true,
    },
    {
      select: "id, endpoint, p256dh, auth, topup_id, iccid",
      filterMonitor: true,
    },
    {
      select: "id, endpoint, p256dh, auth, topup_id, iccid",
      filterMonitor: false,
    },
  ];

  let lastError = null;
  for (const attempt of attempts) {
    let query = supabaseAdmin.from("push_subscriptions").select(attempt.select);
    if (attempt.filterMonitor) {
      query = query.eq("monitor_enabled", true);
    }
    query = query.or("topup_id.not.is.null,iccid.not.is.null");
    const { data, error } = await query;
    if (!error) return { data, error: null };
    lastError = error;
    if (!error.message?.includes("does not exist")) break;
  }

  return { data: null, error: lastError };
}

async function fetchLineTargets(supabaseAdmin) {
  const { data, error } = await supabaseAdmin
    .from("line_traffic_alerts")
    .select(
      "id, line_user_id, topup_id, iccid, product_label, last_alert_at, last_remaining_mb",
    )
    .eq("monitor_enabled", true)
    .or("topup_id.not.is.null,iccid.not.is.null");

  if (
    error?.message?.includes("does not exist") ||
    error?.message?.includes("Could not find the table") ||
    error?.code === "42P01"
  ) {
    return { data: [], error: null };
  }
  return { data, error };
}

async function isLineFriend(supabaseAdmin, lineUserId) {
  if (!lineUserId) return false;
  const { data, error } = await supabaseAdmin
    .from("line_oa_friends")
    .select("line_user_id, unfollowed_at")
    .eq("line_user_id", lineUserId)
    .maybeSingle();
  if (error?.message?.includes("does not exist")) return true;
  return !!(data && !data.unfollowed_at);
}

async function checkOneTarget(supabaseAdmin, target, table) {
  const topupId = target.topup_id;
  const iccid = target.iccid;
  if (!topupId && !iccid) {
    return { skipped: true, reason: "no_topup_or_iccid" };
  }

  const usage = await queryEsimUsage({ topupId, iccid });
  const now = new Date().toISOString();
  const updateBase = {
    last_checked_at: now,
    last_remaining_mb: usage.ok ? usage.data?.remainingMb : null,
  };

  const { error: checkUpdateErr } = await supabaseAdmin
    .from(table)
    .update(updateBase)
    .eq("id", target.id);
  if (checkUpdateErr?.message?.includes("does not exist")) {
    await supabaseAdmin
      .from(table)
      .update({ last_remaining_mb: updateBase.last_remaining_mb })
      .eq("id", target.id);
  }

  if (!usage.ok || usage.data?.remainingMb == null) {
    return { checked: true, alert: false, error: usage.error };
  }

  const alertData = {
    remainingMb: usage.data.remainingMb,
    totalMb: usage.data.totalMb,
    productName: usage.data.productName || target.product_label,
    lastAlertAt: target.last_alert_at,
    lastRemainingMb: target.last_remaining_mb,
  };

  if (!shouldSendTrafficAlert(alertData)) {
    return { checked: true, alert: false, remainingMb: usage.data.remainingMb };
  }

  const results = { checked: true, alert: true, web: false, line: false };

  if (table === "push_subscriptions" && target.endpoint) {
    const payload = buildLowTrafficWebPayload({
      ...alertData,
      product_label: target.product_label,
    });
    const pushResult = await sendWebPush(target, payload);
    if (pushResult.ok) results.web = true;
    if (pushResult.gone) {
      await supabaseAdmin
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", target.endpoint);
    }
  }

  const lineUserId = target.line_user_id;
  const wantLine =
    table === "line_traffic_alerts" ||
    (target.line_alert_enabled && lineUserId);

  if (wantLine && lineUserId && isLineBotConfigured()) {
    const friend = await isLineFriend(supabaseAdmin, lineUserId);
    if (friend) {
      try {
        await pushLineMessage(lineUserId, {
          type: "text",
          text: buildLowTrafficLineText({
            ...alertData,
            product_label: target.product_label,
          }),
        });
        results.line = true;
      } catch (err) {
        results.lineError = err.message;
      }
    } else {
      results.lineSkipped = "not_friend";
    }
  }

  if (results.web || results.line) {
    await supabaseAdmin
      .from(table)
      .update({
        last_alert_at: now,
        last_remaining_mb: usage.data.remainingMb,
      })
      .eq("id", target.id);
  }

  return results;
}

/**
 * Cron 主流程：檢查所有 monitor_enabled 的訂閱並發推播
 */
export async function runTrafficMonitor() {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return { ok: false, error: "Supabase 未設定" };
  }

  const summary = {
    pushChecked: 0,
    lineChecked: 0,
    alertsSent: 0,
    errors: [],
  };

  const { data: pushTargets, error: pushErr } =
    await fetchPushTargets(supabaseAdmin);

  if (pushErr) {
    summary.errors.push(`push_subscriptions: ${pushErr.message}`);
  } else {
    for (const target of pushTargets || []) {
      summary.pushChecked++;
      try {
        const r = await checkOneTarget(supabaseAdmin, target, "push_subscriptions");
        if (r.alert && (r.web || r.line)) summary.alertsSent++;
      } catch (e) {
        summary.errors.push(`push:${target.id}: ${e.message}`);
      }
    }
  }

  const { data: lineTargets, error: lineErr } =
    await fetchLineTargets(supabaseAdmin);

  if (lineErr) {
    summary.errors.push(`line_traffic_alerts: ${lineErr.message}`);
  } else {
    for (const target of lineTargets || []) {
      summary.lineChecked++;
      try {
        const r = await checkOneTarget(supabaseAdmin, target, "line_traffic_alerts");
        if (r.alert && r.line) summary.alertsSent++;
      } catch (e) {
        summary.errors.push(`line:${target.id}: ${e.message}`);
      }
    }
  }

  return { ok: true, ...summary };
}
