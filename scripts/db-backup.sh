#!/bin/bash
# Backup ZeroChat Database

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Create backups directory
mkdir -p backups

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/zerochat_backup_${TIMESTAMP}.sql"

echo -e "${BLUE}Creating database backup...${NC}"

# Create backup
docker compose exec -T db pg_dump -U zerochat_user -d zerochat > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    # Compress backup
    gzip "$BACKUP_FILE"
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)

    echo -e "${GREEN}✓ Backup created successfully!${NC}"
    echo "  File: ${BACKUP_FILE}.gz"
    echo "  Size: $BACKUP_SIZE"
    echo ""
    echo -e "${BLUE}To restore this backup:${NC}"
    echo "  gunzip ${BACKUP_FILE}.gz"
    echo "  docker compose exec -T db psql -U zerochat_user -d zerochat < $BACKUP_FILE"
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi
