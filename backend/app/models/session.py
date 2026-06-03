from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


FlowName = Literal["start", "symptoms", "report", "doctor", "emergency", "completed"]


class SessionState(BaseModel):
    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    user_id: str
    flow: FlowName = "start"
    step: int = 0
    language: str = "en"
    intent: str | None = None
    data: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def touch(self) -> None:
        self.updated_at = datetime.now(timezone.utc)