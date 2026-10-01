from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.services.shipment_service import ShipmentService
from app.schemas import ShipmentCreate, ShipmentUpdate, ShipmentResponse
from app.models import User, ShipmentStatus

router = APIRouter(prefix="/shipments", tags=["Shipments"])


@router.post("/", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
def create_shipment(
    shipment: ShipmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new shipment"""
    if current_user.role not in ["admin", "logistics_manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return ShipmentService.create_shipment(db, shipment)


@router.get("/", response_model=list[ShipmentResponse])
def get_shipments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status_filter: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get shipments"""
    if status_filter:
        try:
            status_enum = ShipmentStatus(status_filter)
            return ShipmentService.get_shipments_by_status(db, status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status"
            )
    
    return ShipmentService.get_all_shipments(db, skip, limit)


@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get shipment by ID"""
    return ShipmentService.get_shipment(db, shipment_id)


@router.get("/tracking/{tracking_number}", response_model=ShipmentResponse)
def get_shipment_by_tracking(
    tracking_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Track shipment by tracking number"""
    return ShipmentService.get_shipment_by_tracking(db, tracking_number)


@router.put("/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(
    shipment_id: int,
    shipment_data: ShipmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update shipment"""
    if current_user.role not in ["admin", "logistics_manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return ShipmentService.update_shipment(db, shipment_id, shipment_data)


@router.get("/status/delayed", response_model=list[ShipmentResponse])
def get_delayed_shipments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get delayed shipments"""
    return ShipmentService.get_delayed_shipments(db)


@router.get("/status/in-transit", response_model=list[ShipmentResponse])
def get_in_transit_shipments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get in-transit shipments"""
    return ShipmentService.get_in_transit_shipments(db)
