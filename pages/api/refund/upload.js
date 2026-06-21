import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { requireCustomerEmail } from "../../../lib/refundAuth";
import { MAX_REFUND_IMAGES, MAX_IMAGE_BYTES } from "../../../lib/refundPolicy";

export const config = { api: { bodyParser: false } };

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFiles: MAX_REFUND_IMAGES,
      maxFileSize: MAX_IMAGE_BYTES,
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

  const userEmail = await requireCustomerEmail(req, res);
  if (!userEmail) {
    return res.status(401).json({ error: "請先登入" });
  }

  let files;
  try {
    ({ files } = await parseForm(req));
  } catch (err) {
    return res.status(400).json({ error: `解析檔案失敗: ${err.message}` });
  }

  const fileList = files.files
    ? Array.isArray(files.files)
      ? files.files
      : [files.files]
    : [];

  if (fileList.length === 0) {
    return res.status(400).json({ error: "請至少上傳 1 張截圖" });
  }
  if (fileList.length > MAX_REFUND_IMAGES) {
    return res.status(400).json({ error: `最多 ${MAX_REFUND_IMAGES} 張圖片` });
  }

  for (const file of fileList) {
    if (!ALLOWED_IMAGES.includes(file.mimetype)) {
      return res.status(400).json({
        error: `不支援的格式：${file.originalFilename}（僅 JPG、PNG、WebP）`,
      });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return res.status(400).json({
        error: `「${file.originalFilename}」超過 5 MB 上限`,
      });
    }
  }

  const uploaded = [];
  const safeEmail = userEmail.replace(/[^a-zA-Z0-9@._-]/g, "_");

  for (const file of fileList) {
    const ext = path.extname(file.originalFilename || "file") || ".jpg";
    const storagePath = `${safeEmail}/${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    const fileBuffer = fs.readFileSync(file.filepath);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("refund-evidence")
      .upload(storagePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: `上傳失敗: ${uploadError.message}` });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("refund-evidence")
      .getPublicUrl(storagePath);

    uploaded.push({
      path: storagePath,
      url: urlData?.publicUrl || storagePath,
      name: file.originalFilename || "screenshot",
    });
  }

  return res.status(200).json({ files: uploaded });
}
