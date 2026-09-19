import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminTable.css';
 
function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await api.get('/delivery/orders');
    setOrders(data.orders);
    setLoading(false);
  };
 
  useEffect(() => { fetchOrders(); }, []);
 
  const updateStatus = async (id, orderStatus) => {
    await api.put(`/delivery/orders/${id}/status`, { orderStatus });
    fetchOrders();
  };
 
  if (loading) return <LoadingSpinner message="Loading assigned orders..." />;
 
  if (orders.length === 0) {
    return (
      <div className="container state-box">
        <Truck size={40} />
        <h3>No orders assigned</h3>
        <p>Assigned deliveries will appear here.</p>
      </div>
    );
  }
 
  return (
    <div className="container admin-table-page">
      <h1 className="section-title">Delivery Dashboard</h1>
      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td><Link to={`/delivery/orders/${o._id}`}>#{o._id.slice(-8).toUpperCase()}</Link></td>
                <td>{o.userId?.name}<br /><span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{o.userId?.phone}</span></td>
                <td style={{ maxWidth: 200 }}>{o.shippingAddress}</td>
                <td><span className="badge badge-accent">{o.orderStatus.replace(/_/g, ' ')}</span></td>
                <td className="admin-table-actions">
                  {o.orderStatus === 'ready' && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => updateStatus(o._id, 'out_for_delivery')}>Start Delivery</button>
                  )}
                  {o.orderStatus === 'out_for_delivery' && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => updateStatus(o._id, 'delivered')}>Mark Delivered</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
export default DeliveryDashboard;
