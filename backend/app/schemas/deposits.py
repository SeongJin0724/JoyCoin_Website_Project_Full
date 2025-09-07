from pydantic import BaseModel
from datetime import datetime


class DepositRequestIn(BaseModel):
    chain: str
    amount_usdt: str


class DepositRequestOut(BaseModel):
    id: int
    assigned_address: str
    expected_amount: str
    reference_code: str
    status: str
    created_at: datetime


class Config:
    from_attributes = True  # Pydantic v2에서 orm_mode 대체
