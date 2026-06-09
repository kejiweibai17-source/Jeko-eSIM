-- ============================================================
-- 部落格評論系統 (blog_reviews + blog_review_media)
-- 請在 Supabase → SQL Editor 執行此檔案
-- ============================================================

-- 1. 評論主表
create table if not exists public.blog_reviews (
  id           uuid primary key default gen_random_uuid(),
  post_slug    text        not null,           -- WordPress 文章 slug
  user_id      uuid        not null references auth.users(id) on delete cascade,
  user_name    text        not null,
  user_avatar  text,                           -- 頭像 URL（來自 Supabase Auth）
  rating       smallint    not null check (rating between 1 and 5),
  content      text        not null check (char_length(content) >= 2),
  likes        integer     not null default 0,
  is_approved  boolean     not null default true,  -- 快速審核開關
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2. 媒體附件表（圖片 / 影片）
create table if not exists public.blog_review_media (
  id           uuid primary key default gen_random_uuid(),
  review_id    uuid        references public.blog_reviews(id) on delete cascade,  -- 上傳時可先為 null，送出評論後綁定
  user_id      uuid        not null references auth.users(id) on delete cascade,
  media_type   text        not null check (media_type in ('image', 'video')),
  storage_path text        not null,           -- Supabase Storage 路徑
  public_url   text        not null,
  file_name    text        not null,
  file_size    bigint      not null,           -- bytes
  created_at   timestamptz not null default now()
);

-- 3. 按讚關聯表（每人每篇評論只能按一次讚）
create table if not exists public.blog_review_likes (
  review_id   uuid not null references public.blog_reviews(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (review_id, user_id)
);

-- 4. 索引
create index if not exists blog_reviews_post_slug_idx on public.blog_reviews(post_slug);
create index if not exists blog_reviews_user_id_idx  on public.blog_reviews(user_id);
create index if not exists blog_review_media_review_idx on public.blog_review_media(review_id);

-- 5. 自動更新 updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_reviews_updated_at on public.blog_reviews;
create trigger blog_reviews_updated_at
  before update on public.blog_reviews
  for each row execute function public.set_updated_at();

-- 6. RLS
alter table public.blog_reviews      enable row level security;
alter table public.blog_review_media enable row level security;
alter table public.blog_review_likes enable row level security;

-- blog_reviews 策略
create policy "公開讀取已審核評論"
  on public.blog_reviews for select
  using (is_approved = true);

create policy "登入者可新增評論"
  on public.blog_reviews for insert
  with check (auth.uid() = user_id);

create policy "只有作者可更新自己評論"
  on public.blog_reviews for update
  using (auth.uid() = user_id);

create policy "只有作者可刪除自己評論"
  on public.blog_reviews for delete
  using (auth.uid() = user_id);

-- blog_review_media 策略
create policy "公開讀取媒體"
  on public.blog_review_media for select
  using (true);

create policy "登入者可新增媒體"
  on public.blog_review_media for insert
  with check (auth.uid() = user_id);

create policy "只有作者可刪除媒體"
  on public.blog_review_media for delete
  using (auth.uid() = user_id);

-- blog_review_likes 策略
create policy "公開讀取按讚"
  on public.blog_review_likes for select
  using (true);

create policy "登入者可按讚"
  on public.blog_review_likes for insert
  with check (auth.uid() = user_id);

create policy "只有自己可退讚"
  on public.blog_review_likes for delete
  using (auth.uid() = user_id);

-- 7. Storage Bucket + 上傳策略
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-review-media',
  'blog-review-media',
  true,
  52428800,
  array['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/quicktime','video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "公開讀取評論媒體檔"
  on storage.objects for select
  using (bucket_id = 'blog-review-media');

create policy "登入者可上傳評論媒體"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-review-media'
    and auth.role() = 'authenticated'
  );

create policy "登入者可刪除自己的評論媒體"
  on storage.objects for delete
  using (
    bucket_id = 'blog-review-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
