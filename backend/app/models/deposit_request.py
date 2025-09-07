# backend/app/models/deposit_request.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

# 프로젝트의 Base 위치에 맞춰 import 하세요.
# 예) app.core.db 에 Base 가 있으면 아래 줄로, 다른 곳이면 경로만 바꾸세요.
from app.core.db import Base


class DepositRequest(Base):
    __tablename__ = "deposit_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    chain = Column(String(10), nullable=False)  # "TRON" | "ETH"
    assigned_address = Column(String(128), nullable=False)  # 관리자 USDT 입금 주소
    expected_amount = Column(String(50), nullable=False)  # 문자열로 저장(간단 버전)
    reference_code = Column(String(32), nullable=False, index=True)

    status = Column(String(32), nullable=False, index=True, default="pending")
    tx_hash = Column(String(128), nullable=True)
    from_address = Column(String(128), nullable=True)
    detected_amount = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    confirmed_at = Column(DateTime, nullable=True)

    # User 모델이 app.models.user.User 에 있다면 아래 관계를 활성화 가능
    # user = relationship("User", backref="deposit_requests")
