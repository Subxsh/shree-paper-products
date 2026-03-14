const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create default admin user
    const adminUser = new User({
  name: 'Administrator',
  email: 'admin@shreepaper.com',
  password: 'admin123',
  role: 'admin',
  company: 'Shree Paper Products',
  companyDetails: {
    address: 'Kangeyam, Tirupur, Tamilnadu, India',
    gst: '27AEXXX0000H2Z9'
  }
});
    await adminUser.save();
    console.log('Admin user created');

    console.log('Sample product seeding is disabled');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
