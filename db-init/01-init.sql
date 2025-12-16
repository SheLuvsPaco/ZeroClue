-- ZeroChat Database Initialization Script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Grant permissions to the zerochat_user
GRANT ALL PRIVILEGES ON DATABASE zerochat TO zerochat_user;

-- Create schema version tracking table (optional, but useful)
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    description TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'ZeroChat database initialized successfully';
END $$;
