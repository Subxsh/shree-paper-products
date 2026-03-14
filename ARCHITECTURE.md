# Technical Architecture - Shree Paper Products

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     SHREE PAPER PRODUCTS                     │
│              Full-Stack MERN Application                     │
└─────────────────────────────────────────────────────────────┘
        │                  │                      │
        ▼                  ▼                      ▼
    ┌────────┐        ┌─────────┐          ┌──────────┐
    │Frontend │        │ Backend │          │Database  │
    │ React  │◄──────►│Express  │◄────────►│MongoDB   │
    │Port 3000│        │Port 5000│         │Atlas     │
    └────────┘        └─────────┘          └──────────┘
        │                  │
        │                  │
    ┌──────────────────────────────────┐
    │   API Communication (REST/JSON)  │
    │   Authentication (JWT)           │
    │   Data Validation                │
    └──────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Header (user info, logout)
├── Navigation (conditional links)
├── Routes
│   ├── HomePage
│   ├── ProductsPage
│   │   ├── ProductFilters
│   │   └── ProductGrid
│   │       └── ProductCard
│   ├── ProductDetailsPage
│   ├── LoginPage
│   ├── OrderCreationPage
│   │   └── OrderForm
│   ├── OrdersPage
│   │   └── OrdersTable
│   └── DashboardPage
│       ├── StatCard
│       ├── OrdersChart
│       └── SalesChart
└── Footer
```

### State Management
- React Hooks (useState, useEffect, useContext)
- localStorage for authentication token
- API service layer for data fetching

### Service Layer
```
services/
├── api.js (Axios instance with token injection)
└── index.js (Service methods for each resource)
    ├── productService.getAllProducts()
    ├── productService.getProductById()
    ├── orderService.getAllOrders()
    ├── orderService.createOrder()
    └── authService.login()
```

## Backend Architecture

### Express Application Structure

```
server.js (Entry Point)
│
├── Middleware
│   ├── CORS
│   ├── JSON Parser
│   ├── Authentication JWT
│   └── Error Handler
│
├── Routes
│   ├── /api/products
│   ├── /api/orders
│   └── /api/auth
│
├── Controllers
│   ├── productController
│   ├── orderController
│   └── authController
│
├── Models
│   ├── Product
│   ├── Order
│   └── User
│
└── Config
    └── database.js
```

### API Routes & Endpoints

#### Products Routes
```
GET     /api/products              Get all products
GET     /api/products/:id          Get single product
GET     /api/products/stats        Get statistics
POST    /api/products              Create product (admin)
PUT     /api/products/:id          Update product (admin)
DELETE  /api/products/:id          Delete product (admin)
```

#### Orders Routes
```
GET     /api/orders                Get all orders
GET     /api/orders/:id            Get single order
GET     /api/orders/stats          Get statistics
POST    /api/orders                Create order
PUT     /api/orders/:id            Update order
DELETE  /api/orders/:id            Delete order (admin)
GET     /api/orders/:id/export-pdf Export as PDF
```

#### Authentication Routes
```
POST    /api/auth/login            Admin login
GET     /api/auth/me               Get current user
POST    /api/auth/users            Create user (admin)
GET     /api/auth/users/all        Get all users (admin)
PUT     /api/auth/users/:id        Update user (admin)
DELETE  /api/auth/users/:id        Delete user (admin)
```

## Database Schema Design

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,                  // Product name
  coneDegree: String,           // 3°30, 4°20, 4°30, 5°57
  length: Number,               // mm
  topDiameter: Number,          // mm
  bottomDiameter: Number,       // mm
  color: String,
  material: String,
  weight: Number,               // grams
  strength: String,             // Low, Medium, High, Extra High
  threadCompatibility: String,  // 20S, 30S, 34S, 61S
  price: Number,                // INR per unit
  stock: Number,                // NOS available
  description: String,
  finishType: String,           // Diamond, Plain, Smooth
  tipType: String,              // Round, Sharp, Flat
  surfaceFinish: String,        // Glossy, Matte, Textured
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  poNumber: String,             // Unique PO identifier
  date: Date,
  customerName: String,
  gstNumber: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  items: [{                      // Itemized order details
    productId: ObjectId,
    productName: String,
    quantity: Number,
    uom: String,                 // NOS, KG, BOXES, CARTONS
    rate: Number,
    cgst: Number,               // Central GST %
    sgst: Number,               // State GST %
    total: Number
  }],
  basicTotal: Number,
  cgstTotal: Number,
  sgstTotal: Number,
  grandTotal: Number,
  notes: String,
  status: String,               // Draft, Confirmed, Shipped, Delivered, Cancelled
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
  email: String,                // Unique
  password: String,             // Hashed with bcryptjs
  role: String,                 // admin, user
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

## Authentication Flow

```
1. User submits login credentials
        │
        ▼
2. Backend validates credentials
        │
        ▼
3. Generate JWT token (expires in 7 days)
        │
        ▼
4. Return token to frontend
        │
        ▼
5. Frontend stores token in localStorage
        │
        ▼
6. Subsequent requests include token in Authorization header
        │
        ▼
7. Backend middleware validates token
        │
        ▼
8. Grant access to protected routes
```

## Data Flow Example: Creating an Order

```
Frontend                          Backend                    Database
   │                                │                           │
   ├─ POST /api/orders ─────────────►│                           │
   │  (with auth token)              │                           │
   │                                 ├─ Verify token            │
   │                                 │                           │
   │                                 ├─ Validate order data      │
   │                                 │                           │
   │                                 ├─ Generate PO number       │
   │                                 │                           │
   │                                 ├─ Calculate totals         │
   │                                 │                           │
   │                                 ├─ Create order ────────────►│
   │                                 │                           │
   │                                 │◄────── Return ObjectId ────┤
   │                                 │                           │
   │◄─201 Created + Order JSON ──────┤                           │
   │                                 │                           │
```

## Security Architecture

### Authentication
- JWT tokens with 7-day expiration
- bcryptjs password hashing (10 salt rounds)
- Secure token storage in localStorage

### Authorization
- Role-based access control (Admin/User)
- Middleware checks on protected routes
- Admin-only operations require role verification

### Data Protection
```
┌──────────────────────────────────────────┐
│      HTTPS (SSL/TLS Encryption)          │
├──────────────────────────────────────────┤
│ Request Validation & Sanitization        │
├──────────────────────────────────────────┤
│ JWT Authentication Verification          │
├──────────────────────────────────────────┤
│ Role-Based Authorization Check           │
├──────────────────────────────────────────┤
│ MongoDB Connection (Encrypted)           │
└──────────────────────────────────────────┘
```

## Performance Optimization Strategies

### Frontend
- Code splitting by route
- Lazy loading of components
- Image optimization
- CSS/JS minification
- Browser caching with Service Workers
- Debouncing on filters

### Backend
- indexing on frequently queried fields
- Pagination for large datasets
- Response compression (gzip)
- Connection pooling
- Caching strategies for stats
- Async/await for non-blocking operations

### Database
- Compound indexes on common queries
- TTL indexes for session data
- Regular analysis and optimization
- Connection limits

## Error Handling Strategy

```
Frontend Error
    │
    ├─ Network Error → Display toast notification
    │
    ├─ 401 Unauthorized → Redirect to login
    │
    ├─ 403 Forbidden → Show access denied page
    │
    ├─ 404 Not Found → Show 404 page
    │
    ├─ 500 Server Error → Show error message
    │
    └─ Validation Error → Display form errors
```

## Logging Strategy

### Backend Logging
```javascript
console.log('[INFO]', timestamp, message)
console.error('[ERROR]', timestamp, error)
console.warn('[WARN]', timestamp, warning)
```

### Frontend Error Tracking
- Toast notifications for user actions
- Console logs for debugging
- Network error logging

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│       Production Environment                │
├─────────────────────────────────────────────┤
│  ┌──────────┐      ┌───────────┐           │
│  │CloudFront│      │   Nginx   │           │
│  │  (CDN)   │      │  Reverse  │           │
│  └──────────┘      │  Proxy    │           │
│        │            └───────────┘           │
│        ├──────────────────┬──────────────┐  │
│        │                  │              │  │
│    ┌────────┐        ┌────────┐   ┌──────────┐
│    │Vercel  │        │ Heroku │   │ MongoDB  │
│    │Frontend│        │Backend │   │  Atlas   │
│    └────────┘        └────────┘   └──────────┘
└─────────────────────────────────────────────┘
```

## Scalability Considerations

- Horizontal scaling with load balancers
- Microservices architecture (future)
- API rate limiting
- Database replication
- CDN for static assets
- Caching layer (Redis)
- Async job processing (Bull/RQ)

## Disaster Recovery Plan

- Automated daily MongoDB backups
- Point-in-time restore capability
- Redundant server instances
- Database replication
- Geographic distribution
- Regular recovery testing
