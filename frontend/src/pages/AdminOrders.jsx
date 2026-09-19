import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminTable.css';
 
const STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
 
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const fetchData = async () => {
    setLoading(true);
    const [ordersRes, usersRes] = await Promise.all([
      api.get('/admin/orders'),
      api.get('/admin/users'),
    ]);
    setOrders(ordersRes.data.orders);
    setDeliveryStaff(usersRes.data.users.filter((u) => u.role === 'delivery'));
    setLoading(false);
  };
 
  useEffect(() => { fetchData(); }, []);
 
  const handleStatusChange = async (orderId, orderStatus) => {
    await orderService.updateOrderStatus(orderId, orderStatus);
    fetchData();
  };
 
  const handleAssign = async (orderId, deliveryPersonId) => {
    if (!deliveryPersonId) return;
    await api.put(`/admin/orders/${orderId}/assign`, { deliveryPersonId });
    fetchData();
  };
 
  if (loading) return <LoadingSpinner message="Loading orders..." />;
 
  return (
    <div className="container admin-table-page">
      <h1 className="section-title">All Orders</h1>
      <p className="section-subtitle">
        Update status to move orders toward delivery. Assign a delivery
        account once an order reaches "Ready" so it appears on their dashboard.
      </p>
 
      {deliveryStaff.length === 0 && (
        <p className="dashboard-empty" style={{ marginBottom: 'var(--space-md)' }}>
          No delivery staff accounts exist yet — register one and change its
          role to "delivery" in MongoDB Compass, the same way you created
          your pharmacist account, to enable assignment.
        </p>
      )}
 
      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Assign Delivery</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}</td>
                <td>{o.userId?.name}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    defaultValue=""
                    onChange={(e) => handleAssign(o._id, e.target.value)}
                    disabled={deliveryStaff.length === 0}
                    style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
                  >
                    <option value="">
                      {o.deliveryPerson ? 'Reassign...' : 'Assign...'}
                    </option>
                    {deliveryStaff.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </td>
                <td><Link to={`/orders/${o._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
export default AdminOrders;
