#!/bin/sh

# Run Alembic Upgrade
echo "Running Alembic Upgrade"
alembic upgrade head

# Start Uvicorn
echo "Starting Uvicorn Server"
exec uvicorn api.main:app --host 0.0.0.0 --port 8000
