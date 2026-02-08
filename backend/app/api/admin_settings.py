# backend/app/api/admin_settings.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.core.config import settings
from app.core.db import get_db
from app.models import User, ExchangeRate

router = APIRouter(prefix="/admin/settings", tags=["admin:settings"])


class SettingsResponse(BaseModel):
    usdt_address: str
    telegram_enabled: bool
    referral_bonus_points: int


@router.get("", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    rate = db.query(ExchangeRate).filter(ExchangeRate.is_active == True).first()
    return SettingsResponse(
        usdt_address=settings.USDT_ADMIN_ADDRESS or "설정되지 않음",
        telegram_enabled=bool(settings.TELEGRAM_BOT_TOKEN and settings.TELEGRAM_CHAT_ID),
        referral_bonus_points=rate.referral_bonus_points if rate else 100,
    )


class ReferralBonusUpdate(BaseModel):
    referral_bonus_points: int


@router.put("/referral-bonus")
def update_referral_bonus(
    data: ReferralBonusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if data.referral_bonus_points < 0:
        raise HTTPException(400, "포인트는 0 이상이어야 합니다")
    rate = db.query(ExchangeRate).filter(ExchangeRate.is_active == True).first()
    if not rate:
        raise HTTPException(404, "환율 설정을 찾을 수 없습니다")
    rate.referral_bonus_points = data.referral_bonus_points
    db.commit()
    return {"ok": True, "referral_bonus_points": rate.referral_bonus_points}
