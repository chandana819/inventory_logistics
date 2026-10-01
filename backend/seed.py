"""Database seeding script"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models import (
    User, UserRole, Category, Supplier, Product, Warehouse, Inventory,
    Order, OrderStatus, OrderItem, Shipment, ShipmentStatus
)
from app.core.security import get_password_hash


def seed_database():
    """Seed database with sample data"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).count() > 0:
            print("Database already seeded!")
            return
        
        print("Seeding database...")
        
        # Create users
        users = [
            User(
                name="Admin User",
                email="admin@inventory.com",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=1
            ),
            User(
                name="Inventory Manager",
                email="inv_manager@inventory.com",
                password_hash=get_password_hash("manager123"),
                role=UserRole.INVENTORY_MANAGER,
                is_active=1
            ),
            User(
                name="Logistics Manager",
                email="logistics@inventory.com",
                password_hash=get_password_hash("logistics123"),
                role=UserRole.LOGISTICS_MANAGER,
                is_active=1
            ),
            User(
                name="John Supplier",
                email="supplier@inventory.com",
                password_hash=get_password_hash("supplier123"),
                role=UserRole.SUPPLIER,
                is_active=1
            ),
            User(
                name="Jane Customer",
                email="customer@inventory.com",
                password_hash=get_password_hash("customer123"),
                role=UserRole.CUSTOMER,
                is_active=1
            ),
        ]
        db.add_all(users)
        db.commit()
        print(f"✓ Created {len(users)} users")
        
        # Create categories
        categories = [
            Category(name="Electronics"),
            Category(name="Furniture"),
            Category(name="Office Supplies"),
            Category(name="Clothing"),
            Category(name="Food & Beverages"),
        ]
        db.add_all(categories)
        db.commit()
        print(f"✓ Created {len(categories)} categories")
        
        # Create suppliers
        suppliers = [
            Supplier(
                name="TechSupply Inc.",
                contact_person="John Smith",
                email="contact@techsupply.com",
                phone="+1-555-0101",
                address="123 Tech St, Silicon Valley, CA",
                rating=4.8
            ),
            Supplier(
                name="Global Furnishings",
                contact_person="Maria Garcia",
                email="sales@furnishings.com",
                phone="+1-555-0102",
                address="456 Furniture Ave, Los Angeles, CA",
                rating=4.5
            ),
            Supplier(
                name="Office Pro Supplies",
                contact_person="David Lee",
                email="info@officepro.com",
                phone="+1-555-0103",
                address="789 Office Blvd, New York, NY",
                rating=4.3
            ),
        ]
        db.add_all(suppliers)
        db.commit()
        print(f"✓ Created {len(suppliers)} suppliers")
        
        # Create products
        products = [
            Product(
                name="Laptop Pro 15",
                sku="TECH-001",
                category_id=1,
                supplier_id=1,
                price=1299.99,
                quantity=45,
                reorder_level=10,
                description="High-performance laptop"
            ),
            Product(
                name="Wireless Mouse",
                sku="TECH-002",
                category_id=1,
                supplier_id=1,
                price=29.99,
                quantity=150,
                reorder_level=30,
                description="Ergonomic wireless mouse"
            ),
            Product(
                name="Office Chair",
                sku="FURN-001",
                category_id=2,
                supplier_id=2,
                price=249.99,
                quantity=28,
                reorder_level=5,
                description="Ergonomic office chair"
            ),
            Product(
                name="Standing Desk",
                sku="FURN-002",
                category_id=2,
                supplier_id=2,
                price=599.99,
                quantity=12,
                reorder_level=3,
                description="Adjustable standing desk"
            ),
            Product(
                name="A4 Paper Ream",
                sku="OFFICE-001",
                category_id=3,
                supplier_id=3,
                price=4.99,
                quantity=500,
                reorder_level=100,
                description="500 sheets of A4 paper"
            ),
            Product(
                name="Ballpoint Pens (Box)",
                sku="OFFICE-002",
                category_id=3,
                supplier_id=3,
                price=12.99,
                quantity=320,
                reorder_level=50,
                description="Box of 50 ballpoint pens"
            ),
        ]
        db.add_all(products)
        db.commit()
        print(f"✓ Created {len(products)} products")
        
        # Create warehouse
        warehouse = Warehouse(
            name="Main Warehouse",
            location="Chicago, IL",
            capacity=10000
        )
        db.add(warehouse)
        db.commit()
        
        # Create inventory records
        inventory_records = []
        for product in products:
            inv = Inventory(
                product_id=product.id,
                warehouse_id=warehouse.id,
                quantity=product.quantity,
                last_stock_in=datetime.utcnow() - timedelta(days=5),
            )
            inventory_records.append(inv)
        
        db.add_all(inventory_records)
        db.commit()
        print(f"✓ Created {len(inventory_records)} inventory records")
        
        # Create orders
        orders_list = []
        today = datetime.utcnow()
        
        for i in range(5):
            order = Order(
                user_id=users[4].id,  # Customer
                order_date=today - timedelta(days=i*2),
                status=[OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.DELIVERED][i],
                total_amount=0
            )
            
            # Add order items
            items_total = 0
            for j in range(1, 3):
                product = products[j]
                item = OrderItem(
                    order=order,
                    product_id=product.id,
                    quantity=2 + j,
                    price=product.price
                )
                items_total += item.quantity * item.price
            
            order.total_amount = items_total
            orders_list.append(order)
        
        db.add_all(orders_list)
        db.commit()
        print(f"✓ Created {len(orders_list)} orders with items")
        
        # Create shipments
        shipments_list = []
        for i, order in enumerate(orders_list[:4]):
            shipment = Shipment(
                order_id=order.id,
                carrier="FedEx",
                tracking_number=f"FX{1000000 + i}",
                status=[ShipmentStatus.PENDING, ShipmentStatus.IN_TRANSIT, ShipmentStatus.IN_TRANSIT, ShipmentStatus.DELIVERED][i],
                source_location="Chicago, IL",
                destination_location="New York, NY",
                expected_delivery=today + timedelta(days=5-i),
                delay_predicted=0
            )
            shipments_list.append(shipment)
        
        db.add_all(shipments_list)
        db.commit()
        print(f"✓ Created {len(shipments_list)} shipments")
        
        print("\n✅ Database seeding completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
