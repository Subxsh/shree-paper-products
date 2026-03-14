const express = require('express');
const router = express.Router();
const {
  createCustomOrder,
  getAllCustomOrders,
  getMyCustomOrders,
  getCustomOrderById,
  updateCustomOrderStatus,
  deleteCustomOrder,
  getCustomOrderStats
} = require('../controllers/customOrderController');

const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public route - anyone can submit a custom order
router.post('/', createCustomOrder);

// Protected customer route
router.get('/my', authMiddleware, getMyCustomOrders);

// Protected admin routes
router.get('/', authMiddleware, adminMiddleware, getAllCustomOrders);
router.get('/stats', authMiddleware, adminMiddleware, getCustomOrderStats);
router.get('/:id', authMiddleware, adminMiddleware, getCustomOrderById);
router.put('/:id', authMiddleware, adminMiddleware, updateCustomOrderStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCustomOrder);

module.exports = router;
