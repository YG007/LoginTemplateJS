const authenticateToken = require('./authMiddleware');
const checkRole = require('./roleMiddleware');

module.exports = {
  isAuthenticated: [authenticateToken],
  isAdmin: [authenticateToken, checkRole(['admin'])],
  isUserOrAdmin: [authenticateToken, checkRole(['user', 'admin'])],
  hasRole: (roles) => [authenticateToken, checkRole(roles)],
};
