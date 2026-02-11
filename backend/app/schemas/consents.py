from pydantic import BaseModel, Field


class ConsentRecordIn(BaseModel):
    event_type: str = Field(..., pattern="^(buy_allocation_request|entry_gate)$")
    legal_version: str = Field(default="2026-02-10", min_length=1, max_length=32)
    locale: str | None = Field(default=None, max_length=8)
    page_path: str | None = Field(default=None, max_length=120)

    terms_accepted: bool = False
    risk_accepted: bool = False
    privacy_accepted: bool = False
    token_accepted: bool = False

    non_investment_ack: bool = False
    allocation_verification_ack: bool = False
    irreversible_transfer_ack: bool = False
    voluntary_risk_ack: bool = False
