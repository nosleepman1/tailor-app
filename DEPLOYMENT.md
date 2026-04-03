# 🚀 Deployment Guide - Tailor App

## Overview

This document provides comprehensive deployment guidelines for the Tailor application across multiple cloud platforms (PaaS, Serverless, and Cloud providers).

**Current Setup:**
- **Frontend:** Vercel (React/Vite) ✅
- **Backend:** Ready for deployment (Laravel/PHP)
- **Database:** PostgreSQL
- **CI/CD:** GitHub Actions

---

## 📋 Prerequisites

### Required Tools & Access
- GitHub account with repository access
- Docker installed (for local testing)
- Node.js 20+
- PHP 8.2+
- PostgreSQL 15+

### Environment Variables Required

```env
# Application
APP_NAME=Tailor
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:xxxxx (generate with: php artisan key:generate)
APP_URL=https://api.yourdomain.com

# Database
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=tailor_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Authentication
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=yourdomain.com

# API
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Email (if needed)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com

# Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=eu-west-1
AWS_BUCKET=your_bucket
```

---

## 🚢 Frontend Deployment - Vercel

### Already Configured ✅

The frontend is already deployed on Vercel.

**To maintain deployment:**

1. Vercel GitHub integration is active
2. Auto-deploys on push to `main` branch
3. Preview deployments on PRs

**If not set up yet, do this:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod

# Or deploy specific folder
vercel client --prod
```

**Vercel Environment Variables:**
```
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 🔧 Backend Deployment Options

### Option 1: Railway.app (⭐ Recommended - Easiest)

**Why Railway?**
- Simple deployment from Git
- Auto-scales
- Built-in PostgreSQL support
- Free tier available
- Perfect for Laravel apps

**Setup Steps:**

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Connect Your Repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your Tailor repository
   - Give Railway permission to access your repo

3. **Configure Services**

   **Backend Service:**
   ```yaml
   # railway.toml (create in root)
   [build]
   builder = "dockerfile"
   dockerfilePath = "Dockerfile.backend"

   [deploy]
   startCommand = "/usr/bin/supervisord -c /etc/supervisord.conf"
   restartPolicyMaxRetries = 5
   ```

   **Database Service:**
   - Click "Add Services" → PostgreSQL
   - Railway creates automatically

4. **Set Environment Variables**
   ```bash
   # In Railway Dashboard: Variables tab
   APP_KEY=base64:xxxxx
   DB_HOST=${{ Postgres.PGHOST }}
   DB_PORT=${{ Postgres.PGPORT }}
   DB_DATABASE=${{ Postgres.PGDATABASE }}
   DB_USERNAME=${{ Postgres.PGUSER }}
   DB_PASSWORD=${{ Postgres.PGPASSWORD }}
   # ... other vars
   ```

5. **Deploy Hook for CI/CD**
   ```
   Settings → Deployments → Webhook URL
   Copy and add to GitHub: Settings → Secrets → RAILWAY_DEPLOY_HOOK
   ```

6. **Run Migrations**
   ```bash
   railway run php artisan migrate --force
   ```

---

### Option 2: Render.com

**Why Render?**
- GitHub integration
- Native environment variables
- PostgreSQL included
- $7/month for web service + DB

**Setup Steps:**

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Dashboard → New+ → Web Service
   - Connect GitHub repository
   - Select branch (main)

3. **Configure Service**
   ```
   - Name: tailor-backend
   - Environment: Docker
   - Build Command: (leave empty, uses Dockerfile)
   - Start Command: /usr/bin/supervisord -c /etc/supervisord.conf
   - Instance Type: Standard (recommended)
   - Region: Frankfurt (or closest to users)
   ```

4. **Create PostgreSQL Database**
   - Dashboard → New+ → PostgreSQL
   - Set database name, user, password
   - Copy connection string

5. **Set Environment Variables**
   - In Web Service settings → Environment
   - Add all required variables
   - Set `DB_HOST` to Postgres internal hostname
   - Other URLs to your domain

6. **Custom Domain**
   - Settings → Domain → Add Custom Domain
   - Update DNS records with provided CNAME

7. **Deploy**
   - Push to GitHub main branch
   - Render auto-deploys
   - Run migrations: `render-cli exec "php artisan migrate --force"`

---

### Option 3: Heroku (Alternative)

**Note:** Heroku is paid-only now (no free tier)

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create tailor-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Deploy
git push heroku main

# Run migrations
heroku run php artisan migrate --force
```

---

### Option 4: Docker + Self-hosted (AWS, DigitalOcean, Hetzner)

#### AWS Elastic Container Service (ECS)

```bash
# Build and push Docker image to ECR
aws ecr create-repository --repository-name tailor-backend --region eu-west-1

# Login to ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin YOUR_ECR_URL

# Build image
docker build -f Dockerfile.backend -t tailor-backend:latest .

# Tag image
docker tag tailor-backend:latest YOUR_ECR_URL/tailor-backend:latest

# Push to ECR
docker push YOUR_ECR_URL/tailor-backend:latest

# Create ECS Task Definition, Service, and Cluster via AWS Console
# Or use CloudFormation/Terraform
```

#### DigitalOcean App Platform

```bash
# 1. Create app.yaml
# 2. Push to GitHub
# 3. Connect via DigitalOcean Dashboard
# 4. Set environment variables
# 5. Deploy

# Alternative: Docker on Droplet
# SSH into droplet and use docker-compose
scp docker-compose.yml root@your-droplet:/app/
ssh root@your-droplet
cd /app
docker-compose up -d
```

---

## 🔐 Security Checklist

- [ ] All environment variables set in deployment platform (not hardcoded)
- [ ] Database password is strong (min. 16 chars, mixed case, numbers, symbols)
- [ ] APP_DEBUG=false in production
- [ ] SSL/TLS certificate configured (auto with Vercel, Render)
- [ ] CORS properly configured for frontend domain
- [ ] Rate limiting enabled for API endpoints
- [ ] Sanctum session domain configured correctly
- [ ] Database backups enabled
- [ ] Health check endpoint configured
- [ ] Monitoring alerts set up

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

Two workflows are automatically triggered:

#### 1. `ci-cd.yml` - Main Pipeline
**Triggers:** Push to `main`, `develop`, `staging`

**Jobs:**
- ✅ Backend Pest tests
- ✅ Backend PHP code quality (Pint, PHPStan)
- ✅ Frontend build
- ✅ Docker image build & push
- ✅ Deploy to Vercel (frontend, main branch only)
- ✅ Deploy to Railway/Render (backend, main branch only)

**Secrets Required:**
```
GITHUB_TOKEN          # Auto-provided
VERCEL_TOKEN         # Get from Vercel
VERCEL_ORG_ID        # Get from Vercel
VERCEL_PROJECT_ID    # Get from Vercel
RAILWAY_TOKEN        # Get from Railway (if using)
RAILWAY_PROJECT_ID   # Get from Railway
RENDER_DEPLOY_HOOK   # Get from Render
SLACK_WEBHOOK_URL    # Optional: for notifications
```

#### 2. `pr-checks.yml` - Pull Request Checks
**Triggers:** Pull requests to `main`, `develop`, `staging`

**Jobs:**
- 🔒 Secret scanning (Trufflehog)
- 🐛 Vulnerability scanning (Trivy)
- 🧪 Integration tests (if available)
- ⚡ Lighthouse audit (frontend performance)

---

## 📊 Database Migration

### Initial Migration

```bash
# SSH into your production environment

# For Railway:
railway run php artisan migrate --force

# For Render:
render-cli exec "php artisan migrate --force"

# For Docker:
docker-compose exec backend php artisan migrate --force
```

### Data Backup (Before Migration)

```bash
# PostgreSQL backup
pg_dump -U username -d database_name -h host > backup.sql

# Restore if needed
psql -U username -d database_name -h host < backup.sql
```

---

## 📝 Running Tests Locally Before Deployment

```bash
cd server

# Run all tests
./vendor/bin/pest

# Run specific test file
./vendor/bin/pest tests/Feature/AuthenticationTest.php

# Run with coverage report
./vendor/bin/pest --coverage

# Watch mode (auto-run on changes)
./vendor/bin/pest --watch
```

---

## 🌐 DNS Configuration

### For Custom Domain

```
API Domain: api.yourdomain.com or backend.yourdomain.com

Railway/Render CNAME:
  Name: api
  Type: CNAME
  Value: <railway/render-domain-provided>
  TTL: 3600

Frontend (Vercel):
  Already configured with DNS provider
```

---

## 📱 Monitoring & Logging

### Railway Metrics
- Dashboard → Logs tab
- Real-time deployment logs
- Container resource usage

### Render Dashboards
- Service logs visible in dashboard
- Email notifications for failures
- Alerting system available

### Custom Monitoring

```bash
# Add to your app for health checks
# GET https://api.yourdomain.com/health
# Returns: {"status": "ok", "database": "connected"}
```

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check connection string format
# PostgreSQL: postgresql://user:password@host:port/database

# Test connection
psql "postgresql://user:pass@host:5432/db"
```

### Email Not Sending
- Check MAIL_* environment variables
- Verify SPF/DKIM records
- Check email provider credentials

### Static Files Not Loading
- Run: `php artisan storage:link`
- Check filesystem disk configuration
- Verify S3 credentials if using S3

### High Memory Usage
- Increase container resources in deployment platform
- Optimize queries (add indexes)
- Enable query caching

### Deployment Fails
1. Check GitHub Actions logs
2. Review deployment platform logs
3. Verify all environment variables set
4. Check database connectivity
5. Run tests locally first

---

## 📞 Support & Resources

### Documentation
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- Laravel Discord
- GitHub Issues
- Stack Overflow

---

## 🎯 Recommended Stack for Production

| Component | Service | Reason |
|-----------|---------|--------|
| Backend | Railway or Render | Easy, integrated, affordable |
| Database | PostgreSQL (included) | Reliable, fast, included in platforms |
| Frontend | Vercel | Built for React/Vite, serverless, CDN |
| Storage | S3 or Railway Storage | Scalable, cheap, integrated |
| Monitoring | Platform native | Included, sufficient for small apps |
| CI/CD | GitHub Actions | Free, integrated, sufficient |

---

**Last Updated:** April 2026
**Maintained by:** Development Team
