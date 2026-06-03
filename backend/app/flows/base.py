from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from app.models.response import BotResponse
from app.models.session import SessionState


class BaseFlow(ABC):
    name: str = "base"

    @abstractmethod
    def handle(self, text: str, session: SessionState) -> BotResponse:
        raise NotImplementedError

    def normalize(self, text: str) -> str:
        return text.strip().lower()

    def flow_bucket(self, session: SessionState) -> dict[str, Any]:
        return session.data.setdefault("flow_data", {})

    def reset_flow_bucket(self, session: SessionState) -> None:
        session.data["flow_data"] = {}

    def ask(self, message: str, next_flow: str | None = None) -> BotResponse:
        return BotResponse(
            response_type="text",
            message=message,
            next_flow=next_flow,
        )

    def urgent(self, message: str) -> BotResponse:
        return BotResponse(
            response_type="urgent",
            message=message,
            next_flow="emergency",
        )