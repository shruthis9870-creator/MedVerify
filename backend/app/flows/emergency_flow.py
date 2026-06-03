from app.flows.base import BaseFlow
from app.models.response import BotResponse
from app.models.session import SessionState


class EmergencyFlow(BaseFlow):
    name = "emergency"

    def handle(self, text: str, session: SessionState) -> BotResponse:
        return BotResponse(
            response_type="urgent",
            message=(
                "⚠️ This may be urgent.\n\n"
                "Please go to the nearest emergency care now or call local emergency services."
            ),
            next_flow="completed",
        )