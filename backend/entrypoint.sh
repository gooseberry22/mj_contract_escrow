#!/bin/bash
set -e

# Wait for database to be ready (if using PostgreSQL)
if [ "$USE_POSTGRESQL" = "True" ] || [ "$DJANGO_SETTINGS_MODULE" = "core.settings.prod" ]; then
  if [ -n "$POSTGRES_HOST" ]; then
    echo "Waiting for PostgreSQL..."
    while ! nc -z "$POSTGRES_HOST" "${POSTGRES_PORT:-5432}"; do
      sleep 0.1
    done
    echo "PostgreSQL started"
  fi
fi

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files (for production)
if [ "$DJANGO_SETTINGS_MODULE" = "core.settings.prod" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput
  echo "Static files collected"
fi

# Execute the command passed to the container
exec "$@"

