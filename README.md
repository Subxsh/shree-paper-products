# Shree Paper Products - Full-Stack Application

## Overview

A comprehensive full-stack web application for **Shree Paper Products**, a paper cone manufacturing company serving the textile industry. The system manages product catalogs, order management, and provides professional administrative dashboards.

## Company Information

- **Name**: Shree Paper Products
- **Location**: Tirupur, Tamil Nadu, India
- **Industry**: Paper Cone Manufacturing for Textile Industry
- **Products**: Premium paper cones used by textile thread manufacturers

## Technology Stack

### Frontend
- **Framework**: React.js 18
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router v6
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Charts**: Chart.js & React-ChartJS-2
- **Notifications**: React Hot Toast
- **PDF Generation**: PDFKit

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Database**: MongoDB Atlas
- **Validation**: Joi
- **File Upload**: Multer
- **PDF Generation**: PDFKit

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB
- Collections: Products, Orders, Users

## Features

### Public Features
1. **Home Page**
   - Professional hero section
   - Company information
   - Standard paper cone specifications
   - Features and benefits overview

2. **Product Catalog**
   - Browse all products
   - Advanced filtering (cone degree, color, material, thread compatibility)
   - Search functionality
   - Product details with specifications

3. **Product Details**
   - Technical specifications table
   - Cone measurements and diagrams
   - Material and color options
   - Pricing information
   - Stock availability

### Admin Features
1. **Authentication**
   - Admin login with JWT
   - Secure session management
   - Role-based access control

2. **Order Management**
   - Create purchase orders with itemized details
   - Auto-calculated totals (Basic, CGST, SGST, Grand Total)
   - Customer information and GST details
   - Order status tracking
   - Export orders as PDF

3. **Product Management**
   - Add new products
   - Update product specifications
   - Manage stock quantities
   - Delete products

4. **Dashboard**
   - Key performance metrics
   - Total products, stock, orders, and revenue
   - Order status distribution
   - Monthly orders and sales charts
   - Product analytics

## Project Structure

```
shree-paper-products/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── admin.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── authRoutes.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductComponents.jsx
│   │   │   ├── OrderComponents.jsx
│   │   │   ├── DashboardComponents.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── OrderCreationPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── README.md
│   └── .env.example
│
├── .gitignore
└── README.md (this file)
```

## Standard Paper Cone Specifications

### 4°20 Paper Cone
- **Length**: 170 mm
- **Top Diameter**: 16 mm
- **Bottom Diameter**: 69 mm
- **Common Thread Compatibility**: 30S, 40S

### 4°30 Paper Cone
- **Length**: 175 mm
- **Top Diameter**: 17 mm
- **Bottom Diameter**: 69 mm
- **Common Thread Compatibility**: 34S

### 5°57 Paper Cone
- **Length**: 230 mm
- **Top Diameter**: 22 mm
- **Bottom Diameter**: 69 mm
- **Common Thread Compatibility**: 61S (Coarse)

### 3°30 Paper Cone
- **Length**: 170 mm
- **Top Diameter**: 18 mm
- **Bottom Diameter**: 62 mm
- **Common Thread Compatibility**: 20S, 40S

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Modern web browser

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and configure:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas connection string and other settings.

4. Seed the database with initial data:
```bash
node seed.js
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Default Login Credentials

```
Email: admin@shreepaper.com
Password: admin123
```

⚠️ **Important**: Change these credentials in production!

## Database Schema

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  coneDegree: String (enum: ['3°30', '4°20', '4°30', '5°57']),
  length: Number,
  topDiameter: Number,
  bottomDiameter: Number,
  color: String,
  material: String,
  weight: Number,
  strength: String,
  threadCompatibility: String,
  price: Number,
  stock: Number,
  description: String,
  finishType: String,
  tipType: String,
  surfaceFinish: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  poNumber: String (unique),
  date: Date,
  customerName: String,
  gstNumber: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    rate: Number,
    cgst: Number,
    sgst: Number,
    total: Number
  }],
  basicTotal: Number,
  cgstTotal: Number,
  sgstTotal: Number,
  grandTotal: Number,
  notes: String,
  status: String,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'user']),
  company: {
    name: String,
    address: String,
    gst: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

## API Endpoints

### Products API
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/stats` - Get product statistics
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders API
- `GET /api/orders` - Get all orders (authenticated)
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/stats` - Get order statistics
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id` - Update order (authenticated)
- `DELETE /api/orders/:id` - Delete order (admin)
- `GET /api/orders/:id/export-pdf` - Export as PDF

### Authentication API
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (authenticated)
- `POST /api/auth/users` - Create user (admin)
- `GET /api/auth/users/all` - Get all users (admin)
- `PUT /api/auth/users/:id` - Update user (admin)
- `DELETE /api/auth/users/:id` - Delete user (admin)

## UI Design

### Color Scheme
- **Primary**: Dark Blue (#1e3a8a)
- **Secondary**: Light Blue (#3b82f6)
- **Background**: Light Gray (#f9fafb)
- **Text**: Gray (#111827)

### Components
- Professional product cards
- Specification tables
- Order management tables
- Dashboard with charts
- Responsive navigation
- Professional footer

## Features Implemented

✅ Complete MERN stack setup
✅ MongoDB Atlas integration
✅ JWT authentication system
✅ Role-based access control (Admin/User)
✅ Product catalog with advanced filters
✅ Product details page
✅ Purchase order creation and management
✅ Auto-calculated order totals with tax
✅ PDF export for purchase orders
✅ Admin dashboard with analytics
✅ Charts for monthly orders and sales
✅ Responsive design for all devices
✅ Professional UI with Tailwind CSS
✅ Data validation and error handling
✅ Toast notifications
✅ Secure password hashing
✅ API documentation

## Future Enhancements

- Email notifications for orders
- Payment gateway integration
- Inventory management alerts
- Customer portal access
- Advanced reporting
- Multi-currency support
- Bulk order import (CSV)
- Real-time notifications with WebSockets
- Mobile app
- API rate limiting

## Deployment

### Backend Deployment (Heroku/AWS/Azure)
1. Push to Git repository
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database exists

### CORS Errors
- Check backend CORS configuration
- Verify frontend API URL matches backend

### Authentication Issues
- Check JWT secret in `.env`
- Verify token is being stored correctly
- Check localStorage in browser DevTools

## Support & Contact

For issues and inquiries:
- Email: support@shreepaper.com
- Location: Tirupur, Tamil Nadu, India

## License

Proprietary - Shree Paper Products

## Version History

- **v1.0.0** (2024-03) - Initial release
  - Complete product catalog system
  - Order management features
  - Admin dashboard
  - PDF export functionality
