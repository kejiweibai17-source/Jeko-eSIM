import { fetchWpPosts } from "../../../lib/wordpress";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const perPage = Number(req.query.per_page) || 100;
    const posts = await fetchWpPosts({ per_page: perPage, embed: true });
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(posts);
  } catch (error) {
    console.error("[api/wordpress/posts]", error);
    return res.status(500).json({ error: error.message || "Failed to fetch posts" });
  }
}
