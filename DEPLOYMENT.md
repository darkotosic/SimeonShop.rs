# Deployment Guide - SimeonShop.rs

Complete guide for deploying SimeonShop.rs to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Security audit completed
- [ ] Performance optimizations done
- [ ] Monitoring and logging configured

## 🌐 Frontend Deployment

### Option 1: Netlify (Recommended)

#### Setup
1. Push code to GitHub
2. Sign up at [netlify.com](https://netlify.com)
3. Connect GitHub repository
4. Netlify auto-detects `netlify.toml` configuration

#### Configuration
```toml
[build]
publish = "apps/web/.next"
command = "cd apps/web && npm install && npm run build"

[build.environment]
NODE_VERSION = "18"
NEXT_PUBLIC_API_BASE_URL = "https://api.simeonshop.rs"
```

#### Deploy
```bash
# Automatic on push to main
git push origin main

# Or manual CLI deployment
netlify deploy --prod
```

### Option 2: Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Import repository
3. Configure environment variables
4. Deploy

```bash
npm i -g vercel
vercel --prod
```

### Option 3: Traditional Server (AWS, DigitalOcean, Linode)

```bash
# Build
cd apps/web
npm run build

# Upload .next directory to server
scp -r .next user@server:/app/

# Install dependencies on server
npm install --production

# Start with PM2
pm2 start "npm start" --name "simeonshop-web"
```

## 🔧 Backend Deployment

### Option 1: Railway (Easiest)

1. Connect GitHub repository
2. Create new project
3. Select Python environment
4. Configure environment variables
5. Auto-deploys on push

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create simeonshop-api

# Configure environment variables
heroku config:set ENVIRONMENT=production
heroku config:set ALLOWED_ORIGINS=https://simeonshop.rs
heroku config:set DATABASE_URL=your_database_url

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub
2. Select "Python" as environment
3. Set environment variables
4. Configure startup command: `uvicorn app.main:app --host 0.0.0.0`
5. Deploy

### Option 4: Docker + Docker Compose

```bash
# Build images
docker-compose build

# Push to registry
docker tag simeonshop-web your-registry/simeonshop-web:latest
docker push your-registry/simeonshop-web:latest

docker tag simeonshop-api your-registry/simeonshop-api:latest
docker push your-registry/simeonshop-api:latest

# Deploy to production server
# Update docker-compose.yml with image references
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Environment Variables

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.simeonshop.rs
```

### Backend (.env.production)
```env
ENVIRONMENT=production
ALLOWED_ORIGINS=https://simeonshop.rs,https://www.simeonshop.rs
HOST=0.0.0.0
PORT=8000
DATABASE_URL=postgresql://user:password@host/dbname
SECRET_KEY=your-secret-key-here
```

## 🔐 Security Considerations

### HTTPS/SSL
- Enable HTTPS on all endpoints
- Use Let's Encrypt for free certificates
- Redirect HTTP to HTTPS

### CORS
Update `ALLOWED_ORIGINS` for production domains:
```env
ALLOWED_ORIGINS=https://simeonshop.rs,https://www.simeonshop.rs
```

### Database
- Use strong passwords
- Enable SSL connections
- Regular backups
- Restrict access by IP

### API Keys & Secrets
- Use environment variables
- Rotate keys regularly
- Never commit to repository
- Use secret management tools

## 📊 Monitoring & Logging

### Frontend
- Sentry for error tracking
- Google Analytics for usage
- Lighthouse CI for performance

### Backend
- Sentry for error tracking
- Application logging
- Database query logging
- Request/response logging

### Setup Sentry
```python
# app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    environment=os.getenv("ENVIRONMENT"),
)
```

## 🚀 Scaling Strategy

### Phase 1: MVP (Current Setup)
- Netlify: Frontend
- Railway/Heroku: Backend
- SQLite: Database (local file)

### Phase 2: Growth
- Netlify Pro: CDN, custom domain
- Dedicated server: Backend
- PostgreSQL: Database

### Phase 3: Enterprise
- CloudFlare: CDN & DDoS protection
- Kubernetes: Container orchestration
- Managed database: AWS RDS, Google Cloud SQL
- Load balancing: Nginx, AWS ALB

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend
        run: netlify deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
      
      - name: Deploy Backend
        run: |
          git push heroku main
        env:
          HEROKU_AUTH_TOKEN: ${{ secrets.HEROKU_AUTH_TOKEN }}
```

## 📈 Performance Optimization

### Frontend
```bash
# Analyze bundle
npm run analyze

# Results suggest:
# - Code splitting
# - Image optimization
# - Font loading strategy
```

### Backend
```python
# Add caching
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend

# Add compression
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

## 🚨 Rollback Procedure

### Frontend (Netlify)
1. Go to Deploy History
2. Click "Rollback" on previous deployment
3. Confirm

### Backend (Heroku)
```bash
heroku releases
heroku rollback v42
```

## 📋 Post-Deployment

- [ ] Test all features in production
- [ ] Verify API connectivity
- [ ] Check error monitoring
- [ ] Monitor performance metrics
- [ ] Send notifications to team
- [ ] Document deployment
- [ ] Plan next updates

## 🐛 Troubleshooting

### Frontend not loading
- Check Netlify deployment logs
- Verify environment variables
- Clear browser cache (Ctrl+Shift+Del)
- Check CORS headers in API response

### API not responding
- Check server logs: `heroku logs --tail`
- Verify database connection
- Check environment variables
- Restart application

### Slow performance
- Check server resources
- Review database queries
- Enable caching
- Implement CDN

## 📞 Support

- Platform documentation: See individual platform docs
- GitHub Issues: Report problems
- Email: ops@simeonshop.rs

---

**Last Updated**: January 2024
**Maintained by**: DevOps Team
