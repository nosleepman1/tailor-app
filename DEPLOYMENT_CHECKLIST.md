# ✅ Production Deployment Checklist

Use this checklist for each production deployment to ensure nothing is missed.

## Pre-Deployment (1-2 days before)

- [ ] All tests passing: `./vendor/bin/pest`
- [ ] Code review completed
- [ ] Database migrations reviewed and tested locally
- [ ] Environment variables documented
- [ ] Backup plan prepared
- [ ] Rollback procedure documented
- [ ] Team notified of deployment window

## Infrastructure

### Database
- [ ] PostgreSQL version matches local/staging
- [ ] Connection string correct and tested
- [ ] Database user created with correct permissions
- [ ] Backup scheduled (daily minimum)
- [ ] Point-in-time recovery enabled
- [ ] Database monitoring configured

### Backend Server
- [ ] PHP 8.2 or compatible version installed
- [ ] All PHP extensions installed (pdo_pgsql, bcmath, gd, etc.)
- [ ] Composer installed and dependencies resolved
- [ ] Storage directories writable (bootstrap/cache, storage/)
- [ ] Supervisor installed and running
- [ ] Nginx configured with correct upstream
- [ ] SSL certificate valid and not expiring soon
- [ ] Fire firewall configured

### Frontend Deployment
- [ ] Vercel connected to GitHub main branch
- [ ] Domain pointing to Vercel nameservers
- [ ] Environment variables set in Vercel
- [ ] Build settings correct
- [ ] Preview deployments working

## Environment Configuration

### Backend .env Production
```
✅ APP_ENV=production
✅ APP_DEBUG=false
✅ APP_KEY=base64:xxxxx (generated and stored)
✅ APP_URL=https://api.yourdomain.com
✅ DB_CONNECTION=pgsql
✅ DB_HOST=correct-production-host
✅ DB_DATABASE=tailor_production
✅ DB_USERNAME=secure-username
✅ DB_PASSWORD=secure-password (24+ chars)
✅ SANCTUM_STATEFUL_DOMAINS=yourdomain.com
✅ SESSION_DOMAIN=yourdomain.com
```

- [ ] No hardcoded database credentials
- [ ] No test API keys in production
- [ ] Mail credentials configured (if applicable)
- [ ] Storage (S3) credentials configured
- [ ] CORS properly set

### Frontend Environment
- [ ] `VITE_API_URL` points to production API
- [ ] All API endpoints updated
- [ ] Analytics configured (if used)
- [ ] Error tracking configured (Sentry, etc.)

## Security

- [ ] SQL injection prevention verified
- [ ] XSS protection headers set
- [ ] CSRF tokens enabled
- [ ] Rate limiting configured
- [ ] Password validation strict
- [ ] Session timeout configured
- [ ] HTTPS enforced everywhere
- [ ] Sensitive files not in web root
- [ ] `.env` file not accessible
- [ ] `.git` directory not accessible
- [ ] Security headers configured:
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000
  ```

## Application Preparation

### Laravel Setup
- [ ] `php artisan config:cache` (caches config)
- [ ] `php artisan route:cache` (caches routes)
- [ ] `php artisan view:cache` (caches views)
- [ ] `php artisan event:cache` (caches events)
- [ ] `php artisan storage:link` (symlink created)

### Database
- [ ] Migrations run: `php artisan migrate --force`
- [ ] Seeders run (if applicable): `php artisan db:seed`
- [ ] Database state verified with queries
- [ ] Backup taken before migration

### Asset Compilation
- [ ] Frontend built: `npm run build`
- [ ] Static files optimized
- [ ] CSS/JS minified
- [ ] Images optimized

## Monitoring & Logging

- [ ] Application logs configured to rotate
- [ ] Error tracking service enabled (Sentry, etc.)
- [ ] Performance monitoring enabled (New Relic, etc.)
- [ ] Uptime monitoring configured (Pingdom, etc.)
- [ ] Alert thresholds set (CPU, Memory, Error rate)
- [ ] Dashboard created for team monitoring
- [ ] Log aggregation configured (if multi-server)

## API Health Checks

- [ ] Health check endpoint working: `/api/health`
- [ ] Database connectivity verified
- [ ] External services reachable
- [ ] Authentication working
- [ ] API rate limiting working
- [ ] CORS headers correct for frontend

## CI/CD Pipeline

- [ ] GitHub Actions workflows correctly configured
- [ ] All secrets added to GitHub
- [ ] Deployment webhook configured
- [ ] Auto-deployment on main branch working
- [ ] Staging environment testing

## Data & Backups

- [ ] Database backup automated
- [ ] Backup storage secured
- [ ] Restore procedure tested
- [ ] User data GDPR compliant
- [ ] Privacy policy updated
- [ ] Terms of service updated

## Documentation

- [ ] Deployment procedure documented
- [ ] Rollback procedure documented
- [ ] Team access credentials shared securely
- [ ] Runbook for common issues prepared
- [ ] Architecture diagram updated

## Performance Baseline

- [ ] Load test completed
- [ ] Expected load capacity documented
- [ ] Auto-scaling configured (if applicable)
- [ ] Database query optimization checked
- [ ] Cache strategy implemented
- [ ] CDN configured (if applicable)

## User Testing

- [ ] UAT completed by business
- [ ] All critical paths tested
- [ ] Mobile testing completed
- [ ] Cross-browser testing completed
- [ ] Payment flow tested (if applicable)

## Go-Live Day

### 1 Hour Before
- [ ] All systems green (monitoring dashboard)
- [ ] Team in communication channel
- [ ] Rollback plan reviewed
- [ ] Database backup taken
- [ ] Maintenance window announced (if needed)

### Deployment
- [ ] Push deployment trigger (merge to main)
- [ ] Monitor GitHub Actions
- [ ] Monitor application logs
- [ ] Test critical endpoints
- [ ] Test user flows from different regions

### 30 Minutes After
- [ ] All systems functioning normally
- [ ] No error spikes in logs
- [ ] Performance metrics normal
- [ ] User reports checked
- [ ] Team communication update

### 1 Hour After
- [ ] Extended monitoring continues
- [ ] Document any issues encountered
- [ ] User feedback collected
- [ ] Performance analysis completed

## Post-Deployment (Next Day)

- [ ] Review deployment logs
- [ ] Check application metrics
- [ ] Verify all features working
- [ ] User feedback incorporated
- [ ] Performance report generated
- [ ] Document lessons learned

## Rollback Procedure

If critical issues occur:

### Option 1: Quick Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# GitHub Actions auto-deploys previous version
```

### Option 2: Database Rollback
```bash
# If migrations caused issues
php artisan migrate:rollback

# Or specific migration batch
php artisan migrate:rollback --step=1
```

### Option 3: Full Rollback
```bash
# Restore from backup
pg_restore -U user -d database backup.sql

# Redeploy previous code
git checkout previous-tag
git push
```

## Communication Template

### Pre-Deployment
```
🚀 Deployment scheduled for [DATE] at [TIME]
- Duration: [30-60] minutes
- Services affected: [List]
- Expected downtime: [None/Brief]
- Contact: [Team lead]
```

### During Deployment
```
🔄 Deployment in progress...
Current status: [Step X of Y]
```

### Post-Deployment
```
✅ Deployment completed successfully!
- All systems operational
- Monitoring shows green
- Users should see new features/fixes
```

### Rollback (If Needed)
```
🔄 Rolling back to previous version
Reason: [Brief explanation]
ETA: [Time]
```

---

## Quick Links

- [Deployment Guide](./DEPLOYMENT.md)
- [Testing Guide](./TESTING.md)
- [GitHub Secrets Setup](./GITHUB_SECRETS_SETUP.md)
- [GitHub Actions Logs](https://github.com/YourUsername/tailor/actions)

---

**Deployment Record:**

| Date | Version | Status | Notes |
|------|---------|--------|-------|
| Apr 3, 2026 | v1.0.0 | ✅ Success | Initial production release |
| | | | |

---

**Current Production Status:** ⚠️ PRE-DEPLOYMENT (Not live yet)

After first successful deployment:
- Update status to ✅ LIVE
- Add deployment date above
- Archive previous checklists
