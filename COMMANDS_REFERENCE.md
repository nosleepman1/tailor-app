# 🚀 Quick Reference - Deployment & DevOps Commands

## Local Development

### Setup & Installation

```bash
# Clone repository
git clone https://github.com/YourUsername/tailor.git
cd tailor

# Backend setup
cd server
composer install
cp .env.example .env
php artisan key:generate

# Frontend setup
cd ../client
npm install
```

### Running Locally

```bash
# Option 1: Docker Compose
cd .. # root directory
docker-compose up -d

# Option 2: Manual (separate terminals)
# Terminal 1 - Backend
cd server
php artisan serve

# Terminal 2 - Frontend
cd client
npm run dev

# Terminal 3 - Queue (optional)
cd server
php artisan queue:work
```

### Accessing Local Services

```
Frontend: http://localhost:5173
Backend:  http://localhost:8000
API:      http://localhost:8000/api/v1
Docs:     http://localhost:8000/docs (if Scribe configured)
Mailbox:  http://localhost:8025 (if MailHog running)
```

---

## Testing

### Run Tests

```bash
cd server

# All tests
./vendor/bin/pest

# Specific test file
./vendor/bin/pest tests/Feature/AuthenticationTest.php

# Watch mode
./vendor/bin/pest --watch

# Coverage
./vendor/bin/pest --coverage

# Parallel
./vendor/bin/pest --parallel
```

### Mock API Responses

```bash
# Start mock server
npm install -g json-server
json-server --watch mock-api.json --port 3001
```

---

## Database Management

### Migrations

```bash
# Create new migration
php artisan make:migration create_table_name

# Run all migrations
php artisan migrate

# Run in production
php artisan migrate --force

# Rollback last batch
php artisan migrate:rollback

# Rollback all
php artisan migrate:reset

# Refresh (rollback + migrate)
php artisan migrate:refresh

# Refresh with seed
php artisan migrate:refresh --seed

# Show migration status
php artisan migrate:status

# Fresh (drop all tables + migrate)
php artisan migrate:fresh
```

### Database Backup & Restore

```bash
# PostgreSQL Backup
pg_dump -U username -d database_name -h host -F c -b > backup.dump

# PostgreSQL Restore
pg_restore -U username -d database_name -h host backup.dump

# MySQL Backup
mysqldump -u username -p database_name > backup.sql

# MySQL Restore
mysql -u username -p database_name < backup.sql
```

### Database Troubleshooting

```bash
# Check connection
psql postgresql://user:pass@host:5432/database

# List databases
\l

# Connect to database
\c database_name

# List tables
\dt

# Show table schema
\d table_name

# Run query
SELECT * FROM table_name;

# Exit
\q
```

---

## Deployment Commands

### GitHub Actions

```bash
# View workflow status
# Go to: https://github.com/YourUsername/tailor/actions

# Manually trigger workflow
gh workflow run ci-cd.yml --ref main

# View latest run logs
gh run view --log
```

### Docker Commands

```bash
# Build backend image
docker build -f Dockerfile.backend -t tailor-backend:latest .

# Build frontend image
docker build -f Dockerfile.frontend -t tailor-frontend:latest .

# Build both
docker-compose build

# Push to registry
docker push ghcr.io/YourUsername/tailor-backend:latest

# Run container
docker run -p 8000:80 tailor-backend:latest

# View logs
docker logs tailor-backend -f

# Stop services
docker-compose down

# Remove everything
docker-compose down -v
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link PROJECT_ID

# View logs
railway logs -f

# Run command in container
railway run php artisan migrate --force

# Deploy
railway up

# Status
railway status
```

### Render Deployment

```bash
# View logs
# Via dashboard: https://dashboard.render.com

# Manual trigger via GitHub
git push origin main  # Auto-deploys

# Check status
# Via: https://api.render.com/api/v1/services
```

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create tailor-backend

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Run migration
heroku run php artisan migrate --force

# Set env variable
heroku config:set APP_KEY=base64:xxxxx

# View variables
heroku config
```

---

## Server Management

### SSH Access

```bash
# Connect to server
ssh user@your-server.com

# Copy files to server
scp local-file user@your-server.com:/remote/path/

# Copy from server
scp user@your-server.com:/remote/file local-path/
```

### Server Commands

```bash
# Check space
df -h

# Check memory
free -h

# Check processes
ps aux | grep php
ps aux | grep nginx

# View system logs
sudo tail -f /var/log/syslog

# Restart services
sudo systemctl restart nginx
sudo systemctl restart php-fpm

# Check service status
sudo systemctl status nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renew setup
sudo certbot renew --dry-run

# View certificates
sudo certbot certificates
```

---

## Artisan Commands

### Useful Laravel Commands

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize
php artisan optimize
php artisan optimize:clear

# Create new model with migration
php artisan make:model MyModel -m

# Create controller
php artisan make:controller MyController

# Create request
php artisan make:request MyRequest

# Create middleware
php artisan make:middleware MyMiddleware

# Tinker (REPL)
php artisan tinker

# Show routes
php artisan route:list

# Storage link (for file uploads)
php artisan storage:link

# Queue work (process background jobs)
php artisan queue:work

# Seed database
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=UsersSeeder
```

---

## Git Workflow

### Basic Workflow

```bash
# Create feature branch
git checkout -b feature/add-new-api-endpoint

# Make changes
git status

# Stage changes
git add .

# Commit
git commit -m "feat: add new API endpoint"

# Push to GitHub
git push origin feature/add-new-api-endpoint

# Create Pull Request on GitHub

# After approval, merge
git checkout main
git pull origin main
git merge feature/add-new-api-endpoint
git push origin main
```

### Useful Git Commands

```bash
# View branch list
git branch -a

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Reset to last commit
git reset --hard HEAD

# Stash changes
git stash

# Apply stashed changes
git stash apply

# View commit history
git log --oneline -10

# Undo last commit
git reset HEAD~1

# Rebase branch
git rebase main

# Cherry-pick commit
git cherry-pick COMMIT_HASH
```

---

## Debugging

### Laravel Debugging

```bash
# Enable debug mode (development only!)
APP_DEBUG=true

# Tinker shell
php artisan tinker

# Dump variable
dd($variable);  // Dumps and dies
dump($variable);  // Dumps and continues

# See queries
DB::enableQueryLog();
// ... your code ...
dd(DB::getQueryLog());
```

### API Debugging

```bash
# Check request
POST /api/v1/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password"
}

# Use Postman or Thunder Client for testing
# Or curl:
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Frontend Debugging

```bash
# Chrome DevTools
F12 or Cmd+Option+I

# Console errors
console.log()
console.error()

# Network tab
Monitor network requests

# React DevTools
https://chrome.google.com/webstore
```

---

## Performance Optimization

### Cache Management

```bash
# Configure caching
php artisan config

# Cache config
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache events
php artisan event:cache

# Cache views
php artisan view:cache

# Clear all
php artisan optimize:clear
```

### Database Optimization

```bash
# Add indexes
// In migration
Schema::table('users', function (Blueprint $table) {
    $table->index('email');
});

# Run query analysis
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

### Asset Optimization

```bash
# Frontend build
npm run build

# Minify CSS/JS
postcss input.css -o output.css --minify
```

---

## Monitoring

### Check Application Health

```bash
# Health check endpoint
curl http://localhost:8000/health

# Check API response
curl http://localhost:8000/api/v1/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Monitor logs in real-time
tail -f storage/logs/laravel.log

# View error logs
tail -f storage/logs/laravel-error.log
```

### Metrics

```bash
# Database connections
psql -l

# Memory usage
free -h

# Disk usage
df -h

# CPU usage
top
```

---

## Common Issues & Solutions

### Database Connection Fails
```bash
# Check credentials
psql "postgresql://user:pass@host:port/db"

# Check firewall
sudo ufw status
sudo ufw allow 5432/tcp
```

### API Returns 500
```bash
# Check logs
tail -f storage/logs/laravel.log

# Check database
php artisan tinker
>>> DB::connection()->getPdo()

# Check migrations
php artisan migrate:status
```

### Frontend Won't Build
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Deployment Fails
```bash
# Check GitHub Actions logs
# Repository → Actions → Latest workflow run

# Check deployment platform logs
# Railway/Render/Heroku dashboard

# Run migrations
php artisan migrate --force

# Restart services
sudo systemctl restart nginx php-fpm
```

---

## Useful Resources

- [Laravel Docs](https://laravel.com/docs)
- [Pest Docs](https://pestphp.com/)
- [Vite Docs](https://vitejs.dev/)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Pro Tips:**
- 💾 Always backup before migrations
- 🧪 Run tests before pushing
- 📝 Write meaningful commit messages
- 🔐 Never commit secrets or credentials
- 📊 Monitor logs and metrics regularly
- 🚀 Deploy to staging before production
