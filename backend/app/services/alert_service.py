from __future__ import annotations

import json
from uuid import uuid4
from datetime import datetime, timezone
from typing import Any

from app.services.orchestrator import redis_client


class AlertService:

    REDIS_KEY = "active_alerts"

    def create_alert(
        self,
        user_id: str,
        severity: str,
        reason: str,
        payload: dict[str, Any] | None = None,
    ):

        alert = {
            "alert_id": str(uuid4()),
            "user_id": user_id,
            "severity": severity,
            "reason": reason,
            "payload": payload or {},
            "status": "open",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        redis_client.hset(
            self.REDIS_KEY,
            alert["alert_id"],
            json.dumps(alert)
        )

        return alert

    def list_active_alerts(self):

        alerts = []

        for raw in redis_client.hvals(self.REDIS_KEY):

            alert = json.loads(raw)

            if alert["status"] == "open":
                alerts.append(alert)

        return alerts

    def acknowledge_alert(self, alert_id):

        raw = redis_client.hget(
            self.REDIS_KEY,
            alert_id
        )

        if not raw:
            return None

        alert = json.loads(raw)

        alert["status"] = "acknowledged"

        redis_client.hset(
            self.REDIS_KEY,
            alert_id,
            json.dumps(alert)
        )

        return alert


alert_service = AlertService()