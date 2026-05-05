from sqlalchemy.orm import Session

from app.models.product import Product


def get_products(db: Session):
    return db.query(Product).all()


def create_product(db: Session, name: str, description: str, price: float):
    product = Product(
        name=name,
        description=description,
        price=price,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
