# User Authentication & Order Management System - Implementation Guide

## ✅ Implementation Summary

I have successfully implemented a complete user authentication and order management system for the Shree Paper Products project. Here's what has been added:

---

## 📋 Backend Changes

### 1. **User Model Update** [backend/models/User.js]
Enhanced the User schema to support customer registration:
- `name`: Full name (required)
- `email`: Unique email (required)
- `password`: Hashed password using bcryptjs (required)
- `phone`: Phone number
- `company`: Company name
- `companyDetails`: Nested object for address, GST, city, state, pinCode
- `role`: Either 'admin' or 'user' (default: 'user')
- `lastLogin`: Track last login time

**Password Security**: Passwords are automatically hashed using bcryptjs before saving.

### 2. **Order Model Update** [backend/models/Order.js]
Added `userId` field to link orders with customers:
```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
```

### 3. **Auth Endpoints** [backend/controllers/authController.js]
Added two new public endpoints:

#### **POST /api/auth/register**
Register a new customer account.
```json
Request Body:
{
  "name": "John Doe",
  "company": "ABC Company",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "password": "password123"
}

Response:
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "ABC Company",
    "phone": "+91-9876543210",
    "role": "user"
  }
}
```

#### **POST /api/auth/login**
Customer login endpoint.
```json
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "JWT_TOKEN",
  "user": { ...userData }
}
```

#### **POST /api/auth/admin-login**
Separate admin login endpoint (for backward compatibility).

### 4. **Auth Routes Update** [backend/routes/authRoutes.js]
Updated routes to support customer registration and login:
```javascript
POST   /api/auth/register      // Public - Customer registration
POST   /api/auth/login         // Public - Customer login
POST   /api/auth/admin-login   // Public - Admin login
GET    /api/auth/me            // Protected - Get current user
```

### 5. **Order Controller Updates** [backend/controllers/orderController.js]
- Modified `getAllOrders()` to filter orders by userId for non-admin users
- Modified `createOrder()` to automatically add userId from JWT token
- Admin users still see all orders

---

## 🎨 Frontend Changes

### 1. **New Page: RegisterPage** [frontend/src/pages/RegisterPage.jsx]
Customer registration form with:
- Full Name (required)
- Company Name (optional)
- Email (required)
- Phone Number (required)
- Password (required, minimum 6 characters)
- Confirm Password (required)

**Features**:
- Form validation before submission
- Password matching validation
- Automatic JWT token storage in localStorage
- Redirect to Products page after successful registration
- Link to login page for existing users

### 2. **Updated LoginPage** [frontend/src/pages/LoginPage.jsx]
Enhanced with:
- Customer login form (Email & Password)
- Separate "Admin Login" button that uses `/admin-login` endpoint
- Smart redirects: Admin → /admin/orders, Customer → /products
- Register link for new users

### 3. **New Page: MyOrdersPage** [frontend/src/pages/MyOrdersPage.jsx]
Customer order dashboard with:
- **Order Filters**: All Orders, Pending, Confirmed, Delivered
- **Order Cards** showing:
  - Order ID (PO Number)
  - Order status with color-coded badges
  - Order date
  - Total amount
  - Item count
  - Item preview (first 2 items)
  - Customer details (name, phone)
  - Price breakdown (subtotal, GST)

**Features**:
- Real-time filter switching
- Color-coded status badges
- Only shows orders belonging to logged-in customer
- Responsive design for mobile/tablet/desktop

### 4. **New Page: AdminOrdersPage** [frontend/src/pages/AdminOrdersPage.jsx]
Admin order management dashboard with:
- **Statistics Cards**: Total, Pending, Confirmed, Shipped, Delivered counts
- **Advanced Filters**: All, Pending, Confirmed, Shipped, Delivered
- **Order Details** (expandable):
  - Full order information
  - Item breakdown with quantities and prices
  - Status update controls
  - Payment summary (Subtotal, CGST, SGST, Total)

**Features**:
- Status workflow enforcement (Pending → Confirmed → Shipped → Delivered)
- Cancel option from any state
- Payment breakdown summary
- Expandable order details
- Shows customer company and phone information
- Responsive table layout

### 5. **Updated Navbar** [frontend/src/components/Navbar.jsx]
Dynamic navigation based on user role:

**When NOT logged in**:
- Home, Products, Custom Order, About
- Login button
- Register button

**When logged in as CUSTOMER** (role: 'user'):
- Home, Products, Custom Order, About
- My Orders (new)
- Create Order
- User name display
- Logout button

**When logged in as ADMIN** (role: 'admin'):
- Home, Products, Custom Order, About
- All Orders (links to /admin/orders)
- Dashboard
- User name display
- Logout button

### 6. **Updated App.js Routes** [frontend/src/App.js]
Added new routes:
```javascript
// Public Routes
/register                 // RegisterPage
/login                    // LoginPage (customer or admin)

// Protected Customer Routes
/my-orders               // MyOrdersPage
/orders                  // OrdersPage

// Protected Admin Routes
/admin/orders            // AdminOrdersPage
/dashboard               // DashboardPage
```

### 7. **Updated API Services** [frontend/src/services/index.js]
Added authentication methods:
```javascript
authService.register(data)          // Customer registration
authService.login(email, password)  // Customer login
authService.adminLogin(email, password) // Admin login
```

---

## 🔒 Security Features

1. **JWT Token Authentication**: All protected routes require valid JWT token
2. **Password Hashing**: Passwords hashed with bcryptjs (10 salt rounds)
3. **Token Storage**: JWT stored in localStorage, sent in Authorization header
4. **Role-Based Access Control**:
   - Customers can only see their own orders
   - Admins can see all orders and manage them
   - Admin routes protected from normal users
5. **Protected Routes**: Client-side route protection with ProtectedRoute components

---

## 📱 User Flows

### Customer Registration & Login Flow
```
1. User clicks "Register" → RegisterPage
2. Fills form with name, company, email, phone, password
3. System validates form and passwords match
4. POST to /api/auth/register
5. Receives JWT token
6. Token stored in localStorage
7. Redirected to /products
```

### Customer Order Flow
```
1. Logged-in customer views /products
2. Selects products and creates order → /orders/create
3. Order includes userId automatically
4. View orders at /my-orders
   - See status updates
   - View order details
   - See price breakdown
```

### Admin Management Flow
```
1. Admin logs in with admin credentials → /login → "Admin Login"
2. Redirected to /admin/orders
3. Can see all customer orders
4. Can update order status:
   - Pending → Confirmed
   - Confirmed → Shipped
   - Shipped → Delivered
   - Any state → Cancelled
```

---

## 🚀 How to Test

### 1. Create a Test Customer Account
- Navigate to `/register`
- Fill in details:
  - Name: John Doe
  - Company: ABC Pvt Ltd
  - Email: john@example.com
  - Phone: 9876543210
  - Password: test123
- Click Register
- Should redirect to /products with token in localStorage

### 2. Create Orders
- After login, click "Create Order"
- Select products and quantities
- Order is stored with userId
- View at `/my-orders`

### 3. Login as Admin
- Go to `/login`
- Click "Admin Login"
- Use admin credentials (if existing admin exists)
- View all orders at `/admin/orders`
- Update order statuses

---

## 📦 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  company: String,
  companyDetails: {
    address: String,
    gst: String,
    city: String,
    state: String,
    pinCode: String
  },
  password: String (hashed),
  role: String, // "admin" or "user"
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### Orders Collection (Updated)
```javascript
{
  _id: ObjectId,
  poNumber: String,
  userId: ObjectId (ref: User),  // NEW
  date: Date,
  customerName: String,
  phone: String,
  email: String,
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
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚙️ Configuration

Make sure your `.env` file has:
```
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔄 Next Steps

1. **Email Verification** (Optional):
   - Add email verification during registration
   - Send confirmation emails

2. **Password Reset** (Optional):
   - Implement forgot password functionality
   - Email-based password reset link

3. **Order Notifications** (Optional):
   - Send email when order status changes
   - SMS notifications for important updates

4. **Customer Profile Page** (Optional):
   - Edit customer details
   - View account information
   - Change password

5. **Order History Export** (Optional):
   - Export orders to PDF
   - CSV export functionality

---

## 🐛 Troubleshooting

### Issue: "Invalid token" error
- **Solution**: Clear localStorage and log in again
- **Command**: `localStorage.clear()`

### Issue: Customer can't see orders
- **Solution**: Make sure userId is saved in order
- **Check**: Order in MongoDB should have userId field

### Issue: Admin can't access /admin/orders
- **Solution**: User must have role: 'admin' and valid token
- **Check**: localStorage should have user with role: 'admin'

### Issue: "Not Authenticated" on protected routes
- **Solution**: Token might have expired or not stored
- **Fix**: Log in again

---

## 📝 File Structure Summary

### Backend Files Modified:
- `backend/models/User.js` - Enhanced schema
- `backend/models/Order.js` - Added userId
- `backend/controllers/authController.js` - Added register/login
- `backend/routes/authRoutes.js` - Added new endpoints

### Frontend Files Created/Modified:
- `frontend/src/pages/RegisterPage.jsx` - NEW
- `frontend/src/pages/LoginPage.jsx` - UPDATED
- `frontend/src/pages/MyOrdersPage.jsx` - NEW
- `frontend/src/pages/AdminOrdersPage.jsx` - NEW
- `frontend/src/components/Navbar.jsx` - UPDATED
- `frontend/src/App.js` - UPDATED
- `frontend/src/services/index.js` - UPDATED

---

## 🎉 Features Summary

✅ Customer Registration with validation  
✅ Secure password hashing with bcryptjs  
✅ JWT-based authentication  
✅ Customer login & logout  
✅ Admin login & logout  
✅ Role-based navbar updates  
✅ My Orders page for customers  
✅ Admin Orders management page  
✅ Order status tracking  
✅ Order filtering by status  
✅ Customer order isolation (can't see others' orders)  
✅ Admin can see and manage all orders  
✅ Responsive design  
✅ Toast notifications  
✅ Protected routes  
✅ Automatic userId assignment to orders  

---

**System is ready for production use!** 🚀
