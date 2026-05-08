from datetime import datetime, timedelta

from app.core.security import create_access_token
from app.crud.product import create_product
from app.crud.user import create_user
from app.models.order import Order
from app.models.product_variant import ProductVariant
from app.schemas.product import ProductCreate
from app.schemas.user import UserCreate


def _headers(db, *, is_admin=True, email="summary-admin@example.com"):
    user = create_user(db, UserCreate(email=email, full_name="Summary User", password="Secret123!"), is_admin=is_admin)
    return {"Authorization": f"Bearer {create_access_token(user.id)}"}


def _order(db, number, status, total_cents, created_at):
    order = Order(
        order_number=number,
        status=status,
        total_cents=total_cents,
        customer_name="Kupac",
        customer_phone="+38160111222",
        shipping_city="Beograd",
        shipping_postal_code="11000",
        shipping_address="Test ulica 1",
        created_at=created_at,
    )
    db.add(order)
    db.commit()
    return order


def test_non_admin_cannot_read_summary(client, db):
    response = client.get("/api/v1/admin/summary", headers=_headers(db, is_admin=False, email="summary-user@example.com"))
    assert response.status_code == 403


def test_summary_period_revenue_and_low_stock_metrics(client, db):
    now = datetime.utcnow()
    _order(db, "SIM-DELIVERED", "delivered", 10000, now - timedelta(days=1))
    _order(db, "SIM-CANCELLED", "cancelled", 90000, now - timedelta(days=1))
    _order(db, "SIM-OLD", "delivered", 50000, now - timedelta(days=40))
    create_product(db, ProductCreate(name="Low stock", slug="low-stock", price_cents=1000, stock_quantity=3))
    high = create_product(db, ProductCreate(name="High stock", slug="high-stock", price_cents=1000, stock_quantity=20))
    variant_product = create_product(db, ProductCreate(name="Variant low", slug="variant-low", price_cents=1000, stock_quantity=50))
    db.add(ProductVariant(product_id=variant_product.id, sku="VL-S", size="S", stock_quantity=2, is_active=True))
    db.commit()

    response = client.get("/api/v1/admin/summary?period_days=30", headers=_headers(db))

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["orders_count_period"] == 2
    assert data["delivered_orders"] == 1
    assert data["cancelled_orders"] == 1
    assert data["total_revenue_cents"] == 10000
    assert data["average_order_value_cents"] == 10000
    low_names = {product["name"] for product in data["low_stock_products"]}
    assert "Low stock" in low_names
    assert "Variant low" in low_names
    assert high.name not in low_names
