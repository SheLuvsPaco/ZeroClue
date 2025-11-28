-- Add password hash column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash BYTEA;

-- Create index for faster username lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);


