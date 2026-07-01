/** 全站圖片 alt 統一後綴 */
export const IMAGE_ALT_SUFFIX = "-jeko_eSIM_接口eSIM";

/**
 * 從圖片路徑擷取檔名（不含副檔名），並加上統一後綴。
 * @example getImageAlt("/images/foo/bar/support-01.png")
 *          → "support-01-jeko_eSIM_接口eSIM"
 */
export function getImageAlt(src, customBase) {
  const base = customBase ?? extractFileBaseName(src);
  return `${base}${IMAGE_ALT_SUFFIX}`;
}

function extractFileBaseName(src) {
  if (!src || typeof src !== "string") return "image";

  try {
    const path = src.split("?")[0];
    const file = decodeURIComponent(path.split("/").pop() || "image");
    return file.replace(/\.[^.]+$/, "") || "image";
  } catch {
    return "image";
  }
}
