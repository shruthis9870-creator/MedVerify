from fastapi import APIRouter, Depends, HTTPException

from app.core.security import require_roles
from app.services.alert_service import alert_service

router = APIRouter(
    prefix="/alerts",
    tags=["alerts"],
    dependencies=[Depends(require_roles("doctor", "admin"))],
)


@router.get("/active")
def get_active_alerts():
    alerts = alert_service.list_active_alerts()

    return {
        "alerts": alerts,
        "count": len(alerts),
        "emergency_patients": alert_service.count_emergency_alerts(),
        "ai_clinical_cases": alert_service.count_ai_clinical_cases(),
        "active_patients": alert_service.count_active_patients(),
    }


@router.post("/{alert_id}/ack")
def acknowledge_alert(alert_id: str):
    alert = alert_service.acknowledge_alert(alert_id)

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found",
        )

    return {
        "ok": True,
        "alert": alert,
    }
