#!/bin/bash
# ZeroChat Database Setup Script

set -e

echo "🚀 ZeroChat Database Setup"
echo "=========================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available.${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Docker is installed${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file${NC}"
        echo -e "${YELLOW}⚠️  Please review .env and update passwords for production!${NC}"
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Stop any existing containers
echo ""
echo -e "${BLUE}Stopping existing containers...${NC}"
docker compose down 2>/dev/null || true

# Start the database
echo ""
echo -e "${BLUE}Starting PostgreSQL and Redis...${NC}"
docker compose up -d db redis

# Wait for database to be ready
echo ""
echo -e "${BLUE}Waiting for database to be ready...${NC}"
max_attempts=30
attempt=0
while ! docker compose exec -T db pg_isready -U zerochat_user -d zerochat &> /dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo -e "${RED}❌ Database failed to start after $max_attempts attempts${NC}"
        docker compose logs db
        exit 1
    fi
    echo -e "${YELLOW}Waiting... ($attempt/$max_attempts)${NC}"
    sleep 2
done

echo -e "${GREEN}✓ Database is ready!${NC}"

# Run migrations
echo ""
echo -e "${BLUE}Running database migrations...${NC}"
if [ -d "server" ]; then
    cd server
    if command -v sqlx &> /dev/null; then
        echo -e "${BLUE}Using sqlx-cli to run migrations...${NC}"
        sqlx migrate run
    else
        echo -e "${YELLOW}⚠️  sqlx-cli not found. Migrations will run when server starts.${NC}"
        echo -e "${BLUE}To install sqlx-cli: cargo install sqlx-cli --no-default-features --features postgres${NC}"
    fi
    cd ..
else
    echo -e "${YELLOW}⚠️  Server directory not found. Migrations will run when server starts.${NC}"
fi

# Show connection info
echo ""
echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo -e "${BLUE}Connection Information:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}PostgreSQL:${NC}"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: zerochat"
echo "  User: zerochat_user"
echo "  Password: zerochat_dev_password_2024"
echo ""
echo -e "${BLUE}Connection URL:${NC}"
echo "  postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat"
echo ""
echo -e "${BLUE}Redis:${NC}"
echo "  Host: localhost"
echo "  Port: 6379"
echo "  URL: redis://localhost:6379"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  Start:   docker compose up -d"
echo "  Stop:    docker compose down"
echo "  Logs:    docker compose logs -f db"
echo "  Shell:   docker compose exec db psql -U zerochat_user -d zerochat"
echo "  Reset:   docker compose down -v  # ⚠️  This deletes all data!"
echo ""
echo -e "${GREEN}🎉 Ready to start developing!${NC}"
