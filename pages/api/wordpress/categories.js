import { fetchWpCategories } from "../../../lib/wordpress";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const categories = await fetchWpCategories();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(categories);
  } catch (error) {
    console.error("[api/wordpress/categories]", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch categories" });
  }
}
