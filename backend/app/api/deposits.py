# backend/app/api/deposits.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.auth import get_current_user
from app.models import User, DepositRequest

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
