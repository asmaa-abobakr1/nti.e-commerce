# Youth Store - E-Commerce Application

## 📦 Project Structure

```
youthStore/              # Angular Frontend
youthStoreAPI/          # Node.js/Express Backend
```

## ⚙️ Setup Instructions

### Frontend Setup (Angular)

```bash
cd youthStore

# Install dependencies
npm install

# Start development server
ng serve
# App runs on http://localhost:4200
```

### Backend Setup (Node.js)

```bash
cd youthStoreAPI

# Install dependencies
npm install

# Create .env file from .env.example
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
```

**Environment Variables (.env):**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/youth-store
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

#### Start Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Seed database with sample data
npm run seed
```

API runs on `http://localhost:5000`

## 🗄️ Database Setup

### MongoDB Local Setup
```bash
# Install MongoDB Community Edition
# Start MongoDB service

# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
# Install and run MongoDB service

# Linux
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Seed Sample Data
```bash
cd youthStoreAPI
npm run seed
```

This will create:
- 3 Product Categories (Hoodies, T-Shirts, Jeans)
- 5 Sample Products with images and pricing

## 📂 Key Features

### ✅ Frontend (Angular)
- **Product Card Component** - Reusable product display (grid & compact layouts)
- **Testimonial Slider** - Auto-rotating customer reviews with carousel
- **Shop Page** - Product filtering, categories, price range
- **Home Page** - Hero section, new arrivals, best sellers
- **Admin Dashboard** - Edit homepage content, manage products
- **Cart System** - Add/remove products
- **Authentication** - User signup/login with JWT

### ✅ Backend (Node.js/Express)
- **Product Management** - CRUD operations with images
- **Category Management** - Product categorization
- **Order Management** - Track customer orders
- **User Authentication** - Signup, login, JWT tokens
- **Admin Panel** - Settings management, product admin
- **Testimonials** - Customer reviews with approval workflow

## 🔑 API Endpoints

```
GET  /api/v1/products           - Get all products
POST /api/v1/products           - Create product (admin)
GET  /api/v1/products/:id       - Get product details
PATCH /api/v1/products/:id      - Update product (admin)
DELETE /api/v1/products/:id     - Delete product (admin)

GET  /api/v1/categories         - Get all categories
POST /api/v1/categories         - Create category (admin)

GET  /api/v1/settings           - Get homepage settings
PATCH /api/v1/settings          - Update settings (admin)

GET  /api/v1/testimonials/approved - Get approved testimonials
POST /api/v1/testimonials       - Submit new testimonial
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd youthStore
npm run build
```

### Backend (Heroku/Railway)
```bash
cd youthStoreAPI
npm install
npm start
```

## 🛠️ Troubleshooting

**Products not showing?**
- Check if Backend API is running on localhost:5000
- Verify MongoDB connection in .env
- Run `npm run seed` to add sample data

**CORS errors?**
- Ensure Backend CORS is enabled
- Check that Frontend points to correct API URL

**Admin can't edit homepage?**
- Login with admin account
- Visit `/admin/settings` route
- Verify database permissions

## 📝 License

ISC
