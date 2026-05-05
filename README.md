# SimeonShop.rs - Enterprise E-Commerce Platform

Modern, scalable monorepo e-commerce platform built with Next.js and FastAPI.

## 📁 Project Structure

```
simeonshop/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── pages/        # React pages and routes
│   │   ├── components/   # Reusable React components
│   │   ├── styles/       # Global styles
│   │   ├── public/       # Static assets
│   │   ├── package.json  # Frontend dependencies
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── .env.example
│   │
│   └── api/              # FastAPI backend application
│       ├── app/
│       │   ├── core/     # Configuration, constants, security
│       │   ├── api/
│       │   │   └── v1/   # API v1 routes
│       │   └── main.py   # FastAPI app entry point
│       ├── requirements.txt
│       ├── .env.example
│       └── .gitignore
│
├── README.md             # This file
├── AGENTS.md            # GitHub Actions & Automation
├── .gitignore           # Git ignore rules
└── netlify.toml         # Netlify deployment configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Git

### Frontend Setup

```bash
cd apps/web

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server (port 3000)
npm run dev
```

Visit `http://localhost:3000`

### Backend Setup

```bash
cd apps/api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Start development server (port 8000)
python app/main.py
```

Visit `http://localhost:8000/api/docs` (Swagger UI)

## 📋 Available Routes

### Frontend Routes
- `/` - Homepage
- `/products` - Products listing
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/about` - About page
- `/contact` - Contact page
- `/privacy-policy` - Privacy policy
- `/terms-and-conditions` - Terms and conditions
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

### Backend API Routes (v1)
- `GET /api/v1/health` - Health check
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/orders` - Create new order
- `POST /api/v1/admin/login` - Admin login
- `GET /api/docs` - Swagger documentation
- `GET /api/redoc` - ReDoc documentation

## 🔧 Configuration

### Frontend Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Backend Environment Variables
```env
# .env
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
HOST=0.0.0.0
PORT=8000
```

## 🎨 Technology Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python-dotenv** - Environment management

## 📦 Available Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
npm run type-check   # Type checking
```

### Backend
```bash
python app/main.py                    # Start server (development)
uvicorn app.main:app --reload        # Start with auto-reload
uvicorn app.main:app --host 0.0.0.0  # Bind to all interfaces
```

## 🚀 Deployment

### Frontend - Netlify
```bash
# Configuration in netlify.toml
npm run build
```

### Backend - Heroku/Railway/Render
```bash
pip install -r requirements.txt
python app/main.py
```

## 📝 API Documentation

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

## 🔐 Security

- CORS properly configured for localhost development
- Environment variables for sensitive configuration
- TypeScript for frontend type safety
- Pydantic validation for backend data

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📞 Support

For issues and questions:
- Email: support@simeonshop.rs
- GitHub Issues: [Create an issue]

---

**Status**: Active Development
**Last Updated**: January 2024
Ffrontend + backend (admin) websites
