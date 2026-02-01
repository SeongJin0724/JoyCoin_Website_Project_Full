# backend/app/api/products.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import Product

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).order_by(Product.sort_order).all()

    return [{
        "id": p.id,
        "name": p.name,
        "joy_amount": p.joy_amount,
        "price_usdt": float(p.price_usdt),
        "price_krw": p.price_krw,
        "discount_rate": p.discount_rate,
        "description": p.description
    } for p in products]
