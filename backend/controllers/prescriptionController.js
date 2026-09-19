const path = require('path');
const Prescription = require('../models/Prescription');
const aiService = require('../services/aiService');
 
// POST /api/prescriptions  (multipart file upload)
const uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Prescription image/PDF is required' });
    }
 
    const prescription = await Prescription.create({
      userId: req.user._id,
      image: `/uploads/${req.file.filename}`,
      status: 'pending',
    });
 
    // OCR text extraction is available on demand via POST /:id/analyze —
    // it is never run automatically and never used to auto-approve.
    // The pharmacist always makes the final approval decision.
 
    res.status(201).json({ success: true, prescription });
  } catch (error) {
    next(error);
  }
};
 
// GET /api/prescriptions  (customer's own)
const getMyPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    next(error);
  }
};
 
// GET /api/prescriptions/pending  (pharmacist/admin)
const getPendingPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ status: 'pending' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: 1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    next(error);
  }
};
 
// POST /api/prescriptions/:id/analyze  (pharmacist/admin)
// Sends the uploaded image through the Python OCR service and stores the
// extracted text on the prescription. This is a reading aid for the
// pharmacist only — it never changes the prescription's status.
const analyzePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
 
    // prescription.image is stored as "/uploads/filename.jpg" — convert
    // that to an absolute path on disk that the AI service process can read.
    const filename = path.basename(prescription.image);
    const absolutePath = path.join(__dirname, '..', 'uploads', filename);
 
    let result;
    try {
      result = await aiService.extractTextFromImage(absolutePath);
    } catch (aiError) {
      return res.status(502).json({
        success: false,
        message: 'AI service is unreachable. Make sure it is running on port 8000.',
      });
    }
 
    prescription.ocrText = result.text || '';
    await prescription.save();
 
    res.json({
      success: true,
      ocrText: prescription.ocrText,
      confidence: result.confidence,
      message: result.message || null, // present when confidence is low
    });
  } catch (error) {
    next(error);
  }
};
 
// PUT /api/prescriptions/:id/review  { status, notes }  (pharmacist/admin)
const reviewPrescription = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
 
    if (!['approved', 'rejected', 'clarification_required'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
 
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status, notes, pharmacistId: req.user._id, reviewedAt: new Date() },
      { new: true },
    );
 
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
 
    res.json({ success: true, prescription });
  } catch (error) {
    next(error);
  }
};
 
module.exports = {
  uploadPrescription,
  getMyPrescriptions,
  getPendingPrescriptions,
  analyzePrescription,
  reviewPrescription,
};
 
