# backend/app/models/deposit_request.py
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base


class DepositRequest(Base):
    __tablename__ = "deposit_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # 요청자
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # 연결된 구매 (선택)
    purchase_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("purchases.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # 블록체인 네트워크
    chain: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )  # TRC20, ERC20, BSC, Polygon
    
    # 입금받을 관리자 지갑 주소
    assigned_address: Mapped[str] = mapped_column(String(128), nullable=False)

    # 입금자명 (지갑 실명)
    sender_name: Mapped[str] = mapped_column(String(100), nullable=False)

    # 입금 예정 USDT
    expected_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    # 구매한 JOY 수량
    joy_amount: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
    # 실제 입금된 USDT (관리자가 확인 후 입력)
    actual_amount: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    
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
    
    # 승인 시각
    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="deposit_requests"
    )
    purchase: Mapped["Purchase"] = relationship("Purchase", back_populates="deposit_requests")
    admin: Mapped["User"] = relationship(
        "User",
        foreign_keys=[admin_id],
        backref="processed_deposits"
    )

    def __repr__(self):
        return f"<DepositRequest(id={self.id}, user_id={self.user_id}, status={self.status})>"
