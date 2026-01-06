#!/bin/bash
# Migration Script
# Runs Django migrations

set -e

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Activate virtual environment
if [ -d "$PROJECT_ROOT/.venv" ]; then
    source "$PROJECT_ROOT/.venv/bin/activate"
else
    echo "Error: Virtual environment not found"
    exit 1
fi

# Navigate to backend directory
cd "$BACKEND_DIR"

# Check for command line arguments
if [ "$1" == "--makemigrations" ]; then
    echo "Creating new migrations..."
    python manage.py makemigrations
elif [ "$1" == "--show" ]; then
    echo "Showing migration status..."
    python manage.py showmigrations
else
    echo "Running migrations..."
    python manage.py migrate
    echo ""
    echo "Migration complete!"
fi

