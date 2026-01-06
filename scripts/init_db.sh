#!/bin/bash
# Database Initialization Script
# This script initializes the database by running migrations and creating a superuser

set -e

echo "========================================="
echo "Database Initialization Script"
echo "========================================="

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Check if virtual environment exists
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
    echo "Error: Virtual environment not found at $PROJECT_ROOT/.venv"
    echo "Please create it first: python3 -m venv .venv"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source "$PROJECT_ROOT/.venv/bin/activate"

# Navigate to backend directory
cd "$BACKEND_DIR"

# Check if .env file exists
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo "Warning: .env file not found. Creating from .env.example..."
    if [ -f "$PROJECT_ROOT/.env.example" ]; then
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
        echo "Please update .env with your settings before continuing."
    else
        echo "Error: .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Run migrations
echo ""
echo "Running migrations..."
python manage.py migrate

# Collect static files (for production)
if [ "$1" == "--production" ]; then
    echo ""
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

# Create superuser if it doesn't exist
echo ""
echo "Checking for superuser..."
if python manage.py shell -c "from user.models import UserAccount; print('Superuser exists' if UserAccount.objects.filter(is_superuser=True).exists() else 'No superuser found')" | grep -q "No superuser found"; then
    echo "No superuser found. Creating one..."
    python scripts/create_superuser.py
else
    echo "Superuser already exists. Skipping creation."
fi

echo ""
echo "========================================="
echo "Database initialization complete!"
echo "========================================="
echo ""
echo "You can now:"
echo "  - Start the development server: ./scripts/start_dev.sh"
echo "  - Create test users: ./scripts/create_test_users.sh"
echo "  - Access Django admin at: http://localhost:8000/admin"

