# ZeroChat Database Setup Guide

Complete guide for setting up and managing the ZeroChat PostgreSQL database.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (for version control)

### One-Command Setup
```bash
./scripts/db-setup.sh
```

This script will:
1. Check Docker installation
2. Create `.env` from `.env.example` (if needed)
3. Start PostgreSQL and Redis containers
4. Wait for database to be ready
5. Run migrations (if sqlx-cli is installed)

---

## 📋 Detailed Setup

### Step 1: Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your preferred settings:
```bash
# Database credentials
POSTGRES_USER=zerochat_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=zerochat

# Connection URL (update password to match above)
DATABASE_URL=postgresql://zerochat_user:your_secure_password_here@localhost:5432/zerochat
```

**⚠️ IMPORTANT:** For production, use strong passwords (32+ characters)!

### Step 2: Start Database

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on port `5432`
- **Redis 7** on port `6379`
- **MinIO** (optional) on ports `9000` and `9001`

### Step 3: Verify Database is Running

```bash
docker compose ps
```

Check health:
```bash
docker compose exec db pg_isready -U zerochat_user -d zerochat
```

### Step 4: Run Migrations

**Option A: Using sqlx-cli (recommended)**
```bash
# Install sqlx-cli if you haven't already
cargo install sqlx-cli --no-default-features --features postgres

# Run migrations
cd server
sqlx migrate run
```

**Option B: Migrations run automatically**
When you start the server, migrations run automatically via sqlx::migrate!

---

## 🛠️ Database Management

### Connect to Database

**Using psql (CLI):**
```bash
docker compose exec db psql -U zerochat_user -d zerochat
```

**Using environment variables:**
```bash
psql $DATABASE_URL
```

**Connection details:**
- Host: `localhost`
- Port: `5432`
- Database: `zerochat`
- Username: `zerochat_user`
- Password: (from your `.env` file)

### Useful SQL Commands

```sql
-- List all tables
\dt

-- Describe a table
\d users
\d provision_tokens

-- View all users
SELECT id, username, created_at FROM users;

-- View provision tokens
SELECT
    id,
    user_id,
    purpose,
    inviter_username,
    expires_at,
    used_at
FROM provision_tokens
ORDER BY created_at DESC
LIMIT 10;

-- Check friendships
SELECT
    f.id,
    u1.username as requester,
    u2.username as addressee,
    f.status,
    f.created_at
FROM friendships f
JOIN users u1 ON f.requester = u1.id
JOIN users u2 ON f.addressee = u2.id
ORDER BY f.created_at DESC;

-- Exit psql
\q
```

### Backup Database

Create a backup:
```bash
./scripts/db-backup.sh
```

Backups are stored in `backups/` directory with timestamp.

**Restore from backup:**
```bash
gunzip backups/zerochat_backup_TIMESTAMP.sql.gz
docker compose exec -T db psql -U zerochat_user -d zerochat < backups/zerochat_backup_TIMESTAMP.sql
```

### Reset Database

**⚠️ WARNING: This deletes ALL data!**

```bash
./scripts/db-reset.sh
```

Then re-run setup:
```bash
./scripts/db-setup.sh
```

---

## 📊 Database Schema

### Core Tables

#### `users`
Stores user accounts.
```sql
- id: UUID (primary key)
- username: TEXT (unique, 3-24 chars)
- password_hash: BYTEA (Argon2id hash)
- created_at: TIMESTAMPTZ
```

#### `devices`
User devices (one user can have multiple devices).
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key → users)
- platform: TEXT ('desktop', 'android')
- push_token: TEXT (nullable)
- auth_token_hash: BYTEA (SHA256 of device auth token)
- token_created_at: TIMESTAMPTZ
- identity_key_pub: BYTEA (Ed25519 public key)
- revoked_at: TIMESTAMPTZ (nullable)
- created_at: TIMESTAMPTZ
```

#### `provision_tokens`
Temporary tokens for device provisioning and invites.
```sql
- id: UUID (primary key)
- user_id: UUID (nullable, foreign key → users)
- purpose: TEXT ('install' or 'invite')
- token_hash: BYTEA (SHA256 hash)
- expires_at: TIMESTAMPTZ
- used_at: TIMESTAMPTZ (nullable)
- inviter_username: TEXT (nullable, for auto-friending)
```

**Note:** For invite tokens, `user_id` is NULL until user signs up.

#### `friendships`
Friend relationships between users.
```sql
- id: UUID (primary key)
- requester: UUID (foreign key → users)
- addressee: UUID (foreign key → users)
- status: TEXT ('pending', 'accepted', 'rejected')
- created_at: TIMESTAMPTZ
- UNIQUE(requester, addressee)
```

#### `messages`
Encrypted messages queued for delivery.
```sql
- id: UUID (primary key)
- to_device_id: UUID (foreign key → devices)
- ciphertext: BYTEA (HPKE encrypted)
- created_at: TIMESTAMPTZ
- expires_at: TIMESTAMPTZ (nullable)
```

### Migrations

Migrations are located in `server/migrations/`:

| File | Description |
|------|-------------|
| `0001_init.sql` | Initial schema (users, devices, tokens, messages) |
| `0002_crypto.sql` | Crypto key storage tables |
| `0003_device_auth.sql` | Device authentication columns |
| `0004_indexes.sql` | Performance indexes |
| `0005_dev_index.sql` | Development indexes |
| `0006_mvp_chat.sql` | Chat functionality (friendships, etc.) |
| `0007_add_password.sql` | Password hash column |
| `0008_add_inviter_to_tokens.sql` | Inviter tracking for auto-friend |
| `0009_nullable_user_for_invites.sql` | ✨ **NEW:** Allow NULL user_id for invite tokens |

---

## 🔒 Security Best Practices

### Development
✅ Default credentials are fine for local development
✅ Database is only accessible on localhost
✅ All passwords are hashed with Argon2id

### Production
⚠️ **CRITICAL CHANGES NEEDED:**

1. **Strong Database Password**
   ```bash
   # Generate a strong password
   openssl rand -base64 32
   ```
   Update in `.env`:
   ```
   POSTGRES_PASSWORD=<generated-strong-password>
   DATABASE_URL=postgresql://zerochat_user:<generated-strong-password>@localhost:5432/zerochat
   ```

2. **Firewall Rules**
   - Only allow server to connect to database
   - Block external access to port 5432

3. **SSL/TLS**
   - Enable SSL for database connections
   - Use SSL certificates

4. **Regular Backups**
   ```bash
   # Set up automated daily backups
   crontab -e
   # Add: 0 2 * * * /path/to/scripts/db-backup.sh
   ```

5. **Environment Variables**
   - Never commit `.env` to git
   - Use secrets management (AWS Secrets Manager, HashiCorp Vault)

---

## 🧪 Testing Database Setup

### 1. Check if database is running:
```bash
docker compose ps
```

### 2. Test connection:
```bash
docker compose exec db psql -U zerochat_user -d zerochat -c "SELECT version();"
```

### 3. Check tables exist:
```bash
docker compose exec db psql -U zerochat_user -d zerochat -c "\dt"
```

### 4. Verify extensions:
```bash
docker compose exec db psql -U zerochat_user -d zerochat -c "\dx"
```
Should show `pgcrypto` extension.

---

## 🐛 Troubleshooting

### Database won't start
```bash
# Check logs
docker compose logs db

# Common issues:
# 1. Port 5432 already in use
sudo lsof -i :5432
# Kill existing postgres or change port in docker-compose.yml

# 2. Corrupted data
docker compose down -v  # ⚠️ Deletes all data
docker compose up -d
```

### Can't connect to database
```bash
# Check if container is running
docker compose ps

# Check network
docker compose exec db pg_isready -U zerochat_user -d zerochat

# Verify credentials in .env match docker-compose.yml
```

### Migrations fail
```bash
# Check migration files
ls -la server/migrations/

# Run manually with verbose output
cd server
sqlx migrate run --source ./migrations

# If still failing, check DATABASE_URL
echo $DATABASE_URL
```

### "relation does not exist" error
```bash
# Migrations haven't run yet
cd server
sqlx migrate run

# Or reset and re-run
./scripts/db-reset.sh
./scripts/db-setup.sh
```

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQLx Documentation](https://docs.rs/sqlx/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## 🎯 Quick Reference

### Start/Stop
```bash
docker compose up -d      # Start all services
docker compose down       # Stop all services
docker compose restart    # Restart all services
```

### Logs
```bash
docker compose logs -f db       # Follow database logs
docker compose logs -f redis    # Follow Redis logs
docker compose logs --tail=100  # Last 100 lines
```

### Database Shell
```bash
docker compose exec db psql -U zerochat_user -d zerochat
```

### Check Status
```bash
docker compose ps
docker compose top
```

### Resource Usage
```bash
docker stats zerochat-postgres
```

---

## ✅ Success Checklist

After setup, verify:
- [ ] Docker containers are running (`docker compose ps`)
- [ ] Database accepts connections (use psql)
- [ ] Migrations have run (check tables with `\dt`)
- [ ] Redis is accessible (`redis-cli ping`)
- [ ] `.env` file exists with correct credentials
- [ ] Server can connect (start the server and check logs)

**You're all set! 🎉**
