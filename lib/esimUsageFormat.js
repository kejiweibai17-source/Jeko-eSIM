/** 客戶端／伺服器共用的用量顯示格式（不可 import 含 service role 的模組） */

export function formatMb(mb) {
  if (mb == null || Number.isNaN(Number(mb))) return null;
  const n = Number(mb);
  if (n >= 1024) return `${(n / 1024).toFixed(1)} GB`;
  return `${Math.round(n)} MB`;
}

export function usagePercent(remaining, total) {
  if (remaining == null || total == null || Number(total) <= 0) return null;
  return Math.min(100, Math.max(0, (Number(remaining) / Number(total)) * 100));
}
