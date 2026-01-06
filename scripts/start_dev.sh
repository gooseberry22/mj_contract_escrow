#!/bin/bash
# Development Server Startup Script
# Starts both frontend and backend development servers

set -e

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "========================================="
echo "Starting Development Servers"
echo "========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
    echo "Error: Virtual environment not found"
    echo "Please run: python3 -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend server
echo "Starting Django backend server..."
cd "$PROJECT_ROOT"
source .venv/bin/activate
cd backend
python manage.py runserver &
BACKEND_PID=$!
echo "Backend server started (PID: $BACKEND_PID)"
echo "  → http://localhost:8000"
echo "  → http://localhost:8000/admin"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "Starting Vite frontend server..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started (PID: $FRONTEND_PID)"
echo "  → http://localhost:3000"
echo ""

echo "========================================="
echo "Development servers are running!"
echo "========================================="
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

