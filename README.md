# 💻 Alamin Computer — Full-Stack Ecommerce Platform

> Ethiopia's trusted laptop store for wholesale & retail customers.  
> Built with Next.js 14 · Express.js · MongoDB · Stripe · Cloudinary

---

## 📁 Project Structure

```
alamin-computer/
├── frontend/          ← Next.js 14 App Router (TypeScript)
│   ├── app/
│   │   ├── page.tsx              ← Home page
│   │   ├── shop/page.tsx         ← Shop / product listing
│   │   ├── product/[slug]/       ← Product detail
│   │   ├── cart/page.tsx         ← Shopping cart
│   │   ├── checkout/page.tsx     ← Checkout + Stripe
│   │   ├── auth/login/           ← Login page
│   │   ├── auth/register/        ← Register page
│   │   ├── dashboard/page.tsx    ← User dashboard
│   │   ├── admin/                ← Admin panel (protected)
│   │   │   ├── page.tsx          ← Dashboard overview
│   │   │   ├── products/         ← Product CRUD
│   │   │   ├── orders/           ← Order management
│   │   │   ├── customers/        ← Customer management
│   │   │   ├── categories/       ← Category management
│   │   │   └── reviews/          ← Review moderation
│   │   ├── contact/page.tsx      ← Contact page
│   │   └── about/page.tsx        ← About page
│   ├── components/
│   │   ├── layout/Navbar.tsx
│   │   ├── layout/Footer.tsx
│   │   ├── home/HeroSection.tsx
│   │   ├── home/FeaturedSection.tsx
│   │   ├── home/CategoryGrid.tsx
│   │   ├── home/ReviewsSection.tsx
│   │   └── shop/ProductCard.tsx
│   ├── store/
│   │   ├── authStore.ts          ← Zustand auth state
│   │   └── cartStore.ts          ← Zustand cart (persisted)
│   └── lib/api.ts                ← Axios instance with JWT
│
└── backend/           ← Node.js + Express REST API
    └── src/
        ├── server.js
        ├── config/db.js
        ├── config/cloudinary.js
        ├── models/
        │   ├── User.js
        │   ├── Product.js
        │   ├── Category.js
        │   ├── Order.js
        │   └── Review.js
        ├── controllers/
        │   ├── authController.js
        │   ├── productController.js
        │   ├── orderController.js
        │   ├── adminController.js
        │   └── paymentController.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── productRoutes.js
        │   ├── categoryRoutes.js
        │   ├── orderRoutes.js
        │   ├── reviewRoutes.js
        │   ├── uploadRoutes.js
        │   ├── paymentRoutes.js
        │   ├── adminRoutes.js
        │   └── userRoutes.js
        ├── middleware/auth.js
        └── utils/
            ├── email.js
            └── seed.js
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
# Backend
cd alamin-computer/backend
npm install
cp .env.example .env
# Fill in your .env values (see below)

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
# Fill in your .env.local values
```

### 2. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- Admin account: `admin@alamincomputer.com` / `Admin@123456`
- 6 product categories
- 5 sample products

### 3. Run development servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/alamin-computer

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=30d

# Admin Seed Credentials
ADMIN_EMAIL=admin@alamincomputer.com
ADMIN_PASSWORD=Admin@123456

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16char_app_password
FROM_EMAIL=noreply@alamincomputer.com
FROM_NAME=Alamin Computer

# CORS
FRONTEND_URL=http://localhost:3000

# Contact Info
WHATSAPP_NUMBER=+251900000000
TELEGRAM_USERNAME=alamincomputer
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
NEXT_PUBLIC_WHATSAPP=+251900000000
NEXT_PUBLIC_TELEGRAM=alamincomputer
NEXT_PUBLIC_FACEBOOK=https://facebook.com/alamincomputer
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🌐 Deployment

### Step 1 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all, for cloud hosting)
5. Get connection string: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/alamin-computer`

### Step 2 — Cloudinary (Image Storage)

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier)
2. Go to Dashboard → get **Cloud Name**, **API Key**, **API Secret**
3. Add to backend `.env`

### Step 3 — Stripe

1. Sign up at [stripe.com](https://stripe.com)
2. Dashboard → Developers → API Keys
3. Copy **Publishable key** → frontend env
4. Copy **Secret key** → backend env
5. For webhooks: Stripe CLI → `stripe listen --forward-to localhost:5000/api/payment/webhook`
6. Copy **Webhook signing secret** → `STRIPE_WEBHOOK_SECRET`

### Step 4 — Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Connect your repo, select the `backend/` directory
3. Add all environment variables from `.env`
4. Set **Start Command**: `npm start`
5. Railway will give you a URL like `https://alamin-backend.railway.app`

**OR use Render:**
1. [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add env vars

### Step 5 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set root directory to `frontend/`
3. Framework: **Next.js** (auto-detected)
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL = https://your-railway-url.railway.app/api
   NEXT_PUBLIC_STRIPE_KEY = pk_live_...
   NEXT_PUBLIC_WHATSAPP = +251900000000
   NEXT_PUBLIC_TELEGRAM = alamincomputer
   NEXT_PUBLIC_FACEBOOK = https://facebook.com/alamincomputer
   NEXT_PUBLIC_SITE_URL = https://alamincomputer.vercel.app
   ```
5. Deploy!

### Step 6 — Update CORS

After deploying frontend, update backend env:
```
FRONTEND_URL=https://alamincomputer.vercel.app
```

Redeploy backend.

---

## 🔐 API Routes Reference

### Auth
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get profile | JWT |
| PUT | `/api/auth/me` | Update profile | JWT |
| PUT | `/api/auth/password` | Change password | JWT |
| POST | `/api/auth/forgot-password` | Forgot password | Public |
| PUT | `/api/auth/reset-password/:token` | Reset password | Public |
| POST | `/api/auth/wishlist/:productId` | Toggle wishlist | JWT |
| POST | `/api/auth/addresses` | Add address | JWT |
| DELETE | `/api/auth/addresses/:id` | Delete address | JWT |

### Products
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/products` | List products (filtered/paginated) | Public |
| GET | `/api/products/featured` | Featured/bestseller/new | Public |
| GET | `/api/products/:slug` | Single product + related | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Orders
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/orders` | Place order | JWT |
| GET | `/api/orders/my` | My orders | JWT |
| GET | `/api/orders/:id` | Single order | JWT/Admin |
| PUT | `/api/orders/:id/pay` | Mark as paid | JWT |
| GET | `/api/orders` | All orders | Admin |
| PUT | `/api/orders/:id/status` | Update status | Admin |

### Upload
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/upload/product-image` | Upload to Cloudinary | Admin |
| DELETE | `/api/upload/product-image` | Delete from Cloudinary | Admin |

### Payment
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/payment/create-intent` | Create Stripe PaymentIntent | JWT |
| POST | `/api/payment/webhook` | Stripe webhook | Public |

### Admin
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/admin/dashboard` | Stats + analytics | Admin |
| GET | `/api/admin/users` | All users | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| GET | `/api/admin/reviews` | All reviews | Admin |
| PUT | `/api/admin/reviews/:id/approve` | Approve review | Admin |
| DELETE | `/api/admin/reviews/:id` | Delete review | Admin |

---

## 👤 Default Admin Login

After running `npm run seed`:

- **Email:** `admin@alamincomputer.com`
- **Password:** `Admin@123456`
- **Admin URL:** `http://localhost:3000/admin`

> ⚠️ **IMPORTANT:** Change the admin password immediately after first login in production!

---

## 📱 SEO Keywords Targeted

- laptop store Ethiopia
- HP EliteBook price Ethiopia
- used laptops Addis Ababa
- wholesale laptops Ethiopia
- Core i7 laptops Ethiopia
- affordable laptops Ethiopia
- refurbished laptops Addis Ababa
- Alamin Computer

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| State | Zustand |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken, bcryptjs) |
| Images | Cloudinary + multer |
| Payments | Stripe |
| Email | Nodemailer (Gmail SMTP) |
| Frontend Host | Vercel |
| Backend Host | Railway / Render |
| DB Host | MongoDB Atlas |

---

## 📞 Business Contact Info to Update

Edit these in your env files and footer:
- `NEXT_PUBLIC_WHATSAPP` — Your WhatsApp number
- `NEXT_PUBLIC_TELEGRAM` — Your Telegram username
- `NEXT_PUBLIC_FACEBOOK` — Your Facebook page URL
- Address in `Footer.tsx` and `contact/page.tsx`
- Google Maps embed in `contact/page.tsx`

---

## 🔄 Useful Commands

```bash
# Seed database with sample data
cd backend && npm run seed

# Build frontend for production
cd frontend && npm run build

# Run backend in production
cd backend && NODE_ENV=production npm start
```

---

## 📄 License

MIT © Alamin Computer Ethiopia

---

*Built with ❤️ for Ethiopian entrepreneurs and laptop buyers.*
