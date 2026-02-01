# backend/app/models/product.py
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Boolean, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    
    # JOY 코인 수량
    joy_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # 가격 (USDT)
    price_usdt: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    
    # 가격 (KRW 참고용)
    price_krw: Mapped[int | None] = mapped_column(Integer, nullable=True)
    
    # 할인율 (%)
    discount_rate: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # 설명
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    # 활성화 여부
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # 정렬 순서
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    # Relationships
    purchases: Mapped[list["Purchase"]] = relationship("Purchase", back_populates="product")

    def __repr__(self):
        return f"<Product(id={self.id}, name={self.name}, joy={self.joy_amount})>"
