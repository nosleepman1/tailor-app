# Makefile for Tailor App

.PHONY: help up down build rebuild logs backend frontend db shell-backend shell-frontend test migrate seed fresh

help:
	@echo "Tailor App - Docker Compose Commands"
	@echo ""
	@echo "  up        Start all services in detached mode"
	@echo "  down      Stop and remove all containers"
	@echo "  build     Build all services"
	@echo "  rebuild   Rebuild all services (force)"
	@echo "  logs      Follow logs from all services"
	@echo "  backend   View backend logs only"
	@echo "  frontend  View frontend logs only"
	@echo "  db        Open SQLite database shell"
	@echo "  shell-backend   Open bash shell in backend container"
	@echo "  shell-frontend  Open sh shell in frontend container"
	@echo "  test      Run backend tests"
	@echo "  migrate   Run database migrations"
	@echo "  seed      Run database seeders"
	@echo "  fresh     Fresh migrate + seed"
	@echo ""

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

rebuild:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

backend:
	docker-compose logs -f backend

frontend:
	docker-compose logs -f frontend

db:
	docker-compose exec backend sqlite3 /var/www/database/database.sqlite

shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

test:
	docker-compose exec backend php artisan test

migrate:
	docker-compose exec backend php artisan migrate

seed:
	docker-compose exec backend php artisan db:seed

fresh:
	docker-compose exec backend php artisan migrate:fresh --seed