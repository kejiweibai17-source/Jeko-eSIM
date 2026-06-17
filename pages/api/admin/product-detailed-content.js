import DOMPurify from "isomorphic-dompurify";
import { requireAdmin } from "../../../lib/adminAuth";
import {
  DETAILED_CONTENT_METADATA_KEY,
  parseDetailedContentByCarrier,
} from "../../../lib/productDetailedContent";

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const INTERNAL_SECRET = process.env.PRODUCT_CONTENT_ADMIN_SECRET || "";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

const ALLOWED_HTML = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
    "div",
    "span",
    "blockquote",
  ],
  ALLOWED_ATTR: [
    "href",
    "class",
    "style",
    "src",
    "alt",
    "target",
    "rel",
    "width",
    "height",
  ],
};

function sanitizeProductHtml(html) {
  return DOMPurify.sanitize(String(html || ""), ALLOWED_HTML);
}

/**
 * POST /api/admin/product-detailed-content
 * body: { productId, carrier, html }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (!INTERNAL_SECRET || INTERNAL_SECRET.length < 16) {
    return res.status(503).json({
      error: "伺服器未設定 PRODUCT_CONTENT_ADMIN_SECRET",
    });
  }
  if (!PUBLISHABLE_KEY) {
    return res.status(503).json({
      error: "伺服器未設定 NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    });
  }

  const { productId, carrier, html } = req.body ?? {};

  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ error: "缺少 productId" });
  }
  if (!carrier || typeof carrier !== "string" || !carrier.trim()) {
    return res.status(400).json({ error: "缺少電信商 carrier" });
  }

  const carrierKey = carrier.trim();
  const sanitized = sanitizeProductHtml(html);

  try {
    const upstream = await fetch(
      `${MEDUSA_URL}/store/internal/product-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Product-Admin-Secret": INTERNAL_SECRET,
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          productId,
          carrier: carrierKey,
          html: sanitized,
          updatedBy: admin.email,
        }),
      },
    );

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data.error || "儲存至 Medusa 失敗",
        detail: data.detail,
      });
    }

    const contentMap = parseDetailedContentByCarrier(
      data.detailed_content_by_carrier,
    );

    return res.status(200).json({
      success: true,
      carrier: carrierKey,
      html: contentMap[carrierKey] || sanitized,
      detailed_content_by_carrier: contentMap,
    });
  } catch (e) {
    return res.status(500).json({
      error: "儲存失敗",
      detail: e.message,
    });
  }
}
