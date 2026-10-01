from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.models import UserRole, OrderStatus, ShipmentStatus


# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.CUSTOMER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Category Schemas
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Supplier Schemas
class SupplierCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    rating: Optional[float] = None


class SupplierResponse(BaseModel):
    id: int
    name: str
    contact_person: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    rating: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Product Schemas
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: int
    supplier_id: int
    price: float
    quantity: int = 0
    reorder_level: int = 10
    sku: str
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    reorder_level: Optional[int] = None
    sku: Optional[str] = None
    image_url: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category_id: int
    supplier_id: int
    price: float
    quantity: int
    reorder_level: int
    sku: str
    image_url: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Warehouse Schemas
class WarehouseCreate(BaseModel):
    name: str
    location: str
    capacity: int = 1000


class WarehouseResponse(BaseModel):
    id: int
    name: str
    location: str
    capacity: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Inventory Schemas
class InventoryResponse(BaseModel):
    id: int
    product_id: int
    warehouse_id: int
    quantity: int
    last_stock_in: Optional[datetime]
    last_stock_out: Optional[datetime]
    last_updated: datetime
    
    class Config:
        from_attributes = True


# Order Item Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float
    
    class Config:
        from_attributes = True


# Order Schemas
class OrderCreate(BaseModel):
    order_items: List[OrderItemCreate]
    notes: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    user_id: int
    order_date: datetime
    status: OrderStatus
    total_amount: float
    notes: Optional[str]
    order_items: List[OrderItemResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Shipment Schemas
class ShipmentCreate(BaseModel):
    order_id: int
    carrier: Optional[str] = None
    source_location: Optional[str] = None
    destination_location: Optional[str] = None
    expected_delivery: Optional[datetime] = None


class ShipmentUpdate(BaseModel):
    status: Optional[ShipmentStatus] = None
    actual_delivery: Optional[datetime] = None
    tracking_number: Optional[str] = None


class ShipmentResponse(BaseModel):
    id: int
    order_id: int
    carrier: Optional[str]
    tracking_number: Optional[str]
    status: ShipmentStatus
    source_location: Optional[str]
    destination_location: Optional[str]
    expected_delivery: Optional[datetime]
    actual_delivery: Optional[datetime]
    delay_predicted: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Purchase Order Schemas
class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float


class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    expected_delivery: Optional[datetime] = None
    items: List[PurchaseOrderItemCreate]


class PurchaseOrderResponse(BaseModel):
    id: int
    supplier_id: int
    order_date: datetime
    expected_delivery: Optional[datetime]
    actual_delivery: Optional[datetime]
    status: str
    total_amount: Optional[float]
    
    class Config:
        from_attributes = True


# AI Insights Schemas
class DemandForecastResponse(BaseModel):
    product_id: int
    product_name: str
    historical_demand: List[int]
    forecasted_demand: List[int]
    confidence: float
    forecast_period: str


class ReorderRecommendation(BaseModel):
    product_id: int
    product_name: str
    current_quantity: int
    reorder_level: int
    recommended_quantity: int
    priority: str  # high, medium, low


class AnomalyAlert(BaseModel):
    type: str  # stock_anomaly, order_anomaly, shipment_anomaly
    product_id: Optional[int]
    order_id: Optional[int]
    shipment_id: Optional[int]
    severity: str  # high, medium, low
    description: str


class DeliveryDelayPrediction(BaseModel):
    shipment_id: int
    order_id: int
    tracking_number: Optional[str]
    expected_delivery: datetime
    delay_probability: float
    predicted_delay_days: int
