from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from app.services.redis_service import redis_client


class ReportService:

    REPORTS_KEY = "reports:by_id"
    LEGACY_REPORTS_KEY = "reports"
    PATIENT_REPORTS_PREFIX = "reports:patient:"

    def _patient_key(self, patient_id: str) -> str:
        return f"{self.PATIENT_REPORTS_PREFIX}{patient_id}"

    def _loads(self, raw: str | bytes | None) -> dict[str, Any] | None:
        if not raw:
            return None

        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return None

    def create_report(
        self,
        patient_id: str,
        media_urls: list[str],
        metadata: dict[str, Any] | None = None,
        report_id: str | None = None,
    ) -> dict[str, Any]:
        report_id = report_id or str(uuid4())

        report = {
            "report_id": report_id,
            "patient_id": patient_id,
            "media_urls": media_urls,
            "metadata": metadata or {},
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        serialized = json.dumps(report)

        redis_client.hset(
            self.REPORTS_KEY,
            report_id,
            serialized,
        )
        redis_client.rpush(
            self._patient_key(patient_id),
            report_id,
        )

        return report

    def get_report(self, report_id: str) -> dict[str, Any] | None:
        return self._loads(redis_client.hget(self.REPORTS_KEY, report_id))

    def list_reports(self, patient_id: str | None = None) -> list[dict[str, Any]]:
        if patient_id:
            reports = [
                self.get_report(report_id)
                for report_id in redis_client.lrange(
                    self._patient_key(patient_id),
                    0,
                    -1,
                )
            ]
            reports.extend(
                report
                for report in (
                    self._loads(raw)
                    for raw in redis_client.lrange(self.LEGACY_REPORTS_KEY, 0, -1)
                )
                if report and report.get("patient_id") == patient_id
            )

            return [
                report
                for report in reports
                if report is not None
            ]

        reports = [
            self._loads(raw)
            for raw in redis_client.hvals(self.REPORTS_KEY)
        ]
        reports.extend(
            self._loads(raw)
            for raw in redis_client.lrange(self.LEGACY_REPORTS_KEY, 0, -1)
        )

        return [
            report
            for report in reports
            if report is not None
        ]

    def list_patient_reports(self, patient_id: str) -> list[dict[str, Any]]:
        return self.list_reports(patient_id=patient_id)

    def media_urls_for_patient(self, patient_id: str) -> list[str]:
        media_urls: list[str] = []

        for report in self.list_patient_reports(patient_id):
            media_urls.extend(report.get("media_urls", []))

        return list(dict.fromkeys(media_urls))


report_service = ReportService()
