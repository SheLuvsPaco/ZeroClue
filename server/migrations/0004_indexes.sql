-- faster lookups
CREATE INDEX IF NOT EXISTS idx_provision_tokens_valid
ON provision_tokens (expires_at)
WHERE used_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_mls_kp_available
ON mls_keypackages (device_id, created_at)
WHERE used_at IS NULL;

-- enforce identity key length when present
ALTER TABLE devices
  ADD CONSTRAINT ck_identity_key_len CHECK (
    identity_key_pub IS NULL OR octet_length(identity_key_pub) = 32
  );
