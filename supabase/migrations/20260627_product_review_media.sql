-- 商品評論媒體 Storage（修正 Bucket not found）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-media',
  'review-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do nothing;

-- 公開讀取
create policy "review_media_public_read"
  on storage.objects for select
  using (bucket_id = 'review-media');

-- 已登入用戶可上傳
create policy "review_media_auth_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'review-media'
    and auth.role() = 'authenticated'
  );

-- 已登入用戶可刪除
create policy "review_media_auth_delete"
  on storage.objects for delete
  using (
    bucket_id = 'review-media'
    and auth.role() = 'authenticated'
  );
