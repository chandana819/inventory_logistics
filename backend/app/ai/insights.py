from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict
import json
from app.models import Order, OrderItem, Product, Shipment, ShipmentStatus, Supplier
from app.schemas import (
    DemandForecastResponse, ReorderRecommendation, 
    AnomalyAlert, DeliveryDelayPrediction
)

try:
    import numpy as np
    import pandas as pd
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.preprocessing import MinMaxScaler
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False


class AIInsightsService:
    """AI/ML insights service"""
    
    @staticmethod
    def get_demand_forecast(
        db: Session, 
        product_id: int, 
        days_ahead: int = 30,
        historical_days: int = 90
    ) -> DemandForecastResponse:
        """
        Predict demand for a product using historical order data
        """
        # Get historical orders
        cutoff_date = datetime.utcnow() - timedelta(days=historical_days)
        orders = db.query(OrderItem).filter(
            OrderItem.product_id == product_id
        ).all()
        
        product = db.query(Product).filter(Product.id == product_id).first()
        
        # If ML not available, use simple moving average
        if not ML_AVAILABLE or len(orders) < 10:
            daily_demands = [item.quantity for item in orders[-30:] if item]
            if not daily_demands:
                daily_demands = [0] * 30
            
            forecast = [sum(daily_demands[-7:]) // 7] * days_ahead
            confidence = 0.5
        else:
            # Use ML-based prediction
            daily_demands = [item.quantity for item in orders]
            forecast, confidence = AIInsightsService._ml_forecast(
                daily_demands, days_ahead
            )
        
        return DemandForecastResponse(
            product_id=product_id,
            product_name=product.name if product else "Unknown",
            historical_demand=daily_demands[-30:] if daily_demands else [],
            forecasted_demand=forecast,
            confidence=confidence,
            forecast_period=f"{days_ahead} days"
        )
    
    @staticmethod
    def _ml_forecast(data: List[int], days_ahead: int) -> tuple:
        """Machine learning based forecasting"""
        if not ML_AVAILABLE or len(data) < 10:
            return [sum(data[-7:]) // 7] * days_ahead, 0.5
        
        try:
            X = np.arange(len(data)).reshape(-1, 1)
            y = np.array(data)
            
            model = RandomForestRegressor(n_estimators=10, random_state=42)
            model.fit(X, y)
            
            future_X = np.arange(len(data), len(data) + days_ahead).reshape(-1, 1)
            predictions = model.predict(future_X).astype(int)
            
            return predictions.tolist(), 0.75
        except Exception:
            return [sum(data[-7:]) // 7] * days_ahead, 0.5
    
    @staticmethod
    def get_reorder_recommendations(db: Session) -> List[ReorderRecommendation]:
        """Get products that need reordering"""
        products = db.query(Product).filter(
            Product.quantity <= Product.reorder_level
        ).all()
        
        recommendations = []
        for product in products:
            # Estimate reorder quantity based on demand
            recent_orders = db.query(OrderItem).filter(
                OrderItem.product_id == product.id
            ).all()
            
            avg_daily_demand = (
                sum([item.quantity for item in recent_orders[-30:] or [0]]) / 30
                if recent_orders else 1
            )
            
            reorder_qty = max(int(avg_daily_demand * 30), product.reorder_level * 2)
            
            # Determine priority
            if product.quantity == 0:
                priority = "high"
            elif product.quantity <= product.reorder_level // 2:
                priority = "medium"
            else:
                priority = "low"
            
            recommendations.append(ReorderRecommendation(
                product_id=product.id,
                product_name=product.name,
                current_quantity=product.quantity,
                reorder_level=product.reorder_level,
                recommended_quantity=reorder_qty,
                priority=priority
            ))
        
        return sorted(recommendations, key=lambda x: {"high": 0, "medium": 1, "low": 2}.get(x.priority, 3))
    
    @staticmethod
    def detect_anomalies(db: Session) -> List[AnomalyAlert]:
        """Detect anomalies in inventory and orders"""
        alerts = []
        
        # Check for unusual stock changes
        products = db.query(Product).filter(Product.is_active == 1).all()
        for product in products:
            # Flagged if quantity drops below 0 or exceeds warehouse capacity
            if product.quantity < 0:
                alerts.append(AnomalyAlert(
                    type="stock_anomaly",
                    product_id=product.id,
                    severity="high",
                    description=f"Negative inventory for {product.name}"
                ))
            
            if product.quantity > product.reorder_level * 10:  # Excess inventory
                alerts.append(AnomalyAlert(
                    type="stock_anomaly",
                    product_id=product.id,
                    severity="low",
                    description=f"Excessive inventory for {product.name}: {product.quantity} units"
                ))
        
        # Check for large orders
        large_orders = db.query(OrderItem).filter(
            OrderItem.quantity > 1000
        ).all()
        for order_item in large_orders:
            if order_item.quantity > 1000:
                alerts.append(AnomalyAlert(
                    type="order_anomaly",
                    order_id=order_item.order_id,
                    product_id=order_item.product_id,
                    severity="medium",
                    description=f"Unusually large order: {order_item.quantity} units"
                ))
        
        return alerts
    
    @staticmethod
    def predict_delivery_delays(db: Session) -> List[DeliveryDelayPrediction]:
        """Predict shipments that may be delayed"""
        predictions = []
        
        # Get in-transit shipments
        in_transit = db.query(Shipment).filter(
            Shipment.status == ShipmentStatus.IN_TRANSIT
        ).all()
        
        for shipment in in_transit:
            if not shipment.expected_delivery:
                continue
            
            # Simple rule-based delay prediction
            days_until_delivery = (
                shipment.expected_delivery - datetime.utcnow()
            ).days
            
            # Check if already delayed
            if days_until_delivery < 0:
                delay_probability = 0.95
                predicted_delay_days = abs(days_until_delivery) + 3
            elif days_until_delivery <= 1:
                delay_probability = 0.3
                predicted_delay_days = 2
            elif days_until_delivery <= 3:
                delay_probability = 0.15
                predicted_delay_days = 1
            else:
                delay_probability = 0.05
                predicted_delay_days = 0
            
            if delay_probability > 0.1:  # Only report meaningful predictions
                predictions.append(DeliveryDelayPrediction(
                    shipment_id=shipment.id,
                    order_id=shipment.order_id,
                    tracking_number=shipment.tracking_number,
                    expected_delivery=shipment.expected_delivery,
                    delay_probability=delay_probability,
                    predicted_delay_days=predicted_delay_days
                ))
        
        return sorted(predictions, key=lambda x: x.delay_probability, reverse=True)
    
    @staticmethod
    def get_dashboard_metrics(db: Session) -> Dict:
        """Get key metrics for dashboard"""
        from sqlalchemy import func
        
        # Total products
        total_products = db.query(func.count(Product.id)).filter(Product.is_active == 1).scalar() or 0
        
        # Total stock value
        stock_value = db.query(func.sum(Product.price * Product.quantity)).filter(Product.is_active == 1).scalar() or 0
        
        # Low stock items count
        low_stock = db.query(func.count(Product.id)).filter(
            Product.quantity <= Product.reorder_level
        ).scalar() or 0
        
        # Pending orders
        pending_orders = db.query(func.count(Order.id)).filter(
            Order.status == "pending"
        ).scalar() or 0

        # Total orders and units currently represented in inventory
        total_orders = db.query(func.count(Order.id)).scalar() or 0
        total_units = db.query(func.sum(Product.quantity)).filter(Product.is_active == 1).scalar() or 0

        # Active supplier count
        active_suppliers = db.query(func.count(Supplier.id)).filter(Supplier.is_active == 1).scalar() or 0
        
        # In-transit shipments
        in_transit = db.query(func.count(Shipment.id)).filter(
            Shipment.status == ShipmentStatus.IN_TRANSIT
        ).scalar() or 0
        
        # Delayed shipments
        delayed = db.query(func.count(Shipment.id)).filter(
            Shipment.delay_predicted == 1
        ).scalar() or 0
        
        return {
            "total_products": total_products,
            "stock_value": float(stock_value) if stock_value else 0,
            "total_units": int(total_units),
            "total_orders": total_orders,
            "low_stock_items": low_stock,
            "pending_orders": pending_orders,
            "in_transit_shipments": in_transit,
            "delayed_shipments": delayed,
            "active_suppliers": active_suppliers
        }
