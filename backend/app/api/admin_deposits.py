# backend/app/api/admin_deposits.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional, List

from app.core.db import get_db
from app.core.auth import get_current_admin
from app.models import DepositRequest, User
from app.services.deposits import approve_deposit, reject_deposit

router = APIRouter(prefix="/admin/deposits", tags=["admin:deposits"])


# ---------- Schemas ----------
class ApproveIn(BaseModel):
    actual_amount: Optional[float] = None
    admin_notes: Optional[str] = None


class RejectIn(BaseModel):
    admin_notes: Optional[str] = None


class UserInfo(BaseModel):
    id: int
    email: str
    username: str

    model_config = dict(from_attributes=True)


class DepositWithUser(BaseModel):
    id: int
    user_id: int
    chain: str
    assigned_address: str
    sender_name: str
    expected_amount: float
    joy_amount: int
    actual_amount: Optional[float] = None
    status: str
    admin_notes: Optional[str] = None
    created_at: str
    approved_at: Optional[str] = None
    user: UserInfo

    model_config = dict(from_attributes=True)


# ---------- List ----------
@router.get("")
def list_deposits(
    status: Optional[str] = Query(None, description="pending|approved|rejected"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    q = (
        db.query(DepositRequest)
        .options(joinedload(DepositRequest.user))
        .order_by(DepositRequest.created_at.desc())
    )
    if status:
        q = q.filter(DepositRequest.status == status)

    deposits = q.limit(200).all()

    result = []
    for d in deposits:
        result.append({
            "id": d.id,
            "user_id": d.user_id,
            "chain": d.chain,
            "assigned_address": d.assigned_address,
            "sender_name": d.sender_name,
            "expected_amount": float(d.expected_amount),
            "joy_amount": d.joy_amount,
            "actual_amount": float(d.actual_amount) if d.actual_amount else None,
            "status": d.status,
            "admin_notes": d.admin_notes,
            "created_at": d.created_at.isoformat() if d.created_at else None,
            "approved_at": d.approved_at.isoformat() if d.approved_at else None,
            "user": {
                "id": d.user.id,
                "email": d.user.email,
                "username": d.user.username,
            }
        })
    return result


# ---------- Approve ----------
@router.post("/{deposit_id}/approve")
def approve_deposit_endpoint(
    deposit_id: int,
    payload: ApproveIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "Deposit request not found")

    if dr.status == "approved":
        raise HTTPException(400, "Already approved")

    if dr.status != "pending":
        raise HTTPException(400, f"Invalid state: {dr.status}")

    result = approve_deposit(db, dr, admin, payload.actual_amount, payload.admin_notes)
    return {"message": "Approved", "id": result.id}


# ---------- Reject ----------
@router.post("/{deposit_id}/reject")
def reject_deposit_endpoint(
    deposit_id: int,
    payload: RejectIn = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "Deposit request not found")

    if dr.status == "approved":
        raise HTTPException(400, "Already approved, cannot reject")

    if dr.status == "rejected":
        raise HTTPException(400, "Already rejected")

    notes = payload.admin_notes if payload else None
    result = reject_deposit(db, dr, admin, notes)
    return {"message": "Rejected", "id": result.id}
