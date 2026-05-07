# Frontend - SimeonShop.rs Web Application

Next.js-based e-commerce frontend for SimeonShop.rs.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server (port 3000)
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
web/
├── pages/
│   ├── index.tsx              # Homepage
│   ├── products.tsx           # Products listing
│   ├── cart.tsx               # Shopping cart
│   ├── checkout.tsx           # Checkout
│   ├── about.tsx              # About page
│   ├── contact.tsx            # Contact page
│   ├── privacy-policy.tsx     # Privacy policy
│   ├── terms-and-conditions.tsx # Terms
│   └── admin/
│       ├── login.tsx          # Admin login
│       └── dashboard.tsx      # Admin dashboard
├── components/                # Reusable React components
├── styles/                    # Global CSS styles
├── public/                    # Static assets
├── package.json              # Dependencies
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── .env.local                # Environment variables
```

## 🛠️ Available Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
npm run type-check   # TypeScript type checking
```

## 🎨 Styling

Using **Tailwind CSS** for utility-first styling:
- Configuration: `tailwind.config.js`
- Global styles: `styles/globals.css`

## 🌍 Environment Configuration

```env
# .env.local
API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BRAND_NAME=Simeon Shop
NEXT_PUBLIC_DEFAULT_LOCALE=sr
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_LOGO_URL=
```

## 📝 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `pages/index.tsx` | Homepage with overview |
| `/products` | `pages/products.tsx` | Product listing |
| `/cart` | `pages/cart.tsx` | Shopping cart |
| `/checkout` | `pages/checkout.tsx` | Checkout process |
| `/about` | `pages/about.tsx` | About company |
| `/contact` | `pages/contact.tsx` | Contact form |
| `/privacy-policy` | `pages/privacy-policy.tsx` | Privacy policy |
| `/terms-and-conditions` | `pages/terms-and-conditions.tsx` | Terms & conditions |
| `/admin/login` | `pages/admin/login.tsx` | Admin login |
| `/admin/dashboard` | `pages/admin/dashboard.tsx` | Admin dashboard |

## 🔗 API Integration

Frontend communicates with backend at `http://localhost:8000`:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Example API call
fetch(`${apiUrl}/api/v1/products`)
  .then(r => r.json())
  .then(data => console.log(data));
```

## 🧪 Testing (Planned)

```bash
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📦 Dependencies

- **next**: React framework
- **react**: UI library
- **typescript**: Type safety
- **tailwindcss**: Styling
- **axios**: HTTP client
- **autoprefixer**: CSS processing
- **postcss**: CSS transformations

## 🚀 Deployment

### Netlify
Configuration in `netlify.toml` at project root.

```bash
npm run build
```

### Vercel
```bash
vercel deploy
```

## 📖 Next.js Features Used

- **App Router**: File-based routing
- **TypeScript**: Full type support
- **Image Optimization**: Built-in image component
- **API Routes**: Backend integration
- **Environment Variables**: Configuration management
- **CSS Modules & Tailwind**: Styling solutions

## 🔐 Security

- Environment variables for API URLs
- TypeScript strict mode
- Input validation on forms

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### API connection issues
- Ensure backend is running on `http://localhost:8000`
- Check `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
- Verify CORS is configured in backend

---

**Status**: Active Development
**Last Updated**: May 2026
