# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ✅ v2 방식
    model_config = SettingsConfigDict(env_file=".env.dev", extra="ignore")

    APP_ENV: str = "dev"

    # 쉼표로 구분한 문자열로 받아서 나중에 파싱
    CORS_ORIGINS: str = "http://localhost:3000"

    DB_URL: str = "postgresql+psycopg://app:app@db:5432/app"
    JWT_SECRET: str = "change_me"
    JWT_EXPIRE_MIN: int = 20

    # 슈퍼관리자 (없어도 됨)
    SUPER_ADMIN_EMAIL: str | None = None
    SUPER_ADMIN_PASSWORD: str | None = None

    # 편의 프로퍼티: 리스트로 꺼내쓰기
    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
