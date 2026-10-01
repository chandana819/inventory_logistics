# Intelligent Inventory & Logistics Management System

A comprehensive full-stack web application for managing inventory, orders, shipments, and suppliers with AI-powered insights for demand prediction and delay forecasting.

## 🎯 Features

### Core Functionality
- ✅ **Product Management** - Add, update, delete products with categories and suppliers
- ✅ **Inventory Tracking** - Real-time stock levels, warehouse management
- ✅ **Order Management** - Create, track orders with status updates (Pending → Confirmed → Packed → Shipped → Delivered)
- ✅ **Shipment Tracking** - Track deliveries in real-time with carrier integration
- ✅ **Supplier Management** - Maintain supplier details, ratings, and contact information
- ✅ **Dashboard** - Role-based dashboards with key metrics and trends

### AI & Analytics
- 🤖 **Demand Forecasting** - Predict future demand using historical data
- 🔮 **Smart Reorder Recommendations** - Get intelligent suggestions for when to reorder
- 📊 **Anomaly Detection** - Identify unusual patterns in inventory and orders
- ⚠️ **Delivery Delay Prediction** - Predict shipments at risk of delays
- 📈 **Analytics & Reports** - Sales trends, top products, delivery performance

### Security & Access Control
- 🔐 **JWT Authentication** - Secure login with JWT tokens
- 👤 **Role-Based Access Control (RBAC)** - Different permissions for Admin, Inventory Manager, Logistics Manager, Supplier, Customer
- 🔒 **Password Encryption** - bcrypt hashing for secure password storage

## 🏗️ Architecture

```
Inventory & Logistics Management System
│
├── Frontend (React + Vite)
│   ├── Login/Registration
│   ├── Dashboard (Role-aware)
│   ├── Inventory Management
│   ├── Order Management
│   ├── Shipment Tracking
│   ├── Supplier Management
│   └── AI Insights Page
│
├── Backend (FastAPI)
│   ├── Auth Module (JWT, RBAC)
│   ├── Product API
│   ├── Order API
│   ├── Shipment API
│   ├── Supplier API
│   └── AI Insights API
│
└── Database (PostgreSQL)
    ├── Users & Roles
    ├── Products & Categories
    ├── Inventory & Warehouses
    ├── Orders & Items
    ├── Shipments
    └── Suppliers
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide Icons** - Icon library
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation
- **JWT** - Authentication
- **scikit-learn** - ML for predictions
- **Pandas, NumPy** - Data processing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL Docker** - Database container

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- OR Python 3.11+ and Node.js 18+
- PostgreSQL 15+ (if not using Docker)

### Option 1: Docker Setup (Recommended)

```bash
# 1. Navigate to project root
cd pe

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start all services
docker-compose up -d

# 4. Seed the database with sample data
docker-compose exec backend python seed.py

# 5. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env
# Edit .env with your settings

# 5. Seed database
python seed.py

# 6. Run server
uvicorn main:app --reload
```

#### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Run development server
npm run dev
```

## 📝 Default Credentials

The seeded database includes these test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@inventory.com | admin123 | Admin |
| inv_manager@inventory.com | manager123 | Inventory Manager |
| logistics@inventory.com | logistics123 | Logistics Manager |
| supplier@inventory.com | supplier123 | Supplier |
| customer@inventory.com | customer123 | Customer |

## 📚 API Documentation

Once the backend is running, visit:
- **Interactive Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)

### Key API Endpoints

```
Authentication
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login & get token
GET    /api/v1/auth/me                - Get current user

Products
GET    /api/v1/products/              - List products
POST   /api/v1/products/              - Create product
GET    /api/v1/products/{id}          - Get product
PUT    /api/v1/products/{id}          - Update product
DELETE /api/v1/products/{id}          - Delete product
GET    /api/v1/products/stock/low     - Get low stock items

Orders
GET    /api/v1/orders/                - List orders
POST   /api/v1/orders/                - Create order
GET    /api/v1/orders/{id}            - Get order
PUT    /api/v1/orders/{id}            - Update order status

Shipments
GET    /api/v1/shipments/             - List shipments
POST   /api/v1/shipments/             - Create shipment
GET    /api/v1/shipments/{id}         - Get shipment
GET    /api/v1/shipments/tracking/{no}- Track by number

Suppliers
GET    /api/v1/suppliers/             - List suppliers
POST   /api/v1/suppliers/             - Create supplier
GET    /api/v1/suppliers/{id}         - Get supplier

AI Insights
GET    /api/v1/ai/forecast/{id}      - Demand forecast
GET    /api/v1/ai/reorder-recommendations - Reorder suggestions
GET    /api/v1/ai/anomalies           - Anomaly alerts
GET    /api/v1/ai/delivery-delays     - Delay predictions
```

## 🎨 Pages & Features

### Login/Register Page
- Email & password authentication
- Role selection during registration
- JWT token management

### Dashboard
- **Key Metrics**: Total products, stock value, pending orders, in-transit shipments
- **Low Stock Alert**: Products below reorder level
- **Delayed Shipments**: Predicted delays with probability
- **Anomaly Alerts**: Unusual inventory patterns
- **Charts**: Stock distribution, recent activity stats

### Products Page
- Search and filter products
- Add new products with category and supplier
- Edit product details
- Soft delete (mark inactive)
- Stock status indicators (Low Stock / In Stock)

### Orders Page
- Create new orders
- Filter by status (Pending, Confirmed, Packed, Shipped, Delivered)
- View order details and items
- Update order status with validation
- Order history and tracking

### Shipments Page
- Track shipments in real-time
- Search by tracking number
- Filter by status
- View source, destination, carrier
- Delay predictions and alerts

### Suppliers Page
- List all suppliers
- Add new suppliers
- Edit supplier details and ratings
- View supplied products
- Supplier performance metrics

### AI Insights Page
- **Demand Forecast**: Chart showing historical and predicted demand
- **Reorder Recommendations**: Smart suggestions with priority levels
- **Anomaly Alerts**: Real-time alerts for unusual patterns
- **Delivery Delays**: Predictions with probability and estimated days late

## 🔒 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- All reports and analytics

### Inventory Manager
- Product management
- Stock management
- Reorder recommendations
- Inventory reports

### Logistics Manager
- Shipment management
- Delivery tracking
- Route optimization
- Delivery performance reports

### Supplier
- Update supply information
- View order history
- Manage pricing

### Customer
- Create orders
- View own order history
- Track shipments

## 📊 Database Schema

See [Database Schema Documentation](docs/DATABASE.md) for detailed schema information.

## 🧪 Testing

```bash
# Run backend tests
cd backend
pytest

# Run frontend tests
cd frontend
npm run test
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
uvicorn main:app --port 8001
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check database credentials in .env
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
```

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

npm install
```

## 📈 Deployment

### Deploy Backend to Cloud

**Using Render:**
1. Create GitHub repository
2. Push code to GitHub
3. Connect to Render
4. Deploy with `uvicorn main:app --host 0.0.0.0`

**Using Heroku:**
```bash
heroku login
heroku create your-app-name
heroku config:set DATABASE_URL=your_postgres_url
git push heroku main
```

### Deploy Frontend to Cloud

**Using Vercel:**
```bash
npm install -g vercel
vercel login
vercel
```

**Using Netlify:**
```bash
npm run build
# Deploy dist/ folder to Netlify
```

## 📖 Additional Documentation

- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@inventory-system.com

## 🎓 Learning Resources

- [FastAPI Official Docs](https://fastapi.tiangolo.com/)
- [React Official Docs](https://react.dev/)
- [SQLAlchemy ORM Tutorial](https://docs.sqlalchemy.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Docker Guide](https://docs.docker.com/)

---

**Built with ❤️ for modern inventory management**
