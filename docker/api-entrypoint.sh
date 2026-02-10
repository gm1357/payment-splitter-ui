#!/bin/sh
set -e

echo "Waiting for database to be ready..."

MAX_ATTEMPTS=30
ATTEMPT=0

until npx prisma migrate deploy 2>&1; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
    echo "ERROR: Failed to run migrations after $MAX_ATTEMPTS attempts"
    exit 1
  fi
  echo "Migration attempt $ATTEMPT/$MAX_ATTEMPTS failed, retrying in 2s..."
  sleep 2
done

echo "Migrations applied successfully. Starting API..."
exec node dist/src/main.js
