from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from fastapi import HTTPException, status
from datetime import datetime
from app.models import Order, OrderItem, OrderStatus, Product
from app.schemas import OrderCreate, OrderUpdate


class OrderService:
    """Order management service"""
    
    @staticmethod
    def create_order(db: Session, user_id: int, order_data: OrderCreate) -> Order:
        """Create new order"""
        # Validate all products exist
        total_amount = 0.0
        
        order = Order(user_id=user_id)
        db.add(order)
        db.flush()  # Flush to get order ID
        
        for item_data in order_data.order_items:
            product = db.query(Product).filter(Product.id == item_data.product_id).first()
            if not product:
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product {item_data.product_id} not found"
                )
            
            # Check stock availability
            if product.quantity < item_data.quantity:
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product.name}"
                )
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data.product_id,
                quantity=item_data.quantity,
                price=item_data.price or product.price
            )
            db.add(order_item)
            total_amount += order_item.quantity * order_item.price
            
            # Reserve stock
            product.quantity -= item_data.quantity
            db.add(product)
        
        order.total_amount = total_amount
        db.commit()
        db.refresh(order)
        return order
    
    @staticmethod
    def get_order(db: Session, order_id: int) -> Order:
        """Get order by ID"""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        return order
    
    @staticmethod
    def get_user_orders(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list:
        """Get user's orders"""
        return db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_all_orders(db: Session, skip: int = 0, limit: int = 100) -> list:
        """Get all orders"""
        return db.query(Order).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_orders_by_status(db: Session, status: OrderStatus) -> list:
        """Get orders by status"""
        return db.query(Order).filter(Order.status == status).all()
    
    @staticmethod
    def update_order_status(db: Session, order_id: int, new_status: OrderStatus) -> Order:
        """Update order status"""
        order = OrderService.get_order(db, order_id)
        
        # Validate status transitions
        valid_transitions = {
            OrderStatus.PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
            OrderStatus.CONFIRMED: [OrderStatus.PACKED, OrderStatus.CANCELLED],
            OrderStatus.PACKED: [OrderStatus.SHIPPED],
            OrderStatus.SHIPPED: [OrderStatus.DELIVERED],
            OrderStatus.DELIVERED: [],
            OrderStatus.CANCELLED: []
        }
        
        if new_status not in valid_transitions.get(order.status, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot transition from {order.status} to {new_status}"
            )
        
        order.status = new_status
        db.add(order)
        db.commit()
        db.refresh(order)
        return order
    
    @staticmethod
    def update_order(db: Session, order_id: int, order_data: OrderUpdate) -> Order:
        """Update order"""
        order = OrderService.get_order(db, order_id)
        
        if order_data.status:
            order = OrderService.update_order_status(db, order_id, order_data.status)
        
        if order_data.notes is not None:
            order.notes = order_data.notes
            db.add(order)
            db.commit()
            db.refresh(order)
        
        return order
