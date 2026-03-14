const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/stats', productController.getProductStats);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', adminMiddleware, productController.createProduct);
router.put('/:id', adminMiddleware, productController.updateProduct);
router.delete('/:id', adminMiddleware, productController.deleteProduct);

module.exports = router;
