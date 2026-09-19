const express = require('express');
const router = express.Router();
const { getAssignedOrders, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
 
router.use(protect, authorize('delivery', 'admin'));
router.get('/orders', getAssignedOrders);
router.put('/orders/:id/status', updateDeliveryStatus);
 
module.exports = router;
