# 🚀 Quick Reference Card

## 5-Second Start
```bash
cd pe && docker-compose up -d && docker-compose exec backend python seed.py
# Open http://localhost:5173
```

## 📱 Default Login
```
Email: admin@inventory.com | Password: admin123
```

## 📂 Project Layout
```
pe/
├── backend/          → FastAPI (Python) - Port 8000
├── frontend/         → React (Node.js) - Port 5173
├── docker-compose.yml
├── README.md         → Full documentation
├── SETUP.md          → Installation guide
└── API_REFERENCE.md  → API documentation
```

## 🎮 Main Features

| Page | Purpose | Route |
|------|---------|-------|
| **Dashboard** | Overview & metrics | `/dashboard` |
| **Products** | Manage inventory | `/products` |
| **Orders** | Track orders | `/orders` |
| **Shipments** | Track deliveries | `/shipments` |
| **AI Insights** | Predictions & alerts | `/ai-insights` |

## 🔌 Backend Services

| Service | URL | Command |
|---------|-----|---------|
| API | http://localhost:8000 | `uvicorn main:app --reload` |
| Swagger Docs | http://localhost:8000/docs | Auto |
| Database | localhost:5432 | PostgreSQL |

## 💾 Database Commands

```bash
# Access database
docker-compose exec db psql -U user -d inventory_db

# Seed data
docker-compose exec backend python seed.py

# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec backend python seed.py
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild images
docker-compose build
```

## 🧪 Test Users

| Email | Password | Role |
|-------|----------|------|
| admin@inventory.com | admin123 | Admin |
| inv_manager@inventory.com | manager123 | Manager |
| logistics@inventory.com | logistics123 | Logistics |
| customer@inventory.com | customer123 | Customer |

## 🔌 Key API Endpoints

```
POST   /api/v1/auth/login               → Login
POST   /api/v1/auth/register            → Register
GET    /api/v1/products/                → List products
POST   /api/v1/orders/                  → Create order
GET    /api/v1/shipments/               → List shipments
GET    /api/v1/ai/reorder-recommendations → Reorder suggestions
GET    /api/v1/ai/delivery-delays       → Delay predictions
```

## 💡 Usage Tips

1. **First Login**: Use admin account to explore all features
2. **Create Products**: Add from Products page
3. **Create Orders**: Use Products → Orders page
4. **Track Shipments**: View in Shipments page
5. **Check Insights**: AI Insights shows predictions

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5173 in use | `lsof -i :5173 \| awk '{print $2}' \| xargs kill` |
| DB connection failed | Check `.env` DATABASE_URL |
| Module not found | `pip install -r requirements.txt` |
| Blank page | Clear cache & hard refresh (Ctrl+Shift+R) |

## 📚 Documentation

- **Complete Guide** → [README.md](README.md)
- **Installation** → [SETUP.md](SETUP.md)
- **API Docs** → [API_REFERENCE.md](API_REFERENCE.md)
- **Quickstart** → [GETTING_STARTED.md](GETTING_STARTED.md)
- **Summary** → [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🎯 Next Steps

1. ✅ Start services: `docker-compose up -d`
2. ✅ Login with admin account
3. ✅ Explore Dashboard
4. ✅ Create sample products
5. ✅ Create test orders
6. ✅ Check AI Insights
7. ✅ Review API documentation at `/docs`

## 🚀 Deploy to Production

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin main

# Deploy to Cloud (e.g., Render, Heroku, AWS)
# Set environment variables
# Deploy from git repository
```

## 📞 File Structure Reference

```
Backend:
  main.py              → App entry point
  app/api/             → Route handlers
  app/services/        → Business logic
  app/models/          → Database models
  app/core/            → Config & security
  app/ai/              → ML models
  seed.py              → Sample data

Frontend:
  src/pages/           → Page components
  src/components/      → Reusable UI
  src/context/         → State management
  src/lib/             → API & utils
  App.jsx              → Router setup
  main.jsx             → Entry point
```

## ⚡ Performance Tips

- Backend API response time: < 200ms
- Frontend bundle size: < 300KB gzipped
- Database queries: Indexed for fast access
- Charts: Optimized for large datasets

---

**💬 Need help? Check the documentation files or review code comments**
