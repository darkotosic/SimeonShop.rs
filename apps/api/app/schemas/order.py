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
    items: list[GuestCheckoutItem] = Field(min_length=1, max_length=50)


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|confirmed|packed|shipped|delivered|cancelled)$")


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
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemRead]
