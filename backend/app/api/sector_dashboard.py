# backend/app/api/sector_dashboard.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional

from app.core.db import get_db
from app.core.auth import get_current_sector_manager
from app.models import User, Sector, DepositRequest, Referral

router = APIRouter(prefix="/sector", tags=["sector"])


@router.get("/dashboard")
def sector_dashboard(
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_sector_manager),
):
    """섹터 매니저 대시보드: 내 섹터 정보 + 통계"""
    sector = db.query(Sector).filter(Sector.id == manager.sector_id).first()

    # 이 섹터에 배정된 모든 유저 (sector_id가 같은 일반 유저들)
    sector_users = db.query(User).filter(User.sector_id == sector.id).all()
    sector_user_ids = [u.id for u in sector_users]

    # 이 섹터 유저들의 입금 요청
    total_deposits = 0.0
    approved_count = 0
    pending_count = 0

    if sector_user_ids:
        deposits = db.query(DepositRequest).filter(
            DepositRequest.user_id.in_(sector_user_ids)
        ).all()

        for d in deposits:
            if d.status == "approved":
                total_deposits += float(d.actual_amount or d.expected_amount)
                approved_count += 1
            elif d.status == "pending":
                pending_count += 1

    fee_amount = total_deposits * (sector.fee_percent / 100)

    return {
        "sector": {
            "id": sector.id,
            "name": sector.name,
            "fee_percent": sector.fee_percent,
        },
        "stats": {
            "total_users": len(sector_user_ids),
            "total_approved_deposits": total_deposits,
            "fee_amount": round(fee_amount, 2),
            "approved_count": approved_count,
            "pending_count": pending_count,
        },
    }


@router.get("/deposits")
def sector_deposits(
    search: Optional[str] = Query(None, description="이메일 또는 유저명 검색"),
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_sector_manager),
):
    """섹터 매니저: 내 섹터 유저들의 입금 내역 조회"""
    # 내 섹터 유저 쿼리
    user_query = db.query(User).filter(User.sector_id == manager.sector_id)

    if search:
        user_query = user_query.filter(
            (User.email.ilike(f"%{search}%")) | (User.username.ilike(f"%{search}%"))
        )

    sector_users = user_query.all()
    sector_user_ids = [u.id for u in sector_users]

    if not sector_user_ids:
        return {"items": []}

    deposits = (
        db.query(DepositRequest)
        .options(joinedload(DepositRequest.user))
        .filter(DepositRequest.user_id.in_(sector_user_ids))
        .order_by(DepositRequest.created_at.desc())
        .limit(200)
        .all()
    )

    return {
        "items": [
            {
                "id": d.id,
                "user_email": d.user.email,
                "user_username": d.user.username,
                "chain": d.chain,
                "expected_amount": float(d.expected_amount),
                "actual_amount": float(d.actual_amount) if d.actual_amount else None,
                "status": d.status,
                "created_at": d.created_at.isoformat(),
            }
            for d in deposits
        ]
    }
