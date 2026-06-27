import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

const MAX_FILES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEOS = ["video/mp4", "video/quicktime", "video/webm"];
const BUCKET = "review-media";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFiles: MAX_FILES,
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "請先登入才能上傳媒體" });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "登入逾時，請重新登入" });
  }

  let fields;
  let files;
  try {
    ({ fields, files } = await parseForm(req));
  } catch (err) {
    return res.status(400).json({ error: `解析檔案失敗: ${err.message}` });
  }

  const productId = String(fields.productId || "").trim();
  if (!productId) {
    return res.status(400).json({ error: "缺少 productId" });
  }

  const fileList = files.files
    ? Array.isArray(files.files)
      ? files.files
      : [files.files]
    : [];

  if (fileList.length === 0) {
    return res.status(400).json({ error: "未選擇任何檔案" });
  }
  if (fileList.length > MAX_FILES) {
    return res.status(400).json({ error: `最多上傳 ${MAX_FILES} 個檔案` });
  }

  for (const file of fileList) {
    const isVideo = ALLOWED_VIDEOS.includes(file.mimetype);
    const isImage = ALLOWED_IMAGES.includes(file.mimetype);
    if (!isVideo && !isImage) {
      return res.status(400).json({
        error: `不支援的檔案格式：${file.originalFilename || "unknown"}`,
      });
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return res.status(400).json({
        error: `圖片「${file.originalFilename}」超過 5 MB 上限`,
      });
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return res.status(400).json({
        error: `影片「${file.originalFilename}」超過 50 MB 上限`,
      });
    }
  }

  const urls = [];
  const currentMonth = new Date().toISOString().slice(0, 7);

  for (const file of fileList) {
    const ext =
      path.extname(file.originalFilename || "") ||
      (ALLOWED_VIDEOS.includes(file.mimetype) ? ".mp4" : ".jpg");
    const storagePath = `${productId}/${currentMonth}/${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    const fileBuffer = fs.readFileSync(file.filepath);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({
        error:
          uploadError.message === "Bucket not found"
            ? "儲存空間尚未建立，請聯繫管理員執行 Supabase migration（review-media）"
            : `上傳失敗: ${uploadError.message}`,
      });
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);
    urls.push(publicUrl);
  }

  return res.status(200).json({ urls });
}
