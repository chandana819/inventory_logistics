# 🚀 VERCEL DEPLOYMENT GUIDE

## Overview

Vercel is optimized for front-end deployments, but we can deploy this full-stack application using:
- **Frontend**: React + Vite → Vercel (native support)
- **Backend**: FastAPI → Vercel Functions (Python) or Railway/Render (alternative)
- **Database**: PostgreSQL → Supabase, Neon, or Railway

---

## Table of Contents
1. [Architecture Options](#architecture-options)
2. [Recommended Setup](#recommended-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)
7. [Deployment Steps](#deployment-steps)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Options

### Option 1: Vercel Frontend + Railway Backend + Neon Database (Recommended)

**Pros**:
- ✅ Simple, managed services
- ✅ Good free tier availability
- ✅ Auto-scaling
- ✅ No modifications needed to FastAPI code
- ✅ Easy to monitor and maintain

**Cons**:
- ❌ Multiple service providers
- ❌ Slightly higher costs
- ❌ Cross-service debugging

### Option 2: Vercel Frontend + Vercel Functions Backend + Supabase Database

**Pros**:
- ✅ Everything on Vercel
- ✅ Integrated monitoring
- ✅ One billing dashboard

**Cons**:
- ❌ Requires refactoring FastAPI → Vercel Functions
- ❌ Cold start delays
- ❌ More complex setup

### Option 3: Vercel Frontend + External VPS + PostgreSQL

**Pros**:
- ✅ Full control
- ✅ Best performance

**Cons**:
- ❌ Higher cost
- ❌ Manual scaling
- ❌ Maintenance overhead

**→ We'll go with Option 1 (Recommended)**

---

## Recommended Setup

```
┌─────────────────────┐
│  GitHub Repository  │
│  (Your code)        │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼──────┐  ┌──▼────────┐
│  Vercel  │  │  Railway   │
│Frontend  │  │  Backend   │
└──────────┘  └──┬─────────┘
               │
          ┌────▼────────┐
          │   Neon      │
          │  PostgreSQL │
          └─────────────┘
```

---

## Frontend Deployment

### Step 1: Prepare Frontend for Vercel

```bash
# Navigate to frontend directory
cd frontend

# Install Vercel CLI (optional but recommended)
npm install -g vercel

# Build frontend locally to test
npm run build

# Should produce dist/ folder with optimized files
```

### Step 2: Configure vercel.json (Optional)

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api_url"
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### Step 3: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
7. Click "Deploy"

### Step 4: Custom Domain (Optional)

1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records according to Vercel instructions

---

## Backend Deployment (Railway - Recommended)

### Why Railway?

- ✅ Direct FastAPI support
- ✅ PostgreSQL included
- ✅ Environment variables management
- ✅ Easy deployment from GitHub
- ✅ Built-in logging

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### Step 2: Deploy Backend

```bash
# Option A: Using Railway CLI
npm i -g @railway/cli
railway login
cd backend
railway init
railway up

# Option B: Using Railway Dashboard (easier)
# 1. Go to dashboard.railway.app
# 2. Click "New Project"
# 3. Select "Deploy from GitHub"
# 4. Choose your repository
# 5. Select the backend folder
```

### Step 3: Configure Railway Project

**Add PostgreSQL Database**:
1. In Railway dashboard, click "New"
2. Select "PostgreSQL"
3. It will auto-connect to your project

**Set Environment Variables**:

In Railway dashboard, go to Backend service settings:

```
SECRET_KEY=<generate-new-secure-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
DATABASE_URL=postgresql://user:password@host:port/dbname
ORIGINS=https://your-frontend-url.vercel.app
API_V1_STR=/api/v1
PROJECT_NAME=Inventory Management System
PROJECT_VERSION=1.0.0
```

> **Note**: Railway automatically provides `DATABASE_URL` when PostgreSQL is added

### Step 4: Create Procfile (for Railway)

Create `backend/Procfile`:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 5: Update requirements.txt

Ensure all dependencies are listed:

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.2
gunicorn==21.2.0
```

### Step 6: Database Migrations

After deployment, seed the database:

```bash
# Using Railway CLI
railway shell backend

# Inside Railway shell
python seed.py
exit
```

Or use Railway dashboard:
1. Open in Railway dashboard
2. Go to your backend service
3. Click "Terminal"
4. Run: `python seed.py`

---

## Alternative: Supabase + Vercel Functions

If you prefer keeping everything on Vercel:

### Step 1: Create Supabase Database

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get database URL from project settings
4. Note the connection details

### Step 2: Convert Backend to Vercel Functions

Create `api/index.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.models import *
from app.api import auth, products, orders, shipments, suppliers, ai_insights
from mangum import Mangum

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(shipments.router)
app.include_router(suppliers.router)
app.include_router(ai_insights.router)

# Handler for Vercel
handler = Mangum(app)
```

### Step 3: Add mangum to requirements.txt

```
mangum==0.17.0
```

### Step 4: Create vercel.json

```json
{
  "buildCommand": "pip install -r requirements.txt",
  "functions": {
    "api/index.py": {
      "memory": 3008,
      "maxDuration": 60
    }
  },
  "env": {
    "DATABASE_URL": "@database_url",
    "SECRET_KEY": "@secret_key"
  }
}
```

---

## Database Setup

### Option 1: Railway PostgreSQL (Automatic)

When you add PostgreSQL to Railway:
- Database is automatically created
- URL provided in `DATABASE_URL` environment variable
- No manual setup needed

### Option 2: Neon (Recommended for Supabase)

1. Go to [neon.tech](https://neon.tech)
2. Sign up
3. Create project
4. Copy connection string
5. Add to environment variables as `DATABASE_URL`

### Option 3: Supabase PostgreSQL

1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Wait for database initialization (~2 min)
4. Go to Settings → Database → Connection String
5. Copy PostgreSQL URL
6. Use as `DATABASE_URL`

---

## Environment Variables

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-railway.up.railway.app
VITE_APP_NAME=Inventory Management System
```

### Backend (Railway)

Set in Railway dashboard:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Security
SECRET_KEY=<use-strong-random-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=False
PROJECT_NAME=Inventory Management System
PROJECT_VERSION=1.0.0
API_V1_STR=/api/v1

# CORS
ORIGINS=["https://your-frontend.vercel.app", "http://localhost:3000"]

# Server
PORT=0  # Vercel/Railway assigns automatically
```

### Generate Secure Secret Key

```python
import secrets
print(secrets.token_urlsafe(32))
# Use the output as SECRET_KEY
```

---

## Deployment Steps

### Complete Flow

#### Step 1: Prepare GitHub Repository

```bash
# At project root
cd pe

# Create .gitignore if not exists
git init
git add .
git commit -m "Initial commit - Full stack inventory system"
git remote add origin https://github.com/YOUR_USERNAME/inventory-system.git
git push -u origin main
```

**Ensure .gitignore includes**:
```
# Backend
backend/venv/
backend/.env
backend/__pycache__/
backend/.pytest_cache/

# Frontend
frontend/node_modules/
frontend/.env.local
frontend/dist/

# General
.DS_Store
```

#### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Specify `backend` folder
6. Add PostgreSQL service:
   - Click "New"
   - Select "PostgreSQL"
   - Configure plugins
7. Set environment variables
8. Deploy
9. Get backend URL from deployments
10. Seed database via terminal

#### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Framework: **Vite**
5. Root Directory: **frontend**
6. Build Command: **npm run build**
7. Output Directory: **dist**
8. Add environment variable:
   ```
   VITE_API_URL=<railroad-backend-url>
   ```
9. Deploy

#### Step 4: Connect Frontend and Backend

1. After both are deployed, get their URLs:
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend.up.railway.app`

2. Update backend CORS in Railway:
   - Set `ORIGINS` to include frontend URL
   - Redeploy or restart

3. Update frontend in Vercel:
   - Set `VITE_API_URL` to backend URL
   - Trigger redeploy

#### Step 5: Verify Deployment

```bash
# Test frontend
curl https://your-app.vercel.app

# Test backend API
curl https://your-backend.up.railway.app/docs

# Test authentication
curl -X POST https://your-backend.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inventory.com","password":"admin123"}'
```

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend API documentation visible at `/docs`
- [ ] Login works with test credentials
- [ ] Can create product
- [ ] Can create order
- [ ] Can place shipment
- [ ] AI insights load
- [ ] Dashboard displays data
- [ ] Search functionality works
- [ ] No CORS errors in browser console

---

## Monitoring & Debugging

### Vercel Frontend

**View Logs**:
1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Click recent deployment
5. View "Runtime logs"

**Debug using browser**:
- Open DevTools (F12)
- Check Console for errors
- Check Network tab for API calls
- Check Application tab for localStorage/token

### Railway Backend

**View Logs**:
1. Go to Railway dashboard
2. Select your project
3. Click "Backend" service
4. View logs in real-time

**Connect to database**:
```bash
# Via Railway CLI
railway connect

# Via psql
psql postgresql://user:password@host:port/dbname
```

**Check deployment status**:
```bash
# View recent deployments
railway status

# View live metrics
# Open Railway dashboard → Backend → Metrics
```

---

## Common Issues & Solutions

### Issue: "CORS error" when calling backend

**Solution**:
```bash
# In Railway backend settings, update ORIGINS:
ORIGINS=["https://your-app.vercel.app", "http://localhost:3000"]

# Restart backend service
```

### Issue: "Database connection refused"

**Solution**:
```bash
# Check DATABASE_URL format:
postgresql://user:password@host:port/dbname

# Verify PostgreSQL is running in Railway
# Check connection string in Railway dashboard

# Test connection:
railway connect postgres
SELECT 1;
```

### Issue: "Module not found" errors in backend

**Solution**:
```bash
# Add missing dependencies to requirements.txt
# Redeploy

# Or update via Railway terminal:
pip install <package_name>
```

### Issue: Frontend can't reach backend API

**Solution**:
```bash
# 1. Check VITE_API_URL in Vercel environment variables
# 2. Verify backend is running: curl <backend-url>
# 3. Check backend CORS settings
# 4. Clear browser cache and hard refresh
```

### Issue: Long startup time on first request

**Solution**:
- This is normal (cold start)
- Use Railway's paid plan for faster startups
- Or use always-on services like Render

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Frontend | ✅ Yes | $20/mo pro |
| Railway Backend | ✅ Yes ($5/mo credits) | Pay as you go |
| Neon Database | ✅ Yes (1GB) | $0.3/GB |
| **Total** | ~$5/mo | ~$20-50/mo |

---

## Scaling Tips

### Frontend (Vercel)
- No scaling needed - Vercel handles automatically
- CDN included globally

### Backend (Railway)
- Increase RAM/CPU in Railway dashboard
- Enable auto-scaling in settings
- Monitor resource usage in metrics

### Database (Railway PostgreSQL)
- View query performance in Railway
- Add indexes for slow queries
- Monitor connections in Railway dashboard

---

## Rollback Procedure

### Frontend
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "Promote to Production"

### Backend
1. Go to Railway dashboard
2. Click "Deployments"
3. Select previous working deployment
4. Click "Redeploy"

---

## Next Steps

1. ✅ Prepare GitHub repository
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Connect services
5. ✅ Test all functionality
6. ✅ Set up monitoring
7. ✅ Configure custom domain (optional)
8. ✅ Set up automated deployments

---

## Useful Links

| Resource | URL |
|----------|-----|
| Vercel Docs | https://vercel.com/docs |
| Railway Docs | https://docs.railway.app |
| FastAPI Deployment | https://fastapi.tiangolo.com/deployment |
| Neon PostgreSQL | https://neon.tech |
| Supabase | https://supabase.com |

---

**Status**: Ready for Vercel Deployment ✅
**Last Updated**: September 2026
**Version**: 1.0
