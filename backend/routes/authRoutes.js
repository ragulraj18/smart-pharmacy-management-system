const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
 
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
 
// TEMPORARY TEST ROUTE — proves role-based access control works.
// Remove this once Phase 12 (Admin Dashboard) adds real admin routes.
router.get('/admin-only-test', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: `Welcome, admin ${req.user.name}. This route is admin-only.` });
});
 
module.exports = router;
