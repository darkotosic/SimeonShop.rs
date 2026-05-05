from fastapi import APIRouter

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


@router.get("/products")
async def get_products(skip: int = 0, limit: int = 10):
    """Temporary public products endpoint for frontend integration smoke tests."""
    return {
        "items": [
            {
                "id": index,
                "name": f"Product {index}",
                "slug": f"product-{index}",
                "price": index * 1200,
                "description": "High-quality product",
            }
            for index in range(skip + 1, skip + limit + 1)
        ],
        "total": 100,
        "skip": skip,
        "limit": limit,
    }


@router.post("/orders")
async def create_order():
    """Temporary order endpoint until the database model is added."""
    return {
        "order_number": "SIM-000001",
        "status": "new",
    }
