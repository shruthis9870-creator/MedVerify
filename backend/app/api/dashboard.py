from fastapi import APIRouter, Depends

from app.core.security import require_roles
from app.services.alert_service import alert_service

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    dependencies=[Depends(require_roles("doctor", "admin"))],
)


@router.get("/stats")
def get_dashboard_stats():
    alerts = alert_service.list_active_alerts()

    return {
        "emergency_patients": alert_service.count_emergency_alerts(),
        "ai_clinical_cases": alert_service.count_ai_clinical_cases(),
        "active_patients": alert_service.count_active_patients(),
        "active_alerts": len(alerts),
    }
