.PHONY: start stop logs help

help:
	@echo "Available commands:"
	@echo "  make start   - Starts PostgreSQL, backend, and frontend in the background"
	@echo "  make stop    - Stops all running services"
	@echo "  make logs    - Tails the logs for both backend and frontend"

start:
	@echo "Starting PostgreSQL..."
	@docker compose up -d
	@echo "Starting backend..."
	@bash -c 'cd backend && if [ -f .env ]; then set -a; source .env; set +a; fi; ./gradlew bootRun > ../backend.log 2>&1 & echo $$! > ../.backend.pid'
	@echo "Starting frontend..."
	@bash -c 'cd frontend && npm run dev > ../frontend.log 2>&1 & echo $$! > ../.frontend.pid'
	@echo "========================================================="
	@echo "Job Search Manager is starting!"
	@echo "Backend log: backend.log"
	@echo "Frontend log: frontend.log"
	@echo "You can view logs by running: make logs"
	@echo "Access the frontend at: http://localhost:5173"
	@echo "========================================================="

stop:
	@echo "Stopping frontend..."
	@if [ -f .frontend.pid ]; then \
		PID=$$(cat .frontend.pid); \
		kill -TERM $$PID 2>/dev/null || true; \
		pkill -P $$PID 2>/dev/null || true; \
		rm .frontend.pid; \
	fi
	@echo "Stopping backend..."
	@if [ -f .backend.pid ]; then \
		PID=$$(cat .backend.pid); \
		kill -TERM $$PID 2>/dev/null || true; \
		pkill -P $$PID 2>/dev/null || true; \
		rm .backend.pid; \
	fi
	@echo "Stopping PostgreSQL..."
	@docker compose stop
	@echo "Force killing any lingering processes on ports 8080 and 5173..."
	@lsof -i :8080 -t | xargs kill -9 2>/dev/null || true
	@lsof -i :5173 -t | xargs kill -9 2>/dev/null || true
	@echo "All services stopped."

logs:
	tail -f backend.log frontend.log
