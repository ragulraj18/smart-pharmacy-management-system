const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

const DELIVERY_FEE = 40;

// POST /api/orders  { shippingAddress, prescriptionId? }
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, prescriptionId } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.medicineId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const needsPrescription = cart.items.some((item) => item.medicineId.prescriptionRequired);
    if (needsPrescription && !prescriptionId) {
      return res.status(400).json({
        success: false,
        message: 'One or more items require a verified prescription before checkout',
      });
    }

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicineId._id);
      if (!medicine || medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.medicineId.name} no longer has enough stock`,
        });
      }
    }

    const orderItems = cart.items.map((item) => ({
      medicineId: item.medicineId._id,
      name: item.medicineId.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalAmount = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      totalAmount,
      prescription: prescriptionId || null,
      paymentStatus: 'paid',
    });

    for (const item of orderItems) {
      await Medicine.findByIdAndUpdate(item.medicineId, { $inc: { stock: -item.quantity } });
    }

    cart.items = [];
    await cart.save();

    // Notify anyone watching this specific order, and staff dashboards
    // listening broadly, that a new order exists.
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${order._id}`).emit('order:statusUpdate', {
        orderId: order._id,
        orderStatus: order.orderStatus,
      });
      io.emit('order:new', { orderId: order._id });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders  (customer's own orders)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const isOwner = order.userId._id.toString() === req.user._id.toString();
    const isStaff = ['admin', 'pharmacist', 'delivery'].includes(req.user.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status  { orderStatus }  (pharmacist/admin/delivery)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Push the update in real time to anyone currently viewing this order
    // (e.g. the customer on their Order Details page) — no refresh needed.
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

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };