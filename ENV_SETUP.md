# Environment Configuration Guide

This project uses `python-decouple` for environment variable management. This provides a clean and secure way to manage configuration across different environments.

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your local settings:**
   - Generate a new `SECRET_KEY` (see below)
   - Update database settings if needed
   - Configure CORS origins

3. **Generate a Django Secret Key:**
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   Copy the output and set it as `SECRET_KEY` in your `.env` file.

## Environment Variables

### Required Variables

- **`SECRET_KEY`** - Django secret key (required for production)
- **`DEBUG`** - Debug mode (`True` for development, `False` for production)
- **`ALLOWED_HOSTS`** - Comma-separated list of allowed hostnames

### Database Configuration

#### SQLite (Default for Development)
```env
USE_POSTGRESQL=False
```
No additional database configuration needed. SQLite database will be created at `backend/db/db.sqlite3`.

#### PostgreSQL (Production or Optional)
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

For development, you can also set `CORS_ALLOW_ALL_ORIGINS=True` in `dev.py` (already configured).

### Optional Variables

- **Email Configuration** - For sending emails
- **AWS S3 Configuration** - For media file storage in production
- **API Keys** - For third-party services (Stripe, etc.)

## How It Works

### Development (`core.settings.dev`)

- Uses `.env` file from project root
- Defaults to SQLite database
- `DEBUG=True` by default
- Allows all CORS origins

### Production (`core.settings.prod`)

- Requires `.env` file with all variables set
- Uses PostgreSQL database (required)
- `DEBUG=False` (must be explicitly set)
- Restricted CORS origins

## Using Environment Variables in Code

```python
from decouple import config, Csv

# Simple string
SECRET_KEY = config('SECRET_KEY')

# Boolean
DEBUG = config('DEBUG', default=False, cast=bool)

# Integer
PORT = config('PORT', default=8000, cast=int)

# Comma-separated list
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

# With default value
DB_NAME = config('DB_NAME', default='surrogate_escrow')
```

## File Locations

- **`.env.example`** - Template file (committed to git)
- **`.env`** - Your local environment file (gitignored)
- **`backend/core/settings/dev.py`** - Development settings
- **`backend/core/settings/prod.py`** - Production settings

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong SECRET_KEY** - Generate a new one for each environment
3. **Don't use DEBUG=True in production** - Security risk
4. **Restrict ALLOWED_HOSTS** - Only include your actual domains
5. **Use environment-specific values** - Different values for dev/staging/prod

## Docker Usage

When using Docker, environment variables can be set in:
1. `.env` file (automatically loaded by docker-compose)
2. `docker-compose.yml` environment section
3. Command line: `docker-compose run -e DEBUG=False backend`

## Troubleshooting

### Settings not loading
- Ensure `.env` file exists in project root
- Check file permissions
- Verify variable names match exactly (case-sensitive)

### Database connection errors
- Verify database credentials in `.env`
- Check if database service is running (for PostgreSQL)
- Ensure `USE_POSTGRESQL` matches your database choice

### CORS errors
- Add your frontend URL to `CORS_ALLOWED_ORIGINS`
- Check that URLs include protocol (`http://` or `https://`)
- For development, `CORS_ALLOW_ALL_ORIGINS=True` is set in dev.py

