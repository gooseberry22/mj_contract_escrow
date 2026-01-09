#!/usr/bin/env python
"""
Script to create a Django superuser interactively or non-interactively.

Usage:
    # Interactive mode (prompts for input)
    python scripts/create_superuser.py

    # Non-interactive mode (uses environment variables)
    SUPERUSER_EMAIL=admin@example.com SUPERUSER_PASSWORD=secure123 python scripts/create_superuser.py

    # Force update existing superuser
    python scripts/create_superuser.py --update
"""

import os
import sys
import argparse
import getpass
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.dev")
django.setup()

from user.models import UserAccount


def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"
    return True, "Password is valid"


def get_input(prompt, default=None, password=False):
    """Get user input with optional default value"""
    if default:
        prompt_text = f"{prompt} [{default}]: "
    else:
        prompt_text = f"{prompt}: "

    if password:
        value = getpass.getpass(prompt_text)
    else:
        value = input(prompt_text)

    return value.strip() if value.strip() else default


def create_superuser(interactive=True, update_existing=False):
    """Create a superuser interactively or non-interactively"""

    # Get values from environment or use defaults for non-interactive mode
    email = os.getenv("SUPERUSER_EMAIL")
    password = os.getenv("SUPERUSER_PASSWORD")
    first_name = os.getenv("SUPERUSER_FIRST_NAME")
    last_name = os.getenv("SUPERUSER_LAST_NAME")

    # Interactive mode: prompt for values
    if interactive and not all([email, password]):
        print("\n=== Create Django Superuser ===\n")

        # Email
        while True:
            email = get_input("Email address", email or "admin@example.com")
            if email and "@" in email:
                break
            print("Please enter a valid email address.")

        # Check if user exists
        user_exists = UserAccount.objects.filter(email=email).exists()
        if user_exists:
            if not update_existing:
                response = get_input(
                    f"User with email '{email}' already exists. Update to superuser? (y/n)",
                    "n",
                ).lower()
                if response != "y":
                    print("Operation cancelled.")
                    return
            else:
                print(f"Updating existing user '{email}' to superuser...")
        else:
            print(f"Creating new superuser '{email}'...")

        # First name
        first_name = get_input("First name", first_name or "Admin")

        # Last name
        last_name = get_input("Last name", last_name or "User")

        # Password
        while True:
            password = getpass.getpass("Password: ")
            if not password:
                print("Password cannot be empty.")
                continue

            is_valid, message = validate_password(password)
            if is_valid:
                password_confirm = getpass.getpass("Password (again): ")
                if password == password_confirm:
                    break
                else:
                    print("Passwords do not match. Please try again.")
            else:
                print(f"Password validation failed: {message}")
                print("Please choose a stronger password.")

    # Non-interactive mode: use defaults if not provided
    else:
        email = email or "admin@example.com"
        password = password or "admin123"
        first_name = first_name or "Admin"
        last_name = last_name or "User"

        if not password or password == "admin123":
            print(
                "WARNING: Using default password 'admin123'. Please change it immediately!"
            )

    # Check if user exists
    user_exists = UserAccount.objects.filter(email=email).exists()

    if user_exists:
        if update_existing or (
            interactive
            and not all([os.getenv("SUPERUSER_EMAIL"), os.getenv("SUPERUSER_PASSWORD")])
        ):
            # Update existing user to superuser
            user = UserAccount.objects.get(email=email)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            if password:
                user.set_password(password)
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            user.save()
            print(f"\n✓ Superuser updated successfully!")
            print(f"  Email: {email}")
            if password:
                print(f"  Password: {'*' * len(password)}")
        else:
            print(f"Superuser with email '{email}' already exists.")
            print("Use --update flag to update existing user or set UPDATE_EXISTING=1")
            return
    else:
        # Create new superuser
        try:
            UserAccount.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            print(f"\n✓ Superuser created successfully!")
            print(f"  Email: {email}")
            print(f"  First Name: {first_name}")
            print(f"  Last Name: {last_name}")
            if not interactive:
                print(f"  Password: {password}")
        except Exception as e:
            print(f"\n✗ Error creating superuser: {str(e)}")
            sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or update Django superuser")
    parser.add_argument(
        "--update",
        action="store_true",
        help="Update existing user to superuser if they exist",
    )
    parser.add_argument(
        "--non-interactive",
        action="store_true",
        help="Run in non-interactive mode (use environment variables only)",
    )

    args = parser.parse_args()

    # Check if update flag is set via environment variable
    update_existing = args.update or os.getenv("UPDATE_EXISTING", "").lower() in (
        "1",
        "true",
        "yes",
    )
    interactive = not args.non_interactive and not all(
        [os.getenv("SUPERUSER_EMAIL"), os.getenv("SUPERUSER_PASSWORD")]
    )

    create_superuser(interactive=interactive, update_existing=update_existing)
