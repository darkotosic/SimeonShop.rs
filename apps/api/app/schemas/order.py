from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CheckoutCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=255)
    customer_email: EmailStr | None = None
    customer_phone: str = Field(min_length=5, max_length=80)
    shipping_city: str = Field(min_length=2, max_length=160)
    shipping_postal_code: str = Field(min_length=2, max_length=32)
    shipping_address: str = Field(min_length=5, max_length=500)
    note: str | None = None


class GuestCheckoutItem(BaseModel):
    product_id: int
    variant_id: int | None = None
    quantity: int = Field(ge=1, le=99)


class GuestCheckoutCreate(CheckoutCreate):
    idempotency_key: str | None = Field(default=None, max_length=120, pattern=r"^[A-Za-z0-9._:-]{8,120}$")
    items: list[GuestCheckoutItem] = Field(min_length=1, max_length=50)


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|confirmed|packed|shipped|delivered|cancelled)$")


class OrderStatusEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    old_status: str | None
    new_status: str
    actor_user_id: int | None
    note: str | None
    created_at: datetime


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    product_name: str
    product_sku: str | None
    unit_price_cents: int
    quantity: int
    total_price_cents: int


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    status: str
    payment_method: str
    total_cents: int
    currency: str
    customer_name: str
    customer_email: EmailStr | None
    customer_phone: str
    shipping_city: str
    shipping_postal_code: str
    shipping_address: str
    note: str | None
    idempotency_key: str | None = None
    confirmed_at: datetime | None = None
    packed_at: datetime | None = None
    shipped_at: datetime | None = None
    delivered_at: datetime | None = None
    cancelled_at: datetime | None = None
    internal_note: str | None = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemRead]
    status_events: list[OrderStatusEventRead] = []
