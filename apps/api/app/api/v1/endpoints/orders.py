from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user, get_db
from app.crud.order import create_order_from_cart, get_order_by_id, get_orders, get_user_orders, update_order_status
from app.models.user import User
from app.schemas.order import CheckoutCreate, OrderRead, OrderStatusUpdate

router = APIRouter()


@router.post("/checkout", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: CheckoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_order_from_cart(db, current_user.id, payload)


@router.get("/me", response_model=list[OrderRead])
def read_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_orders(db, current_user.id)


@router.get("/", response_model=list[OrderRead])
def read_orders(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_orders(db)


@router.patch("/{order_id}/status", response_model=OrderRead)
def change_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    order = get_order_by_id(db, order_id)

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    return update_order_status(db, order, payload.status)
