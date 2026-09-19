const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getUsers, updateUser, getAllOrders, assignDelivery, forecastMedicineDemand,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/assign', assignDelivery);
router.get('/analytics/forecast/:medicineId', forecastMedicineDemand);

module.exports = router;