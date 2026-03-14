# Shree Paper Products - Backend

Node.js + Express backend for the Shree Paper Products management system.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/shree_paper_products
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@shreepaper.com
ADMIN_PASSWORD=admin123
```

3. Seed the database:
```bash
node seed.js
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/stats` - Get product statistics

### Orders
- `GET /api/orders` - Get all orders (authenticated)
- `GET /api/orders/:id` - Get single order (authenticated)
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id` - Update order (authenticated)
- `DELETE /api/orders/:id` - Delete order (admin)
- `GET /api/orders/:id/export-pdf` - Export order as PDF (authenticated)
- `GET /api/orders/stats` - Get order statistics (authenticated)

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (authenticated)
- `POST /api/auth/users` - Create user (admin)
- `GET /api/auth/users/all` - Get all users (admin)
- `PUT /api/auth/users/:id` - Update user (admin)
- `DELETE /api/auth/users/:id` - Delete user (admin)

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # MongoDB schemas
├── routes/         # API routes
├── server.js       # Main server file
├── seed.js         # Database seeding
└── package.json
```

## Notes

- MongoDB Atlas is required. Sign up at https://www.mongodb.com/cloud/atlas
- JWT tokens are required for protected endpoints
- Admin role is required for certain operations
