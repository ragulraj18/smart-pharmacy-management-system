import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import prescriptionService from '../services/prescriptionService';
import './Checkout.css';
 
function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
 
  const [address, setAddress] = useState(user?.address || '');
  const [step, setStep] = useState('address'); // address -> payment -> confirmation
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState('');
 
  const items = cart.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;
 
  const needsPrescription = items.some((i) => i.medicineId?.prescriptionRequired);
 
  useEffect(() => {
    if (!needsPrescription) return;
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionService.getMyPrescriptions();
        setMyPrescriptions(data.prescriptions);
      } catch (err) {
        setMyPrescriptions([]);
      }
    };
    fetchPrescriptions();
  }, [needsPrescription]);
 
  const handlePlaceOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      const payload = { shippingAddress: address };
      if (needsPrescription) payload.prescriptionId = selectedPrescription;
      const data = await orderService.placeOrder(payload);
      setPlacedOrder(data.order);
      setStep('confirmation');
      refreshCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order.');
    } finally {
      setPlacing(false);
    }
  };
 
  if (step === 'confirmation' && placedOrder) {
    return (
      <div className="container checkout-page">
        <div className="confirmation-box card">
          <CheckCircle size={48} className="confirmation-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Order ID: {placedOrder._id}</p>
          <p className="confirmation-total">Total Paid: ₹{placedOrder.totalAmount}</p>
          <button className="btn btn-primary" onClick={() => navigate('/orders')}>
            View My Orders
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="container checkout-page">
      <h1 className="section-title">Checkout</h1>
 
      <div className="checkout-steps">
        <span className="checkout-step active">1. Address</span>
        <span className="checkout-step-line" />
        <span className={`checkout-step ${step === 'payment' ? 'active' : ''}`}>2. Payment</span>
        <span className="checkout-step-line" />
        <span className="checkout-step">3. Confirmation</span>
      </div>
 
      <div className="checkout-grid">
        <div className="checkout-form card">
          {step === 'address' && (
            <>
              <h3>Shipping Address</h3>
              <textarea
                rows={4}
                placeholder="Enter your full delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                className="btn btn-primary"
                disabled={!address.trim()}
                onClick={() => setStep('payment')}
              >
                Continue to Payment
              </button>
            </>
          )}
 
          {step === 'payment' && (
            <>
              <h3>Payment</h3>
              <p className="checkout-note">
                This is a mock payment step for demo purposes. A real payment
                gateway will be integrated later.
              </p>
 
              {needsPrescription && (
                <div className="checkout-rx-box">
                  <FileText size={18} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>
                      A prescription is required for one or more items in your cart.
                    </p>
                    {myPrescriptions.length === 0 ? (
                      <p className="checkout-note" style={{ marginBottom: 0 }}>
                        You haven't uploaded any prescriptions yet.{' '}
                        <Link to="/prescriptions/upload">Upload one now</Link>, then come back to checkout.
                      </p>
                    ) : (
                      <select
                        value={selectedPrescription}
                        onChange={(e) => setSelectedPrescription(e.target.value)}
                      >
                        <option value="">-- Select an uploaded prescription --</option>
                        {myPrescriptions.map((rx) => (
                          <option key={rx._id} value={rx._id}>
                            Uploaded {new Date(rx.uploadedAt).toLocaleDateString()} — {rx.status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              )}
 
              {error && <div className="auth-error">{error}</div>}
 
              <button
                className="btn btn-primary"
                disabled={placing || (needsPrescription && !selectedPrescription)}
                onClick={handlePlaceOrder}
              >
                {placing ? 'Processing order...' : `Pay ₹${total} & Place Order`}
              </button>
            </>
          )}
        </div>
 
        <div className="checkout-summary card">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div className="summary-row" key={item.medicineId._id || item.medicineId}>
              <span>{item.medicineId.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>₹{total}</span></div>
        </div>
      </div>
    </div>
  );
}
 
export default Checkout;
