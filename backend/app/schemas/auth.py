# backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr, Field


class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12)
    username: str = Field(min_length=2, max_length=100)
    referral_code: str | None = None  # 추천인 코드 (선택)
    center_id: int | None = None  # 센터 ID (선택)
    sector_id: int | None = None  # 섹터 ID (선택)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class Tokens(BaseModel):
    access: str
