#!/bin/bash

# Parent script to start all services (frontend and backend)

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Starting all development services..."
echo "=========================================="
echo ""

# Check if .venv exists
if [ ! -d ".venv" ]; then
    echo "✗ Error: .venv directory not found"
    echo "Please create a virtual environment first"
    exit 1
fi

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "=========================================="
    echo "Stopping all services..."
    echo "=========================================="
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID $BACKEND_PID 2>/dev/null
    echo "All services stopped"
    exit 0
}

# Trap Ctrl+C and call cleanup function
trap cleanup SIGINT SIGTERM

# Start frontend in background
echo "Starting frontend development server..."
source .venv/bin/activate && cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to initialize
sleep 2

# Start backend in background
echo "Starting Django backend server..."
source .venv/bin/activate && pipenv run python manage.py runserver &
BACKEND_PID=$!

echo ""
echo "=========================================="
echo "All services started!"
echo "=========================================="
echo "Frontend PID: $FRONTEND_PID"
echo "Backend PID: $BACKEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=========================================="

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
