/**
 * 商品頁「產品介紹」HTML 區塊模板（inline style，供 Medusa 後台 HTML 原始碼貼上）
 * 設計規範：主色 #2D5BE3、標題 #1e293b、內文 #64748b / #475569
 */

const ICON =
  "font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;";

export function icon(name, size = 18) {
  return `<span class="material-symbols-outlined" style="font-size:${size}px;color:#2D5BE3;${ICON}">${name}</span>`;
}

export function sectionTitle(title, iconName = "info", size = 22) {
  return `
  <div style="text-align:center;margin-bottom:28px;">
    <h3 style="margin:0;font-size:${size}px;font-weight:700;color:#1e293b;display:inline-flex;align-items:center;gap:8px;">
      ${icon(iconName, size + 2)}
      ${title}
    </h3>
    <div style="width:48px;height:3px;background:#2D5BE3;border-radius:2px;margin:10px auto 0;"></div>
  </div>`;
}

export function badge5G(label = "5G") {
  return `<span style="display:inline-block;background:#EEF3FF;color:#2D5BE3;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;border:1px solid #D6E4FF;">${label}</span>`;
}

export function detailCell({ iconName, label, valueHtml, borderRight = true }) {
  return `
      <div style="padding:20px 24px;${borderRight ? "border-right:1px solid #eef2f7;" : ""}">
        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
          ${icon(iconName, 18)}${label}
        </div>
        <div style="font-size:14px;color:#64748b;">${valueHtml}</div>
      </div>`;
}

/** 方案詳情：rows 為 [[left, right], ...]，fullWidth 為整列一欄 */
export function planDetailsGrid(rows, fullWidth = null) {
  const rowHtml = rows
    .map(
      ([left, right]) => `
    <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #eef2f7;">
      ${detailCell({ ...left, borderRight: true })}
      ${detailCell({ ...right, borderRight: false })}
    </div>`,
    )
    .join("");

  const fullHtml = fullWidth
    ? `
    <div style="padding:20px 24px;">
      <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        ${icon(fullWidth.iconName, 18)}${fullWidth.label}
      </div>
      <div style="font-size:14px;color:#64748b;">${fullWidth.valueHtml}</div>
    </div>`
    : "";

  return `
  ${sectionTitle("方案詳情", "info")}
  <div style="background:#FFFFFF;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:40px;">
    ${rowHtml}
    ${fullHtml}
  </div>`;
}

export function bulletList(items) {
  const li = items
    .map(
      (text, i) => `
      <li style="display:flex;gap:10px;align-items:flex-start;margin-bottom:${i < items.length - 1 ? "14" : "0"}px;font-size:15px;color:#475569;">
        <span class="material-symbols-outlined" style="font-size:20px;color:#2D5BE3;flex-shrink:0;margin-top:2px;${ICON}">check_circle</span>
        <span>${text}</span>
      </li>`,
    )
    .join("");

  return `
  <div style="background:#FFFFFF;border:1px solid #e2e8f0;border-radius:12px;padding:24px 28px;margin-bottom:32px;">
    <ul style="margin:0;padding:0;list-style:none;">${li}</ul>
  </div>`;
}

export function subsectionTitle(title, iconName = "article") {
  return `
  <h4 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:8px;">
    ${icon(iconName, 22)}
    ${title}
  </h4>`;
}

/** 其他資訊區塊 */
export function otherInfoBlock(sections) {
  const body = sections
    .map(
      (s) => `
    <div style="margin-bottom:${s.marginBottom ?? "20"}px;">
      ${s.title ? `<div style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:8px;">${s.title}</div>` : ""}
      <div style="font-size:14px;color:#475569;line-height:1.75;white-space:pre-line;">${s.html}</div>
    </div>`,
    )
    .join("");

  return `
  ${sectionTitle("其他資訊", "description", 22)}
  <div style="background:#FFFFFF;border:1px solid #e2e8f0;border-radius:12px;padding:24px 28px;margin-bottom:40px;">
    ${body}
  </div>`;
}

/** 產品介紹區：標題 + 內文（可含 HTML） */
export function productIntroSection(innerHtml) {
  return `
  ${sectionTitle("產品介紹", "article", 24)}
  ${innerHtml}`;
}

export function dataTable(headers, rows, minWidth = 640) {
  const th = headers
    .map(
      (h) =>
        `<th style="padding:14px 16px;text-align:left;font-weight:600;font-size:13px;">${h}</th>`,
    )
    .join("");
  const tr = rows
    .map(
      (cells, ri) => `
        <tr style="${ri < rows.length - 1 ? "border-bottom:1px solid #eef2f7;" : ""}">
          ${cells
            .map(
              (c) =>
                `<td style="padding:16px;vertical-align:top;color:#475569;font-size:13px;line-height:1.7;">${c}</td>`,
            )
            .join("")}
        </tr>`,
    )
    .join("");

  return `
  <div style="overflow-x:auto;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;min-width:${minWidth}px;background:#FFFFFF;">
      <thead>
        <tr style="background:#2D5BE3;color:#FFFFFF;">${th}</tr>
      </thead>
      <tbody>${tr}</tbody>
    </table>
  </div>`;
}

export function paragraph(text, marginBottom = 16) {
  return `<p style="margin:0 0 ${marginBottom}px;font-size:15px;color:#475569;line-height:1.75;">${text}</p>`;
}
