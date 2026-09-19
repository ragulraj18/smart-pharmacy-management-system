const Order = require('../models/Order');

// GET /api/delivery/orders  (assigned to the logged-in delivery staff)
const getAssignedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ deliveryPerson: req.user._id })
      .populate('userId', 'name phone address')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// PUT /api/delivery/orders/:id/status  { orderStatus }
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const allowed = ['out_for_delivery', 'delivered'];
    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid delivery status' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, deliveryPerson: req.user._id },
      { orderStatus },
      { new: true },
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found or not assigned to you' });

    // Real-time push — the customer's Order Details page updates instantly
    // without needing to reload.
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${order._id}`).emit('order:statusUpdate', {
        orderId: order._id,
        orderStatus: order.orderStatus,
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAssignedOrders, updateDeliveryStatus };