from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import uuid

router = APIRouter()

# In-memory storage for alerts (replace with database later)
alerts_db = []

class AlertCreate(BaseModel):
    patient_id: str
    severity: str
    reason: str
    source: Optional[str] = "manual"
    recommendation: Optional[str] = None
    patient_name: Optional[str] = None

class AlertResponse(BaseModel):
    alert_id: str
    patient_id: str
    patient_name: Optional[str] = None
    severity: str
    reason: str
    source: str
    recommendation: Optional[str] = None
    status: str
    created_at: str

@router.get("/alerts", response_model=List[AlertResponse])
async def get_alerts():
    """Get all alerts"""
    return alerts_db

@router.post("/alerts", response_model=AlertResponse)
async def create_alert(alert: AlertCreate):
    """Create a new alert"""
    new_alert = AlertResponse(
        alert_id=f"alert_{uuid.uuid4().hex[:8]}",
        patient_id=alert.patient_id,
        patient_name=alert.patient_name,
        severity=alert.severity,
        reason=alert.reason,
        source=alert.source,
        recommendation=alert.recommendation or alert.reason,
        status="open",
        created_at=datetime.utcnow().isoformat()
    )
    alerts_db.append(new_alert)
    return new_alert

@router.patch("/alerts/{alert_id}")
async def update_alert(alert_id: str, status: str):
    """Update alert status"""
    for alert in alerts_db:
        if alert.alert_id == alert_id:
            alert.status = status
            return {"message": "Alert updated", "alert_id": alert_id, "status": status}
    raise HTTPException(status_code=404, detail="Alert not found")
# Add demo alert if no alerts exist
if not alerts_db:
    alerts_db.append(AlertResponse(
        alert_id="alert_demo_001",
        patient_id="+919876543210",
        patient_name="Demo Patient",
        severity="HIGH",
        reason="Chest pain detected (demo - send 'chest pain' to WhatsApp for real alerts)",
        source="whatsapp_symptom",
        recommendation="Seek immediate medical attention",
        status="open",
        created_at=datetime.utcnow().isoformat()
    ))
    print("✅ Demo alert added!")