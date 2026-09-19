import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wifi, WifiOff } from 'lucide-react';
import orderService from '../services/orderService';
import { useSocket } from '../context/SocketContext';
import OrderStatus from '../components/OrderStatus';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './OrderDetails.css';

function OrderDetails() {
  const { id } = useParams();
  const { socket, connected } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data.order);
      } catch (err) {
        setError('Could not load this order.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Join a room for this specific order and listen for live status pushes
  // from Node whenever a pharmacist/admin/delivery account updates it —
  // the page updates instantly, no refresh needed.
  useEffect(() => {
    if (!socket) return;

    socket.emit('order:subscribe', id);

    const handleUpdate = (payload) => {
      if (payload.orderId !== id) return;
      setOrder((prev) => (prev ? { ...prev, orderStatus: payload.orderStatus } : prev));
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);
    };

    socket.on('order:statusUpdate', handleUpdate);
    return () => socket.off('order:statusUpdate', handleUpdate);
  }, [socket, id]);

  if (loading) return <LoadingSpinner message="Loading order..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  return (
    <div className="container order-details-page">
      <div className="order-details-header-row">
        <h1 className="section-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`live-indicator ${connected ? 'live' : 'offline'}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? 'Live' : 'Offline'}
        </span>
      </div>

      {justUpdated && <div className="order-live-banner">Status just updated in real time.</div>}

      <div className="card order-timeline-card">
        <OrderStatus status={order.orderStatus} />
      </div>

      <div className="order-details-grid">
        <div className="card order-items-card">
          <h3>Items</h3>
          {order.items.map((item) => (
            <div className="order-line-item" key={item.medicineId}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="order-line-item order-line-total">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="card order-meta-card">
          <h3>Delivery Details</h3>
          <p><strong>Address:</strong> {order.shippingAddress}</p>
          <p><strong>Payment:</strong> {order.paymentStatus}</p>
          <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;