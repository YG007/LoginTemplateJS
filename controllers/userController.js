const User = require('../models/User');

/**
 * @desc Get logged-in user profile
 * @route GET /profile
 * @access Private (Authenticated users)
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (error) {
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
