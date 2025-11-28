-- 0006_mvp_chat.sql
-- Device auth columns (idempotent)
ALTER TABLE devices
  ADD COLUMN IF NOT EXISTS auth_token_hash BYTEA,
  ADD COLUMN IF NOT EXISTS token_created_at TIMESTAMPTZ;

-- Friend graph
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','accepted','rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (requester, addressee)
);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee);

-- Message receipts to support ack-after-decrypt
CREATE TABLE IF NOT EXISTS message_receipts (
  message_id UUID PRIMARY KEY REFERENCES messages(id) ON DELETE CASCADE,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


