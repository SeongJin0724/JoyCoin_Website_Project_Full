# backend/app/core/config.py
import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    APP_ENV: str = Field(default=os.getenv("APP_ENV", "dev"))

    DB_URL: str = Field(
        default=os.getenv("DB_URL", "postgresql+psycopg://app:app@db:5432/app")
    )
    JWT_SECRET: str = Field(default=os.getenv("JWT_SECRET", "change_me"))
    JWT_EXPIRE_MIN: int = Field(default=int(os.getenv("JWT_EXPIRE_MIN", "20")))

    CORS_ORIGINS: str = Field(
        default=os.getenv("CORS_ORIGINS", "http://localhost:3000")
    )

    USDT_CHAIN: str = Field(default=os.getenv("USDT_CHAIN", "TRON"))
    USDT_ADMIN_ADDRESS: str = Field(default=os.getenv("USDT_ADMIN_ADDRESS", ""))

    class Config:
        extra = "ignore"  # 환경변수에 불필요한 키가 있어도 무시


settings = Settings()
