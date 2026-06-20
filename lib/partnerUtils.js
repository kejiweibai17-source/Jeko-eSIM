export function normalizePartnerEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function partnerLoginBlockMessage(partner) {
  if (!partner) {
    return "找不到此 Email 的夥伴申請紀錄。請確認是否使用申請時填寫的 Email 登入。";
  }
  if (partner.status === "pending") {
    return "您的夥伴申請尚在審核中。審核通過後會收到開通通知信，屆時即可登入後台。";
  }
  if (partner.status === "rejected") {
    return "此夥伴申請未通過審核。如有疑問請聯繫 JEKO eSIM 客服。";
  }
  return "此帳號尚未通過合作夥伴審核。請先等候開通通知信，或確認是否使用申請時的 Email 登入。";
}
