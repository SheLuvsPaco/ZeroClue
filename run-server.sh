#!/bin/bash
# Simple script to run the server with correct environment and working directory

set -e

export DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat"
export REDIS_URL="redis://localhost:6379"
export RUST_LOG="${RUST_LOG:-info,server=debug}"

echo "Starting ZeroChat server..."
echo "Working directory: server/"
echo "Logs: $RUST_LOG"
echo ""

# IMPORTANT: Always run from server/ directory so static file paths work
cd server
cargo run

# Note: If you want to run in release mode, use: cargo run --release
