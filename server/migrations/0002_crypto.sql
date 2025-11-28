ALTER TABLE devices
  ADD COLUMN IF NOT EXISTS identity_key_pub BYTEA; -- Ed25519 public key (32 bytes)

CREATE TABLE IF NOT EXISTS mls_keypackages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id  UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  keypackage BYTEA NOT NULL,                       -- opaque MLS KeyPackage bytes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at    TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mls_kp_device  ON mls_keypackages(device_id);
CREATE INDEX IF NOT EXISTS idx_mls_kp_expires ON mls_keypackages(expires_at);
