const mongoose = require('mongoose');
 
const orderItemSchema = new mongoose.Schema(
  {
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);
 
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: { type: String, required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 40 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', default: null },
    deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);
 
module.exports = mongoose.model('Order', orderSchema);
 
