from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4
from typing import Any


class AlertService:
    def __init__(self) -> None:
        self._alerts: dict[str, dict[str, Any]] = {}

    def create_alert(
        self,
        user_id: str,
        severity: str,
        reason: str,
        payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        alert_id = str(uuid4())
        alert = {
            "alert_id": alert_id,
            "user_id": user_id,
            "severity": severity,
            "reason": reason,
            "payload": payload or {},
            "status": "open",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self._alerts[alert_id] = alert
        return alert

    def list_active_alerts(self) -> list[dict[str, Any]]:
        return [alert for alert in self._alerts.values() if alert["status"] == "open"]

    def acknowledge_alert(self, alert_id: str) -> dict[str, Any] | None:
        alert = self._alerts.get(alert_id)
        if alert:
            alert["status"] = "acknowledged"
        return alert


alert_service = AlertService()