from __future__ import annotations

from app.flows.base import BaseFlow
from app.models.response import BotResponse
from app.models.session import SessionState
from app.services.alert_service import alert_service
from app.utils.red_flags import contains_red_flags


class SymptomFlow(BaseFlow):
    name = "symptoms"

    def handle(self, text: str, session: SessionState) -> BotResponse:
        data = self.flow_bucket(session)
        normalized = self.normalize(text)

        if session.step == 1:
            data["main_symptom"] = text.strip()

            if contains_red_flags(normalized):
                alert_service.create_alert(
                    user_id=session.user_id,
                    severity="HIGH",
                    reason="Red flag detected during symptom intake",
                    payload={"main_symptom": text.strip()},
                )
                session.flow = "emergency"
                session.step = 0
                return self.urgent(
                    "This may need urgent medical attention. Please go to the nearest emergency care now."
                )

            session.step = 2
            return self.ask("Since when has this been happening?")

        if session.step == 2:
            data["duration"] = text.strip()
            session.step = 3
            return self.ask("What is your age?")

        if session.step == 3:
            try:
                age = int(text.strip())
                if age <= 0 or age > 120:
                    raise ValueError
            except ValueError:
                return self.ask("Please reply with your age as a number, like 24.")

            data["age"] = age
            session.step = 4
            return self.ask(
                "Do you have any of these right now: chest pain, breathing trouble, fainting, seizure, heavy bleeding, very high fever, or confusion?"
            )

        if session.step == 4:
            if normalized in {"yes", "y", "yeah", "yep", "true", "1"}:
                alert_service.create_alert(
                    user_id=session.user_id,
                    severity="HIGH",
                    reason="User confirmed red flag during symptom intake",
                    payload={"main_symptom": data.get("main_symptom", "")},
                )
                session.flow = "emergency"
                session.step = 0
                return self.urgent(
                    "This may be urgent. Please go to the nearest emergency care now."
                )

            data["red_flags"] = False
            session.step = 5
            return self.ask(
                "Any other symptoms like cough, fever, vomiting, weakness, headache, or body pain?"
            )

        if session.step == 5:
            data["extra_symptoms"] = text.strip()
            session.flow = "completed"
            session.step = 0

            return BotResponse(
                response_type="text",
                message=(
                    "Summary:\n"
                    f"Main symptom: {data.get('main_symptom', 'Not provided')}\n"
                    f"Duration: {data.get('duration', 'Not provided')}\n"
                    f"Age: {data.get('age', 'Not provided')}\n"
                    f"Other symptoms: {data.get('extra_symptoms', 'Not provided')}\n\n"
                    "I can help you route this to the right next step."
                ),
                next_flow="completed",
            )

        session.step = 1
        return self.ask("Please describe your main symptom in one line.")