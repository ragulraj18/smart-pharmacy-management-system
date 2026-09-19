const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');
 
// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.medicineId', 'name image price stock');
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};
 
// POST /api/cart  { medicineId, quantity }
const addToCart = async (req, res, next) => {
  try {
    const { medicineId, quantity = 1 } = req.body;
 
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
 
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });
 
    const existingItem = cart.items.find((item) => item.medicineId.toString() === medicineId);
    const requestedQty = existingItem ? existingItem.quantity + Number(quantity) : Number(quantity);
 
    if (requestedQty > medicine.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${medicine.stock} units of ${medicine.name} are available`,
      });
    }
 
    if (existingItem) {
      existingItem.quantity = requestedQty;
    } else {
      cart.items.push({ medicineId, quantity: requestedQty, price: medicine.price });
    }
 
    await cart.save();
    res.status(201).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};
 
// PUT /api/cart/:medicineId  { quantity }
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { medicineId } = req.params;
 
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    if (quantity > medicine.stock) {
      return res.status(400).json({ success: false, message: `Only ${medicine.stock} units available` });
    }
 
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
 
    const item = cart.items.find((i) => i.medicineId.toString() === medicineId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });
 
    item.quantity = quantity;
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};
 
// DELETE /api/cart/:medicineId
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
 
    cart.items = cart.items.filter((i) => i.medicineId.toString() !== req.params.medicineId);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};
 
// DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
 
module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
