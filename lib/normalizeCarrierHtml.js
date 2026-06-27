/**
 * 還原被 React Quill 轉成純文字的 HTML。
 * Quill 會把 <div> 變成 &lt;div&gt; 並包在 <p> 裡，前台就會「裸露」原始碼。
 */

function decodeHtmlEntities(text) {
  return String(text)
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'");
}

function unwrapQuillParagraph(html) {
  let out = html.trim();
  let prev = "";

  while (out !== prev) {
    prev = out;
    out = out.replace(/^<p>([\s\S]*)<\/p>$/i, (_, inner) => {
      const trimmed = inner.trim();
      if (/^<(div|table|section|article|ul|ol|h\d|!--)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${inner}</p>`;
    });
  }

  return out;
}

export function looksLikeEscapedCarrierHtml(html) {
  if (!html) return false;
  return /&lt;\/?[a-z]/i.test(html) || /^<p>&lt;/i.test(html.trim());
}

export function hasBlockLevelCarrierHtml(html) {
  if (!html) return false;
  const normalized = looksLikeEscapedCarrierHtml(html)
    ? decodeHtmlEntities(html)
    : html;
  return /<(div|table|section|article|style=)/i.test(normalized);
}

export function normalizeCarrierHtml(html) {
  if (!html || typeof html !== "string") return "";

  let out = html.trim();
  if (!out) return "";

  if (looksLikeEscapedCarrierHtml(out)) {
    out = decodeHtmlEntities(out);
  }

  out = unwrapQuillParagraph(out);

  return out.trim();
}
