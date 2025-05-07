const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');

// This route requires user to be authenticated
router.get('/profile', authenticateToken, userController.getProfile);

// This route requires user to be 'admin'
router.get('/admin', authenticateToken, checkRole(['admin']), userController.getAdminDashboard);

module.exports = router;
