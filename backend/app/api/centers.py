# backend/app/api/centers.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import Center

router = APIRouter(prefix="/centers", tags=["centers"])


@router.get("")
def get_centers(db: Session = Depends(get_db)):
    centers = db.query(Center).filter(Center.is_active == True).all()
    return [{"id": c.id, "name": c.name, "region": c.region} for c in centers]
