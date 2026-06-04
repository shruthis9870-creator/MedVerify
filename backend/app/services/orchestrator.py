from __future__ import annotations

from redis import Redis

from app.core.config import settings
from app.models.message import IncomingMessage
from app.models.response import BotResponse
from app.services.flow_registry import FlowRegistry
from app.services.session_manager import SessionManager


redis_client = Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    decode_responses=True,
)

session_manager = SessionManager(
    redis_client=redis_client
)
flow_registry = FlowRegistry()


class Orchestrator:
    def handle_message(self, incoming: IncomingMessage) -> BotResponse:
        session = session_manager.get_session(incoming.user_id)

        session.data["last_num_media"] = incoming.num_media
        session.data["last_channel"] = incoming.channel

        if incoming.num_media > 0 and session.flow == "start":
            session.flow = "report"
            session.step = 1

        flow = flow_registry.get(session.flow)
        response = flow.handle(incoming.text, session)

        session_manager.save_session(session)
        return response


orchestrator = Orchestrator()