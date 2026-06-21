"use client";

import { useState } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/MaterialIcon";

const SUMMARY_ITEMS = [
  {
    title: "掃描 QR Code 即視為開通",
    text: "掃描或安裝 eSIM 後，即代表數位商品已交付使用。",
  },
  {
    title: "開通後原則不退款",
    text: "已開通之 eSIM 原則不提供退款（詳見例外情形）。",
  },
  {
    title: "未開通可申請退款",
    text: "QR Code 尚未掃描、且 eSIM 尚未啟用，可於 7 日內申請全額退款。",
  },
];

/**
 * 結帳／商品頁可展開的 eSIM 退換貨條款摘要
 */
export default function EsimRefundDisclosure({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 py-2 text-left group"
        aria-expanded={open}
      >
        <span className="text-xs text-slate-500 group-hover:text-slate-700 transition leading-snug">
          數位 eSIM 商品說明：掃描開通後即無法退款
        </span>
        <MaterialIcon
          name={open ? "expand_less" : "expand_more"}
          size={18}
          className="text-slate-400 shrink-0"
        />
      </button>

      {open && (
        <div className="pb-3 space-y-3 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            eSIM 為數位商品，付款成功後將 Email 寄送 QR Code。請確認手機支援 eSIM 且已解除電信鎖。
          </p>

          <ul className="space-y-2.5">
            {SUMMARY_ITEMS.map((item) => (
              <li key={item.title} className="text-xs leading-relaxed">
                <span className="text-slate-700 font-medium">{item.title}</span>
                <span className="text-slate-400"> — {item.text}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-slate-400 leading-relaxed">
            例外：重複扣款、錯誤出貨、經查證之系統或供應商故障等，依
            <Link href="/refund-policy" target="_blank" className="text-slate-600 underline hover:text-slate-800 mx-0.5">
              退換貨政策
            </Link>
            個案審核。
          </p>
        </div>
      )}
    </div>
  );
}
