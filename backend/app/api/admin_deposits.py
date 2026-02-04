# backend/app/api/admin_deposits.py
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from sqlalchemy.orm import joinedload

from app.core.db import get_db
from app.core.auth import get_current_admin
from app.models import DepositRequest, User
from app.schemas.deposits import DepositRequestOut, AdminDepositRequestOut
from app.services.telegram import notify_deposit_approved

router = APIRouter(prefix="/admin/deposits", tags=["admin:deposits"])


# ---------- In Schemas ----------
class ApproveIn(BaseModel):
    actual_amount: Optional[float] = None
    admin_notes: Optional[str] = None


class RejectIn(BaseModel):
    admin_notes: Optional[str] = None


# ---------- List ----------
@router.get("", response_model=List[AdminDepositRequestOut])
def list_deposits(
    status: Optional[str] = Query(None, description="pending|approved|rejected"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    q = db.query(DepositRequest).options(joinedload(DepositRequest.user)).order_by(DepositRequest.created_at.desc())
    if status:
        q = q.filter(DepositRequest.status == status)
    return q.limit(200).all()


# ---------- Approve (상태 변경 + 유저 잔액 충전) ----------
@router.post("/{deposit_id}/approve", response_model=DepositRequestOut)
def approve_deposit(
    deposit_id: int,
    payload: ApproveIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    # 1. 입금 요청 존재 확인
    dr = db.query(DepositRequest).filter(DepositRequest.id == deposit_id).first()
    if not dr:
        raise HTTPException(404, "입금 요청(deposit_request)을 찾을 수 없습니다.")

    # 2. 이미 승인된 경우 중복 처리 방지
    if dr.status == "approved":
        return dr

    # 3. 대기 중인 상태인지 확인
    if dr.status != "pending":
        raise HTTPException(400, f"처리할 수 없는 상태입니다: {dr.status}")

    # 4. 입금 요청 정보 업데이트
    dr.actual_amount = payload.actual_amount if payload.actual_amount else dr.expected_amount
    dr.admin_notes = payload.admin_notes
    dr.admin_id = admin.id
    dr.status = "approved"
    dr.approved_at = datetime.utcnow()

    # 5. [중요] 유저 잔액(Balance) 실제 충전 로직
    user = db.query(User).filter(User.id == dr.user_id).first()
    if not user:
        raise HTTPException(404, "해당 입금을 신청한 유저를 찾을 수 없습니다.")
    user.balance = float(user.balance or 0) + float(dr.actual_amount)

    db.commit()
    db.refresh(dr)

    # 텔레그램 알림 전송
    try:
        notify_deposit_approved(
            user_email=user.email,
            amount=dr.actual_amount,
            deposit_id=dr.id
        )
    except Exception as e:
        print(f"텔레그램 알림 실패 (무시): {e}")

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
        raise HTTPException(404, "입금 요청을 찾을 수 없습니다.")

    if dr.status == "approved":
        raise HTTPException(400, "이미 승인된 요청은 거절할 수 없습니다.")

    if dr.status == "rejected":
        return dr

    dr.status = "rejected"
    dr.admin_id = admin.id
    if payload and payload.admin_notes:
        dr.admin_notes = payload.admin_notes

    db.commit()
    db.refresh(dr)
    return dr