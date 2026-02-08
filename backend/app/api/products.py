# backend/app/api/products.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.auth import get_current_admin
from app.models import Product, User

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


# --- Admin CRUD ---

class ProductIn(BaseModel):
    name: str
    joy_amount: int
    price_usdt: float
    price_krw: int | None = None
    discount_rate: int = 0
    description: str | None = None
    sort_order: int = 0


@router.get("/admin/all")
def get_all_products(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    products = db.query(Product).order_by(Product.sort_order).all()
    return [{
        "id": p.id,
        "name": p.name,
        "joy_amount": p.joy_amount,
        "price_usdt": float(p.price_usdt),
        "price_krw": p.price_krw,
        "discount_rate": p.discount_rate,
        "description": p.description,
        "is_active": p.is_active,
        "sort_order": p.sort_order,
    } for p in products]


@router.post("/admin")
def create_product(data: ProductIn, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    product = Product(
        name=data.name,
        joy_amount=data.joy_amount,
        price_usdt=data.price_usdt,
        price_krw=data.price_krw,
        discount_rate=data.discount_rate,
        description=data.description,
        sort_order=data.sort_order,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"ok": True, "id": product.id}


@router.put("/admin/{product_id}")
def update_product(product_id: int, data: ProductIn, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(404, "상품을 찾을 수 없습니다")
    product.name = data.name
    product.joy_amount = data.joy_amount
    product.price_usdt = data.price_usdt
    product.price_krw = data.price_krw
    product.discount_rate = data.discount_rate
    product.description = data.description
    product.sort_order = data.sort_order
    db.commit()
    return {"ok": True, "id": product.id}


@router.delete("/admin/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(404, "상품을 찾을 수 없습니다")
    product.is_active = False
    db.commit()
    return {"ok": True, "message": "비활성화 완료"}


@router.post("/admin/{product_id}/activate")
def activate_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(404, "상품을 찾을 수 없습니다")
    product.is_active = True
    db.commit()
    return {"ok": True, "message": "활성화 완료"}
