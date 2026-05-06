import re

from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return slug or "product"


def get_products(db: Session, *, include_inactive: bool = False) -> list[Product]:
    query = db.query(Product).order_by(Product.created_at.desc())
    if not include_inactive:
        query = query.filter(Product.is_active.is_(True))
    return query.all()


def get_product_by_id(db: Session, product_id: int) -> Product | None:
    return db.get(Product, product_id)


def get_product_by_slug(db: Session, slug: str) -> Product | None:
    return db.query(Product).filter(Product.slug == slug).first()


def create_product(db: Session, payload: ProductCreate) -> Product:
    product = Product(**payload.model_dump(exclude={"slug"}))
    product.slug = payload.slug or slugify(payload.name)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product: Product, payload: ProductUpdate) -> Product:
    data = payload.model_dump(exclude_unset=True)
    if "name" in data and "slug" not in data:
        data["slug"] = slugify(data["name"])
    for field, value in data.items():
        setattr(product, field, value)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product: Product) -> None:
    db.delete(product)
    db.commit()
