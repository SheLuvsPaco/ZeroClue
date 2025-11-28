#!/usr/bin/env bash
set -euo pipefail

# --- config ---
APP_NAME="ZeroClue"
DB_PORT_HOST="${DB_PORT_HOST:-55432}"   # avoid conflicts with local Postgres
SERVE_PORT="${SERVE_PORT:-8080}"

# --- helpers ---
have() { command -v "$1" >/dev/null 2>&1; }
compose() {
  if have docker-compose; then docker-compose "$@"; else docker compose "$@"; fi
}

echo ">> Checking prerequisites"
have docker || { echo "Docker is required."; exit 1; }
have cargo  || { echo "Rust/Cargo required (rustup)."; exit 1; }

echo ">> Initializing workspace"
git init >/dev/null 2>&1 || true
cargo new --vcs none server
cargo new --vcs none core --lib
cargo new --vcs none proto --lib
cargo new --vcs none tooling --lib

cat > Cargo.toml <<'EOF'
[workspace]
members = ["server","core","proto","tooling"]
resolver = "2"
EOF

echo ">> Writing server Cargo.toml"
cat > server/Cargo.toml <<'EOF'
[package]
name = "server"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["rt-multi-thread","macros"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["fmt","env-filter"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
dotenvy = "0.15"
anyhow = "1"
thiserror = "1"
sqlx = { version = "0.7", features = ["runtime-tokio-rustls","postgres","uuid","time","migrate"] }
uuid = { version = "1", features = ["v4","serde"] }
time = { version = "0.3", features = ["macros","serde"] }
EOF

echo ">> Writing server main.rs"
mkdir -p server/src
cat > server/src/main.rs <<'EOF'
use axum::{extract::State, routing::get, Router};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use sqlx::{Pool, Postgres};

#[derive(Clone)]
struct AppState { db: Pool<Postgres> }

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "server=info,axum=warn,sqlx=warn".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url = std::env::var("DATABASE_URL")?;
    let db = sqlx::postgres::PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(std::time::Duration::from_secs(10))
        .connect(&database_url)
        .await?;

    let state = AppState { db };
    let app = Router::new()
        .route("/healthz", get(|| async { "ok" }))
        .route("/readyz", get(readyz))
        .with_state(state);

    let addr: SocketAddr = std::env::var("BIND_ADDR")
        .unwrap_or_else(|_| "0.0.0.0:8080".into())
        .parse()?;
    tracing::info!("listening on {}", addr);
    axum::serve(tokio::net::TcpListener::bind(addr).await?, app).await?;
    Ok(())
}

async fn readyz(State(state): State<AppState>) -> &'static str {
    let _ = sqlx::query_scalar::<_, i32>("SELECT 1").fetch_one(&state.db).await.unwrap();
    "ready"
}
EOF

echo ">> Writing docker-compose.yml (Postgres:${DB_PORT_HOST}, Redis, MinIO)"
cat > docker-compose.yml <<EOF
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: appdb
    ports: ["${DB_PORT_HOST}:5432"]
    volumes: [dbdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL","pg_isready -U app -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 30

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: ["redis-server","--appendonly","yes"]
    volumes: [redisdata:/data]

  minio:
    image: minio/minio:latest
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio12345
    command: server /data --console-address ":9001"
    ports: ["9000:9000","9001:9001"]
    volumes: [miniodata:/data]

volumes:
  dbdata: {}
  redisdata: {}
  miniodata: {}
EOF

echo ">> Writing .env"
cat > .env <<EOF
RUST_LOG=server=info
BIND_ADDR=0.0.0.0:${SERVE_PORT}
DATABASE_URL=postgres://app:app@127.0.0.1:${DB_PORT_HOST}/appdb
REDIS_URL=redis://127.0.0.1:6379
S3_ENDPOINT=http://127.0.0.1:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio12345
S3_BUCKET=attachments
EOF

echo ">> Writing migrations"
mkdir -p server/migrations
cat > server/migrations/0001_init.sql <<'EOF'
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS devices (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform   TEXT NOT NULL,
  push_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS provision_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose    TEXT NOT NULL,
  token_hash BYTEA NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  ciphertext   BYTEA NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_devices_user     ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_device  ON messages(to_device_id);
CREATE INDEX IF NOT EXISTS idx_messages_expires ON messages(expires_at);
EOF

echo ">> Writing Makefile (handy targets)"
cat > Makefile <<EOF
COMPOSE=\$(shell command -v docker-compose >/dev/null 2>&1 && echo docker-compose || echo docker\ compose)

up:
	\$(COMPOSE) up -d

down:
	\$(COMPOSE) down -v

logs:
	\$(COMPOSE) logs -f db

migrate:
	cd server && DATABASE_URL=\$$(grep DATABASE_URL ../.env | cut -d= -f2-) sqlx migrate run

run:
	cargo run -p server

health:
	curl -s localhost:${SERVE_PORT}/healthz

ready:
	curl -s -o - -w "\\n%{http_code}\\n" localhost:${SERVE_PORT}/readyz
EOF

echo ">> Creating .gitignore"
cat > .gitignore <<'EOF'
target/
.env
.DS_Store
.vscode/
.idea/
*.log
EOF

echo ">> Bringing up infra"
compose up -d

echo ">> Installing sqlx-cli if missing"
have sqlx || cargo install sqlx-cli --no-default-features --features rustls,postgres

echo ">> Running migrations"
( cd server && DATABASE_URL="$(grep DATABASE_URL ../.env | cut -d= -f2-)" sqlx migrate run )

echo ">> Building & starting server (you can stop with Ctrl-C)"
cargo run -p server
