from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class IncomingMessage(BaseModel):
    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    user_id: str
    text: str = ""
    channel: Literal["whatsapp", "web", "app"] = "whatsapp"
    num_media: int = Field(default=0, ge=0)
    media_urls: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
