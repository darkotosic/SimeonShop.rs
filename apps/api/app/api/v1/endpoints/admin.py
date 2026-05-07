from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.crud.category import create_category, get_categories, get_category_by_id, soft_delete_category, update_category
from app.crud.order import get_order_by_id, get_orders, update_order_internal_note, update_order_status
from app.crud.product import create_product, delete_product, get_product_by_id, get_products, update_product
from app.crud.product_media import (
    create_product_image,
    create_product_variant,
    delete_product_image,
    delete_product_variant,
    set_primary_product_image,
    update_product_image,
    update_product_variant,
)
from app.models.order import Order
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant
from app.models.store_setting import StoreSetting
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.schemas.order import OrderInternalNoteUpdate, OrderRead, OrderStatusUpdate
from app.schemas.product import (
    ProductCreate,
    ProductImageCreate,
    ProductImageRead,
    ProductImageUpdate,
    ProductListResponse,
    ProductRead,
    ProductUpdate,
    ProductVariantCreate,
    ProductVariantRead,
    ProductVariantUpdate,
)
from app.schemas.store import StoreSettingRead, StoreSettingUpdate
from app.models.audit_log import AuditLog
from app.services.audit import create_audit_log
from app.services.media import upload_product_image

router = APIRouter()


def _get_product_or_404(db: Session, product_id: int) -> Product:
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product


def _get_product_image_or_404(db: Session, product_id: int, image_id: int) -> ProductImage:
    image = db.query(ProductImage).filter(ProductImage.id == image_id, ProductImage.product_id == product_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Product image not found.")
    return image


def _get_product_variant_or_404(db: Session, product_id: int, variant_id: int) -> ProductVariant:
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id, ProductVariant.product_id == product_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not found.")
    return variant


@router.get("/summary")
def admin_summary(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return {
        "new_orders": db.query(func.count(Order.id)).filter(Order.status == "new").scalar() or 0,
        "active_products": db.query(func.count(Product.id)).filter(Product.is_active.is_(True)).scalar() or 0,
        "out_of_stock_products": db.query(func.count(Product.id)).filter(Product.is_active.is_(True), Product.stock_quantity <= 0).scalar() or 0,
        "latest_orders": get_orders(db)[:5],
    }


@router.get("/products", response_model=ProductListResponse)
def admin_products(page: int = 1, page_size: int = 12, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_products(db, page=page, page_size=page_size, include_inactive=True)


@router.post("/products", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def admin_create_product(payload: ProductCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    try:
        product = create_product(db, payload)
        create_audit_log(db, current_admin.id, "create", "product", product.id)
        return product
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product slug or SKU already exists.") from exc


@router.patch("/products/{product_id}", response_model=ProductRead)
def admin_update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    updated = update_product(db, product, payload)
    create_audit_log(db, current_admin.id, "update", "product", product_id)
    return updated


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_product(product_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    delete_product(db, product)
    create_audit_log(db, current_admin.id, "delete", "product", product_id)
    return None


@router.post("/products/{product_id}/images", response_model=ProductImageRead, status_code=status.HTTP_201_CREATED)
def admin_create_product_image(
    product_id: int,
    payload: ProductImageCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    _get_product_or_404(db, product_id)
    image = create_product_image(db, product_id, payload)
    create_audit_log(db, current_admin.id, "create", "product_image", image.id, {"product_id": product_id})
    return image




@router.post("/products/{product_id}/images/upload", response_model=ProductImageRead, status_code=status.HTTP_201_CREATED)
async def admin_upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    alt_text: str | None = Form(default=None),
    sort_order: int = Form(default=0),
    is_primary: bool = Form(default=False),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    _get_product_or_404(db, product_id)
    image_url = await upload_product_image(file, product_id)
    image = create_product_image(
        db,
        product_id,
        ProductImageCreate(
            image_url=image_url,
            alt_text=alt_text,
            sort_order=sort_order,
            is_primary=is_primary,
        ),
    )
    create_audit_log(db, current_admin.id, "upload", "product_image", image.id, {"product_id": product_id})
    return image


@router.patch("/products/{product_id}/images/{image_id}", response_model=ProductImageRead)
def admin_update_product_image(
    product_id: int,
    image_id: int,
    payload: ProductImageUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    image = _get_product_image_or_404(db, product_id, image_id)
    updated = update_product_image(db, image, payload)
    create_audit_log(db, current_admin.id, "update", "product_image", image_id, {"product_id": product_id})
    return updated


@router.delete("/products/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_product_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    image = _get_product_image_or_404(db, product_id, image_id)
    delete_product_image(db, image)
    create_audit_log(db, current_admin.id, "delete", "product_image", image_id, {"product_id": product_id})
    return None


@router.patch("/products/{product_id}/images/{image_id}/primary", response_model=ProductImageRead)
def admin_set_primary_product_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    image = _get_product_image_or_404(db, product_id, image_id)
    updated = set_primary_product_image(db, image)
    create_audit_log(db, current_admin.id, "update", "product_image", image_id, {"product_id": product_id, "primary": True})
    return updated


@router.post("/products/{product_id}/variants", response_model=ProductVariantRead, status_code=status.HTTP_201_CREATED)
def admin_create_product_variant(
    product_id: int,
    payload: ProductVariantCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    _get_product_or_404(db, product_id)
    try:
        variant = create_product_variant(db, product_id, payload)
        create_audit_log(db, current_admin.id, "create", "product_variant", variant.id, {"product_id": product_id})
        return variant
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product variant SKU already exists.") from exc


@router.patch("/products/{product_id}/variants/{variant_id}", response_model=ProductVariantRead)
def admin_update_product_variant(
    product_id: int,
    variant_id: int,
    payload: ProductVariantUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    variant = _get_product_variant_or_404(db, product_id, variant_id)
    try:
        updated = update_product_variant(db, variant, payload)
        create_audit_log(db, current_admin.id, "update", "product_variant", variant_id, {"product_id": product_id})
        return updated
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product variant SKU already exists.") from exc


@router.delete("/products/{product_id}/variants/{variant_id}", response_model=ProductVariantRead)
def admin_delete_product_variant(
    product_id: int,
    variant_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    variant = _get_product_variant_or_404(db, product_id, variant_id)
    deleted = delete_product_variant(db, variant)
    create_audit_log(db, current_admin.id, "delete", "product_variant", variant_id, {"product_id": product_id})
    return deleted


@router.get("/orders", response_model=list[OrderRead])
def admin_orders(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_orders(db)


@router.patch("/orders/{order_id}/status", response_model=OrderRead)
def admin_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    order = get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    updated = update_order_status(db, order, payload.status, actor_user_id=current_admin.id)
    create_audit_log(db, current_admin.id, "update_status", "order", order_id, {"status": payload.status})
    return updated




@router.patch("/orders/{order_id}/internal-note", response_model=OrderRead)
def admin_order_internal_note(order_id: int, payload: OrderInternalNoteUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    order = get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    updated = update_order_internal_note(db, order, payload.internal_note)
    create_audit_log(db, current_admin.id, "update_internal_note", "order", order_id)
    return updated


@router.get("/categories", response_model=list[CategoryRead])
def admin_categories(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_categories(db, include_inactive=True)


@router.post("/categories", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def admin_create_category(payload: CategoryCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    category = create_category(db, payload)
    create_audit_log(db, current_admin.id, "create", "category", category.id)
    return category


@router.patch("/categories/{category_id}", response_model=CategoryRead)
def admin_update_category(category_id: int, payload: CategoryUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    category = get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    updated = update_category(db, category, payload)
    create_audit_log(db, current_admin.id, "update", "category", category_id)
    return updated


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_category(category_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    category = get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    soft_delete_category(db, category)
    create_audit_log(db, current_admin.id, "delete", "category", category_id)
    return None


@router.get("/audit-logs")
def admin_audit_logs(action: str | None = None, entity_type: str | None = None, actor_user_id: int | None = None, page: int = 1, page_size: int = 50, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)
    if actor_user_id is not None:
        query = query.filter(AuditLog.actor_user_id == actor_user_id)
    total = query.count()
    items = query.order_by(AuditLog.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": item.id, "actor_user_id": item.actor_user_id, "action": item.action, "entity_type": item.entity_type, "entity_id": item.entity_id, "metadata_json": item.metadata_json, "created_at": item.created_at} for item in items], "total": total, "page": page, "page_size": page_size}


@router.get("/settings", response_model=list[StoreSettingRead])
def admin_settings(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return db.query(StoreSetting).order_by(StoreSetting.key.asc()).all()


@router.patch("/settings/{key}", response_model=StoreSettingRead)
def admin_update_setting(key: str, payload: StoreSettingUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    setting = db.query(StoreSetting).filter(StoreSetting.key == key).first()
    if not setting:
        setting = StoreSetting(key=key, value_type=payload.value_type or "string")
        db.add(setting)
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(setting, field, value)
    db.commit()
    db.refresh(setting)
    create_audit_log(db, current_admin.id, "update", "setting", key)
    return setting
