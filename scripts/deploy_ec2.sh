#!/bin/bash
# EC2 Deployment Script
# This script helps deploy the application to an EC2 instance

set -e

echo "========================================="
echo "EC2 Deployment Helper Script"
echo "========================================="
echo ""

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "Error: .env.prod file not found!"
    echo "Please create .env.prod with production environment variables."
    echo ""
    echo "Required variables:"
    echo "  - SECRET_KEY"
    echo "  - DEBUG=False"
    echo "  - ALLOWED_HOSTS"
    echo "  - POSTGRES_DB"
    echo "  - POSTGRES_USER"
    echo "  - POSTGRES_PASSWORD"
    echo "  - CORS_ALLOWED_ORIGINS"
    exit 1
fi

# Check if frontend is built
if [ ! -d "frontend/dist" ]; then
    echo "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
    echo "Frontend built successfully"
fi

# Build production images
echo ""
echo "Building production Docker images..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod build

# Run migrations
echo ""
echo "Running database migrations..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod run --rm backend python manage.py migrate --noinput

# Collect static files
echo ""
echo "Collecting static files..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod run --rm backend python manage.py collectstatic --noinput

# Start services
echo ""
echo "Starting production services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Wait for services to be healthy
echo ""
echo "Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "Service status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "========================================="
echo "Deployment complete!"
echo "========================================="
echo ""
echo "View logs with:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Check service health:"
echo "  docker-compose -f docker-compose.prod.yml ps"
echo ""



