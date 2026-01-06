# Local Development Setup Plan
## Surrogate Escrow Website

This document outlines the plan to make the surrogate escrow website run locally, using the `aviccel` project as a reference.

---

## Current State Analysis

### ✅ What We Have:
1. **Frontend Application** (React + Vite + TypeScript)
   - Modern React application with Vite build tool
   - Tailwind CSS v4 for styling
   - Multiple UI components and pages
   - No backend currently

2. **Reference Project (aviccel)**
   - Full-stack Django + React application
   - Docker Compose setup
   - Pipenv for Python dependencies
   - Celery + RabbitMQ for background tasks
   - Nginx for reverse proxy
   - Proper dev/prod environment separation

### ❌ What's Missing:
1. **Frontend Dependencies** - `node_modules` not installed
2. **Backend Infrastructure** - No Django backend
3. **Environment Configuration** - No `.env` files
4. **Docker Setup** - No Docker configuration
5. **Database** - No database setup
6. **Development Documentation** - Basic README only

---

## Implementation Plan

### Phase 1: Frontend Setup (Quick Start - Can Run Immediately)
**Goal:** Get the frontend running locally without backend

#### Steps:
1. ✅ Install Node.js dependencies
   ```bash
   cd frontend
   npm install
   ```

2. ✅ Verify Vite configuration
   - Check `frontend/vite.config.ts` is properly configured
   - Ensure port 3000 is available

3. ✅ Run development server
   ```bash
   cd frontend
   npm run dev
   ```

4. ✅ Test the application
   - Should run on `http://localhost:3000`
   - All UI components should render

**Status:** ✅ Completed

---

### Phase 2: Backend Infrastructure Setup (Full Stack)
**Goal:** Set up Django backend similar to aviccel project

#### 2.1 Create Django Project Structure
- [x] Create `backend/` directory
- [x] Initialize Django project with `django-admin startproject`
- [x] Create Django apps (user, payments, contracts, milestones, etc.)
- [x] Set up project structure matching aviccel pattern

#### 2.2 Python Environment Setup
- [x] Create `Pipfile` with dependencies:
  - Django
  - Django REST Framework
  - Django CORS Headers
  - JWT authentication
  - PostgreSQL/MySQL driver (or SQLite for dev)
  - Other required packages
- [x] Create `Pipfile.lock` by running `pipenv install`
- [x] Create `.venv/` virtual environment

#### 2.3 Django Settings Configuration
- [x] Create `backend/core/settings/` directory structure:
  - `__init__.py`
  - `shared.py` - Common settings
  - `dev.py` - Development settings
  - `prod.py` - Production settings
- [x] Configure:
  - Database settings (SQLite for dev, PostgreSQL for prod)
  - CORS settings (allow localhost:3000)
  - JWT authentication
  - Static files and media files
  - Installed apps
  - Middleware

#### 2.4 Database Setup
- [x] Create `db/` directory for SQLite database
- [x] Run migrations: `python manage.py migrate`
- [x] Create superuser: `python manage.py createsuperuser` (created via script)

#### 2.5 API Endpoints
- [x] Create REST API endpoints for:
  - User authentication (login, register, JWT tokens)
  - User management
  - Contracts
  - Payments
  - Milestones
  - Escrow management
- [x] Set up URL routing
- [x] Create serializers for models

---

### Phase 3: Docker Setup (Containerization)
**Goal:** Containerize the application for easy local development

#### 3.1 Docker Configuration Files
- [x] Create `Dockerfile` for backend:
  - Base Python 3.9 image
  - Install system dependencies
  - Install Python dependencies from requirements.txt
  - Copy project files
  - Set up entrypoint script

- [x] Create `docker-compose.yml`:
  - Backend service (Django)
  - Frontend service (Vite dev server)
  - Database service (PostgreSQL)
  - Nginx service (for reverse proxy)

- [x] Create `.dockerignore` file
- [x] Create `nginx/nginx.conf` for reverse proxy

#### 3.2 Docker Development Setup
- [x] Configure docker-compose for development:
  - Volume mounts for hot reload
  - Environment variables
  - Port mappings
  - Service dependencies

---

### Phase 4: Environment Configuration
**Goal:** Set up proper environment variable management

#### 4.1 Environment Files
- [x] Create `.env.example` with:
  - `SECRET_KEY` - Django secret key
  - `DEBUG=True` - Debug mode
  - `ALLOWED_HOSTS` - Allowed hosts
  - Database configuration
  - API keys (if needed)
  - CORS settings

- [x] Create `.env` file (gitignored) for local development
- [x] Update `.gitignore` to exclude `.env` files (already configured)

#### 4.2 Configuration Management
- [x] Use `python-decouple` for env management
- [x] Load environment variables in Django settings
- [x] Set up different configs for dev/prod

---

### Phase 5: Development Tools & Scripts
**Goal:** Add helpful development tools and scripts

#### 5.1 Management Scripts
- [x] Create `scripts/` directory
- [x] Add scripts for:
  - Database initialization (`init_db.sh`)
  - Creating test users (`create_test_users.sh`)
  - Running migrations (`migrate.sh`)
  - Starting development servers (`start_dev.sh`)

#### 5.2 Documentation
- [x] Update `README.md` with:
  - Prerequisites
  - Installation steps
  - Running locally (with and without Docker)
  - API documentation
  - Environment variables
  - Troubleshooting

---

### Phase 6: Frontend-Backend Integration
**Goal:** Connect frontend to backend API

#### 6.1 API Client Setup
- [x] Create API client/utility for making requests
- [x] Set up axios wrapper
- [x] Configure base URL for API (via VITE_API_URL env var)
- [x] Add authentication token handling (with auto-refresh)

#### 6.2 Update Frontend Components
- [x] Update Login component to call backend API
- [x] Update CreateAccount to register users
- [ ] Connect Dashboard to fetch real data
- [ ] Connect Payments to backend
- [ ] Connect Milestones to backend
- [x] Add error handling and loading states

#### 6.3 CORS Configuration
- [x] Ensure Django CORS settings allow frontend origin (CORS_ALLOW_ALL_ORIGINS=True in dev)
- [ ] Test API calls from frontend

---

## Quick Start (Frontend Only)

If you just want to run the frontend immediately:

```bash
# 1. Navigate to project directory
cd "/Users/favasm/Desktop/consult/MJ/surrogacy/surrogate escrow website"

# 2. Navigate to frontend directory
cd frontend

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000
```

---

## Full Stack Setup (Recommended)

### Prerequisites:
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (optional but recommended)
- pipenv (for Python dependency management)

### Steps:

1. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Setup:**
   ```bash
   # Install pipenv if not installed
   pip install pipenv

   # Navigate to backend directory (to be created)
   cd backend

   # Install Python dependencies
   pipenv install --dev

   # Activate virtual environment
   pipenv shell

   # Run migrations
   python manage.py migrate

   # Create superuser
   python manage.py createsuperuser

   # Run development server
   python manage.py runserver
   ```

3. **Docker Setup (Alternative):**
   ```bash
   # Build and start all services
   docker-compose up --build

   # Run migrations
   docker-compose exec backend python manage.py migrate

   # Create superuser
   docker-compose exec backend python manage.py createsuperuser
   ```

---

## File Structure (Target)

```
surrogate-escrow-website/
├── backend/                    # Django backend (to be created)
│   ├── core/                   # Main Django project
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── shared.py
│   │   │   ├── dev.py
│   │   │   └── prod.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── user/                   # User management app
│   ├── contracts/              # Contract management app
│   ├── payments/               # Payment processing app
│   ├── milestones/             # Milestone tracking app
│   ├── manage.py
│   └── Pipfile
├── frontend/                   # React frontend ✅
│   ├── src/                    # React source code
│   ├── node_modules/           # Node.js dependencies
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── db/                         # Database files
├── nginx/                      # Nginx configuration
│   └── nginx.conf
├── scripts/                    # Utility scripts
├── .venv/                      # Python virtual environment ✅
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── .gitignore                  # ✅
└── README.md
```

---

## Priority Order

1. **IMMEDIATE (Do First):**
   - Phase 1: Frontend Setup - Get UI running

2. **HIGH PRIORITY:**
   - Phase 2: Backend Infrastructure - Core functionality
   - Phase 4: Environment Configuration - Security

3. **MEDIUM PRIORITY:**
   - Phase 6: Frontend-Backend Integration - Connect UI to backend
   - Phase 5: Development Tools - Developer experience

4. **LOW PRIORITY (Can do later):**
   - Phase 3: Docker Setup - Nice to have for consistency

---

## Next Steps

1. Start with Phase 1 to get the frontend running
2. Then proceed with Phase 2 to add backend
3. Integrate frontend and backend (Phase 6)
4. Add Docker setup if needed (Phase 3)

---

## Notes

- The aviccel project uses SQLite for development (in `db/db.sqlite3`)
- For production, consider PostgreSQL
- The aviccel project uses RabbitMQ for Celery - only add if you need background tasks
- CORS is configured to allow `localhost:3000` in dev settings
- JWT tokens are used for authentication (similar to aviccel)

