/**
 * POST /api/admin/seed-products
 * 一次性將 Demo 商品寫入 Supabase products + product_variations
 * 呼叫方式：curl -X POST https://yoursite/api/admin/seed-products?secret=jeko2025
 */
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const DEMO_PRODUCTS = [
  {
    name: "日本 eSIM 吃到飽",
    description: "日本全境 SoftBank/Docomo 網路，吃到飽無限上網，支援 iOS/Android",
    image_url: "/images/esim-japan.jpg",
    variations: [
      { sku: "JP-UNLM-3D", b2b_price: 220, attributes: { days: 3, data: "無限" } },
      { sku: "JP-UNLM-5D", b2b_price: 320, attributes: { days: 5, data: "無限" } },
      { sku: "JP-UNLM-7D", b2b_price: 420, attributes: { days: 7, data: "無限" } },
      { sku: "JP-UNLM-10D", b2b_price: 550, attributes: { days: 10, data: "無限" } },
      { sku: "JP-UNLM-15D", b2b_price: 750, attributes: { days: 15, data: "無限" } },
      { sku: "JP-UNLM-30D", b2b_price: 1200, attributes: { days: 30, data: "無限" } },
    ],
  },
  {
    name: "韓國 eSIM 高速上網",
    description: "韓國 SK/KT 網路，高速 4G/5G，觀光必備",
    image_url: "/images/esim-korea.jpg",
    variations: [
      { sku: "KR-UNLM-3D", b2b_price: 180, attributes: { days: 3, data: "無限" } },
      { sku: "KR-UNLM-5D", b2b_price: 260, attributes: { days: 5, data: "無限" } },
      { sku: "KR-UNLM-7D", b2b_price: 350, attributes: { days: 7, data: "無限" } },
      { sku: "KR-UNLM-10D", b2b_price: 480, attributes: { days: 10, data: "無限" } },
    ],
  },
  {
    name: "泰國 eSIM 高速上網",
    description: "泰國 AIS/DTAC 網路，4G 高速，曼谷清邁普吉皆適用",
    image_url: "/images/esim-thailand.jpg",
    variations: [
      { sku: "TH-UNLM-3D", b2b_price: 150, attributes: { days: 3, data: "無限" } },
      { sku: "TH-UNLM-5D", b2b_price: 220, attributes: { days: 5, data: "無限" } },
      { sku: "TH-UNLM-7D", b2b_price: 280, attributes: { days: 7, data: "無限" } },
    ],
  },
  {
    name: "歐洲多國 eSIM",
    description: "覆蓋 30+ 歐洲國家，單一 eSIM 暢遊全歐，旅遊必備",
    image_url: "/images/esim-europe.jpg",
    variations: [
      { sku: "EU-3GB-7D", b2b_price: 380, attributes: { days: 7, data: "3GB" } },
      { sku: "EU-5GB-10D", b2b_price: 520, attributes: { days: 10, data: "5GB" } },
      { sku: "EU-10GB-15D", b2b_price: 750, attributes: { days: 15, data: "10GB" } },
    ],
  },
  {
    name: "美國/加拿大 eSIM",
    description: "美國 T-Mobile 網路，全美 5G/4G LTE，亦覆蓋加拿大",
    image_url: "/images/esim-usa.jpg",
    variations: [
      { sku: "US-5GB-7D", b2b_price: 420, attributes: { days: 7, data: "5GB" } },
      { sku: "US-10GB-15D", b2b_price: 680, attributes: { days: 15, data: "10GB" } },
      { sku: "US-UNLM-30D", b2b_price: 1100, attributes: { days: 30, data: "無限" } },
    ],
  },
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { secret } = req.query;
  if (secret !== "jeko2025") return res.status(401).json({ error: "Unauthorized" });

  const results = [];

  for (const product of DEMO_PRODUCTS) {
    // 先確認是否已存在（以 name 為唯一鍵）
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("name", product.name)
      .single();

    let productId;

    if (existing) {
      productId = existing.id;
      results.push({ name: product.name, status: "already_exists", id: productId });
    } else {
      const { data: newProduct, error: pErr } = await supabaseAdmin
        .from("products")
        .insert([{ name: product.name, description: product.description, image_url: product.image_url }])
        .select()
        .single();

      if (pErr) {
        results.push({ name: product.name, status: "error", error: pErr.message });
        continue;
      }
      productId = newProduct.id;

      // 插入變體
      const variationsPayload = product.variations.map((v) => ({
        product_id: productId,
        sku: v.sku,
        b2b_price: v.b2b_price,
        attributes: v.attributes,
      }));

      const { error: vErr } = await supabaseAdmin
        .from("product_variations")
        .insert(variationsPayload);

      if (vErr) {
        results.push({ name: product.name, status: "product_ok_variations_error", error: vErr.message });
      } else {
        results.push({ name: product.name, status: "created", id: productId, variations: product.variations.length });
      }
    }
  }

  return res.status(200).json({ success: true, results });
}
