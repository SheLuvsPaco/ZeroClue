-- index to resolve by (user_id, created_at) fast if you list devices
CREATE INDEX IF NOT EXISTS idx_devices_user_created
  ON devices(user_id, created_at);



