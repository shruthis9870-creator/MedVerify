from __future__ import annotations

from app.models.response import BotResponse
from app.models.session import SessionState
from app.flows.base import BaseFlow


class DoctorFlow(BaseFlow):
    name = "doctor"

    def handle(self, text: str, session: SessionState) -> BotResponse:
        data = self.flow_bucket(session)

        if session.step == 1:
            data["location"] = text.strip()
            session.step = 2
            return self.ask(
                "What kind of doctor do you need?\n"
                "Examples: general physician, pediatrician, gynecologist, cardiologist, ENT, dermatologist."
            )

        if session.step == 2:
            data["specialty"] = text.strip()
            session.step = 3
            return self.ask("Do you want nearby clinic or online consultation?")

        if session.step == 3:
            data["mode"] = text.strip()
            session.step = 4
            return self.ask("Which language do you prefer for the consultation?")

        if session.step == 4:
            data["preferred_language"] = text.strip()
            session.flow = "completed"
            session.step = 0

            return BotResponse(
                response_type="text",
                message=(
                    "Got it.\n\n"
                    f"Location: {data.get('location')}\n"
                    f"Specialty: {data.get('specialty')}\n"
                    f"Mode: {data.get('mode')}\n"
                    f"Language: {data.get('preferred_language')}\n\n"
                    "Doctor matching can be plugged in next."
                ),
                next_flow="completed",
            )

        session.step = 1
        return self.ask("Which city or pin code are you in?")