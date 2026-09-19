const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const Prescription = require('../models/Prescription');
const aiService = require('../services/aiService');
 
// GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOrders, medicines, lowStock, pendingPrescriptions, revenueAgg] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Medicine.countDocuments(),
      Medicine.countDocuments({ $expr: { $lte: ['$stock', '$minimumStock'] } }),
      Prescription.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);
 
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        medicines,
        lowStock,
        pendingPrescriptions,
        revenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
 
// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
 
// PUT /api/admin/users/:id  { role, isActive }
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const update = {};
    if (role) update.role = role;
    if (typeof isActive === 'boolean') update.isActive = isActive;
 
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
 
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
 
// GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};
 
// PUT /api/admin/orders/:id/assign  { deliveryPersonId }
const assignDelivery = async (req, res, next) => {
  try {
    const { deliveryPersonId } = req.body;
 
    const deliveryUser = await User.findOne({ _id: deliveryPersonId, role: 'delivery' });
    if (!deliveryUser) {
      return res.status(400).json({ success: false, message: 'That user is not a valid delivery account' });
    }
 
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryPerson: deliveryPersonId },
      { new: true },
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
 
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
 
// GET /api/admin/analytics/forecast/:medicineId
// Builds a simple monthly sales history for this medicine from real order
// data, sends it to the Python forecasting service, and returns an estimate.
// If there isn't enough order history yet, the model falls back to a small
// default rather than failing — this is expected on a fresh/demo database.
const forecastMedicineDemand = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
 
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
 
    // Group quantity sold by month across all orders containing this medicine
    const monthlySales = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.medicineId': medicine._id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalQty: { $sum: '$items.quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
 
    const historicalQuantities = monthlySales.map((m) => m.totalQty);
 
    let result;
    try {
      result = await aiService.forecastDemand(medicineId, historicalQuantities, medicine.stock);
    } catch (aiError) {
      return res.status(502).json({
        success: false,
        message: 'AI service is unreachable. Make sure it is running on port 8000.',
      });
    }
 
    res.json({
      success: true,
      medicine: { _id: medicine._id, name: medicine.name, stock: medicine.stock },
      monthsOfHistory: historicalQuantities.length,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
 
module.exports = {
  getDashboardStats,
  getUsers,
  updateUser,
  getAllOrders,
  assignDelivery,
  forecastMedicineDemand,
};
 
