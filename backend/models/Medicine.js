const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    genericName: { type: String, required: true, trim: true },
    brandName: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' },
    uses: { type: String, default: '' },
    dosageForm: { type: String, default: '' },
    strength: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    minimumStock: { type: Number, default: 10 },
    expiryDate: { type: Date },
    manufacturer: { type: String, default: '' },
    prescriptionRequired: { type: Boolean, default: false },
    image: { type: String, default: '' },
    generalAdministrationInformation: { type: String, default: '' },
    warnings: { type: String, default: '' },
    storageInformation: { type: String, default: '' },
  },
  { timestamps: true },
);

medicineSchema.index({ name: 'text', genericName: 'text', brandName: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);