# Backend - SimeonShop.rs API

FastAPI-based REST API for SimeonShop.rs e-commerce platform.

## 🚀 Quick Start

### Backend local commands (Windows / PowerShell)

```bash
cd apps/api
py -3.12 -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

For macOS/Linux, create a Python 3.12 virtual environment with your local Python launcher and activate it with `source .venv/bin/activate`.

Visit `http://localhost:8000/api/docs` for API documentation.

## 📁 Project Structure

```
api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py        # Configuration & settings
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── router.py    # API v1 routes
│   └── models/              # Pydantic models (optional)
├── requirements.txt         # Python dependencies
├── .env.example            # Example environment variables
├── .env                    # Environment variables (local)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🛠️ Available Commands

```bash
# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run with uvicorn (with auto-reload)
uvicorn app.main:app --reload --port 8000

# Run with specific host
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Install dependencies
pip install -r requirements.txt

# Add new dependency
pip install package-name
pip freeze > requirements.txt
```

## 📝 API Endpoints

All endpoints are under `/api/v1` prefix.

### Health & Status
- **GET** `/api/v1/health` - Health check endpoint
  - Returns: `{"status": "ok", "message": "...", "version": "1.0.0"}`

### Products
- **GET** `/api/v1/products` - Get all products
  - Query params: `skip=0, limit=10`
  - Returns: List of products with pagination

- **GET** `/api/v1/products/{product_id}` - Get product by ID
  - Returns: Single product details

### Orders
- **POST** `/api/v1/orders` - Create new order
  - Body: `{customer_name, items}`
  - Returns: Order confirmation with ID

### Admin
- **POST** `/api/v1/admin/login` - Admin login
  - Body: `{email, password}`
  - Returns: Access token and user info

## 🔧 Configuration

### Environment Variables
```env
# .env
APP_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
HOST=0.0.0.0
PORT=8000
```

### CORS Configuration
CORS is configured to allow requests from `ALLOWED_ORIGINS`:
- `http://localhost:3000` (Frontend)
- `http://localhost:8000` (Swagger UI)
- `http://127.0.0.1:3000` (Alternative localhost)

Modify `ALLOWED_ORIGINS` in `.env` to add more origins.

## 📚 API Documentation

Interactive documentation available at:
- **Swagger UI**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`
- **OpenAPI JSON**: `http://localhost:8000/api/openapi.json`

## 📦 Dependencies

- **fastapi** (^0.104.1) - Web framework
- **uvicorn** (^0.24.0) - ASGI server
- **pydantic** (^2.5.0) - Data validation
- **python-dotenv** (^1.0.0) - Environment management

See `requirements.txt` for all dependencies.

## 🧪 Testing (Planned)

```bash
# Install pytest
pip install pytest pytest-asyncio

# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## 🚀 Deployment

### Development
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```


### Docker production start

The production Docker image starts with `/app/start.sh`, which runs `alembic upgrade head` before launching Uvicorn with proxy headers. Keep Render/Docker start commands aligned with this behavior so migrations are not skipped.

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Docker
```dockerfile
FROM python:3.12
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app ./app
CMD ["python", "app/main.py"]
```

## 🔐 Security

- ✅ CORS properly configured
- ✅ Environment variables for secrets
- ✅ Pydantic data validation
- ✅ JWT admin authentication

### TODO - Production Security
- [x] JWT authentication
- [x] PostgreSQL via SQLAlchemy and Alembic
- [x] Rate limiting
- [x] Input validation
- [ ] HTTPS enforcement
- [ ] SQL injection prevention

## 🐛 Troubleshooting

### Port 8000 already in use
```bash
# Use different port
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --port 8001
# Or kill process:
# Windows: netstat -ano | findstr :8000
# macOS/Linux: lsof -i :8000
```

### Module not found errors
```bash
# Ensure venv is activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### CORS errors
- Check `ALLOWED_ORIGINS` in `.env`
- Ensure frontend URL is in the list
- Restart API server after changes

## 📖 FastAPI Features Used

- **Async/Await**: Async route handlers
- **Pydantic**: Request/response validation
- **Type Hints**: Full type annotation
- **CORS Middleware**: Cross-origin support
- **OpenAPI Docs**: Auto-generated documentation
- **Path Parameters**: Dynamic route segments
- **Query Parameters**: URL query strings

## 🔄 Adding New Endpoints

1. Add route to `app/api/v1/router.py`:
```python
@router.get("/new-endpoint")
async def new_endpoint():
    return {"message": "Success"}
```

2. Restart server
3. View in Swagger UI at `http://localhost:8000/api/docs`

---

**Status**: Active Development
**Last Updated**: January 2024
