from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Supplier
from app.schemas import SupplierCreate, SupplierUpdate


class SupplierService:
    """Supplier management service"""
    
    @staticmethod
    def create_supplier(db: Session, supplier_data: SupplierCreate) -> Supplier:
        """Create new supplier"""
        supplier = Supplier(**supplier_data.dict())
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier
    
    @staticmethod
    def get_supplier(db: Session, supplier_id: int) -> Supplier:
        """Get supplier by ID"""
        supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supplier not found"
            )
        return supplier
    
    @staticmethod
    def get_all_suppliers(db: Session, skip: int = 0, limit: int = 100) -> list:
        """Get all suppliers"""
        return db.query(Supplier).filter(Supplier.is_active == 1).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_supplier(db: Session, supplier_id: int, supplier_data: SupplierUpdate) -> Supplier:
        """Update supplier"""
        supplier = SupplierService.get_supplier(db, supplier_id)
        
        update_data = supplier_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(supplier, field, value)
        
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier
    
    @staticmethod
    def delete_supplier(db: Session, supplier_id: int) -> Supplier:
        """Delete supplier (soft delete)"""
        supplier = SupplierService.get_supplier(db, supplier_id)
        supplier.is_active = 0
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier
