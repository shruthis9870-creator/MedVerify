from __future__ import annotations

from redis import Redis

from app.models.session import SessionState


class SessionManager:
    def __init__(self, redis_client: Redis | None = None, ttl_seconds: int = 7 * 24 * 60 * 60):
        self.redis = redis_client
        self.ttl_seconds = ttl_seconds
        self._memory_sessions: dict[str, SessionState] = {}

    def _key(self, user_id: str) -> str:
        return f"session:{user_id}"

    def get_session(self, user_id: str) -> SessionState:
        if self.redis is not None:
            try:
                raw = self.redis.get(self._key(user_id))
                if raw:
                    return SessionState.model_validate_json(raw)
            except Exception:
                pass

        if user_id in self._memory_sessions:
            return self._memory_sessions[user_id]

        session = SessionState(user_id=user_id)
        self._memory_sessions[user_id] = session
        return session

    def save_session(self, session: SessionState) -> None:
        session.touch()
        self._memory_sessions[session.user_id] = session

        if self.redis is not None:
            try:
                self.redis.set(
                    self._key(session.user_id),
                    session.model_dump_json(),
                    ex=self.ttl_seconds,
                )
            except Exception:
                pass

    def delete_session(self, user_id: str) -> None:
        self._memory_sessions.pop(user_id, None)

        if self.redis is not None:
            try:
                self.redis.delete(self._key(user_id))
            except Exception:
                pass