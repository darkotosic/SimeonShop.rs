from fastapi import APIRouter

from app.api.v1.endpoints import products
from app.core.config import settings

router = APIRouter(prefix=settings.API_PREFIX, tags=["v1"])


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "SimeonShop.rs API is running",
        "version": settings.PROJECT_VERSION,
        "environment": settings.APP_ENV,
    }


@router.post("/orders")
async def create_order():
    """Temporary order endpoint until the database model is added."""
    return {
        "order_number": "SIM-000001",
        "status": "new",
    }


router.include_router(products.router, prefix="/products", tags=["Products"])
