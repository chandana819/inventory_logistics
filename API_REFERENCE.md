# API Reference

## Authentication

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "customer"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

## Products

### List Products
```http
GET /api/v1/products/?skip=0&limit=100
Authorization: Bearer {token}
```

### Get Product
```http
GET /api/v1/products/{product_id}
Authorization: Bearer {token}
```

### Create Product
```http
POST /api/v1/products/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop",
  "sku": "TECH-001",
  "category_id": 1,
  "supplier_id": 1,
  "price": 1299.99,
  "quantity": 50,
  "reorder_level": 10,
  "description": "High-performance laptop"
}
```

### Update Product
```http
PUT /api/v1/products/{product_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 1199.99,
  "quantity": 45
}
```

### Delete Product
```http
DELETE /api/v1/products/{product_id}
Authorization: Bearer {token}
```

### Search Products
```http
GET /api/v1/products/search/?q=laptop
Authorization: Bearer {token}
```

### Get Low Stock Products
```http
GET /api/v1/products/stock/low
Authorization: Bearer {token}
```

## Orders

### List Orders
```http
GET /api/v1/orders/?skip=0&limit=100&status_filter=pending
Authorization: Bearer {token}
```

### Get Order
```http
GET /api/v1/orders/{order_id}
Authorization: Bearer {token}
```

### Create Order
```http
POST /api/v1/orders/
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 1299.99
    }
  ],
  "notes": "Urgent"
}
```

### Update Order
```http
PUT /api/v1/orders/{order_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "shipped",
  "notes": "Updated notes"
}
```

## Shipments

### List Shipments
```http
GET /api/v1/shipments/?skip=0&limit=100&status_filter=in_transit
Authorization: Bearer {token}
```

### Get Shipment
```http
GET /api/v1/shipments/{shipment_id}
Authorization: Bearer {token}
```

### Track by Tracking Number
```http
GET /api/v1/shipments/tracking/{tracking_number}
Authorization: Bearer {token}
```

### Create Shipment
```http
POST /api/v1/shipments/
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 1,
  "carrier": "FedEx",
  "source_location": "Chicago, IL",
  "destination_location": "New York, NY",
  "expected_delivery": "2024-01-15T10:00:00"
}
```

### Update Shipment
```http
PUT /api/v1/shipments/{shipment_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "delivered",
  "tracking_number": "FX123456789",
  "actual_delivery": "2024-01-15T14:30:00"
}
```

### Get Delayed Shipments
```http
GET /api/v1/shipments/status/delayed
Authorization: Bearer {token}
```

### Get In-Transit Shipments
```http
GET /api/v1/shipments/status/in-transit
Authorization: Bearer {token}
```

## Suppliers

### List Suppliers
```http
GET /api/v1/suppliers/?skip=0&limit=100
Authorization: Bearer {token}
```

### Get Supplier
```http
GET /api/v1/suppliers/{supplier_id}
Authorization: Bearer {token}
```

### Create Supplier
```http
POST /api/v1/suppliers/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Supply Co.",
  "contact_person": "John Smith",
  "email": "contact@techsupply.com",
  "phone": "+1-555-0101",
  "address": "123 Tech St, Silicon Valley, CA"
}
```

### Update Supplier
```http
PUT /api/v1/suppliers/{supplier_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4.8,
  "phone": "+1-555-0102"
}
```

### Delete Supplier
```http
DELETE /api/v1/suppliers/{supplier_id}
Authorization: Bearer {token}
```

## AI Insights

### Get Demand Forecast
```http
GET /api/v1/ai/forecast/{product_id}?days_ahead=30
Authorization: Bearer {token}

Response:
{
  "product_id": 1,
  "product_name": "Laptop",
  "historical_demand": [10, 12, 15, ...],
  "forecasted_demand": [14, 16, 18, ...],
  "confidence": 0.75,
  "forecast_period": "30 days"
}
```

### Get Reorder Recommendations
```http
GET /api/v1/ai/reorder-recommendations
Authorization: Bearer {token}

Response:
[
  {
    "product_id": 1,
    "product_name": "Laptop",
    "current_quantity": 5,
    "reorder_level": 10,
    "recommended_quantity": 50,
    "priority": "high"
  }
]
```

### Detect Anomalies
```http
GET /api/v1/ai/anomalies
Authorization: Bearer {token}

Response:
[
  {
    "type": "stock_anomaly",
    "product_id": 1,
    "severity": "high",
    "description": "Negative inventory for Laptop"
  }
]
```

### Predict Delivery Delays
```http
GET /api/v1/ai/delivery-delays
Authorization: Bearer {token}

Response:
[
  {
    "shipment_id": 1,
    "order_id": 1,
    "tracking_number": "FX123456",
    "expected_delivery": "2024-01-15T10:00:00",
    "delay_probability": 0.45,
    "predicted_delay_days": 3
  }
]
```

### Get Dashboard Metrics
```http
GET /api/v1/ai/dashboard-metrics
Authorization: Bearer {token}

Response:
{
  "total_products": 45,
  "stock_value": 185000.50,
  "low_stock_items": 8,
  "pending_orders": 12,
  "in_transit_shipments": 5,
  "delayed_shipments": 2
}
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "detail": "Error message here"
}
```

### Common Error Codes
- 400: Bad Request
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Rate Limiting & Pagination

- Default limit: 100 items
- Maximum limit: 500 items
- Pagination: Use `skip` and `limit` query parameters

## Authentication Header Format

All protected endpoints require:
```
Authorization: Bearer {access_token}
```

Where `{access_token}` is obtained from login endpoint.
