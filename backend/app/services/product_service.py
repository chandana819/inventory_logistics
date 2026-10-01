from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models import Product, Category, Supplier, Inventory
from app.schemas import ProductCreate, ProductUpdate, ProductResponse


class ProductService:
    """Product management service"""
    
    @staticmethod
    def create_product(db: Session, product_data: ProductCreate) -> Product:
        """Create new product"""
        # Verify category exists
        category = db.query(Category).filter(Category.id == product_data.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        # Verify supplier exists
        supplier = db.query(Supplier).filter(Supplier.id == product_data.supplier_id).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supplier not found"
            )
        
        # Check if SKU already exists
        existing_product = db.query(Product).filter(Product.sku == product_data.sku).first()
        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="SKU already exists"
            )
        
        product = Product(**product_data.dict())
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def get_product(db: Session, product_id: int) -> Product:
        """Get product by ID"""
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return product
    
    @staticmethod
    def get_all_products(db: Session, skip: int = 0, limit: int = 100) -> list:
        """Get all products"""
        return db.query(Product).filter(Product.is_active == 1).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> Product:
        """Update product"""
        product = ProductService.get_product(db, product_id)
        
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(product, field, value)
        
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(db: Session, product_id: int) -> Product:
        """Delete product (soft delete)"""
        product = ProductService.get_product(db, product_id)
        product.is_active = 0
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def get_low_stock_products(db: Session) -> list:
        """Get products with low stock"""
        return db.query(Product).filter(
            and_(
                Product.is_active == 1,
                Product.quantity <= Product.reorder_level
            )
        ).all()
    
    @staticmethod
    def search_products(db: Session, query: str) -> list:
        """Search products by name or SKU"""
        return db.query(Product).filter(
            and_(
                Product.is_active == 1,
                (Product.name.ilike(f"%{query}%") | Product.sku.ilike(f"%{query}%"))
            )
        ).all()
