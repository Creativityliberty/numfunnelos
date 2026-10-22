.PHONY: init up build down logs test ps health clean

init:
	python3 scripts/init_env.py

up:
	docker compose up --build -d

build:
	docker compose build

down:
	docker compose down

logs:
	docker compose logs -f app

ps:
	docker compose ps

test:
	docker compose exec app python -m pytest -q tests

health:
	curl --fail --silent --show-error http://127.0.0.1:8080/api/health

clean:
	@echo 'This target intentionally does not delete the PostgreSQL volume.'
	@echo 'For an explicit destructive reset: docker compose down -v'
