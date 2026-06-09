/** 前台即時讀取 Medusa 商品 metadata（含 key_features_by_carrier） */

function parseKeyFeaturesByCarrier(raw) {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.map(String).filter(Boolean) : [],
      ]),
    );
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [
            k,
            Array.isArray(v) ? v.map(String).filter(Boolean) : [],
          ]),
        );
      }
    } catch {
      /* ignore */
    }
  }
  return {};
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const handle = req.query.handle;
  if (!handle || typeof handle !== "string") {
    return res.status(400).json({ error: "handle is required" });
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const params = new URLSearchParams({
    handle,
    fields: "+metadata",
  });

  try {
    const response = await fetch(`${backendUrl}/store/products?${params}`, {
      headers: {
        ...(publishableKey && {
          "x-publishable-api-key": publishableKey,
        }),
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Medusa fetch failed" });
    }

    const data = await response.json();
    const product = data.products?.[0];
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60",
    );
    return res.status(200).json({
      key_features_by_carrier: parseKeyFeaturesByCarrier(
        product.metadata?.key_features_by_carrier,
      ),
      detailed_content: product.metadata?.detailed_content || "",
    });
  } catch (error) {
    console.error("[product-features]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
