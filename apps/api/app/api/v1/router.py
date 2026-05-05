from fastapi import APIRouter

# Create router for v1 endpoints
router = APIRouter(prefix="/api/v1", tags=["v1"])


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "SimeonShop.rs API is running",
        "version": "1.0.0",
    }


@router.get("/products")
async def get_products(skip: int = 0, limit: int = 10):
    """Get all products"""
    return {
        "items": [
            {
                "id": i,
                "name": f"Product {i}",
                "price": i * 10.0,
                "description": "High-quality product",
            }
            for i in range(1, limit + 1)
        ],
        "total": 100,
        "skip": skip,
        "limit": limit,
    }


@router.get("/products/{product_id}")
async def get_product(product_id: int):
    """Get product by ID"""
    return {
        "id": product_id,
        "name": f"Product {product_id}",
        "price": product_id * 10.0,
        "description": "High-quality product",
        "in_stock": True,
    }


@router.post("/orders")
async def create_order(customer_name: str, items: list = None):
    """Create new order"""
    return {
        "order_id": "ORD-001",
        "customer": customer_name,
        "items": items or [],
        "total": 0,
        "status": "pending",
    }


@router.post("/admin/login")
async def admin_login(email: str, password: str):
    """Admin login endpoint"""
    # Demo endpoint - in production use proper authentication
    if email and password:
        return {
            "access_token": "demo_token_123",
            "token_type": "bearer",
            "user": {"email": email, "role": "admin"},
        }
    return {"error": "Invalid credentials"}, 401
