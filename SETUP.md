# Shree Paper Products Installation & Setup Guide

## Quick Start (5 minutes)

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with MongoDB Atlas credentials
# Copy from .env.example and update MONGODB_URI

# 4. Seed database with sample data
node seed.js

# 5. Start server
npm run dev
```

**Server runs on**: `http://localhost:5000`

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

**Application opens at**: `http://localhost:3000`

## MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Add your IP to whitelist
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
6. Add to backend `.env`

## Default Login

```
Email: admin@shreepaper.com
Password: admin123
```

## Project Contents

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ PDF export for orders
- ✅ Role-based access control
- ✅ Data validation with Joi
- ✅ CORS enabled
- ✅ Error handling middleware

### Frontend Features
- ✅ React with hooks
- ✅ Responsive Tailwind CSS design
- ✅ Advanced product filtering
- ✅ Purchase order creation
- ✅ Order management
- ✅ Admin dashboard with charts
- ✅ PDF export
- ✅ Toast notifications

### Database Includes
- 5 sample products pre-configured
- Admin user account
- Order management system
- User authentication

## API Documentation

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/health` - Server health check

### Protected Endpoints (Requires Token)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:id/export-pdf` - Export PDF

### Admin Endpoints
- `POST /api/products` - Add product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `DELETE /api/orders/:id` - Delete order

## Environment Variables

### Backend `.env`
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

### Frontend `.env.local`
```
REACT_APP_API_URL=http://localhost:5000/api
```

## File Structure Summary

```
Backend:
- 3 MongoDB models (Product, Order, User)
- 3 controllers (product, order, auth)
- 3 route files with 15+ endpoints
- Authentication & admin middleware
- Error handling & CORS setup

Frontend:
- 7 page components
- 4 component files with reusable UI
- Service layer for API calls
- Tailwind CSS styling
- React Router navigation
- Toast notifications
- Chart.js integration
```

## Workflow

1. **Admin Login** → Dashboard
2. **Manage Products** → Create/Edit/Delete
3. **Create Orders** → Calculate totals automatically
4. **Export Orders** → PDF format
5. **View Analytics** → Dashboard charts

## Support

Refer to `/backend/README.md` and `/frontend/README.md` for detailed documentation.
