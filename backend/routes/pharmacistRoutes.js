const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/pharmacistController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
 
router.use(protect, authorize('pharmacist', 'admin'));
router.get('/dashboard', getDashboardStats);
 
module.exports = router;
 
