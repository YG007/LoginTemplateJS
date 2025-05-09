const User = require('../models/User');
const logService = require('../services/loggerService');

/**
 * @desc Get logged-in user profile
 * @route GET /profile
 * @access Private (Authenticated users)
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        logService.verbose(`Fetching profile for user ${req.user.userId}`);
        logService.info('User profile retrieved successfully');

        res.json({ user });
    } catch (error) {
        logService.error('Error fetching profile: ' + error.message);
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

/**
 * @desc Admin dashboard access
 * @route GET /admin
 * @access Private (Admins only)
 */
exports.getAdminDashboard = async (req, res) => {
    try {
        res.json({
            message: 'Welcome to the admin dashboard',
            user: {
                id: req.user.userId,
                role: req.user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error accessing admin route', error });
    }
};
