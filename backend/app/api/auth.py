# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.core.auth import get_current_user
from app.schemas.auth import SignupIn, LoginIn, Tokens
from app.models import User, Center, Referral
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
def signup(data: SignupIn, db: Session = Depends(get_db)):
    # 1. 이메일 중복 체크
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. 추천인 코드 확인 (있다면)
    referrer = None
    if data.referral_code:
        referrer = db.query(User).filter(User.referral_code == data.referral_code).first()
        if not referrer:
            raise HTTPException(status_code=400, detail="Invalid referral code")

    # 3. 센터 확인 (있다면)
    if data.center_id:
        center = db.query(Center).filter(Center.id == data.center_id).first()
        if not center:
            raise HTTPException(status_code=400, detail="Invalid center")

    # 4. 사용자 생성
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        username=data.username,
        referred_by=referrer.id if referrer else None,
        center_id=data.center_id if data.center_id else None,
        role="user",
        is_email_verified=True,
    )
    db.add(user)
    db.flush()

    # 5. 추천인 관계 기록 및 추천 보상 횟수 증가
    if referrer:
        referral = Referral(
            referrer_id=referrer.id,
            referred_id=user.id,
            reward_points=0  # 실제 보상은 구매 시 지급
        )
        db.add(referral)

        # 추천인의 보상 가능 횟수 +1
        referrer.referral_reward_remaining += 1

    db.commit()

    return {
        "message": "Registration successful",
        "user_id": user.id,
        "referral_code": user.referral_code
    }


@router.post("/login", response_model=Tokens)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access = create_access_token(
        user_id=user.id,
        minutes=settings.JWT_EXPIRE_MIN,
        secret=settings.JWT_SECRET,
    )
    return Tokens(access=access)


@router.get("/me")
def get_me(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """현재 로그인된 사용자 정보 조회"""
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "referral_code": user.referral_code,
        "role": user.role,
        "center_id": user.center_id,
        "total_joy": user.total_joy,
        "total_points": user.total_points,
        "is_email_verified": user.is_email_verified,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }
