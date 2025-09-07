# backend/app/api/admin_deposits.py
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.auth import get_current_admin
from app.models.deposit_request import DepositRequest

router = APIRouter(prefix="/admin/deposits", tags=["admin:deposits"])


@router.get("")
def list_deposits(
    status: str | None = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    q = db.query(DepositRequest).order_by(DepositRequest.id.desc())
    if status:
        q = q.filter(DepositRequest.status == status)
    return {"items": q.limit(200).all()}


@router.post("/{deposit_id}/confirm")
def confirm_deposit(
    deposit_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "deposit_request not found")
    if dr.status not in ("pending", "review_required"):
        raise HTTPException(400, f"invalid state: {dr.status}")

    dr.tx_hash = payload.get("tx_hash")
    dr.detected_amount = payload.get("detected_amount")
    dr.from_address = payload.get("from_address")
    dr.status = "confirmed"
    dr.confirmed_at = datetime.utcnow()
    db.commit()
    db.refresh(dr)
    return {"ok": True, "item": dr}


@router.post("/{deposit_id}/mark-credited")
def mark_credited(
    deposit_id: int,
    joy_tx_hash: str | None = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "deposit_request not found")
    if dr.status != "confirmed":
        raise HTTPException(400, f"invalid state: {dr.status}")
    dr.status = "credited"
    # 필요시 별도 ourcoin_tx_hash 컬럼을 만들고 저장하세요
    db.commit()
    db.refresh(dr)
    return {"ok": True, "item": dr}


@router.post("/{deposit_id}/reject")
def reject_deposit(
    deposit_id: int,
    reason: str | None = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "deposit_request not found")
    if dr.status in ("credited",):
        raise HTTPException(400, "already credited")
    dr.status = "rejected"
    db.commit()
    db.refresh(dr)
    return {"ok": True, "item": dr}
