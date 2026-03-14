# Quick Start Guide - User Authentication System

## 🚀 Getting Started

This guide will help you get the new customer authentication and order management system up and running.

---

## Prerequisites

- Node.js v14+ and npm installed
- MongoDB running locally or Atlas connection string
- Backend and Frontend dependencies already installed

---

## Step 1: Backend Setup

### 1.1 Update Environment Variables
Make sure your `.env` file in the backend root has:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 1.2 Create an Admin User (First Time Setup)
Run this script or use MongoDB Compass to create an admin user:

```bash
# Using MongoDB shell
db.users.insertOne({
  name: "Admin User",
  email: "admin@shreepaper.com",
  password: "admin123", // Will be hashed automatically
  role: "admin",
  phone: "9876543210",
  company: "Shree Paper Products",
  isActive: true,
  createdAt: new Date()
})
```

Or use the Node.js script approach:

```javascript
// Create this as a one-time setup script
const User = require('./models/User');
const connectDB = require('./config/database');

async function createAdmin() {
  await connectDB();
  
  const adminExists = await User.findOne({ email: 'admin@shreepaper.com' });
  if (!adminExists) {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@shreepaper.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      company: 'Shree Paper Products'
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    process.exit(0);
  } else {
    console.log('ℹ️ Admin user already exists');
    process.exit(0);
  }
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
```

### 1.3 Start Backend Server

```bash
cd backend
npm install  # If not already done
npm start    # or npm run dev for development with auto-reload
```

**Expected Output:**
```
Server running on port 5000
Environment: development
```

---

## Step 2: Frontend Setup

### 2.1 Update API Configuration
Check `frontend/src/services/api.js` - the API base URL should be:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 2.2 Create `.env` file in frontend root (optional)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2.3 Start Frontend Server

```bash
cd frontend
npm install  # If not already done
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view shree-paper-products-frontend in the browser.
Local: http://localhost:3000
```

---

## Step 3: Test the System

### 3.1 Test Customer Registration

1. Open browser to `http://localhost:3000`
2. Click on "Register" in navbar
3. Fill in the registration form:
   - **Full Name**: John Doe
   - **Company Name**: ABC Trading Co.
   - **Email**: john.doe@example.com
   - **Phone**: 9876543210
   - **Password**: password123
   - **Confirm Password**: password123

4. Click "Register"
5. Should redirect to `/products` page and navbar should show "John Doe" with "My Orders" link

### 3.2 Test Customer Login/Logout

1. Click "Logout" button
2. Click "Login" in navbar
3. Enter credentials:
   - Email: john.doe@example.com
   - Password: password123
4. Click "Login"
5. Should redirect to `/products` and show user name

### 3.3 Test Customer Create Order

1. While logged in as customer, click "Create Order"
2. Select products from the list
3. Add quantities and fill order details
4. Submit order
5. Click "My Orders" to see the created order

### 3.4 Test Admin Login

1. Click "Logout"
2. Go to `/login`
3. Click "Admin Login" button
4. Enter admin credentials:
   - Email: admin@shreepaper.com
   - Password: admin123
5. Should redirect to `/admin/orders`
6. Can see all customer orders and update statuses

---

## API Endpoints Reference

### Authentication Endpoints

```bash
# Customer Registration
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "company": "ABC Company",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}

# Customer Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Admin Login
POST /api/auth/admin-login
{
  "email": "admin@shreepaper.com",
  "password": "admin123"
}

# Get Current User Info (Protected)
GET /api/auth/me
Authorization: Bearer {JWT_TOKEN}
```

### Order Endpoints

```bash
# Get All Orders (filtered by role)
GET /api/orders
Authorization: Bearer {JWT_TOKEN}

# Create New Order (Protected)
POST /api/orders
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "customerName": "John Doe",
  "phone": "9876543210",
  "items": [
    {
      "productId": "product_id",
      "quantity": 100,
      "rate": 50,
      "cgst": 9,
      "sgst": 9
    }
  ]
}

# Update Order Status (Protected)
PUT /api/orders/{orderId}
Authorization: Bearer {JWT_TOKEN}

{
  "status": "Confirmed"
}
```

---

## Navigation & Routes

### Public Routes
- `/` - Home page
- `/products` - Products listing
- `/products/:id` - Product details
- `/about` - About page
- `/custom-order` - Custom order request
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Requires Login)
- `/my-orders` - Customer's orders
- `/orders` - Orders list
- `/orders/create` - Create new order

### Admin Only Routes
- `/admin/orders` - All orders management
- `/dashboard` - Admin dashboard

---

## Troubleshooting

### Issue: "Connect ECONNREFUSED" when starting backend
**Solution**: Make sure MongoDB is running
```bash
# On Windows
mongod

# On Mac (if installed via brew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Issue: Backend loads but frontend can't reach it
**Solution**: Check CORS is enabled in backend
```javascript
// In backend/server.js
app.use(cors()); // Should be before routes
```

### Issue: "Invalid email" validation error
**Solution**: Make sure email format is correct (must have @)

### Issue: "Passwords do not match" on register
**Solution**: Both password fields must be identical (case-sensitive)

### Issue: Can't login with registered account
**Possible Causes**:
- Password is incorrect
- Email is different from registration (case-sensitive)
- Admin is disabled (`isActive: false`)
- Check MongoDB if user exists

### Issue: "Token expired" error
**Solution**: 
- Log out and log in again
- Clear localStorage: `localStorage.clear()`
- Check JWT expiration in `.env` (`JWT_EXPIRE=7d`)

### Issue: Admin orders page shows all orders but customer sees theirs filtered
**Expected Behavior**: This is correct! Admin sees all, customers see only theirs

---

## Database Commands

### Check if users exist
```bash
# In MongoDB shell connected to your database
db.users.find()
db.users.countDocuments()

# Find specific user
db.users.findOne({ email: 'john@example.com' })
```

### Check orders
```bash
# See all orders
db.orders.find()

# See orders for specific user
db.orders.find({ userId: ObjectId("user_id_here") })
```

### Reset Database (Development Only!)
```bash
# Delete all users
db.users.deleteMany({})

# Delete all orders
db.orders.deleteMany({})

# Verify deletion
db.users.countDocuments()
db.orders.countDocuments()
```

---

## Environment Variables Checklist

### Backend `.env`
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secret key for JWT (minimum 20 characters)
- [ ] `JWT_EXPIRE` - Token expiration (e.g., '7d')
- [ ] `PORT` - Server port (default 5000)
- [ ] `NODE_ENV` - 'development' or 'production'

### Frontend `.env` (Optional)
- [ ] `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

---

## Performance Tips

1. **Optimize Images**: Compress product images before uploading
2. **Database Indexes**: Create indexes on frequently queried fields:
   ```javascript
   db.users.createIndex({ email: 1 })
   db.orders.createIndex({ userId: 1 })
   db.orders.createIndex({ poNumber: 1 })
   ```

3. **Pagination**: For large order lists, implement pagination (future enhancement)
4. **Caching**: Implement caching for product lists (future enhancement)

---

## Security Checklist

- [ ] JWT_SECRET is strong (20+ characters, mix of upper/lower/numbers/symbols)
- [ ] CORS is properly configured
- [ ] Passwords are hashed (bcryptjs)
- [ ] Sensitive data not logged
- [ ] API validates all inputs
- [ ] Admin routes are protected
- [ ] HTTPS enabled in production

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update MongoDB URI to production database
- [ ] Use strong, unique JWT_SECRET
- [ ] Set proper JWT_EXPIRE time
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Enable MongoDB authentication
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Test all user flows
- [ ] Create admin account manually

---

## Support & Documentation

For more detailed information, see:
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Complete feature documentation
- Backend models: [backend/models/User.js](./backend/models/User.js), [backend/models/Order.js](./backend/models/Order.js)
- Frontend pages: [frontend/src/pages/](./frontend/src/pages/)

---

**Happy coding! 🎉**
