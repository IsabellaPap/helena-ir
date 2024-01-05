#!/bin/sh

wait_for_postgres() {
    echo "Waiting for PostgreSQL to become available..."
    while ! nc -z $DB_HOST 5432; do
      sleep 0.1
    done
    echo "PostgreSQL is up - executing command"
}

# Wait for PostgreSQL
wait_for_postgres

# Run Alembic Upgrade
echo "Running Alembic Upgrade"
alembic upgrade head

# Start Uvicorn
echo "Starting Uvicorn Server"
exec uvicorn api.main:app --host 0.0.0.0 --port 8000
