const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');
const Order = require('../models/Order');
 
// GET /api/pharmacist/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalMedicines, lowStock, pendingPrescriptions, pendingOrders] = await Promise.all([
      Medicine.countDocuments(),
      Medicine.countDocuments({ $expr: { $lte: ['$stock', '$minimumStock'] } }),
      Prescription.countDocuments({ status: 'pending' }),
      Order.countDocuments({ orderStatus: { $in: ['placed', 'confirmed', 'processing'] } }),
    ]);
 
    res.json({
      success: true,
      stats: { totalMedicines, lowStock, pendingPrescriptions, pendingOrders },
    });
  } catch (error) {
    next(error);
  }
};
 
module.exports = { getDashboardStats };
