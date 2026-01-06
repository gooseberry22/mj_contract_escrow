# Surrogate Escrow Website

A full-stack application for managing surrogate escrow services, built with React (Vite) frontend and Django REST Framework backend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Development Scripts](#development-scripts)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Docker** and Docker Compose (optional, for containerized setup)
- **Git**

## Quick Start

### Option 1: Frontend Only (Quick)

```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:3000

### Option 2: Full Stack (Recommended)

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your settings

# 2. Initialize database
./scripts/init_db.sh

# 3. Start development servers
./scripts/start_dev.sh
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

### Option 3: Docker (Easiest)

```bash
# Build and start all services
docker-compose up --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

Access:
- Frontend: http://localhost (via Nginx)
- Backend API: http://localhost/api
- Django Admin: http://localhost/admin

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "surrogate escrow website"
```

### 2. Set Up Python Environment

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

### 3. Set Up Frontend

```bash
cd frontend
npm install
```

### 4. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
# Generate a secret key:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 5. Initialize Database

```bash
# Run migrations
./scripts/migrate.sh

# Or use the full initialization script
./scripts/init_db.sh
```

## Running Locally

### Without Docker

#### Start Backend Only

```bash
source .venv/bin/activate
cd backend
python manage.py runserver
```

Backend available at: http://localhost:8000

#### Start Frontend Only

```bash
cd frontend
npm run dev
```

Frontend available at: http://localhost:3000

#### Start Both (Recommended)

```bash
./scripts/start_dev.sh
```

This starts both servers simultaneously.

### With Docker

See [Docker Setup](#docker-setup) section below.

## Docker Setup

For detailed Docker instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

### Quick Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

## Environment Variables

For detailed environment configuration, see [ENV_SETUP.md](./ENV_SETUP.md).

### Required Variables

- `SECRET_KEY` - Django secret key (generate a new one for production)
- `DEBUG` - Set to `True` for development, `False` for production
- `ALLOWED_HOSTS` - Comma-separated list of allowed hostnames

### Database Configuration

**SQLite (Default for Development):**
```env
USE_POSTGRESQL=False
```

**PostgreSQL (Production):**
```env
USE_POSTGRESQL=True
DB_NAME=surrogate_escrow
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### CORS Settings

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signup/` - User registration
- `POST /api/auth/token/` - Obtain JWT token (login)
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `POST /api/auth/logout/` - Logout (blacklist token)
- `GET /api/auth/profile/` - Get current user profile
- `PUT /api/auth/profile/update/` - Update profile
- `POST /api/auth/password/change/` - Change password
- `GET /api/auth/users/` - List users
- `GET /api/auth/users/<id>/` - Get user details

### Contract Endpoints

- `GET /api/contracts/contracts/` - List contracts
- `POST /api/contracts/contracts/` - Create contract
- `GET /api/contracts/contracts/<id>/` - Get contract details
- `PUT /api/contracts/contracts/<id>/` - Update contract
- `DELETE /api/contracts/contracts/<id>/` - Delete contract
- `POST /api/contracts/contracts/<id>/upload_document/` - Upload document
- `PATCH /api/contracts/contracts/<id>/update_status/` - Update status

### Payment Endpoints

- `GET /api/payments/payments/` - List payments
- `POST /api/payments/payments/` - Create payment
- `GET /api/payments/payments/<id>/` - Get payment details
- `PATCH /api/payments/payments/<id>/update_status/` - Update payment status
- `GET /api/payments/escrow/` - List escrow accounts
- `POST /api/payments/escrow/<id>/deposit/` - Deposit funds
- `POST /api/payments/escrow/<id>/release/` - Release funds

### Milestone Endpoints

- `GET /api/milestones/milestones/` - List milestones
- `POST /api/milestones/milestones/` - Create milestone
- `GET /api/milestones/milestones/<id>/` - Get milestone details
- `PATCH /api/milestones/milestones/<id>/complete/` - Mark as completed
- `PATCH /api/milestones/milestones/<id>/update_status/` - Update status
- `POST /api/milestones/milestones/<id>/upload_document/` - Upload document

### Authentication

All API endpoints (except signup and login) require JWT authentication:

```bash
# Login to get token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in subsequent requests
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer <your-access-token>"
```

## Development Scripts

All scripts are located in the `scripts/` directory and are executable.

### Database Initialization

```bash
./scripts/init_db.sh
```

Runs migrations and creates a superuser if one doesn't exist.

### Create Test Users

```bash
./scripts/create_test_users.sh
```

Creates sample users:
- Intended Parent: `parent@example.com` / `testpass123`
- Surrogate: `surrogate@example.com` / `testpass123`

### Run Migrations

```bash
# Run migrations
./scripts/migrate.sh

# Create new migrations
./scripts/migrate.sh --makemigrations

# Show migration status
./scripts/migrate.sh --show
```

### Start Development Servers

```bash
./scripts/start_dev.sh
```

Starts both frontend and backend servers simultaneously.

## Project Structure

```
surrogate-escrow-website/
├── backend/                 # Django backend
│   ├── core/               # Main Django project
│   │   ├── settings/       # Settings (dev, prod, shared)
│   │   └── urls.py         # URL routing
│   ├── user/               # User management app
│   ├── contracts/          # Contract management app
│   ├── payments/            # Payment processing app
│   ├── milestones/         # Milestone tracking app
│   ├── manage.py            # Django management script
│   ├── requirements.txt     # Python dependencies
│   └── scripts/             # Backend scripts
├── frontend/                # React frontend
│   ├── src/                 # React source code
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── package.json         # Node.js dependencies
│   └── vite.config.ts      # Vite configuration
├── scripts/                 # Development scripts
│   ├── init_db.sh          # Database initialization
│   ├── create_test_users.sh # Create test users
│   ├── migrate.sh          # Run migrations
│   └── start_dev.sh        # Start dev servers
├── nginx/                   # Nginx configuration
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker image definition
├── .env.example             # Environment variables template
├── .env                     # Local environment variables (gitignored)
└── README.md               # This file
```

## Troubleshooting

### Backend Issues

**ModuleNotFoundError: No module named 'django'**
```bash
# Activate virtual environment and install dependencies
source .venv/bin/activate
pip install -r backend/requirements.txt
```

**Database connection errors**
- Check `.env` file has correct database settings
- Ensure database service is running (for PostgreSQL)
- Verify `USE_POSTGRESQL` setting matches your database choice

**Migration errors**
```bash
# Reset migrations (development only!)
./scripts/migrate.sh --makemigrations
./scripts/migrate.sh
```

### Frontend Issues

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or change port in vite.config.ts
```

**Module not found errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Port conflicts**
- Change port mappings in `docker-compose.yml`
- Or stop conflicting services

**Container won't start**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up --build
```

**Database connection in Docker**
- Ensure `DB_HOST=db` in `.env` for Docker
- Check database service is healthy: `docker-compose ps`

### General Issues

**CORS errors**
- Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `.env`
- For development, `CORS_ALLOW_ALL_ORIGINS=True` is set in `dev.py`

**Static files not loading**
```bash
# Collect static files
cd backend
python manage.py collectstatic
```

**Environment variables not loading**
- Ensure `.env` file exists in project root
- Check variable names match exactly (case-sensitive)
- Restart server after changing `.env`

## Additional Documentation

- [LOCAL_SETUP_PLAN.md](./LOCAL_SETUP_PLAN.md) - Full development roadmap
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Docker setup guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration guide

## Development

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS v4
- **Backend**: Django 4.2 + Django REST Framework + JWT Authentication
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Containerization**: Docker + Docker Compose

## Notes

- The original Figma design: https://www.figma.com/design/UxIj3GINQD2Ho2lNkhOJzi/Landing-Page-Design
- For production deployment, ensure `DEBUG=False` and use PostgreSQL
- Always use strong `SECRET_KEY` in production

## License

[Add your license here]
