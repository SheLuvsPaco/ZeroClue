-- Allow provision_tokens.user_id to be NULL for invite tokens
-- This enables creating invite tokens before the user account exists
ALTER TABLE provision_tokens
  ALTER COLUMN user_id DROP NOT NULL;

-- Add check constraint: user_id must be set if purpose is 'install' (not 'invite')
-- This ensures regular provision tokens still have a user_id
ALTER TABLE provision_tokens
  ADD CONSTRAINT provision_tokens_user_id_check
  CHECK (
    (purpose = 'invite' AND user_id IS NULL) OR
    (purpose != 'invite' AND user_id IS NOT NULL) OR
    (purpose = 'invite' AND user_id IS NOT NULL)
  );
