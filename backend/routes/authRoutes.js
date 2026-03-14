const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

// Admin routes
router.post('/users', adminMiddleware, authController.createUser);
router.get('/users/all', adminMiddleware, authController.getAllUsers);
router.put('/users/:id', adminMiddleware, authController.updateUser);
router.delete('/users/:id', adminMiddleware, authController.deleteUser);

module.exports = router;
