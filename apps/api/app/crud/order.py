from datetime import datetime, timezone
from secrets import token_hex

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import CheckoutCreate


def generate_order_number() -> str:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"SIM-{stamp}-{token_hex(4).upper()}"


def create_order_from_cart(db: Session, user_id: int, payload: CheckoutCreate) -> Order:
    cart = (
        db.query(Cart)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
        .filter(Cart.user_id == user_id, Cart.status == "active")
        .first()
    )

    if not cart or not cart.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty.")

    total_cents = 0

    for item in cart.items:
        if not item.product or not item.product.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart contains unavailable product.")

        if item.product.stock_quantity < item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Insufficient stock for {item.product.name}.")

        total_cents += item.quantity * item.product.price_cents

    order = Order(
        order_number=generate_order_number(),
        user_id=user_id,
        total_cents=total_cents,
        customer_name=payload.customer_name,
        customer_email=str(payload.customer_email) if payload.customer_email else None,
        customer_phone=payload.customer_phone,
        shipping_city=payload.shipping_city,
        shipping_postal_code=payload.shipping_postal_code,
        shipping_address=payload.shipping_address,
        note=payload.note,
    )

    db.add(order)
    db.flush()

    for item in cart.items:
        product: Product = item.product

        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                product_sku=product.sku,
                unit_price_cents=product.price_cents,
                quantity=item.quantity,
                total_price_cents=item.quantity * product.price_cents,
            )
        )

        product.stock_quantity -= item.quantity

    cart.status = "converted"

    db.commit()
    db.refresh(order)

    return get_order_by_id(db, order.id) or order


def get_order_by_id(db: Session, order_id: int) -> Order | None:
    return (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )


def get_user_orders(db: Session, user_id: int) -> list[Order]:
    return (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_orders(db: Session) -> list[Order]:
    return db.query(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc()).all()


def update_order_status(db: Session, order: Order, status_value: str) -> Order:
    order.status = status_value
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
