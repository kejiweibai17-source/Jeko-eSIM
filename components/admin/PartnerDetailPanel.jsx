"use client";

import { ACCOUNT_UI } from "@/lib/accountUi";
import {
  parsePartnerType,
  parseDescriptionField,
} from "@/lib/partnerDescriptionParse";

export default function PartnerDetailPanel({ partner, onClose }) {
  if (!partner) return null;

  const lines = (partner.description || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className={ACCOUNT_UI.modalOverlayBottom}>
      <div className="bg-white rounded-sm shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#2563eb] uppercase">申請詳情</p>
            <h3 className="text-lg font-black text-slate-900">{partner.name}</h3>
            <p className="text-sm text-slate-500">{partner.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none px-2"
          >
            ×
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-sm p-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">合作類型</p>
              <p className="font-bold text-slate-800">{parsePartnerType(partner.description)}</p>
            </div>
            <div className="bg-slate-50 rounded-sm p-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">專屬網址</p>
              <p className="font-mono text-[#2563eb] font-bold text-xs">/p/{partner.slug}</p>
            </div>
            {parseDescriptionField(partner.description, "聯絡人") && (
              <div className="bg-slate-50 rounded-sm p-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">聯絡人</p>
                <p className="font-bold text-slate-800">
                  {parseDescriptionField(partner.description, "聯絡人")}
                </p>
              </div>
            )}
            {parseDescriptionField(partner.description, "聯絡電話") && (
              <div className="bg-slate-50 rounded-sm p-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">電話</p>
                <p className="font-bold text-slate-800">
                  {parseDescriptionField(partner.description, "聯絡電話")}
                </p>
              </div>
            )}
            {parseDescriptionField(partner.description, "LINE ID") && (
              <div className="bg-slate-50 rounded-sm p-3 col-span-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">LINE ID</p>
                <p className="font-bold text-slate-800">
                  {parseDescriptionField(partner.description, "LINE ID")}
                </p>
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">完整申請內容</p>
            <div className="bg-blue-50/50 border border-blue-100 rounded-sm p-4 text-xs text-slate-600 leading-relaxed space-y-1">
              {lines.length ? lines.map((line) => <p key={line}>{line}</p>) : "（無）"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
