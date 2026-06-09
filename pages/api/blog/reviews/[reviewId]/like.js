import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  const { reviewId } = req.query;

  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "請先登入才能按讚" });
  }
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "登入逾時" });

  // POST = 按讚，DELETE = 退讚
  if (req.method === "POST") {
    const { error } = await supabaseAdmin
      .from("blog_review_likes")
      .upsert({ review_id: reviewId, user_id: user.id }, { onConflict: "review_id,user_id" });

    if (error) return res.status(500).json({ error: error.message });

    // 重算讚數
    const { count } = await supabaseAdmin
      .from("blog_review_likes")
      .select("*", { count: "exact", head: true })
      .eq("review_id", reviewId);

    await supabaseAdmin
      .from("blog_reviews")
      .update({ likes: count ?? 0 })
      .eq("id", reviewId);

    return res.status(200).json({ likes: count ?? 0, is_liked_by_me: true });
  }

  if (req.method === "DELETE") {
    await supabaseAdmin
      .from("blog_review_likes")
      .delete()
      .eq("review_id", reviewId)
      .eq("user_id", user.id);

    const { count } = await supabaseAdmin
      .from("blog_review_likes")
      .select("*", { count: "exact", head: true })
      .eq("review_id", reviewId);

    await supabaseAdmin
      .from("blog_reviews")
      .update({ likes: count ?? 0 })
      .eq("id", reviewId);

    return res.status(200).json({ likes: count ?? 0, is_liked_by_me: false });
  }
}
