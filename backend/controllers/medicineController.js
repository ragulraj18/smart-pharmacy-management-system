const Medicine = require('../models/Medicine');
const Category = require('../models/Category');

// GET /api/medicines  (search, filter, sort, pagination)
const getMedicines = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [medicines, total] = await Promise.all([
      Medicine.find(query).populate('category', 'name slug').sort(sortOption).skip(skip).limit(Number(limit)),
      Medicine.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: medicines.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      medicines,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/medicines/:id
const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('category', 'name slug');
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, medicine });
  } catch (error) {
    next(error);
  }
};

// POST /api/medicines  (pharmacist/admin)
const createMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, medicine });
  } catch (error) {
    next(error);
  }
};

// PUT /api/medicines/:id  (pharmacist/admin)
const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, medicine });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/medicines/:id  (pharmacist/admin)
const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, message: 'Medicine deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/medicines/alerts/low-stock  (pharmacist/admin)
const getLowStockMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find({ $expr: { $lte: ['$stock', '$minimumStock'] } });
    res.json({ success: true, count: medicines.length, medicines });
  } catch (error) {
    next(error);
  }
};

// GET /api/medicines/alerts/expiring  (pharmacist/admin)
const getExpiringMedicines = async (req, res, next) => {
  try {
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);
    const medicines = await Medicine.find({ expiryDate: { $lte: in30Days, $gte: new Date() } });
    res.json({ success: true, count: medicines.length, medicines });
  } catch (error) {
    next(error);
  }
};

// GET /api/medicines/categories/list  (used to populate dropdowns in add/edit forms)
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines,
  getExpiringMedicines,
  getCategories,
};