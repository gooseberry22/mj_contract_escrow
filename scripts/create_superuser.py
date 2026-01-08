#!/usr/bin/env python
"""
Script to create a Django superuser non-interactively.
Usage: python scripts/create_superuser.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from user.models import UserAccount

def create_superuser():
    """Create a superuser if one doesn't exist"""
    email = os.getenv('SUPERUSER_EMAIL', 'admin@example.com')
    password = os.getenv('SUPERUSER_PASSWORD', 'admin123')
    first_name = os.getenv('SUPERUSER_FIRST_NAME', 'Admin')
    last_name = os.getenv('SUPERUSER_LAST_NAME', 'User')
    
    if UserAccount.objects.filter(email=email).exists():
        print(f"Superuser with email '{email}' already exists.")
        return
    
    UserAccount.objects.create_superuser(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    print(f"Superuser created successfully!")
    print(f"Email: {email}")
    print(f"Password: {password}")

if __name__ == '__main__':
    create_superuser()


