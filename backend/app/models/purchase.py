# backend/app/models/purchase.py
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # 구매자
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # 구매 상품
    product_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    
    # 수량
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    
    # 총 JOY 코인
    total_joy: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # 총 USDT
    total_usdt: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    
    # 총 KRW (참고용)
    total_krw: Mapped[int | None] = mapped_column(Integer, nullable=True)
    
    # 결제 방법
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # 블록체인 트랜잭션 해시 (선택)
    transaction_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    
    # 상태
    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
        index=True
    )  # pending, completed, failed, refunded
    
    # 구매 완료 시각
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="purchases")
    product: Mapped["Product"] = relationship("Product", back_populates="purchases")
    deposit_requests: Mapped[list["DepositRequest"]] = relationship(
        "DepositRequest",
        back_populates="purchase"
    )
    point_records: Mapped[list["Point"]] = relationship("Point", back_populates="purchase")

    def __repr__(self):
        return f"<Purchase(id={self.id}, user_id={self.user_id}, status={self.status})>"
