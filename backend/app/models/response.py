from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class BotResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    response_type: Literal["text", "urgent", "handoff"] = "text"
    message: str
    next_flow: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)