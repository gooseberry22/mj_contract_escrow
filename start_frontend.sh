#!/bin/bash

# Script to start the frontend development server

echo "Starting frontend development server..."

# Activate virtual environment and start frontend dev server
source .venv/bin/activate && cd frontend && npm run dev
