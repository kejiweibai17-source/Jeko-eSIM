/** 會員中心 UI 常數 — 層級、圓角、內容最大寬度 */
export const ACCOUNT_CONTENT_MAX_PX = 1280;

export const ACCOUNT_UI = {
  /** 會員頁隱藏全站 Navbar，不需頂部留白 */
  pagePt: "pt-0",
  stickyTop: "top-0",
  sidebarH: "h-screen",
  /** 右側主內容最大寬度 — 大螢幕維持合理比例 */
  contentMax: "max-w-[1280px] mx-auto w-full",
  /** Navbar z-[1000]、mobile menu z-[10001] 之上 */
  modalOverlay: "fixed inset-0 z-[11050] flex items-center justify-center p-4 bg-black/45",
  modalOverlayBottom:
    "fixed inset-0 z-[11050] flex items-end sm:items-center justify-center p-4 bg-black/45",
  dropdown: "z-[11000]",
  shellSticky: "z-[100]",
  radiusCard: "rounded-sm",
  radiusInput: "rounded-sm",
  radiusBtn: "rounded-sm",
};
