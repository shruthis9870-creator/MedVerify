from fastapi import APIRouter

from app.services.alert_service import alert_service

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/active")
def get_active_alerts():

    alerts = alert_service.list_active_alerts()

    return {
        "alerts": alerts,
        "count": len(alerts),
        "critical": len(
            [
                a for a in alerts
                if a["severity"] == "HIGH"
            ]
        )
    }

@router.post("/{alert_id}/ack")
def acknowledge_alert(alert_id: str):
    alert = alert_service.acknowledge_alert(alert_id)
    if alert is None:
        return {"ok": False, "message": "Alert not found"}
    return {"ok": True, "alert": alert}