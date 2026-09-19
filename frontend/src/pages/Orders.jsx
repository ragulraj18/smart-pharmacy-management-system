import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Orders.css';
 
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getMyOrders();
      setOrders(data.orders);
    } catch (err) {
      setError('Could not load your orders.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchOrders(); }, []);
 
  if (loading) return <LoadingSpinner message="Loading your orders..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrders} />;
 
  if (orders.length === 0) {
    return (
      <div className="container state-box">
        <Package size={40} />
        <h3>No orders yet</h3>
        <p>Your order history will appear here.</p>
        <Link to="/medicines" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }
 
  return (
    <div className="container orders-page">
      <h1 className="section-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <Link to={`/orders/${order._id}`} className="order-row card" key={order._id}>
            <div>
              <h4>Order #{order._id.slice(-8).toUpperCase()}</h4>
              <p className="order-row-date">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="order-row-items">{order.items.length} item(s)</div>
            <div className="order-row-total">₹{order.totalAmount}</div>
            <span className={`badge badge-${order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'danger' : 'accent'}`}>
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
 
export default Orders;
 
