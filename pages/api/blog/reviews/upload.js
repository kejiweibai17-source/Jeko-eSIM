import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

// 上傳限制
const MAX_IMAGES = 4;
const MAX_VIDEOS = 1;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;  // 50 MB
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEOS = ["video/mp4", "video/quicktime", "video/webm"];

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFiles: MAX_IMAGES + MAX_VIDEOS,
      maxFileSize: MAX_VIDEO_BYTES,
      multiples: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "請先登入才能上傳媒體" });
  }
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "登入逾時" });

  let fields, files;
  try {
    ({ fields, files } = await parseForm(req));
  } catch (err) {
    return res.status(400).json({ error: `解析檔案失敗: ${err.message}` });
  }

  const fileList = files.files
    ? Array.isArray(files.files) ? files.files : [files.files]
    : [];

  if (fileList.length === 0) return res.status(400).json({ error: "未選擇任何檔案" });

  const images = fileList.filter((f) => ALLOWED_IMAGES.includes(f.mimetype));
  const videos = fileList.filter((f) => ALLOWED_VIDEOS.includes(f.mimetype));
  const invalid = fileList.filter(
    (f) => !ALLOWED_IMAGES.includes(f.mimetype) && !ALLOWED_VIDEOS.includes(f.mimetype),
  );

  if (invalid.length > 0) {
    return res.status(400).json({ error: `不支援的檔案格式：${invalid.map((f) => f.originalFilename).join(", ")}` });
  }
  if (images.length > MAX_IMAGES) {
    return res.status(400).json({ error: `圖片最多 ${MAX_IMAGES} 張` });
  }
  if (videos.length > MAX_VIDEOS) {
    return res.status(400).json({ error: `影片最多 ${MAX_VIDEOS} 個` });
  }
  for (const img of images) {
    if (img.size > MAX_IMAGE_BYTES) {
      return res.status(400).json({ error: `圖片「${img.originalFilename}」超過 5 MB 上限` });
    }
  }
  for (const vid of videos) {
    if (vid.size > MAX_VIDEO_BYTES) {
      return res.status(400).json({ error: `影片「${vid.originalFilename}」超過 50 MB 上限` });
    }
  }

  const uploaded = [];

  for (const file of fileList) {
    const isVideo = ALLOWED_VIDEOS.includes(file.mimetype);
    const mediaType = isVideo ? "video" : "image";
    const ext = path.extname(file.originalFilename || "file") || (isVideo ? ".mp4" : ".jpg");
    const storagePath = `reviews/${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;

    const fileBuffer = fs.readFileSync(file.filepath);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("blog-review-media")
      .upload(storagePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: `上傳失敗: ${uploadError.message}` });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("blog-review-media")
      .getPublicUrl(storagePath);

    // 先暫存到 DB（review_id 留空，等評論送出後再綁定）
    const { data: mediaRow, error: dbError } = await supabaseAdmin
      .from("blog_review_media")
      .insert({
        review_id: null,
        user_id: user.id,
        media_type: mediaType,
        storage_path: storagePath,
        public_url: publicUrl,
        file_name: file.originalFilename || "file",
        file_size: file.size,
      })
      .select("id, media_type, public_url, file_name")
      .single();

    if (dbError) return res.status(500).json({ error: dbError.message });
    uploaded.push(mediaRow);
  }

  return res.status(200).json(uploaded);
}
