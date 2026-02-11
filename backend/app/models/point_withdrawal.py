# backend/app/models/point_withdrawal.py
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base


class PointWithdrawal(Base):
    __tablename__ = "point_withdrawals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # 신청자
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # 출금 포인트
    amount: Mapped[int] = mapped_column(Integer, nullable=False)

    # 출금 방법 (bank, usdt 등)
    method: Mapped[str] = mapped_column(String(50), nullable=False)

    # 출금 정보 (계좌번호 또는 지갑주소)
    account_info: Mapped[str] = mapped_column(String(255), nullable=False)

    # 상태
    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
        index=True
    )  # pending, approved, rejected

    # 처리한 관리자
    admin_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    # 관리자 메모
    admin_notes: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # 처리 시각
    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        return f"<PointWithdrawal(id={self.id}, user_id={self.user_id}, amount={self.amount}, status={self.status})>"
