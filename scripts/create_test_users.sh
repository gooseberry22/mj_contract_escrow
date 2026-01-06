#!/bin/bash
# Create Test Users Script
# Creates sample users for testing (intended parent and surrogate)

set -e

echo "========================================="
echo "Creating Test Users"
echo "========================================="

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

# Run Python script to create test users
python << 'EOF'
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from user.models import UserAccount

# Create intended parent user
parent_email = 'parent@example.com'
if not UserAccount.objects.filter(email=parent_email).exists():
    parent = UserAccount.objects.create_user(
        email=parent_email,
        password='testpass123',
        first_name='John',
        last_name='Doe'
    )
    print(f"✓ Created intended parent: {parent_email} / testpass123")
else:
    print(f"✗ Intended parent already exists: {parent_email}")

# Create surrogate user
surrogate_email = 'surrogate@example.com'
if not UserAccount.objects.filter(email=surrogate_email).exists():
    surrogate = UserAccount.objects.create_user(
        email=surrogate_email,
        password='testpass123',
        first_name='Jane',
        last_name='Smith'
    )
    print(f"✓ Created surrogate: {surrogate_email} / testpass123")
else:
    print(f"✗ Surrogate already exists: {surrogate_email}")

print("\n=========================================")
print("Test users created successfully!")
print("=========================================")
print("\nLogin credentials:")
print(f"  Intended Parent: {parent_email} / testpass123")
print(f"  Surrogate: {surrogate_email} / testpass123")
EOF

