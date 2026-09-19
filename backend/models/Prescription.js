const mongoose = require('mongoose');
 
const prescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'clarification_required'],
      default: 'pending',
    },
    pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    ocrText: { type: String, default: '' },
    possibleMedicines: [{ type: String }],
    notes: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
 
module.exports = mongoose.model('Prescription', prescriptionSchema);
