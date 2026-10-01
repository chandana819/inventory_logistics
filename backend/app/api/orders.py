from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.services.order_service import OrderService
from app.schemas import OrderCreate, OrderUpdate, OrderResponse
from app.models import User, OrderStatus

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new order"""
    return OrderService.create_order(db, current_user.id, order)


@router.get("/", response_model=list[OrderResponse])
def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status_filter: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get orders"""
    if status_filter:
        try:
            status_enum = OrderStatus(status_filter)
            return OrderService.get_orders_by_status(db, status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status"
            )
    
    if current_user.role in ["customer"]:
        return OrderService.get_user_orders(db, current_user.id, skip, limit)
    
    return OrderService.get_all_orders(db, skip, limit)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get order by ID"""
    order = OrderService.get_order(db, order_id)
    
    # Users can only view their own orders
    if current_user.role == "customer" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return order


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order_data: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update order status"""
    if current_user.role not in ["admin", "logistics_manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return OrderService.update_order(db, order_id, order_data)
