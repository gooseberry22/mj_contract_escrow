# EC2 Deployment Guide

This guide covers deploying the Surrogate Escrow Website to an AWS EC2 instance using Docker.

## Prerequisites

- AWS EC2 instance (Ubuntu 22.04 LTS recommended)
- Domain name (optional but recommended)
- SSH access to EC2 instance
- Docker and Docker Compose installed on EC2

## EC2 Instance Setup

### 1. Launch EC2 Instance

- **Instance Type**: t3.medium or larger (2 vCPU, 4GB RAM minimum)
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 20GB+ SSD
- **Security Group**: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 2. Install Docker on EC2

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

## Deployment Steps

### 1. Clone Repository on EC2

**Option A: Using Personal Access Token (Recommended for quick setup)**

1. Create a Personal Access Token on GitHub:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name (e.g., "EC2 Deployment")
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. Clone using the token:
```bash
cd /opt
# Use your GitHub username and the token as password
git clone https://github.com/favasmfsm/mj_escrow.git surrogate-escrow
# When prompted:
# Username: favasmfsm
# Password: <paste your personal access token>
sudo chown -R $USER:$USER surrogate-escrow
cd surrogate-escrow
```

**Option B: Using SSH Keys (Recommended for long-term use)**

1. Generate SSH key on EC2:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter twice for no passphrase (or set one)
cat ~/.ssh/id_ed25519.pub
```

2. Add the public key to GitHub:
   - Copy the output from `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste the key and save

3. Clone using SSH:
```bash
cd /opt
git clone git@github.com:favasmfsm/mj_escrow.git surrogate-escrow
sudo chown -R $USER:$USER surrogate-escrow
cd surrogate-escrow
```

### 2. Build Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

### 3. Set Up Environment Variables

```bash
# Create production .env file
cp .env.example .env.prod

# Edit with production values
nano .env.prod
```

Required variables:
```env
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,<ec2-public-ip>
USE_POSTGRESQL=True
POSTGRES_DB=surrogate_escrow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<strong-password>
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. Set Up SSL Certificates (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot -y

# Create directories
sudo mkdir -p /opt/surrogate-escrow/nginx/ssl
sudo mkdir -p /var/www/certbot

# Get certificate (replace with your domain)
sudo certbot certonly --webroot -w /var/www/certbot -d yourdomain.com -d www.yourdomain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/surrogate-escrow/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/surrogate-escrow/nginx/ssl/
sudo chmod 644 /opt/surrogate-escrow/nginx/ssl/*.pem
```

### 5. Build and Start Services

```bash
# Build production images
docker-compose -f docker-compose.prod.yml --env-file .env.prod build

# Run migrations
docker-compose -f docker-compose.prod.yml --env-file .env.prod run --rm backend python manage.py migrate

# Collect static files
docker-compose -f docker-compose.prod.yml --env-file .env.prod run --rm backend python manage.py collectstatic --noinput

# Create superuser (optional)
docker-compose -f docker-compose.prod.yml --env-file .env.prod run --rm backend python manage.py createsuperuser

# Start all services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Post-Deployment

### 1. Set Up Auto-Renewal for SSL

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab (runs twice daily)
sudo crontab -e
# Add: 0 0,12 * * * certbot renew --quiet && docker-compose -f /opt/surrogate-escrow/docker-compose.prod.yml restart nginx
```

### 2. Set Up Database Backups

```bash
# Create backup script
sudo nano /opt/surrogate-escrow/scripts/backup_db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose -f /opt/surrogate-escrow/docker-compose.prod.yml exec -T db pg_dump -U postgres surrogate_escrow > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /opt/surrogate-escrow/scripts/backup_db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /opt/surrogate-escrow/scripts/backup_db.sh
```

### 3. Set Up Log Rotation

```bash
sudo nano /etc/logrotate.d/docker-containers
```

```
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
```

## Monitoring

### Health Checks

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs nginx

# Check database
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d surrogate_escrow -c "SELECT version();"
```

### Useful Commands

```bash
# Restart services
docker-compose -f docker-compose.prod.yml restart

# Update and redeploy
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# View resource usage
docker stats

# Access backend shell
docker-compose -f docker-compose.prod.yml exec backend bash
```

## Security Checklist

- [ ] Change default database password
- [ ] Use strong SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Set up SSL/HTTPS
- [ ] Configure firewall (only 22, 80, 443 open)
- [ ] Set up regular backups
- [ ] Enable log rotation
- [ ] Use non-root user in containers
- [ ] Keep Docker and system updated
- [ ] Set up monitoring/alerting
- [ ] Configure rate limiting in nginx

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check environment variables
docker-compose -f docker-compose.prod.yml config
```

### Database connection errors
```bash
# Check database is running
docker-compose -f docker-compose.prod.yml ps db

# Test connection
docker-compose -f docker-compose.prod.yml exec backend python manage.py dbshell
```

### SSL certificate issues
```bash
# Check certificate files
ls -la /opt/surrogate-escrow/nginx/ssl/

# Test nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

## Scaling Considerations

For higher traffic:
- Use AWS RDS instead of containerized PostgreSQL
- Use AWS S3 for media file storage
- Add load balancer (ALB) for multiple instances
- Use Redis for caching
- Consider ECS/EKS for orchestration

