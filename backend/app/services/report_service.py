import json

from app.services.redis_service import redis_client


class ReportService:

    KEY = "reports"

    def create_report(
        self,
        patient_id,
        media_urls,
        metadata=None
    ):

        report = {
            "patient_id": patient_id,
            "media_urls": media_urls,
            "metadata": metadata or {}
        }

        redis_client.rpush(
            self.KEY,
            json.dumps(report)
        )

        return report

    def list_reports(self):

        return [
            json.loads(x)
            for x in redis_client.lrange(
                self.KEY,
                0,
                -1
            )
        ]


report_service = ReportService()