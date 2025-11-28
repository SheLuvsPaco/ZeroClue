-- Migrate password_hash column from BYTEA (SHA256) to TEXT (bcrypt)
-- This migration will clear existing password hashes (users will need to reset/re-signup)
-- bcrypt hashes are stored as strings, not binary data

-- Clear existing password hashes (they're SHA256, incompatible with bcrypt)
UPDATE users SET password_hash = NULL;

-- Change column type from BYTEA to TEXT
ALTER TABLE users
  ALTER COLUMN password_hash TYPE TEXT
  USING password_hash::TEXT;

-- Note: Existing users will need to re-signup or reset their password
-- This is unavoidable when migrating from SHA256 to bcrypt
