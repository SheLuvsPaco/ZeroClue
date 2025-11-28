-- Add inviter_username to provision_tokens for auto-friending
ALTER TABLE provision_tokens
ADD COLUMN IF NOT EXISTS inviter_username TEXT;

CREATE INDEX IF NOT EXISTS idx_provision_tokens_inviter ON provision_tokens(inviter_username);


