# backend/app/api/admin_deposits.py
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.core.db import get_db
from app.core.auth import get_current_admin
from app.models import DepositRequest, User
from app.schemas.deposits import DepositRequestOut

router = APIRouter(prefix="/admin/deposits", tags=["admin:deposits"])


# ---------- In Schemas ----------
class ApproveIn(BaseModel):
    actual_amount: Optional[float] = None
    admin_notes: Optional[str] = None


class RejectIn(BaseModel):
    admin_notes: Optional[str] = None


# ---------- List ----------
@router.get("", response_model=List[DepositRequestOut])
def list_deposits(
    status: Optional[str] = Query(None, description="pending|approved|rejected"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    q = db.query(DepositRequest).order_by(DepositRequest.created_at.desc())
    if status:
        q = q.filter(DepositRequest.status == status)
    return q.limit(200).all()


# ---------- Approve ----------
@router.post("/{deposit_id}/approve", response_model=DepositRequestOut)
def approve_deposit(
    deposit_id: int,
    payload: ApproveIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "deposit_request not found")

    if dr.status == "approved":
        return dr

    if dr.status != "pending":
        raise HTTPException(400, f"invalid state: {dr.status}")

    dr.actual_amount = payload.actual_amount if payload.actual_amount else dr.expected_amount
    dr.admin_notes = payload.admin_notes
    dr.admin_id = admin.id
    dr.status = "approved"
    dr.approved_at = datetime.utcnow()

    db.commit()
    db.refresh(dr)
    return dr


# ---------- Reject ----------
@router.post("/{deposit_id}/reject", response_model=DepositRequestOut)
def reject_deposit(
    deposit_id: int,
    payload: RejectIn | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "deposit_request not found")

    if dr.status == "approved":
        raise HTTPException(400, "already approved")

    if dr.status == "rejected":
        return dr

    dr.status = "rejected"
    dr.admin_id = admin.id
    if payload and payload.admin_notes:
        dr.admin_notes = payload.admin_notes

    db.commit()
    db.refresh(dr)
    return dr
