from io import BytesIO

from app.core.config import settings
from app.core.security import create_access_token
from app.crud.product import create_product
from app.crud.user import create_user
from app.models.audit_log import AuditLog
from app.models.product_image import ProductImage
from app.schemas.product import ProductCreate
from app.schemas.user import UserCreate


def test_admin_uploads_product_image_to_cloudinary(client, db, monkeypatch):
    settings.MEDIA_PROVIDER = "cloudinary"
    settings.CLOUDINARY_CLOUD_NAME = "demo"
    settings.CLOUDINARY_API_KEY = "key"
    settings.CLOUDINARY_API_SECRET = "secret"
    product = create_product(db, ProductCreate(name="Upload majica", slug="upload-majica", price_cents=1000, stock_quantity=2))
    user = create_user(db, UserCreate(email="upload-admin@example.com", full_name="Upload Admin", password="Secret123!"), is_admin=True)

    def fake_upload(content, folder, resource_type):
        assert content == b"image-bytes"
        assert folder == f"simeonshop/products/{product.id}"
        assert resource_type == "image"
        return {"secure_url": "https://res.cloudinary.com/demo/image/upload/test.jpg"}

    monkeypatch.setattr("cloudinary.uploader.upload", fake_upload)

    response = client.post(
        f"/api/v1/admin/products/{product.id}/images/upload",
        headers={"Authorization": f"Bearer {create_access_token(user.id)}"},
        files={"file": ("test.jpg", BytesIO(b"image-bytes"), "image/jpeg")},
        data={"alt_text": "Alt", "sort_order": "5", "is_primary": "true"},
    )

    assert response.status_code == 201, response.text
    data = response.json()
    assert data["image_url"] == "https://res.cloudinary.com/demo/image/upload/test.jpg"
    assert data["is_primary"] is True
    assert db.query(ProductImage).filter(ProductImage.product_id == product.id).count() == 1
    log = db.query(AuditLog).filter(AuditLog.action == "upload", AuditLog.entity_type == "product_image").first()
    assert log is not None
