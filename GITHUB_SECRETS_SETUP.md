# 🔐 GitHub Secrets Setup Guide

This guide walks you through setting up all necessary GitHub secrets for the CI/CD pipeline.

## 1. Navigate to GitHub Repository Settings

1. Go to your repository: `https://github.com/YourUsername/tailor`
2. Click **Settings** tab
3. In the left sidebar → **Secrets and variables** → **Actions**

## 2. Required Secrets

### Frontend Deployment - Vercel

#### `VERCEL_TOKEN`
```
Where: Vercel Dashboard → Settings → Tokens
Copy the production token
Paste in: GitHub Secrets → VERCEL_TOKEN
```

#### `VERCEL_ORG_ID`
```
Where: Vercel Dashboard → Team Settings → General
Look for: "Team ID"
Paste in: GitHub Secrets → VERCEL_ORG_ID
```

#### `VERCEL_PROJECT_ID`
```
Where: Your project in Vercel → Settings → General
Look for: "Project ID"
Paste in: GitHub Secrets → VERCEL_PROJECT_ID
```

### Backend Deployment - Railway

#### `RAILWAY_TOKEN`
```
Where: Railway Dashboard → Account → Tokens
Create new deployment token
Paste in: GitHub Secrets → RAILWAY_TOKEN
```

#### `RAILWAY_PROJECT_ID`
```
Where: Railway Dashboard → Your Project → Settings
Look for: "Project ID"
Paste in: GitHub Secrets → RAILWAY_PROJECT_ID
```

### Backend Deployment - Render (Alternative)

#### `RENDER_DEPLOY_HOOK`
```
Where: Render Dashboard → Your Web Service → Settings
Look for: "Deploy Hook"
Copy the webhook URL
Paste in: GitHub Secrets → RENDER_DEPLOY_HOOK
```

### Optional: Slack Notifications

#### `SLACK_WEBHOOK_URL`
```
Where: Slack Workspace → Apps & Integrations → Incoming Webhooks
Create new webhook
Select channel for notifications
Copy Webhook URL
Paste in: GitHub Secrets → SLACK_WEBHOOK_URL
```

## 3. Environment Files

### Server .env.example
```
# Already in repository
# Used by CI/CD for reference
```

### Local Development
```bash
cp server/.env.example server/.env
# Update with your local values
```

### Production (In Deployment Platform)
Set directly in platform dashboard:
- Railway: Variables tab
- Render: Environment panel
- Heroku: Config vars

## 4. Verify Setup

### Check GitHub Secrets
1. Repository Settings → Secrets and variables
2. You should see:
   - ✅ VERCEL_TOKEN
   - ✅ VERCEL_ORG_ID
   - ✅ VERCEL_PROJECT_ID
   - ✅ RAILWAY_TOKEN (if using Railway)
   - ✅ RAILWAY_PROJECT_ID (if using Railway)
   - ✅ RENDER_DEPLOY_HOOK (if using Render)
   - ✅ SLACK_WEBHOOK_URL (optional)

### Test the Pipeline
1. Make a small change
2. Push to `develop` or `staging` branch
3. Go to Actions tab
4. Watch the pipeline run
5. Check logs for any errors

## 5. First Deployment

### Manual Steps (One-time)

```bash
# 1. SSH into deployment environment
ssh your-user@your-host

# 2. Clone repository
git clone https://github.com/YourUsername/tailor.git
cd tailor

# 3. Set environment variables
# Copy production .env to platform
# For Railway/Render: Done in dashboard

# 4. Run migrations
php artisan migrate --force

# 5. Set permissions (if self-hosted)
chmod -R 775 storage bootstrap/cache

# 6. Link storage
php artisan storage:link

# 7. Seed test data (optional)
php artisan db:seed
```

### Automatic Future Deployments
- Just push to `main` branch
- GitHub Actions runs automatically
- Vercel and Railway/Render update automatically

## 6. Troubleshooting

### "Deployment failed - Token invalid"
- Regenerate token in platform
- Update secret in GitHub
- Retry workflow

### "Secret not found"
- Check spelling of secret name (case-sensitive)
- Verify secret exists in GitHub
- Re-add secret if needed

### "Permission denied"
- Ensure token has correct permissions
- Check member role in organization

### Pipeline Shows Yellow (Skipped)
- This is normal for PRs without deploy permission
- Only main branch deployments run

## 7. Security Best Practices

✅ DO:
- Regenerate tokens periodically (every 3-6 months)
- Use specific tokens (not org/personal tokens)
- Limit token permissions
- Review who has Settings access

❌ DON'T:
- Commit secrets to repository
- Share secret values
- Use the same token everywhere
- Check in .env files

## 8. Quick Reference

| Secret | Platform | Permissions |
|--------|----------|-------------|
| VERCEL_TOKEN | Vercel | Full access to project |
| VERCEL_ORG_ID | Vercel | Org ID (read-only) |
| VERCEL_PROJECT_ID | Vercel | Project ID (read-only) |
| RAILWAY_TOKEN | Railway | Deployments scope |
| RAILWAY_PROJECT_ID | Railway | Project ID (read-only) |
| RENDER_DEPLOY_HOOK | Render | Public webhook URL |
| SLACK_WEBHOOK_URL | Slack | Channel posting only |

---

**Next Steps:**
1. ✅ Add all required secrets
2. ✅ Make a test push
3. ✅ Monitor GitHub Actions
4. ✅ Verify deployment
5. ✅ Test application endpoint
