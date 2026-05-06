from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(40), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(String(32), nullable=False, default="new", server_default="new")
    payment_method = Column(String(32), nullable=False, default="cash_on_delivery", server_default="cash_on_delivery")
    total_cents = Column(Integer, nullable=False, default=0, server_default="0")
    currency = Column(String(3), nullable=False, default="RSD", server_default="RSD")

    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(320), nullable=True)
    customer_phone = Column(String(80), nullable=False)
    shipping_city = Column(String(160), nullable=False)
    shipping_postal_code = Column(String(32), nullable=False)
    shipping_address = Column(String(500), nullable=False)
    note = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    product_name = Column(String(255), nullable=False)
    product_sku = Column(String(100), nullable=True)
    unit_price_cents = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price_cents = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
