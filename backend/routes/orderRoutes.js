const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// All order routes require authentication
router.use(authMiddleware);

router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', adminMiddleware, orderController.deleteOrder);
router.get('/:id/export-pdf', orderController.exportOrderPDF);

module.exports = router;
