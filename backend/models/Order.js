const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  uom: {
    type: String,
    default: 'NOS',
    enum: ['NOS', 'KG', 'BOXES', 'CARTONS']
  },
  rate: {
    type: Number,
    required: true,
    description: 'Rate per unit'
  },
  cgst: {
    type: Number,
    default: 9,
    description: 'Central GST percentage'
  },
  sgst: {
    type: Number,
    default: 9,
    description: 'State GST percentage'
  },
  total: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
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
    default: 'Tamilnadu'
  },
  pinCode: {
    type: String,
    trim: true
  },
  items: [orderItemSchema],
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
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
