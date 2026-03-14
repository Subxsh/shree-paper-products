# Custom Order Flow - Complete Overview

## 🚀 What Happens After Customer Submits Custom Order

### Step 1: Form Submission (Frontend)
```
User fills out form with:
  - Customer info (name, company, email, phone)
  - Cone specifications (degree, dimensions, material, color, etc.)
  - Order details (quantity, delivery date, special notes)
```

↓

### Step 2: API Call to Backend
```
POST /api/custom-orders
- Data sent to backend as JSON
- Stored in MongoDB CustomOrder collection
```

↓

### Step 3: Order Created with Status "Pending"
```javascript
{
  _id: unique_order_id,
  customerName: "...",
  companyName: "...",
  email: "customer@example.com",
  phone: "+91...",
  coneDegree: "4°30",
  material: "Brown Kraft",
  quantity: 10000,
  deliveryDate: "2026-04-10",
  status: "Pending",  // Initial status
  createdAt: timestamp,
  updatedAt: timestamp
}
```

↓

### Step 4: Reference Number Generated
```
Reference Number Format: Last 8 chars of MongoDB ID in uppercase
Example: #ABC12345

This is displayed to the customer for tracking
Shown in both success page and email confirmation
```

↓

### Step 5: Email Notifications Sent (Asynchronous)

#### A) Customer Confirmation Email
**Recipient:** customer@example.com
**Subject:** Order Received - Reference #ABC12345
**Contains:**
- Order reference number
- Customer information recap
- Full cone specifications
- Quantity and delivery date
- Special instructions (if provided)
- Next steps timeline
- Contact information

#### B) Admin Notification Email
**Recipients:** (from ADMIN_EMAILS env variable)
- admin@shreepaper.com
- orders@shreepaper.com
**Subject:** 🔔 New Custom Order - Customer Name
**Contains:**
- Order ID (full MongoDB ID)
- Customer contact details (name, company, phone, email)
- Order specifications summary
- Quantity (highlighted)
- Required delivery date (highlighted)
- Special instructions
- Link to admin dashboard to review

↓

### Step 6: Frontend User Experience
```
✅ Form submitted successfully toast
↓ (1 second delay)
✅ Confirmation email sent toast
↓
Display Success Screen with:
  - Large checkmark ✅
  - "Order Submitted Successfully!" title
  - Reference number prominently displayed
  - What happens next timeline
  - Contact information
  - Two buttons:
    a) Submit Another Order
    b) Browse Products
```

↓

### Step 7: Order Status Workflow (Admin)

```
Pending → Reviewed → Quoted → Accepted → Completed
   ↓
Admin receives email
   ↓
Admin logs into dashboard
   ↓
Admin views custom order
   ↓
Admin can update status to "Reviewed"
   ↓
Admin prepares quote
   ↓
Admin updates status to "Quoted"
   ↓
Can add notes, pricing, timeline
   ↓
Customer receives quote via email/phone
   ↓
If accepted → Status: "Accepted"
   ↓
Production begins (7-14 days)
   ↓
Status: "Completed"
```

---

## 📋 Database Fields Reference

### CustomOrder Schema
```javascript
{
  // Customer Information
  customerName: String (required),
  companyName: String (required),
  email: String (required, lowercase),
  phone: String (required),
  
  // Cone Specifications
  coneDegree: String (enum: 3°30, 4°20, 4°30, 5°57),
  length: Number (mm),
  topDiameter: Number (mm),
  bottomDiameter: Number (mm),
  material: String (enum: White Kraft, Brown Kraft, Sky Blue Solid),
  color: String,
  threadCompatibility: String (enum: 20S, 30S, 34S, 40S, 61S),
  weight: Number (grams),
  strength: String (enum: Light, Medium, Heavy),
  
  // Order Details
  quantity: Number (NOS, minimum 1),
  deliveryDate: Date,
  notes: String (optional special instructions),
  
  // System Fields
  status: String (enum: Pending, Reviewed, Quoted, Accepted, Rejected, Completed)
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🔔 Email Configuration Setup

### For Gmail (Recommended - Free):

1. Enable 2-Factor Authentication on Gmail account
2. Generate App Password:
   - Visit: https://support.google.com/accounts/answer/185833
   - Generate 16-digit password for "Mail" app
   
3. Update `.env` file:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=generated_16_digit_password
ADMIN_EMAILS=admin@shreepaper.com,orders@shreepaper.com
```

### Email Features Included:
- ✅ Beautiful HTML email templates
- ✅ Customer confirmation with full details
- ✅ Admin notification with action items
- ✅ Responsive design for mobile
- ✅ Professional branding

---

## 📱 Frontend User Journey

### 1. Customer Visits Page
- `/custom-order` route
- Sees form with all fields
- Instructions on what to fill

### 2. Customer Fills Form (2-3 minutes)
- Customer Info section (4 fields)
- Cone Specifications (9 fields)
- Order Details (3 fields + textarea)
- Real-time form validation

### 3. Customer Submits
- Form validates all required fields
- Loading spinner shows while uploading
- Button disabled during submission

### 4. Success Flow
- ✅ Toast notification
- Success screen displayed
- Shows unique reference number
- Timeline of what happens next
- Contact information provided
- Option to submit another order

### 5. Email Confirmation
- Confirmation email received in inbox
- Contains all order details
- Has reference number to track with

---

## 🛠️ Backend API Endpoints

### 1. Create Custom Order (Public - No Auth Required)
```
POST /api/custom-orders
Content-Type: application/json

Request:
{
  customerName: "John Doe",
  companyName: "TextileMills Inc",
  email: "john@textile.com",
  phone: "+91 98765 43210",
  coneDegree: "4°30",
  length: 170,
  topDiameter: 16,
  bottomDiameter: 69,
  material: "Brown Kraft",
  color: "Brown",
  threadCompatibility: "30S",
  weight: 2.8,
  strength: "Medium",
  quantity: 10000,
  deliveryDate: "2026-04-10",
  notes: "Please use premium quality material"
}

Response (201 Created):
{
  message: "Custom order request submitted successfully",
  referenceNumber: "ABC12345",
  order: { order_object }
}
```

### 2. Get All Custom Orders (Admin Only)
```
GET /api/custom-orders?status=Pending
Authorization: Bearer <jwt_token>

Response:
[order1, order2, order3...]
```

### 3. Get Single Custom Order (Admin Only)
```
GET /api/custom-orders/:id
Authorization: Bearer <jwt_token>

Response:
{order_object}
```

### 4. Update Order Status (Admin Only)
```
PUT /api/custom-orders/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

Request:
{
  status: "Reviewed"  // or "Quoted", "Accepted", "Completed"
}

Response:
{ updated_order_object }
```

### 5. Delete Custom Order (Admin Only)
```
DELETE /api/custom-orders/:id
Authorization: Bearer <jwt_token>

Response:
{ message: "Custom order deleted successfully" }
```

### 6. Get Custom Order Statistics (Admin Only)
```
GET /api/custom-orders/stats
Authorization: Bearer <jwt_token>

Response:
{
  totalOrders: 45,
  ordersByStatus: [
    { _id: "Pending", count: 10 },
    { _id: "Reviewed", count: 15 },
    { _id: "Quoted", count: 12 },
    { _id: "Accepted", count: 8 }
  ],
  recentOrders: [...]
}
```

---

## 🎯 Next Features to Add

- [ ] Admin Dashboard View for Custom Orders
- [ ] Email reminders for pending quotes
- [ ] Order tracking page for customers
- [ ] Export custom orders to PDF/Excel
- [ ] Automated quote generation
- [ ] Status change notifications to customers
- [ ] Admin notes on orders
- [ ] Estimated pricing template
- [ ] Production timeline tracker

---

## 🔐 Security Features

- ✅ Email validation
- ✅ Phone number validation
- ✅ Admin-only endpoints protected with JWT
- ✅ Input sanitization via Mongoose validators
- ✅ No sensitive data in response
- ✅ Error messages don't reveal system info

---

## 📊 Current Implementation Status

- ✅ Frontend CustomOrderPage component created
- ✅ Backend CustomOrder model created
- ✅ Backend customOrderController with all CRUD operations
- ✅ Backend customOrderRoutes configured
- ✅ Email service integrated with nodemailer
- ✅ Customer confirmation emails
- ✅ Admin notification emails
- ✅ Reference number generation
- ✅ Success screen with order reference
- ✅ Navigation menu updated with Custom Order link
- ✅ Route added to App.js

### Still Needed:
- ⏳ Admin Dashboard custom orders section
- ⏳ Order status update UI in dashboard
- ⏳ Order details view page
- ⏳ Customer order tracking page
- ⏳ Email reminders for admins

---

## 🧪 Testing the Custom Order Flow

1. **Test Order Submission:**
```bash
curl -X POST http://localhost:5000/api/custom-orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "companyName": "Test Company",
    "email": "test@example.com",
    "phone": "+91 98765 43210",
    "coneDegree": "4°30",
    "length": 170,
    "topDiameter": 16,
    "bottomDiameter": 69,
    "material": "Brown Kraft",
    "color": "Brown",
    "threadCompatibility": "30S",
    "weight": 2.8,
    "strength": "Medium",
    "quantity": 5000,
    "deliveryDate": "2026-04-15",
    "notes": "Test order"
  }'
```

2. **Check Email Logs:**
```bash
# Monitor console for email sending logs
# Look for: "✅ Confirmation email sent to..."
# Look for: "✅ Admin notification sent to..."
```

3. **Check MongoDB:**
```bash
# In MongoDB Atlas or local mongo shell:
db.customorders.find().sort({createdAt: -1}).limit(1)
```

---

Generated: March 10, 2026
For: Shree Paper Products
Version: 1.0
