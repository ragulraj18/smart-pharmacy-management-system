const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
 
router.use(protect);
router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('pharmacist', 'admin', 'delivery'), updateOrderStatus);
 
module.exports = router;
 
