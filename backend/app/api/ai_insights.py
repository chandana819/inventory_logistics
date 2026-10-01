from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.ai.insights import AIInsightsService
from app.schemas import (
    DemandForecastResponse, ReorderRecommendation, 
    AnomalyAlert, DeliveryDelayPrediction
)
from app.models import User

router = APIRouter(prefix="/ai", tags=["AI Insights"])


@router.get("/forecast/{product_id}", response_model=DemandForecastResponse)
def get_demand_forecast(
    product_id: int,
    days_ahead: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get demand forecast for product"""
    return AIInsightsService.get_demand_forecast(db, product_id, days_ahead)


@router.get("/reorder-recommendations", response_model=list[ReorderRecommendation])
def get_reorder_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get smart reorder recommendations"""
    if current_user.role not in ["admin", "inventory_manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return AIInsightsService.get_reorder_recommendations(db)


@router.get("/anomalies", response_model=list[AnomalyAlert])
def detect_anomalies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Detect anomalies in inventory and orders"""
    if current_user.role not in ["admin", "inventory_manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return AIInsightsService.detect_anomalies(db)


@router.get("/delivery-delays", response_model=list[DeliveryDelayPrediction])
def predict_delivery_delays(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Predict delivery delays"""
    if current_user.role not in ["admin", "logistics_manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return AIInsightsService.predict_delivery_delays(db)


@router.get("/dashboard-metrics")
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard metrics"""
    return AIInsightsService.get_dashboard_metrics(db)
