# backend/app/models/point.py
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base


class Point(Base):
    __tablename__ = "points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # 포인트 소유자
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # 포인트 변동량 (+ 적립, - 사용)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # 변동 후 잔액
    balance_after: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # 포인트 유형
    type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True
    )  # earn, spend, refund, admin_adjust, referral_bonus
    
    # 설명
    description: Mapped[str] = mapped_column(String(200), nullable=False)
    
    # 관련 구매 (선택)
    purchase_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("purchases.id", ondelete="SET NULL"),
        nullable=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="point_history")
    purchase: Mapped["Purchase"] = relationship("Purchase", back_populates="point_records")

    def __repr__(self):
        return f"<Point(id={self.id}, user_id={self.user_id}, amount={self.amount}, type={self.type})>"
