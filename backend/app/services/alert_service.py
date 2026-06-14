from __future__ import annotations

import json
from uuid import uuid4
from datetime import datetime, timezone
from typing import Any

from app.services.report_service import report_service
from app.services.redis_service import redis_client


class AlertService:
    REDIS_KEY = "active_alerts"

    def _loads(self, raw: str | bytes | None) -> dict[str, Any] | None:
        if not raw:
            return None

        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return None

    def _patient_report_payload(self, patient_id: str) -> dict[str, Any]:
        reports = report_service.list_patient_reports(patient_id)
        media_urls: list[str] = []

        for report in reports:
            media_urls.extend(report.get("media_urls", []))

        return {
            "report_ids": [
                report["report_id"]
                for report in reports
                if report.get("report_id")
            ],
            "media_urls": list(dict.fromkeys(media_urls)),
            "reports": [
                {
                    "report_id": report.get("report_id"),
                    "name": (
                        report.get("metadata", {}).get("filename")
                        or str(report.get("media_urls", [""])[0]).split("?")[0].split("/")[-1]
                        if report.get("media_urls")
                        else f"Report {index + 1}"
                    ),
                    "url": media_url,
                    "created_at": report.get("created_at"),
                }
                for index, report in enumerate(reports)
                for media_url in report.get("media_urls", [])
            ],
        }

    def _with_patient_reports(self, alert: dict[str, Any]) -> dict[str, Any]:
        patient_id = alert.get("patient_id") or alert.get("user_id")

        if not patient_id:
            return alert

        payload = {
            **alert.get("payload", {}),
            **self._patient_report_payload(patient_id),
        }

        return {
            **alert,
            "payload": payload,
        }

    def _save_alert(self, alert: dict[str, Any]) -> None:
        redis_client.hset(
            self.REDIS_KEY,
            alert["alert_id"],
            json.dumps(alert),
        )

    def _sync_routing_assignment(self, alert: dict[str, Any]) -> None:
        try:
            from app.services.routing_service import routing_service

            routing_service.sync_alert_assignment(alert)
        except Exception as exc:
            print(f"ROUTING SYNC FAILED: {exc}")

    def create_alert(
        self,
        user_id: str,
        severity: str,
        reason: str,
        payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        normalized_severity = severity.upper()
        payload = payload or {}
        patient_payload = self._patient_report_payload(user_id)

        payload = {
            **payload,
            **patient_payload,
        }

        alert_id = str(uuid4())

        alert = {
            "alert_id": alert_id,
            "user_id": user_id,
            "patient_id": user_id,
            "severity": normalized_severity,
            "reason": reason,
            "payload": payload,
            "status": "open",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        self._save_alert(alert)
        self._sync_routing_assignment(alert)

        return alert

    def list_active_alerts(self) -> list[dict[str, Any]]:
        alerts: list[dict[str, Any]] = []

        for raw in redis_client.hvals(self.REDIS_KEY):
            alert = self._loads(raw)

            if alert is None:
                continue

            if alert.get("status") == "open":
                alerts.append(self._with_patient_reports(alert))

        return sorted(
            alerts,
            key=lambda item: item.get("created_at", ""),
            reverse=True,
        )

    def acknowledge_alert(self, alert_id: str) -> dict[str, Any] | None:
        raw = redis_client.hget(self.REDIS_KEY, alert_id)

        alert = self._loads(raw)

        if alert is None:
            return None

        alert["status"] = "acknowledged"
        alert["acknowledged_at"] = datetime.now(timezone.utc).isoformat()

        self._save_alert(alert)

        return alert

    def attach_patient_reports_to_open_alerts(self, patient_id: str) -> int:
        updated = 0

        for raw in redis_client.hvals(self.REDIS_KEY):
            alert = self._loads(raw)

            if alert is None or alert.get("status") != "open":
                continue

            if (alert.get("patient_id") or alert.get("user_id")) != patient_id:
                continue

            alert["payload"] = {
                **alert.get("payload", {}),
                **self._patient_report_payload(patient_id),
            }
            self._save_alert(alert)
            updated += 1

        return updated

    def count_emergency_alerts(self) -> int:
        alerts = self.list_active_alerts()

        patient_ids = {
            alert.get("patient_id") or alert.get("user_id")
            for alert in alerts
                if alert.get("severity") in {"HIGH", "CRITICAL"}
                or alert.get("payload", {}).get("case_type") == "emergency"
        }

        return len(
            [
                patient_id
                for patient_id in patient_ids
                if patient_id
            ]
        )

    def count_ai_clinical_cases(self) -> int:
        alerts = self.list_active_alerts()

        return len(
            [
                alert
                for alert in alerts
                if alert.get("payload", {}).get("requires_doctor_review") is True
            ]
        )

    def count_active_patients(self) -> int:
        alerts = self.list_active_alerts()

        patient_ids = {
            alert.get("patient_id") or alert.get("user_id")
            for alert in alerts
            if alert.get("patient_id") or alert.get("user_id")
        }

        return len(patient_ids)


alert_service = AlertService()
