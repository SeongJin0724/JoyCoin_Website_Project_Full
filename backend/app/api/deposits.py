# backend/app/api/deposits.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# ✅ 실제 프로젝트 구조에 맞게 수정
from app.core.db import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.deposit_request import DepositRequest  # 모델 파일명이 다르면 맞게 수정

from app.schemas.deposits import DepositRequestIn, DepositRequestOut
from app.services.deposits import create_deposit_request, get_user_deposits

router = APIRouter(prefix="/deposits", tags=["deposits"])


@router.post("/request", response_model=DepositRequestOut)
def request_deposit(
    data: DepositRequestIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return create_deposit_request(db, user, data)


@router.get("/my")
def my_deposits(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items = get_user_deposits(db, user)
    return {"items": items}
