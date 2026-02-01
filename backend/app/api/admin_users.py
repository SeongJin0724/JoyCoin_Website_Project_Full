# backend/app/api/admin_users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.auth import get_current_admin
from app.models import User

router = APIRouter(prefix="/admin/users", tags=["admin:users"])


@router.post("/{user_id}/promote")
def promote_user_to_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "user not found")
    if user.role == "admin":
        return {"ok": True, "message": "already admin", "user_id": user.id}
    user.role = "admin"
    db.commit()
    return {"ok": True, "message": "promoted", "user_id": user.id}


@router.get("")
def list_users(
    q: str | None = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    qry = db.query(User)
    if q:
        qry = qry.filter(User.email.ilike(f"%{q}%"))
    items = qry.order_by(User.created_at.desc()).limit(100).all()
    return {
        "items": [
            {
                "id": u.id,
                "email": u.email,
                "role": u.role,
                "is_email_verified": u.is_email_verified,
                "created_at": u.created_at,
            }
            for u in items
        ]
    }
