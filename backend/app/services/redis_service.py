from __future__ import annotations

import socket
from urllib.parse import urlparse

from redis import Redis

from app.core.config import settings


class FakeRedis:
    is_ephemeral_store = True

    def __init__(self):
        self.hashes = {}
        self.lists = {}
        self.values = {}

    def ping(self):
        return True

    def get(self, key):
        return self.values.get(key)

    def set(self, key, value, ex=None):
        self.values[key] = value
        return True

    def delete(self, key):
        self.values.pop(key, None)
        self.hashes.pop(key, None)
        self.lists.pop(key, None)
        return True

    def hset(self, key, field, value):
        self.hashes.setdefault(key, {})
        self.hashes[key][field] = value

    def hget(self, key, field):
        return self.hashes.get(key, {}).get(field)

    def hvals(self, key):
        return list(self.hashes.get(key, {}).values())

    def rpush(self, key, value):
        self.lists.setdefault(key, [])
        self.lists[key].append(value)

    def lrange(self, key, start, end):
        items = self.lists.get(key, [])

        if end == -1:
            return items[start:]

        return items[start:end + 1]


def _build_real_redis_client() -> Redis:
    if settings.redis_url:
        return Redis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=1,
            socket_timeout=1,
        )

    return Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        db=settings.redis_db,
        decode_responses=True,
        socket_connect_timeout=1,
        socket_timeout=1,
    )


def _redis_endpoint() -> tuple[str, int]:
    if not settings.redis_url:
        return settings.redis_host, settings.redis_port

    parsed = urlparse(settings.redis_url)
    return parsed.hostname or settings.redis_host, parsed.port or settings.redis_port


def _redis_port_is_open() -> bool:
    host, port = _redis_endpoint()

    try:
        with socket.create_connection((host, port), timeout=0.25):
            return True
    except OSError:
        return False


def build_redis_client() -> Redis | FakeRedis:
    if settings.allow_in_memory_store:
        print(
            "WARNING: using explicit in-memory store. Auth, sessions, alerts, "
            "routing, and reports are not durable or shared across processes."
        )
        return FakeRedis()

    if not _redis_port_is_open():
        host, port = _redis_endpoint()
        raise RuntimeError(
            f"Redis is required but unavailable at {host}:{port}. "
            "Start Redis before launching the backend. For isolated local tests only, "
            "set ALLOW_IN_MEMORY_STORE=true to use non-durable per-process storage."
        )

    return _build_real_redis_client()


redis_client = build_redis_client()
