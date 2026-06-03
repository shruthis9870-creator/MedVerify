from __future__ import annotations

from app.models.response import BotResponse
from app.models.session import SessionState
from app.flows.base import BaseFlow


class ReportFlow(BaseFlow):
    name = "report"

    def handle(self, text: str, session: SessionState) -> BotResponse:
        data = self.flow_bucket(session)

        if session.step == 1:
            data["report_raw"] = text.strip()
            session.step = 2
            return self.ask("Thanks. I’m reading it now.")

        if session.step == 2:
            data["report_notes"] = text.strip()
            session.flow = "completed"
            session.step = 0

            return BotResponse(
                response_type="text",
                message=(
                    "I have noted the report.\n\n"
                    "OCR and medical explanation can be added next, but the flow is ready."
                ),
                next_flow="completed",
            )

        session.step = 1
        return self.ask("Please upload a photo, PDF, or text from the report.")