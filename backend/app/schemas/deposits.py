# backend/app/schemas/deposits.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class DepositRequestIn(BaseModel):
    chain: str = Field(..., pattern="^(TRC20|ERC20|BSC|Polygon)$")
    amount_usdt: float


class DepositRequestOut(BaseModel):
    id: int
    user_id: int
    purchase_id: Optional[int] = None
    chain: str
    assigned_address: str
    expected_amount: float
    actual_amount: Optional[float] = None
    status: str
    admin_id: Optional[int] = None
    admin_notes: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime

    model_config = dict(from_attributes=True)
