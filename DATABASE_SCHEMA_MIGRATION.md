# Database Schema Changes & Migration Guide

## Overview of Changes

This document details all MongoDB schema changes made to support the new user authentication and order management system.

---

## Users Collection Schema

### Original vs Updated Schema

#### Fields Added:
- `phone` (String) - Customer phone number
- `company` (String) - Company name (simplified from object)
- `companyDetails` (Object) - Nested company details
  - `address` (String)
  - `gst` (String)
  - `city` (String)
  - `state` (String)
  - `pinCode` (String)

#### Complete Current Schema:

```javascript
{
  _id: ObjectId,
  
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
    // Automatically hashed before saving
  },
  
  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  
  // Company Information
  company: {
    type: String,  // Simple string for company name
    trim: true
  },
  companyDetails: {
    address: String,
    gst: String,
    city: String,
    state: String,
    pinCode: String
  },
  
  // Account Management
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Migration Script (If Updating Existing Database)

If you have existing users without the new fields:

```javascript
// Run in MongoDB shell or Node.js script
db.users.updateMany(
  { phone: { $exists: false } },
  { 
    $set: {
      phone: "",
      company: "",
      companyDetails: {
        address: "",
        gst: "",
        city: "",
        state: "",
        pinCode: ""
      }
    }
  }
)

// Verify
db.users.find().pretty()
```

---

## Orders Collection Schema

### Changes Made

#### Field Added:
- `userId` (ObjectId, ref: 'User') - Reference to the user who created the order

### Complete Current Schema:

```javascript
{
  _id: ObjectId,
  
  // Order Reference
  poNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  // NEW FIELD - Link to Customer
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  
  // Order Date
  date: {
    type: Date,
    default: Date.now
  },
  
  // Customer Information
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true,
    default: 'Tamil Nadu'
  },
  pinCode: {
    type: String,
    trim: true
  },
  
  // Order Items
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    uom: String, // 'NOS', 'KG', 'BOXES', 'CARTONS'
    rate: Number,
    cgst: Number,
    sgst: Number,
    total: Number
  }],
  
  // Pricing
  basicTotal: {
    type: Number,
    required: true,
    default: 0
  },
  cgstTotal: {
    type: Number,
    default: 0
  },
  sgstTotal: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Order Management
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Draft'
  },
  
  // Audit Trail
  createdBy: ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Migration Script for Existing Orders

If you have existing orders without userId:

```javascript
// Option 1: Set userId for admin-created orders
db.orders.updateMany(
  { userId: { $exists: false } },
  { 
    $set: {
      userId: null  // Will be null until customer updates
    }
  }
)

// Option 2: If you know which admin created orders, set to admin userId
const adminId = ObjectId("admin_user_id_here");
db.orders.updateMany(
  { userId: { $exists: false }, createdBy: adminId },
  { 
    $set: {
      userId: adminId
    }
  }
)

// Verify
db.orders.find().pretty()
```

---

## Index Recommendations

Create indexes for better query performance:

```javascript
// Users Collection
db.users.createIndex({ email: 1 })  // Speed up login lookups
db.users.createIndex({ role: 1 })   // Filter by role

// Orders Collection
db.orders.createIndex({ userId: 1 }) // Filter customer orders
db.orders.createIndex({ poNumber: 1 }) // Unique order lookup
db.orders.createIndex({ status: 1 }) // Filter by status
db.orders.createIndex({ userId: 1, createdAt: -1 }) // Customer order history
db.orders.createIndex({ createdAt: -1 }) // Recent orders for admin
```

---

## Data Relationships

### User to Orders Relationship

```
User (1) ──────── (Many) Orders
  |                    |
  ├─ _id              ├─ _id
  ├─ name        └────├─ userId (reference to User._id)
  ├─ email            ├─ customerName
  ├─ phone            ├─ poNumber
  ├─ company          └─ ...other fields
  └─ role
```

### Populate Query Example

To fetch an order with user details:

```javascript
// MongoDB Query
db.orders.findOne({ _id: orderId }).populate('userId')

// JavaScript (Mongoose)
const order = await Order.findById(orderId).populate('userId');

// Returns
{
  _id: ObjectId,
  poNumber: 'PO-20240305-12345',
  userId: {
    _id: ObjectId,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    company: 'ABC Company'
  },
  customerName: 'John Doe',
  ...otherFields
}
```

---

## Data Integrity Constraints

### Users Collection
```javascript
// Email must be unique and lowercase
db.users.createIndex({ email: 1 }, { unique: true })

// Password must not be null
db.users.find({ password: { $exists: false } })

// Role must be one of enum values
db.users.find({ role: { $nin: ['admin', 'user'] } })
```

### Orders Collection
```javascript
// PO Number must be unique
db.orders.createIndex({ poNumber: 1 }, { unique: true })

// userId should reference an existing user
// (No built-in foreign key constraint in MongoDB, validate in application)

// Status values are restricted
db.orders.find({ status: { $nin: ['Draft', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] } })
```

---

## Validation Rules

### User Validation

| Field | Rule | Example |
|-------|------|---------|
| name | Required, string, trimmed | "John Doe" |
| email | Required, unique, lowercase, email format | "john@example.com" |
| password | Required, min 6 chars, bcrypt hashed | "password123" (becomes hash) |
| phone | Optional, string, trimmed | "9876543210" |
| company | Optional, string, trimmed | "ABC Company Pvt Ltd" |
| role | Required, enum ['admin', 'user'] | "user" |

### Order Validation

| Field | Rule | Example |
|-------|------|---------|
| poNumber | Required, unique, string | "PO-20240305-00001" |
| userId | Optional, reference to User, indexed | ObjectId |
| customerName | Required, string, trimmed | "John Doe" |
| items | Required, array, min 1 item | [...] |
| grandTotal | Required, number, >= 0 | 50000 |
| status | Required, enum | "Confirmed" |

---

## Backup & Recovery

### Before Migration

```bash
# Backup MongoDB database
mongodump --uri "mongodb://user:password@host:port/dbname" --out /backup/path

# Or using MongoDB Atlas
# Go to Backup tab and create a snapshot
```

### Restore from Backup

```bash
# Restore from dump
mongorestore --uri "mongodb://user:password@host:port/dbname" /backup/path

# Verify restoration
db.users.countDocuments()
db.orders.countDocuments()
```

---

## Common Queries After Migration

### Find All Orders by User

```javascript
db.orders.find({ userId: ObjectId("user_id_here") }).sort({ createdAt: -1 })

// With user details
db.orders.aggregate([
  { $match: { userId: ObjectId("user_id_here") } },
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails"
  }},
  { $sort: { createdAt: -1 } }
])
```

### Find Orders by Status

```javascript
db.orders.find({ status: "Pending" }).count()
db.orders.find({ status: "Delivered" }).count()

// Orders by all statuses
db.orders.aggregate([
  { $group: {
      _id: "$status",
      count: { $sum: 1 }
  }}
])
```

### Find Orders with User Info

```javascript
db.orders.aggregate([
  { $match: { _id: ObjectId("order_id") } },
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "customer"
  }},
  { $unwind: "$customer" }
])
```

### List All Users and Their Orders Count

```javascript
db.users.aggregate([
  { $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders"
  }},
  { $project: {
      name: 1,
      email: 1,
      orderCount: { $size: "$orders" }
  }}
])
```

---

## Performance Optimization

### Query Optimization

```javascript
// BEFORE (Slow - full collection scan)
db.orders.find({ customerName: "John" })

// AFTER (Fast - with index)
db.orders.find({ userId: userId }).hint({ userId: 1 })

// BEFORE (Slow - N+1 queries)
const orders = db.orders.find();
orders.forEach(order => {
  const user = db.users.findOne({ _id: order.userId });
})

// AFTER (Fast - single join)
db.orders.aggregate([
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }
])
```

### Memory Optimization

```javascript
// For large result sets, use pagination
db.orders.find({ userId: userId })
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .sort({ createdAt: -1 })
```

---

## Testing Checklist

- [ ] User registration stores password as hash
- [ ] User login compares password correctly
- [ ] New orders automatically get userId
- [ ] Customers only see their own orders
- [ ] Admins see all orders
- [ ] Order status updates work correctly
- [ ] Indexes created and working
- [ ] Backup and restore working
- [ ] All relationships (userId → user) populate correctly
- [ ] No duplicate emails in users collection
- [ ] No duplicate PO numbers in orders collection

---

## Rollback Plan

If you need to rollback:

```javascript
// 1. Restore from backup
mongorestore --uri "..." /backup/path

// 2. Remove new indexes (optional)
db.orders.dropIndex("userId_1")
db.users.dropIndex("email_1")

// 3. Verify
db.version()
db.users.findOne()
db.orders.findOne()
```

---

## Contact & Support

For database-related issues:
- Check MongoDB logs: `/var/log/mongodb/mongod.log` (Linux)
- Verify connectivity: `mongosh --host localhost --port 27017`
- Check existing schemas: `db.users.findOne()` and `db.orders.findOne()`

---

**Database migration complete! Verify all data before going to production.** ✅
