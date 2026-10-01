# Setup Guide

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed
- Git installed

### Steps

1. **Clone the repository**
   ```bash
   cd pe
   ```

2. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   docker-compose exec backend python seed.py
   ```

5. **Access application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Manual Setup (Without Docker)

### Backend Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # Activate on Windows
   venv\Scripts\activate
   
   # Activate on Mac/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure database**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your PostgreSQL connection
   # Default: postgresql://user:password@localhost:5432/inventory_db
   ```

4. **Initialize database**
   ```bash
   python seed.py
   ```

5. **Start backend**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Install Node.js** (18+)

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Update VITE_API_URL if needed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Configuration

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Inventory & Logistics Management
```

## Database Setup

### PostgreSQL Installation

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer
- Remember password for postgres user

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```bash
psql -U postgres -c "CREATE DATABASE inventory_db OWNER postgres"
```

## Verification

1. **Check Backend**
   ```bash
   curl http://localhost:8000/
   # Should return: {"name": "Inventory & Logistics Management", ...}
   ```

2. **Check Database Connection**
   ```bash
   curl http://localhost:8000/api/health
   # Should return: {"status": "healthy"}
   ```

3. **Check Frontend**
   - Visit http://localhost:5173
   - Should see login page

4. **Test Login**
   - Email: admin@inventory.com
   - Password: admin123

## Troubleshooting

### Issue: Port Already in Use
```bash
# Kill process on port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
uvicorn main:app --port 8001
```

### Issue: PostgreSQL Connection Failed
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Or using Docker
docker-compose ps
```

### Issue: Module Not Found
```bash
# Reinstall Python dependencies
pip install -r requirements.txt --force-reinstall --no-cache-dir

# Reinstall Node dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Cannot Access Frontend
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Check if port 5173 is in use

## Stopping Services

### With Docker
```bash
docker-compose down
```

### Without Docker
- Backend: Press Ctrl+C in terminal
- Frontend: Press Ctrl+C in terminal

## Next Steps

1. Log in with test credentials
2. Explore the Dashboard
3. Create sample products and orders
4. Check AI Insights
5. Review API documentation at http://localhost:8000/docs
