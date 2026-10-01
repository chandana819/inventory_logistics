# VERCEL DEPLOYMENT - STEP BY STEP

## Prerequisites

- ✅ GitHub repository with your code
- ✅ Vercel account (https://vercel.com)
- ✅ Railway account (https://railway.app)
- ✅ 15 minutes of setup time

---

## Architecture Diagram

```
┌─────────────────────────┐
│    Your GitHub Repo     │
│  (Code + Configuration) │
└────────┬────────────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
    ┌─────────────┐        ┌──────────────┐
    │   Vercel    │        │   Railway    │
    │  Frontend   │        │   Backend    │
    └─────────────┘        └──────┬───────┘
         │                        │
         │ Fetches               │ Connected
         │ from                  │ to
         │                        ▼
         │                   ┌──────────────┐
         │                   │  PostgreSQL  │
         │                   │   Database   │
         └──────────┬────────┘
                    │
                    ▼
              Users Access
```

---

## RAILWAY BACKEND DEPLOYMENT

### Step 1: Prepare Your Code

Push your code to GitHub:

```bash
cd pe

# If not already a Git repository
git init
git add .
git commit -m "Initial commit - Full stack inventory system"
git remote add origin https://github.com/YOUR_USERNAME/inventory-system.git
git branch -M main
git push -u origin main
```

✅ **What to commit**:
- ✅ `backend/` folder
- ✅ `frontend/` folder
- ✅ All configuration files
- ✅ `.env.example` files

❌ **What NOT to commit**:
- ❌ `.env` files (contains secrets)
- ❌ `__pycache__/` folders
- ❌ `node_modules/` folders
- ❌ `.venv/` folders

---

### Step 2: Create Railway Project

**Action**: Go to https://railway.app

1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
   
   ![Select GitHub deployment]
   
3. **Connect GitHub** (if not already connected):
   - Click "GitHub" option
   - Authorize Railway to access your repositories
   
4. **Select Your Repository**:
   - Find your `inventory-system` repository
   - Click to select it

5. **Select Deployment Path**:
   - Framework: Python
   - Root Directory: `backend`
   - Click **"Deploy"**

**Expected Result**: Railway starts building your backend

---

### Step 3: Add PostgreSQL Database

In the Railway project dashboard:

1. Click **"New"** button (upper right)
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Wait for it to initialize (~30 seconds)

✅ **Result**: PostgreSQL service connected to your backend

Railway will automatically provide `DATABASE_URL` environment variable.

---

### Step 4: Set Environment Variables

**In Railway Dashboard**:

1. Click on **"Backend"** service (your Python app)
2. Click **"Variables"** tab
3. Copy these variables and paste:

```
SECRET_KEY=[GENERATED_KEY]
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
PROJECT_NAME=Inventory Management System
PROJECT_VERSION=1.0.0
API_V1_STR=/api/v1
ORIGINS=["https://PLACEHOLDER.vercel.app"]
```

> **Generate SECRET_KEY** (run locally):
> ```bash
> python -c "import secrets; print(secrets.token_urlsafe(32))"
> ```

> **ORIGINS**: For now use placeholder. Update after Vercel deployment.

**After adding variables**:
- Click "Deploy" or "Redeploy" button
- Wait for redeploy to complete

✅ **Check your backend service logs**:
- Should show: `Uvicorn running on 0.0.0.0:PORT`

---

### Step 5: Seed Database

Your backend needs initial data (products, orders, users, etc.).

**In Railway Dashboard**:

1. Click **"Backend"** service
2. Click **"Shell"** button (terminal icon)
3. Run:
   ```bash
   python seed.py
   ```
4. Wait for completion
5. Exit shell: `exit` or `Ctrl+D`

✅ **What gets seeded**:
- 5 test users (admin, manager, logistics, supplier, customer)
- 5 product categories
- 3 suppliers
- 6 sample products
- 5 sample orders
- 4 sample shipments

---

### Step 6: Get Your Backend URL

**In Railway Dashboard**:

1. Click **"Backend"** service
2. Look for **"Deployments"** section
3. Find the active deployment
4. Copy the URL (looks like: `https://your-backend.up.railway.app`)

**Save this URL** - you'll need it for Vercel setup!

---

## VERCEL FRONTEND DEPLOYMENT

### Step 1: Prepare Frontend

**In your local repository**:

```bash
cd frontend

# Update .env.production with your Railway URL
# VITE_API_URL=https://your-backend.up.railway.app
```

Edit `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.up.railway.app
VITE_APP_NAME=Inventory Management System
```

Commit the change:
```bash
cd ..  # Back to project root
git add frontend/.env.production
git commit -m "Update API URL for production"
git push
```

---

### Step 2: Create Vercel Project

**Action**: Go to https://vercel.com

1. Click **"Add New"**
2. Select **"Project"**
   
   ![Vercel New Project]

3. **Select Import Repository**:
   - Find your repository in the list
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Environment Variables**:
   - Add Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.up.railway.app`
   - Click "Add"

   ![Add Environment Variable]

6. **Deploy**:
   - Click **"Deploy"** button
   - Wait for build and deployment (~3-5 minutes)

✅ **Expected Result**: Your frontend is live with a Vercel URL (https://your-app.vercel.app)

---

### Step 3: Copy Your Frontend URL

When deployment completes:
1. Vercel shows your live URL
2. Copy it (e.g., `https://my-inventory-app.vercel.app`)

**Save this URL** - you'll use it to update backend CORS!

---

## CONNECT SERVICES

### Step 1: Update Backend CORS Settings

Go back to **Railway Dashboard**:

1. Click **"Backend"** service
2. Click **"Variables"** tab
3. Find **`ORIGINS`** variable
4. Update it with your Vercel URL:
   ```
   ORIGINS=["https://my-inventory-app.vercel.app"]
   ```
5. Click **"Deploy"** or **"Redeploy"**

✅ **Result**: Backend now accepts requests from your Vercel frontend

---

### Step 2: Trigger Frontend Redeploy

**In Vercel Dashboard**:

1. Go to your project
2. Click **"Deployments"**
3. Click **"Redeploy"** on the most recent deployment
4. Or: Make a code change and push to GitHub (auto-deploys)

✅ **Result**: Frontend rebuilds with latest configuration

---

## TESTING DEPLOYMENT

### Test 1: Check Backend API

**Open** `https://your-backend.up.railway.app/docs`

Expected: FastAPI Swagger UI loads with all endpoints visible

### Test 2: Check Login Endpoint

```bash
curl -X POST https://your-backend.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inventory.com","password":"admin123"}'
```

Expected response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Test 3: Browser Frontend

**Open**: `https://my-inventory-app.vercel.app`

Expected:
1. ✅ Landing page loads
2. ✅ No CORS errors in browser console (F12)
3. ✅ Login page displays

### Test 4: Login Flow

1. Go to `https://my-inventory-app.vercel.app`
2. Enter credentials:
   - Email: `admin@inventory.com`
   - Password: `admin123`
3. Click Login

Expected: ✅ Dashboard loads with data

### Test 5: Full Feature Test

1. ✅ Dashboard shows metrics (products, orders)
2. ✅ Products page loads and shows sample products
3. ✅ Can create new product
4. ✅ Orders page works
5. ✅ Shipments show tracking
6. ✅ AI Insights displays predictions

---

## MONITORING & MANAGING

### Railway Monitoring

1. Go to Railway Dashboard
2. Select your project
3. **Deployments**: View deployment history
4. **Logs**: Real-time application logs
5. **Metrics**: CPU, memory, disk usage
6. **Alerts**: Set up notifications

Monitor commands:
```bash
# View live logs
railway logs

# SSH into container
railway shell

# Check status
railway status
```

### Vercel Monitoring

1. Go to Vercel Dashboard
2. Select your project
3. **Deployments**: View past deployments
4. **Analytics**: Performance metrics
5. **Logs**: Build and runtime logs
6. **Settings**: Manage environment variables

---

## TROUBLESHOOTING COMMON ERRORS

### Error 1: CORS Error (Frontend can't reach backend)

**Symptoms**:
- Browser console shows: `CORS error: Access-Control-Allow-Origin`
- Login page shows error

**Fix**:
```bash
# 1. Check ORIGINS in Railway Variables
ORIGINS=["https://my-inventory-app.vercel.app"]

# 2. Redeploy Railway
railway up

# 3. Hard refresh frontend (Ctrl+Shift+R)
```

---

### Error 2: 401 Unauthorized (Login fails)

**Symptoms**:
- Login button doesn't work
- Console shows: `401 Unauthorized`

**Fix**:
```bash
# 1. Verify credentials in database
railway shell
python -c "from app.core.database import SessionLocal; from app.models.models import User; s = SessionLocal(); print(s.query(User).first())"

# 2. If no users, reseed:
python seed.py

# 3. Exit shell
exit
```

---

### Error 3: 422 Unprocessable Entity (Database error)

**Symptoms**:
- API returns 422 error
- Database operations fail

**Fix**:
```bash
# 1. Check if tables exist
railway shell
psql $DATABASE_URL -c "\dt"

# 2. If missing, create tables:
python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"

# 3. Exit and reseed
python seed.py
exit
```

---

### Error 4: Database Connection Refused

**Symptoms**:
- Backend logs show `connection refused`
- Can't query database

**Fix**:
```bash
# 1. Verify PostgreSQL is running in Railway
# Go to Railway Dashboard → check if PostgreSQL service is green

# 2. Check DATABASE_URL format
# Should be: postgresql://user:password@host:port/dbname

# 3. Restart services
railway deploy

# 4. Test connection
railway shell
python -c "import psycopg2; print('Connected!')"
```

---

### Error 5: 403 Forbidden (Insufficient permissions)

**Symptoms**:
- Can't create products
- Can't manage orders
- API returns 403

**Fix**:
```bash
# 1. Check user role
# Admin can do everything
# Other roles have limited access

# 2. Login as admin:
Email: admin@inventory.com
Password: admin123

# 3. Or update user role in database:
railway shell
psql $DATABASE_URL -c "UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';"
exit
```

---

### Error 6: Frontend Blank/Won't Load

**Symptoms**:
- Frontend shows blank page
- Network errors in console

**Fix**:
```bash
# 1. Check VITE_API_URL in Vercel
# Vercel Dashboard → Project Settings → Environment Variables
# Should be: https://your-backend.up.railway.app

# 2. Trigger rebuild
# Vercel Dashboard → Deployments → Click recent → Redeploy

# 3. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# 4. Check browser console for errors (F12 → Console)
```

---

## PERFORMANCE OPTIMIZATION

### For Backend (Railway)

```
Current: Python 3.11 on Railway free tier
- Can handle ~100 concurrent users
- ~50ms response times for queries

Optimize:
1. Add caching (Redis)
2. Optimize database queries
3. Add indexes
4. Use connection pooling
```

### For Frontend (Vercel)

```
Current: Built with Vite
- Uses CDN for global distribution
- Automatic caching
- Minified assets

Already optimized:
✅ Lazy-loaded components
✅ Code splitting
✅ Image optimization
✅ CSS minification
```

---

## UPDATING AFTER DEPLOYMENT

### To Update Frontend

```bash
# Make changes locally
cd frontend
# ... edit files ...

# Commit and push
cd ..
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push
# Go to Vercel Dashboard → Deployments (should show new build)
```

### To Update Backend

```bash
# Make changes locally
cd backend
# ... edit files ...

# Commit and push
cd ..
git add .
git commit -m "Update API"
git push

# Railway auto-deploys on push
# Go to Railway Dashboard → Deployments (should show new build)
```

### To Update Database

```bash
# SSH into Railway
railway shell

# Run migrations or updates
python seed.py  # Re-seed if needed

# Exit
exit
```

---

## ROLLBACK (If Something Goes Wrong)

### Rollback Frontend (Vercel)

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find working deployment
4. Click "**...**" → "Promote to Production"

### Rollback Backend (Railway)

1. Go to Railway Dashboard
2. Click "Deployments"
3. Find working deployment
4. Click "Redeploy"

---

## NEXT STEPS (POST-DEPLOYMENT)

### 1. Custom Domain (Optional)

**For Frontend**:
- Vercel → Project Settings → Domains
- Add your domain
- Update DNS records

**For Backend**:
- Railway → Project Settings → Domains
- Add your domain
- Update DNS records

### 2. Email Notifications (Advanced)

Add to backend:
```python
from fastapi_mail import FastMail, MessageSchema

async def send_order_confirmation(email: str, order_id: int):
    message = MessageSchema(
        subject="Order Confirmation",
        recipients=[email],
        body=f"Your order #{order_id} has been confirmed",
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
```

### 3. Monitoring & Alerts

**Railway**:
- Set up alerts for high CPU
- Alert on deploy failure
- Alert on process crash

**Vercel**:
- Monitor analytics
- Set up error tracking (Sentry)
- Monitor build times

### 4. Scaling

If you get more users:
- Upgrade Railway plan (more resources)
- Vercel automatically scales (no action needed)
- Add database replicas

---

## DEPLOYMENT SUMMARY

| Step | Service | Time | Status |
|------|---------|------|--------|
| 1 | Push to GitHub | 1 min | ✅ |
| 2 | Deploy Backend to Railway | 2 min | ✅ |
| 3 | Add PostgreSQL | 1 min | ✅ |
| 4 | Set Environment Variables | 2 min | ✅ |
| 5 | Seed Database | 1 min | ✅ |
| 6 | Deploy Frontend to Vercel | 3 min | ✅ |
| 7 | Connect Services | 2 min | ✅ |
| 8 | Test Everything | 3 min | ✅ |
| **TOTAL** | | **15 min** | ✅ |

---

## SUCCESS CHECKLIST

Before considering deployment complete:

- [ ] Backend running on Railway
- [ ] PostgreSQL connected and initialized
- [ ] Database seeded with sample data
- [ ] Frontend running on Vercel
- [ ] Login works with test credentials
- [ ] Dashboard displays data
- [ ] Can create products
- [ ] Can create orders
- [ ] Can view shipments
- [ ] AI insights load
- [ ] No errors in browser console
- [ ] No errors in Railway logs
- [ ] Performance is acceptable
- [ ] Backups configured (if needed)

---

**Congratulations! Your app is deployed!** 🎉

💬 **Need help?**
- Check logs: Railway Dashboard or Vercel Dashboard
- Read full guide: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- Quick reference: [VERCEL_QUICK_START.md](VERCEL_QUICK_START.md)

