# backend/app/api/admin_sectors.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.core.db import get_db
from app.core.auth import get_current_admin
from app.models import User, Sector

router = APIRouter(prefix="/admin/sectors", tags=["admin:sectors"])


# ---------- Schemas ----------
class SectorOut(BaseModel):
    id: int
    name: str
    fee_percent: int

    model_config = dict(from_attributes=True)


class SectorFeeUpdate(BaseModel):
    fee_percent: int  # 5, 10, 15, 20


class SectorManagerAssign(BaseModel):
    user_id: int
    sector_id: int


# ---------- 섹터 목록 ----------
@router.get("", response_model=List[SectorOut])
def list_sectors(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    return db.query(Sector).order_by(Sector.name).all()


# ---------- 섹터 Fee 변경 ----------
@router.put("/{sector_id}/fee", response_model=SectorOut)
def update_sector_fee(
    sector_id: int,
    payload: SectorFeeUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if payload.fee_percent not in (5, 10, 15, 20):
        raise HTTPException(400, "fee_percent는 5, 10, 15, 20 중 하나여야 합니다.")

    sector = db.query(Sector).filter(Sector.id == sector_id).first()
    if not sector:
        raise HTTPException(404, "섹터를 찾을 수 없습니다.")

    sector.fee_percent = payload.fee_percent
    db.commit()
    db.refresh(sector)
    return sector


# ---------- 섹터 매니저 배정 ----------
@router.post("/assign-manager")
def assign_sector_manager(
    payload: SectorManagerAssign,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(404, "유저를 찾을 수 없습니다.")

    sector = db.query(Sector).filter(Sector.id == payload.sector_id).first()
    if not sector:
        raise HTTPException(404, "섹터를 찾을 수 없습니다.")

    user.role = "sector_manager"
    user.sector_id = payload.sector_id
    db.commit()
    return {"message": f"{user.email}님이 섹터 {sector.name} 매니저로 배정되었습니다."}
