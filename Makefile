COMPOSE=$(shell command -v docker-compose >/dev/null 2>&1 && echo docker-compose || echo docker\ compose)

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f db

migrate:
	cd server && DATABASE_URL=$ sqlx migrate run

run:
	cargo run -p server

health:
	curl -s localhost:8080/healthz

ready:
	curl -s -o - -w "\n%{http_code}\n" localhost:8080/readyz
