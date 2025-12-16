#!/bin/bash
# ZeroChat - Complete Startup Script
# This script starts everything you need to run ZeroChat

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║     ZeroChat - Complete Startup        ║"
echo "╔════════════════════════════════════════╝"
echo -e "${NC}"

# Step 1: Check and start database
echo -e "${BLUE}[1/4] Starting Database...${NC}"
if docker compose ps | grep -q "zerochat-postgres.*Up"; then
    echo -e "${GREEN}✓ Database already running${NC}"
else
    echo "Starting PostgreSQL and Redis..."
    docker compose up -d db redis
    echo "Waiting for database to be ready..."
    sleep 5
fi

# Step 2: Export environment variables
echo -e "${BLUE}[2/4] Setting up environment...${NC}"
export DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat"
export REDIS_URL="redis://localhost:6379"
export RUST_LOG="info,server=debug"
echo -e "${GREEN}✓ Environment configured${NC}"

# Step 3: Start the server (in background)
echo -e "${BLUE}[3/4] Starting Backend Server...${NC}"

# Kill any existing server process
pkill -f "target.*server" 2>/dev/null || true

echo "Building and starting server (this may take a minute)..."
echo -e "${YELLOW}Note: You may see some sqlx warnings - this is normal${NC}"

# Start server in background, redirecting output to log file
# IMPORTANT: Run from server/ directory so paths are correct
cd server
nohup cargo run --release > ../server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ../.server.pid
cd ..

echo -e "${GREEN}✓ Server starting (PID: $SERVER_PID)${NC}"
echo "  Logs: tail -f server.log"

# Wait a moment for server to start
echo "Waiting for server to initialize..."
sleep 3

# Step 4: Instructions for desktop app
echo -e "${BLUE}[4/4] Desktop App${NC}"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗"
echo -e "║  🎉 Backend is starting!               ║"
echo -e "╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}To start the Desktop App:${NC}"
echo ""
echo "  1. Open a NEW terminal window"
echo "  2. Run these commands:"
echo ""
echo -e "${YELLOW}     cd zerochat-desktop"
echo -e "     npm run dev:app${NC}"
echo ""
echo -e "${BLUE}Or use this one-liner:${NC}"
echo -e "${GREEN}     cd zerochat-desktop && npm run dev:app${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Server Status:${NC}"
echo "  URL: http://localhost:8080"
echo "  Logs: tail -f server.log"
echo "  Stop: kill \$(cat .server.pid)"
echo ""
echo -e "${BLUE}Database:${NC}"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"
echo "  Logs: docker compose logs -f db"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Ready to test ZeroChat! 🚀${NC}"
echo ""
