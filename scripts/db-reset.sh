#!/bin/bash
# Reset ZeroChat Database (⚠️ WARNING: This deletes all data!)

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}⚠️  WARNING: DATABASE RESET${NC}"
echo "This will delete ALL data in the database!"
echo ""
read -p "Are you sure? Type 'yes' to continue: " -r
echo

if [[ ! $REPLY =~ ^yes$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo -e "${YELLOW}Stopping containers...${NC}"
docker compose down

echo -e "${YELLOW}Removing volumes...${NC}"
docker compose down -v

echo -e "${GREEN}✓ Database reset complete${NC}"
echo ""
echo "Run './scripts/db-setup.sh' to recreate the database"
