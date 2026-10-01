# 🚀 DEPLOYMENT GUIDE

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Checklist](#production-checklist)
4. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ (if not using Docker)
- Git

### Backend Setup (Manual)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update .env with your settings (at minimum, set SECRET_KEY)
# SECRET_KEY should be a random, secure string

# Run database migrations (creates tables)
python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"

# Seed sample data
python seed.py

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Frontend Setup (Manual)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with API URL
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Login with Test Accounts

```
Email: admin@inventory.com
Password: admin123
Role: Admin

Email: manager@inventory.com
Password: manager123
Role: Inventory Manager

Email: logistics@inventory.com
Password: logistics123
Role: Logistics Manager

Email: supplier@inventory.com
Password: supplier123
Role: Supplier

Email: customer@inventory.com
Password: customer123
Role: Customer
```

---

## Docker Deployment

### Prerequisites
- Docker (version 20.10+)
- Docker Compose (version 1.29+)

### Quick Start (Recommended)

```bash
# Navigate to project root
cd pe

# Start all services
docker-compose up -d

# Seed the database
docker-compose exec backend python seed.py

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Database: postgresql://localhost:5432
```

### Service Management

```bash
# View running services
docker-compose ps

# Stop services
docker-compose down

# Remove all data and start fresh
docker-compose down -v

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db

# View backend logs
docker-compose logs backend -f

# Execute commands in backend
docker-compose exec backend python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"

# Database access
docker-compose exec db psql -U inventory_user -d inventory_db -c "SELECT COUNT(*) FROM users;"
```

### Custom Configuration

Edit `docker-compose.yml` to customize:

```yaml
environment:
  - DATABASE_URL=postgresql://user:password@db:5432/dbname
  - BACKEND_PORT=8000
  - FRONTEND_PORT=5173
  - DEBUG=False
```

### Volume Management

```bash
# List volumes
docker volume ls | grep pe

# Backup database
docker-compose exec db pg_dump -U inventory_user inventory_db > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U inventory_user -d inventory_db
```

---

## Production Checklist

### Pre-Deployment

- [ ] **Update Environment Variables**
  ```bash
  # Backend .env
  DEBUG=False
  SECRET_KEY=<generate-strong-random-key>
  ALGORITHM=HS256
  ACCESS_TOKEN_EXPIRE_MINUTES=30
  DATABASE_URL=postgresql://user:password@prod-db:5432/inventory
  ORIGINS=https://yourdomain.com
  
  # Frontend .env.production
  VITE_API_URL=https://api.yourdomain.com
  ```

- [ ] **Generate Secure Secret Key**
  ```python
  import secrets
  print(secrets.token_urlsafe(32))
  ```

- [ ] **Database Configuration**
  - Use managed PostgreSQL service (RDS, Azure Database, etc.)
  - Enable automated backups
  - Configure SSL/TLS for connections
  - Set up read replicas for scaling
  - Configure proper security groups

- [ ] **Infrastructure Setup**
  - Use container orchestration (Kubernetes, Docker Swarm)
  - Configure load balancer
  - Set up CDN for static assets
  - Configure SSL/TLS certificates

- [ ] **Security Hardening**
  - Enable HTTPS only
  - Configure CORS properly
  - Set secure cookie flags
  - Implement rate limiting
  - Enable logging and monitoring
  - Set up WAF (Web Application Firewall)

### Deployment Steps

#### Option 1: AWS ECS

```bash
# Push Docker images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker tag backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/inventory-backend:latest
docker tag frontend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/inventory-frontend:latest

docker push <account>.dkr.ecr.us-east-1.amazonaws.com/inventory-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/inventory-frontend:latest

# Create ECS task definitions and services in AWS console
# Update docker-compose.yml for ECS compatibility
```

#### Option 2: Kubernetes

```bash
# Create namespace
kubectl create namespace inventory

# Create secrets
kubectl create secret generic db-credentials \
  --from-literal=username=inventory_user \
  --from-literal=password=<secure-password> \
  -n inventory

# Apply manifests
kubectl apply -f k8s/postgres-deployment.yaml -n inventory
kubectl apply -f k8s/backend-deployment.yaml -n inventory
kubectl apply -f k8s/frontend-deployment.yaml -n inventory

# Verify deployment
kubectl get pods -n inventory
kubectl get services -n inventory

# Scale services
kubectl scale deployment backend --replicas=3 -n inventory
```

#### Option 3: Docker Swarm

```bash
# Initialize Swarm
docker swarm init

# Create overlay network
docker network create -d overlay inventory-net

# Deploy stack
docker stack deploy -c docker-compose.yml inventory

# Monitor stack
docker stack ps inventory
docker service logs inventory_backend -f
```

#### Option 4: Azure Container Instances

```bash
# Build and push images
az acr build --registry <registry-name> --image backend:latest -f backend/Dockerfile .
az acr build --registry <registry-name> --image frontend:latest -f frontend/Dockerfile .

# Deploy using Azure Container Instances or App Service
az container create \
  --resource-group <group> \
  --name inventory-backend \
  --image <registry>/backend:latest \
  --cpu 1 --memory 1 \
  --port 8000
```

### Post-Deployment

- [ ] **Database Initialization**
  - Run migrations
  - Seed initial data
  - Verify database connectivity

- [ ] **Performance Monitoring**
  - Set up APM (Application Performance Monitoring)
  - Configure logging aggregation (ELK, CloudWatch)
  - Monitor CPU, memory, disk usage
  - Track API response times

- [ ] **Backup & Recovery**
  - Schedule daily database backups
  - Test restore procedures
  - Keep backup retention policy
  - Document recovery procedures

- [ ] **Health Checks**
  - Monitor application health endpoints
  - Set up alerting for failures
  - Configure automatic restart policies
  - Test failover scenarios

- [ ] **Security**
  - Enable audit logging
  - Set up intrusion detection
  - Monitor for suspicious activities
  - Keep dependencies updated
  - Regular security scanning

---

## Troubleshooting

### Docker Issues

**Port Already in Use**
```bash
# Find and kill process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti :8000 | xargs kill -9
```

**Database Connection Failed**
```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Manually test connection
docker-compose exec db psql -U inventory_user -d inventory_db -c "SELECT 1;"

# Reset database volume
docker-compose down -v
docker-compose up -d
docker-compose exec backend python seed.py
```

**Backend Not Starting**
```bash
# Check logs
docker-compose logs backend

# Verify requirements are installed
pip install -r backend/requirements.txt

# Check Python version
python --version  # Should be 3.11+
```

**Frontend Build Issues**
```bash
# Clear node_modules and cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+

# Clear Vite cache
rm -rf .vite dist
npm run build
```

### API Issues

**401 Unauthorized**
- Token has expired → Login again
- Token not in header → Check axios interceptor
- Wrong secret key in backend → Update secrets

**403 Forbidden**
- Insufficient permissions → Check user role
- Role not assigned → Run seed.py again
- Endpoint requires specific role → Verify configuration

**404 Not Found**
- Resource deleted → Create new one
- Wrong endpoint URL → Check API_REFERENCE.md
- Database migration failed → Check backend logs

**500 Internal Server Error**
- Backend crash → Check server logs
- Database error → Check PostgreSQL connectivity
- Unhandled exception → Enable DEBUG mode temporarily

### Database Issues

**Database Won't Start**
```bash
# Check PostgreSQL logs
docker-compose logs db

# Verify volume mount
docker volume ls

# Remove and recreate database
docker-compose down -v
docker-compose up -d db
```

**Tables Not Created**
```bash
# Manually create tables
docker-compose exec backend python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"

# Verify tables exist
docker-compose exec db psql -U inventory_user -d inventory_db -c "\dt"
```

**Seed Script Fails**
```bash
# Check error message
docker-compose exec backend python seed.py

# Verify models are correct
docker-compose exec backend python -c "from app.models.models import Base; print([t.name for t in Base.metadata.tables])"

# Re-run with verbose output
docker-compose exec backend python -u seed.py 2>&1
```

### Performance Issues

**Slow API Responses**
1. Check database performance
   ```sql
   EXPLAIN ANALYZE SELECT * FROM products;
   ```

2. Add database indexes
   ```sql
   CREATE INDEX idx_products_category ON products(category_id);
   CREATE INDEX idx_orders_status ON orders(status);
   ```

3. Enable query caching
4. Implement pagination for large result sets

**High Memory Usage**
- Check for memory leaks in code
- Reduce in-memory caching
- Scale to more instances
- Optimize data structures

**Database Connections Exhausted**
- Increase connection pool size
- Reduce connection timeout
- Implement connection pooling
- Monitor active connections

### Security Issues

**Exposed Secrets**
1. Rotate all secrets immediately
2. Update environment variables
3. Redeploy with new secrets
4. Audit logs for breaches

**Database Breach**
1. Change database password
2. Audit user activities (check logs table)
3. Rotate user tokens (deploy new SECRET_KEY)
4. Update all external integrations

**API Rate Limiting**
```python
# Add to main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

---

## Getting Help

1. **Check Documentation**
   - [README.md](README.md)
   - [API_REFERENCE.md](API_REFERENCE.md)
   - [SETUP.md](SETUP.md)

2. **Review Logs**
   - Backend: `docker-compose logs backend -f`
   - Frontend: Browser console (F12)
   - Database: `docker-compose logs db -f`

3. **Test Connectivity**
   - Backend API: `curl http://localhost:8000/`
   - Frontend: `curl http://localhost:5173/`
   - Database: `docker-compose exec db psql -U inventory_user -d inventory_db -c "SELECT 1;"`

4. **Common Fixes**
   - Restart services: `docker-compose restart`
   - Clear cache: `docker system prune -a`
   - Reset environment: `docker-compose down -v && docker-compose up -d`

---

## Support Resources

| Resource | Link |
|----------|------|
| FastAPI Docs | https://fastapi.tiangolo.com |
| React Docs | https://react.dev |
| Docker Docs | https://docs.docker.com |
| PostgreSQL Docs | https://www.postgresql.org/docs |
| Tailwind CSS | https://tailwindcss.com/docs |
| Axios | https://axios-http.com |

---

**Last Updated**: September 2026
**Version**: 1.0
**Status**: Production Ready ✅
