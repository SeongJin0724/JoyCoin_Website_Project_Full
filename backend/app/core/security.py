import os
from passlib.hash import argon2
from datetime import datetime, timedelta
from jose import jwt

JWT_SECRET = os.getenv("JWT_SECRET", "change_me")
JWT_EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MIN", "20"))
ALGO = "HS256"


def hash_password(plain: str) -> str:
    return argon2.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return argon2.verify(plain, hashed)
    except Exception:
        return False


def create_access_token(*, user_id: int, minutes: int, secret: str) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": str(user_id),  # ✅ 항상 문자열 형태의 정수 id
        "iat": now,
        "exp": now + timedelta(minutes=minutes),
    }
    return jwt.encode(payload, secret, algorithm="HS256")
