// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const policies = require('../middlewares/policies');

// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', policies.isAuthenticated, authController.logout);

module.exports = router;