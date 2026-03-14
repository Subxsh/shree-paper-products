const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  coneDegree: {
    type: String,
    required: true,
    enum: ['3°30', '4°20', '4°30', '5°57', 'Custom'],
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
  color: {
    type: String,
    required: true,
    enum: ['Sky Blue Solid', 'Brown Kraft', 'White', 'Natural', 'Custom'],
    trim: true
  },
  material: {
    type: String,
    required: true,
    enum: ['Sky Blue Solid', 'Brown Kraft', 'White Kraft', 'Custom'],
    trim: true
  },
  weight: {
    type: Number,
    required: true,
    description: 'Weight in grams'
  },
  strength: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Extra High'],
    default: 'Medium'
  },
  threadCompatibility: {
    type: String,
    required: true,
    description: 'Thread count like 30S, 34S, 61S'
  },
  price: {
    type: Number,
    required: true,
    description: 'Price per cone in INR'
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  finishType: {
    type: String,
    enum: ['Diamond', 'Plain', 'Smooth'],
    default: 'Plain'
  },
  tipType: {
    type: String,
    enum: ['Round', 'Sharp', 'Flat'],
    default: 'Round'
  },
  surfaceFinish: {
    type: String,
    enum: ['Glossy', 'Matte', 'Textured'],
    default: 'Matte'
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  image: {
    type: String,
    default: null
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

module.exports = mongoose.model('Product', productSchema);
