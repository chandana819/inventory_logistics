# 🚀 VERCEL DEPLOYMENT QUICK START

**Time to Deploy**: ~15 minutes

---

## ⚡ 5-Minute Checklist

Before starting, prepare:
- ✅ GitHub account with your code pushed
- ✅ Vercel account (free tier works)
- ✅ Railway account (free tier works with $5 credits)
- ✅ Secure SECRET_KEY (run: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)

---

## STEP 1: Deploy Backend to Railway (5 min)

```bash
# 1. Go to https://railway.app
# 2. Click "New Project"
# 3. Select "Deploy from GitHub"
# 4. Choose your repository
# 5. Specify folder: backend
# 6. Click "Deploy"
```

**After deployment**:
1. Open Railway dashboard
2. Go to "Plugins" → Add "PostgreSQL"
3. Go to "Variables" and set:
   ```
   SECRET_KEY=<your-generated-key>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DEBUG=False
   PROJECT_NAME=Inventory Management System
   PROJECT_VERSION=1.0.0
   API_V1_STR=/api/v1
   ORIGINS=["https://your-app.vercel.app"]
   ```
   > Railway auto-provides `DATABASE_URL` when PostgreSQL is added

4. **Seed Database**:
   - Click "Backend" service
   - Click "Terminal"
   - Run: `python seed.py`

5. **Get your backend URL**: 
   - Copy from Railway dashboard (e.g., `https://your-backend.up.railway.app`)

---

## STEP 2: Deploy Frontend to Vercel (5 min)

```bash
# 1. Go to https://vercel.com
# 2. Click "Add New Project"
# 3. Import your GitHub repository
# 4. Configure:
#    - Framework: Vite
#    - Root Directory: frontend
#    - Build Command: npm run build
#    - Output Directory: dist
# 5. Add Environment Variable:
#    Name: VITE_API_URL
#    Value: https://your-backend.up.railway.app
# 6. Click "Deploy"
```

**Done!** Your frontend URL will be shown (e.g., `https://your-app.vercel.app`)

---

## STEP 3: Connect Services (2 min)

Go back to **Railway backend**:
1. Open "Variables"
2. Update `ORIGINS`:
   ```
   ORIGINS=["https://your-app.vercel.app"]
   ```
3. Click "Redeploy"

---

## STEP 4: Test Everything

**Login Test**:
```bash
# Replace URL with your Railway backend URL
curl -X POST https://your-backend.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inventory.com","password":"admin123"}'

# Should return: {"access_token": "...", "token_type": "bearer"}
```

**Frontend Test**:
1. Open `https://your-app.vercel.app`
2. Login with:
   - Email: `admin@inventory.com`
   - Password: `admin123`
3. You should see the dashboard

---

## 📝 Environment Variables Reference

### Railway Backend
```env
# Auto-provided by Railway when PostgreSQL plugin is added
DATABASE_URL=postgresql://...

# Set these manually
SECRET_KEY=your-secure-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
PROJECT_NAME=Inventory Management System
PROJECT_VERSION=1.0.0
API_V1_STR=/api/v1
ORIGINS=["https://your-app.vercel.app"]
```

### Vercel Frontend
```env
VITE_API_URL=https://your-backend.up.railway.app
VITE_APP_NAME=Inventory Management System
```

---

## 🔧 Troubleshooting

### "Frontend can't connect to backend"
```bash
# Check Railway is running:
curl https://your-backend.up.railway.app

# Check CORS in Railway Variables - must include your Vercel URL
ORIGINS=["https://your-app.vercel.app"]

# Then redeploy Railway
```

### "Login fails with 422 error"
```bash
# Database might not be seeded
# In Railway Terminal, run:
python seed.py
```

### "Database connection refused"
```bash
# Verify PostgreSQL plugin is added in Railway
# Check DATABASE_URL format: postgresql://user:password@host:port/db
# Restart Railway service
```

### "API returns 403 Forbidden"
```bash
# Check user role in database
# Default admin should have role: "admin"
# If needed, reseed: python seed.py
```

---

## 📊 After Deployment

| URL | Purpose |
|-----|---------|
| `https://your-app.vercel.app` | 🎨 Frontend (React UI) |
| `https://your-backend.up.railway.app` | ⚙️ Backend (FastAPI) |
| `https://your-backend.up.railway.app/docs` | 📖 API Documentation |
| `https://railway.app/project/...` | 📊 Backend Monitoring |

---

## 🔑 Test Credentials

```
Admin:
  Email: admin@inventory.com
  Password: admin123

Inventory Manager:
  Email: manager@inventory.com
  Password: manager123

Logistics Manager:
  Email: logistics@inventory.com
  Password: logistics123

Supplier:
  Email: supplier@inventory.com
  Password: supplier123

Customer:
  Email: customer@inventory.com
  Password: customer123
```

---

## 📈 Next Steps

1. **Custom Domain** (optional):
   - Add domain in Vercel → Project Settings → Domains
   - Update Railway ORIGINS variable

2. **Email Notifications** (advanced):
   - Add email service to backend
   - Send notifications on order/shipment events

3. **Monitoring**:
   - Set up Railway alerts for errors
   - Monitor Vercel analytics dashboard

4. **Scaling**:
   - Increase Railway memory if needed
   - Vercel scales automatically

---

## 💰 Estimated Costs

| Service | Cost |
|---------|------|
| Vercel Frontend | Free (or $20/mo pro) |
| Railway Backend | ~$5-15/mo |
| Railway PostgreSQL | Included |
| **Total** | ~$5-15/mo |

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway backend deployed
- [ ] PostgreSQL added in Railway
- [ ] Backend seeded with data
- [ ] Backend URL copied
- [ ] Vercel frontend deployed
- [ ] VITE_API_URL set in Vercel
- [ ] ORIGINS updated in Railway
- [ ] Frontend loads without errors
- [ ] Login works
- [ ] API documentation loads (`/docs`)
- [ ] Can create product
- [ ] Can create order
- [ ] AI insights load

---

## 🆘 Need Help?

1. **Check Railway Logs**: Railway Dashboard → Backend → Logs
2. **Check Vercel Logs**: Vercel Dashboard → Deployments → Recent → Logs
3. **Check Browser Console**: F12 → Console tab
4. **Test API**: `curl https://your-backend.up.railway.app/`

---

**Status**: Ready for Production ✅
**Estimated Setup Time**: 15 minutes
**Knowledge Required**: ~30 minutes (beginner-friendly)
