from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.crud.product import create_product, get_products

router = APIRouter()


@router.get("/")
def read_products(db: Session = Depends(get_db)):
    return get_products(db)


@router.post("/")
def add_product(
    name: str,
    description: str = "",
    price: float = 0,
    db: Session = Depends(get_db),
):
    return create_product(db, name, description, price)
