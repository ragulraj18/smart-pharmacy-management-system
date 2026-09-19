import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';
 
function Cart() {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();
 
  const items = cart.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;
 
  if (!loading && items.length === 0) {
    return (
      <div className="container state-box">
        <ShoppingBag size={40} />
        <h3>Your cart is empty</h3>
        <p>Browse medicines and add items to your cart.</p>
        <Link to="/medicines" className="btn btn-primary">Explore Medicines</Link>
      </div>
    );
  }
 
  return (
    <div className="container cart-page">
      <h1 className="section-title">Your Cart</h1>
 
      <div className="cart-grid">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item card" key={item.medicineId._id || item.medicineId}>
              <img
                src={item.medicineId.image || 'https://via.placeholder.com/80'}
                alt={item.medicineId.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h4>{item.medicineId.name}</h4>
                <p>₹{item.price} each</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateItem(item.medicineId._id, Math.max(1, item.quantity - 1))}>
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItem(item.medicineId._id, item.quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <div className="cart-item-total">₹{item.price * item.quantity}</div>
              <button className="cart-item-remove" onClick={() => removeItem(item.medicineId._id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
 
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>₹{total}</span></div>
          <button className="btn btn-primary cart-checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default Cart;
 
