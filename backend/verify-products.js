const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB\n');

    const products = await Product.find();
    console.log(`Total products in database: ${products.length}\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Cone Degree: ${product.coneDegree}`);
      console.log(`   Price: ₹${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Image: ${product.image ? '✓ Present' : '✗ Missing'}`);
      if (product.image) {
        console.log(`   Image URL: ${product.image.substring(0, 80)}...`);
      }
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
