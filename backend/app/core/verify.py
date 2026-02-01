import os
import secrets
import time
import logging

logger = logging.getLogger(__name__)

BACKEND_PUBLIC_URL = os.getenv("BACKEND_PUBLIC_URL", "http://localhost:8000")
REDIS_URL = os.getenv("REDIS_URL", "").strip()
VERIFY_PREFIX = "verify_email:"
TTL_SECONDS = 15 * 60  # 15분

# Redis 사용 가능 시 사용, 불가 시 메모리 fallback (로컬/Redis 미설정 시 500 방지)
_redis = None
_memory_store: dict[str, tuple[str, float]] = {}


def _get_redis():
    global _redis
    if _redis is not None:
        return _redis
    if not REDIS_URL:
        return None
    try:
        import redis
        _redis = redis.Redis.from_url(REDIS_URL, decode_responses=True)
        _redis.ping()
        return _redis
    except Exception as e:
        logger.warning(
            "Redis unavailable, using in-memory store for email verify: %s", e
        )
        return None


def generate_email_verify_link(email: str) -> str:
    token = secrets.token_urlsafe(32)
    r = _get_redis()
    if r:
        try:
            r.setex(f"{VERIFY_PREFIX}{token}", TTL_SECONDS, email)
        except Exception as e:
            logger.warning("Redis setex failed, using memory: %s", e)
            _memory_store[f"{VERIFY_PREFIX}{token}"] = (
                email, time.time() + TTL_SECONDS
            )
    else:
        _memory_store[f"{VERIFY_PREFIX}{token}"] = (
            email, time.time() + TTL_SECONDS
        )
    return f"{BACKEND_PUBLIC_URL}/auth/verify-email?token={token}"


def _memory_get(key: str) -> str | None:
    if key not in _memory_store:
        return None
    email, expiry = _memory_store[key]
    if time.time() > expiry:
        del _memory_store[key]
        return None
    return email


def consume_email_token(token: str) -> str | None:
    key = f"{VERIFY_PREFIX}{token}"
    r = _get_redis()
    if r:
        try:
            email = r.get(key)
            if email:
                r.delete(key)
            return email
        except Exception:
            pass
    email = _memory_get(key)
    if email:
        _memory_store.pop(key, None)
    return email
