#!/bin/bash

# Script to start the Django backend server

echo "Starting Django backend server..."

# Activate virtual environment and start Django server
source .venv/bin/activate && pipenv run python manage.py runserver
