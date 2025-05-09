const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const policies = require('../middlewares/policies');

// This route requires user to be authenticated
router.get('/profile', policies.isAuthenticated, userController.getProfile);

// This route requires user to be 'admin'
router.get('/admin', policies.isAdmin, userController.getAdminDashboard);

module.exports = router;
