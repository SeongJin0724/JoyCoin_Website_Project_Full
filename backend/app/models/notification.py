# backend/app/models/notification.py
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # 알림 받는 사용자
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # 알림 유형
    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )  # deposit_pending, deposit_approved, deposit_rejected, referral_bonus, etc.

    # 알림 제목
    title: Mapped[str] = mapped_column(String(200), nullable=False)

    # 알림 내용
    message: Mapped[str] = mapped_column(String(500), nullable=False)

    # 관련 데이터 ID (예: deposit_request_id)
    related_id: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # 읽음 여부
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", backref="notifications")

    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, type={self.type})>"
