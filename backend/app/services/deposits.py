# backend/app/services/deposits.py
import logging
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime

from app.models import User, DepositRequest, Notification, Point
from app.core.config import settings

logger = logging.getLogger(__name__)


def create_deposit_request(db: Session, user: User, data):
    if not settings.USDT_ADMIN_ADDRESS:
        raise ValueError("USDT_ADMIN_ADDRESS is not configured")

    amt = Decimal(str(data.amount_usdt))

    req = DepositRequest(
        user_id=user.id,
        chain=data.chain,
        expected_amount=float(amt),
        joy_amount=data.joy_amount,
        sender_name=data.sender_name,
        assigned_address=settings.USDT_ADMIN_ADDRESS,
        status="pending",
    )
    db.add(req)
    db.flush()

    # 사용자에게 입금 대기 알림 생성
    notification = Notification(
        user_id=user.id,
        type="deposit_pending",
        title="Deposit Pending",
        message=f"Your deposit request for {data.joy_amount} JOY (${amt} USDT) is pending.",
        related_id=req.id,
    )
    db.add(notification)

    db.commit()
    db.refresh(req)

    # 텔레그램 알림 발송 (비동기로 처리)
    send_telegram_notification(
        f"🔔 New Deposit Request\n"
        f"User: {user.username} ({user.email})\n"
        f"Sender: {data.sender_name}\n"
        f"Amount: ${amt} USDT\n"
        f"JOY: {data.joy_amount}\n"
        f"Chain: {data.chain}\n"
        f"Request ID: {req.id}"
    )

    return req


def approve_deposit(db: Session, deposit: DepositRequest, admin: User, actual_amount: float = None, notes: str = None):
    """입금 승인 처리 - JOY 지급 및 추천인 보상"""
    user = deposit.user

    # 1. 입금 상태 업데이트
    deposit.status = "approved"
    deposit.admin_id = admin.id
    deposit.actual_amount = actual_amount or deposit.expected_amount
    deposit.admin_notes = notes
    deposit.approved_at = datetime.utcnow()

    # 2. 사용자 JOY 잔액 업데이트
    user.total_joy += deposit.joy_amount

    # 3. 추천인 보상 처리 (10% 포인트, 추천받은 횟수만큼만)
    if user.referred_by and user.referrer:
        referrer = user.referrer
        if referrer.referral_reward_remaining > 0:
            # 입금 금액의 10% 포인트 지급
            reward_points = int(float(deposit.actual_amount) * 10)  # $1 = 10 points, 10% = 1 point per $1
            referrer.total_points += reward_points
            referrer.referral_reward_remaining -= 1

            # 포인트 내역 기록
            point_record = Point(
                user_id=referrer.id,
                amount=reward_points,
                balance_after=referrer.total_points,
                type="referral_bonus",
                description=f"Referral bonus from {user.username}'s purchase",
            )
            db.add(point_record)

            # 추천인에게 알림
            referrer_notification = Notification(
                user_id=referrer.id,
                type="referral_bonus",
                title="Referral Bonus",
                message=f"You earned {reward_points} points from {user.username}'s purchase!",
                related_id=deposit.id,
            )
            db.add(referrer_notification)

    # 4. 사용자에게 입금 완료 알림
    notification = Notification(
        user_id=user.id,
        type="deposit_approved",
        title="Deposit Approved",
        message=f"Your deposit has been approved! {deposit.joy_amount} JOY has been added to your account.",
        related_id=deposit.id,
    )
    db.add(notification)

    db.commit()
    db.refresh(deposit)

    # 텔레그램 알림
    send_telegram_notification(
        f"✅ Deposit Approved\n"
        f"User: {user.username}\n"
        f"JOY: {deposit.joy_amount}\n"
        f"Admin: {admin.username}"
    )

    return deposit


def reject_deposit(db: Session, deposit: DepositRequest, admin: User, notes: str = None):
    """입금 거부 처리"""
    deposit.status = "rejected"
    deposit.admin_id = admin.id
    deposit.admin_notes = notes

    # 사용자에게 알림
    notification = Notification(
        user_id=deposit.user_id,
        type="deposit_rejected",
        title="Deposit Rejected",
        message=f"Your deposit request has been rejected. {notes or ''}",
        related_id=deposit.id,
    )
    db.add(notification)

    db.commit()
    db.refresh(deposit)
    return deposit


def get_user_deposits(db: Session, user: User):
    return (
        db.query(DepositRequest)
        .filter(DepositRequest.user_id == user.id)
        .order_by(DepositRequest.id.desc())
        .all()
    )


def send_telegram_notification(message: str):
    """텔레그램 알림 발송"""
    import requests

    bot_token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    if not bot_token or not chat_id:
        logger.warning("Telegram not configured, skipping notification")
        return

    try:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        requests.post(url, json={"chat_id": chat_id, "text": message}, timeout=5)
    except Exception as e:
        logger.error(f"Failed to send telegram notification: {e}")
