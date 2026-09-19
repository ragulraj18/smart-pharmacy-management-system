const express = require('express');
const router = express.Router();
const {
  uploadPrescription, getMyPrescriptions, getPendingPrescriptions,
  analyzePrescription, reviewPrescription,
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
 
router.use(protect);
router.post('/', upload.single('prescriptionFile'), uploadPrescription);
router.get('/', getMyPrescriptions);
router.get('/pending', authorize('pharmacist', 'admin'), getPendingPrescriptions);
router.post('/:id/analyze', authorize('pharmacist', 'admin'), analyzePrescription);
router.put('/:id/review', authorize('pharmacist', 'admin'), reviewPrescription);
 
module.exports = router;
