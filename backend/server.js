require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/custom-orders', require('./routes/customOrderRoutes'));

// Serve frontend build files when deployed as a single service.
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuildPath));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// API-specific 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// SPA fallback for client-side routes in production.
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  }
  return res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Guard: fail loudly if critical env vars are missing
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set. Set it in Render Environment Variables.');
    process.exit(1);
  }
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    console.error('FATAL: MONGO_URI environment variable is not set. Set it in Render Environment Variables.');
    process.exit(1);
  }

  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
