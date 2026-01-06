# Docker Setup Guide

This guide explains how to run the Surrogate Escrow Website using Docker Compose.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- At least 4GB of available RAM
- Ports 80, 3000, 5432, and 8000 available

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run migrations and create superuser:**
   ```bash
   # Run migrations
   docker-compose exec backend python manage.py migrate
   
   # Create superuser (optional)
   docker-compose exec backend python manage.py createsuperuser
   ```

3. **Access the application:**
   - Frontend: http://localhost (via Nginx)
   - Frontend (direct): http://localhost:3000
   - Backend API: http://localhost/api
   - Django Admin: http://localhost/admin
   - Backend (direct): http://localhost:8000

## Services

### Backend (Django)
- **Container:** `surrogate_escrow_backend`
- **Port:** 8000
- **Volume mounts:** Hot reload enabled for code changes
- **Database:** SQLite by default (dev), PostgreSQL available

### Frontend (Vite)
- **Container:** `surrogate_escrow_frontend`
- **Port:** 3000
- **Volume mounts:** Hot reload enabled for code changes

### Database (PostgreSQL)
- **Container:** `surrogate_escrow_db`
- **Port:** 5432
- **Note:** Optional - SQLite is used by default in development

### Nginx (Reverse Proxy)
- **Container:** `surrogate_escrow_nginx`
- **Port:** 80
- Routes traffic between frontend and backend

## Common Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Run Django management commands
```bash
docker-compose exec backend python manage.py <command>
```

### Access shell
```bash
# Backend shell
docker-compose exec backend bash

# Database shell (PostgreSQL)
docker-compose exec db psql -U postgres -d surrogate_escrow
```

### Rebuild after dependency changes
```bash
# Rebuild backend
docker-compose build backend

# Rebuild frontend
docker-compose build frontend

# Rebuild all
docker-compose build
```

## Environment Variables

Create a `.env` file in the project root (optional):

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional - SQLite used by default)
USE_POSTGRESQL=False
POSTGRES_DB=surrogate_escrow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## Using PostgreSQL

To use PostgreSQL instead of SQLite:

1. Set `USE_POSTGRESQL=True` in your `.env` file
2. Update `backend/core/settings/dev.py` to use PostgreSQL when `USE_POSTGRESQL=True`
3. Restart services: `docker-compose restart backend`

## Troubleshooting

### Port already in use
If a port is already in use, either:
- Stop the conflicting service
- Change the port mapping in `docker-compose.yml`

### Database connection errors
- Ensure the database service is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs db`
- Verify environment variables are set correctly

### Static files not loading
- Run collectstatic: `docker-compose exec backend python manage.py collectstatic`
- Check nginx logs: `docker-compose logs nginx`

### Frontend not connecting to backend
- Verify CORS settings in Django settings
- Check that `VITE_API_URL` is set correctly in frontend service
- Review nginx configuration

## Development Workflow

1. Make code changes in your local files
2. Changes are automatically reflected (hot reload enabled)
3. For backend changes, restart may be needed: `docker-compose restart backend`
4. For frontend changes, Vite will hot reload automatically

## Production Considerations

For production deployment:
1. Use `core.settings.prod` instead of `core.settings.dev`
2. Set `DEBUG=False`
3. Use PostgreSQL database
4. Configure proper SSL certificates in nginx
5. Set secure `SECRET_KEY`
6. Update `ALLOWED_HOSTS`
7. Use gunicorn instead of runserver (update Dockerfile CMD)

