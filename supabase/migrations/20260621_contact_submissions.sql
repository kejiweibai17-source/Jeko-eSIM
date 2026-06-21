-- 聯絡表單提交紀錄
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('general', 'partner', 'refund')),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  order_id TEXT,
  partner_type TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  image_urls JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'resolved', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_type ON contact_submissions(type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
