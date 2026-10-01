from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime
from app.models import Shipment, ShipmentStatus, Order
from app.schemas import ShipmentCreate, ShipmentUpdate


class ShipmentService:
    """Shipment management service"""
    
    @staticmethod
    def create_shipment(db: Session, shipment_data: ShipmentCreate) -> Shipment:
        """Create new shipment"""
        # Verify order exists
        order = db.query(Order).filter(Order.id == shipment_data.order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        shipment = Shipment(**shipment_data.dict())
        db.add(shipment)
        db.commit()
        db.refresh(shipment)
        return shipment
    
    @staticmethod
    def get_shipment(db: Session, shipment_id: int) -> Shipment:
        """Get shipment by ID"""
        shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
        if not shipment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shipment not found"
            )
        return shipment
    
    @staticmethod
    def get_shipment_by_tracking(db: Session, tracking_number: str) -> Shipment:
        """Get shipment by tracking number"""
        shipment = db.query(Shipment).filter(Shipment.tracking_number == tracking_number).first()
        if not shipment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shipment not found"
            )
        return shipment
    
    @staticmethod
    def get_all_shipments(db: Session, skip: int = 0, limit: int = 100) -> list:
        """Get all shipments"""
        return db.query(Shipment).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_shipments_by_status(db: Session, status: ShipmentStatus) -> list:
        """Get shipments by status"""
        return db.query(Shipment).filter(Shipment.status == status).all()
    
    @staticmethod
    def update_shipment(db: Session, shipment_id: int, shipment_data: ShipmentUpdate) -> Shipment:
        """Update shipment"""
        shipment = ShipmentService.get_shipment(db, shipment_id)
        
        update_data = shipment_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(shipment, field, value)
        
        db.add(shipment)
        db.commit()
        db.refresh(shipment)
        return shipment
    
    @staticmethod
    def get_delayed_shipments(db: Session) -> list:
        """Get shipments predicted to be delayed"""
        return db.query(Shipment).filter(Shipment.delay_predicted == 1).all()
    
    @staticmethod
    def get_in_transit_shipments(db: Session) -> list:
        """Get in-transit shipments"""
        return db.query(Shipment).filter(Shipment.status == ShipmentStatus.IN_TRANSIT).all()
