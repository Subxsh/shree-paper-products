const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  coneDegree: {
    type: String,
    required: true,
    enum: ['3°30', '4°20', '4°30', '5°57'],
    trim: true
  },
  length: {
    type: Number,
    required: true,
    description: 'Length in mm'
  },
  topDiameter: {
    type: Number,
    required: true,
    description: 'Top diameter in mm'
  },
  bottomDiameter: {
    type: Number,
    required: true,
    description: 'Bottom diameter in mm'
  },
  material: {
    type: String,
    required: true,
    enum: ['White Kraft', 'Brown Kraft', 'Sky Blue Solid'],
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  threadCompatibility: {
    type: String,
    required: true,
    enum: ['20S', '30S', '34S', '40S', '61S'],
    trim: true
  },
  weight: {
    type: Number,
    required: true,
    description: 'Weight in grams'
  },
  strength: {
    type: String,
    required: true,
    enum: ['Light', 'Medium', 'Heavy'],
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    description: 'Quantity in NOS'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Quoted', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
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

// Update the updatedAt timestamp before saving
customOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CustomOrder', customOrderSchema);
