const express = require('express');
const router = express.Router();
const {
  getMedicines, getMedicineById, createMedicine, updateMedicine,
  deleteMedicine, getLowStockMedicines, getExpiringMedicines, getCategories,
} = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// IMPORTANT: specific paths must come before the generic '/:id' route,
// otherwise Express treats "categories" or "alerts" as an :id value.
router.get('/categories/list', getCategories);
router.get('/alerts/low-stock', protect, authorize('pharmacist', 'admin'), getLowStockMedicines);
router.get('/alerts/expiring', protect, authorize('pharmacist', 'admin'), getExpiringMedicines);

router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.post('/', protect, authorize('pharmacist', 'admin'), createMedicine);
router.put('/:id', protect, authorize('pharmacist', 'admin'), updateMedicine);
router.delete('/:id', protect, authorize('pharmacist', 'admin'), deleteMedicine);

module.exports = router;