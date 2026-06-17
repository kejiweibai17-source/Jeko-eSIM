/** 商品文案：粗體 **文字**、連結 [文字](網址) */

export const PRODUCT_RICH_LINK_CLASS =
  "text-[#00befa] hover:underline font-medium";

const BOLD_CLASS = "font-bold text-slate-800";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** 單行內：粗體 + 超連結（先連結、再粗體） */
export function applyInlineRichText(
  segment,
  linkClass = PRODUCT_RICH_LINK_CLASS,
) {
  let out = escapeHtml(segment);

  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const safeHref = String(href).trim();
    if (!/^https?:\/\//i.test(safeHref) && !safeHref.startsWith("/")) {
      return `[${label}](${href})`;
    }
    const labelHtml = escapeHtml(label).replace(
      /\*\*([^*]+)\*\*/g,
      `<strong class="${BOLD_CLASS}">$1</strong>`,
    );
    return `<a href="${safeHref.replace(/"/g, "&quot;")}" class="${linkClass}">${labelHtml}</a>`;
  });

  out = out.replace(
    /\*\*([^*]+)\*\*/g,
    `<strong class="${BOLD_CLASS}">$1</strong>`,
  );

  return out;
}

/** 多段落富文本 → HTML（不含 DOMPurify，供後台預覽） */
export function previewProductRichTextHtml(
  text,
  linkClass = PRODUCT_RICH_LINK_CLASS,
) {
  if (!text?.trim()) return "";

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (!paragraphs.length) return "";

  return paragraphs
    .map((paragraph) => {
      const lines = paragraph
        .split("\n")
        .map((line) => applyInlineRichText(line.trim(), linkClass))
        .filter(Boolean);
      return `<p class="feature-para mb-0 leading-relaxed">${lines.join("<br>")}</p>`;
    })
    .join("");
}

/** 前台安全輸出（需傳入 DOMPurify.sanitize） */
export function buildProductRichTextHtml(
  text,
  linkClass = PRODUCT_RICH_LINK_CLASS,
) {
  if (!text) return "";

  if (/<a\s/i.test(text) && /<p|<br/i.test(text)) {
    return text;
  }

  if (/<a\s/i.test(text) && !/\n/.test(text)) {
    return applyInlineRichText(text.replace(/<[^>]+>/g, ""), linkClass);
  }

  return previewProductRichTextHtml(text, linkClass);
}

export function sanitizeProductRichTextHtml(html, purify) {
  return purify(html, {
    ALLOWED_TAGS: ["a", "p", "br", "strong", "b"],
    ALLOWED_ATTR: ["href", "class", "target", "rel"],
  });
}
