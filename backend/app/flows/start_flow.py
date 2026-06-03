from __future__ import annotations

from app.models.response import BotResponse
from app.models.session import SessionState

from app.flows.base import BaseFlow


class StartFlow(BaseFlow):
    name = "start"

    def handle(self, text: str, session: SessionState) -> BotResponse:
        normalized = self.normalize(text)

        if normalized in {"hi", "hello", "hey", "start", "menu", "restart"}:
            session.flow = "start"
            session.step = 0

        if normalized == "1":
            session.flow = "symptoms"
            session.step = 1
            self.reset_flow_bucket(session)
            return self.ask("Please describe your main symptom in one line.")

        if normalized == "2":
            session.flow = "report"
            session.step = 1
            self.reset_flow_bucket(session)
            return self.ask("Please upload a photo or PDF of your report.")

        if normalized == "3":
            session.flow = "doctor"
            session.step = 1
            self.reset_flow_bucket(session)
            return self.ask("Which city or pin code are you in?")

        return self.ask(
            "Hi 👋\n"
            "I can help with:\n"
            "1 Symptoms\n"
            "2 Report\n"
            "3 Doctor\n\n"
            "Reply with 1, 2, or 3."
        )