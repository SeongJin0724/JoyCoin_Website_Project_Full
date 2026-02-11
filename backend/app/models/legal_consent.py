from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base


class LegalConsent(Base):
    __tablename__ = "legal_consents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    event_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    legal_version: Mapped[str] = mapped_column(String(32), nullable=False, default="2026-02-10")
    locale: Mapped[str | None] = mapped_column(String(8), nullable=True)

    terms_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    risk_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    privacy_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    token_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    non_investment_ack: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    allocation_verification_ack: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    irreversible_transfer_ack: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    voluntary_risk_ack: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    page_path: Mapped[str | None] = mapped_column(String(120), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", backref="legal_consents")
