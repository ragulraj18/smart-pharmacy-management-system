import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, ShoppingCart, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import prescriptionService from '../services/prescriptionService';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';
 
function CustomerDashboard() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, rxData] = await Promise.all([
          orderService.getMyOrders(),
          prescriptionService.getMyPrescriptions(),
        ]);
        setOrders(ordersData.orders);
        setPrescriptions(rxData.prescriptions);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;
 
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.orderStatus)).length;
 
  return (
    <div className="container dashboard-page">
      <h1 className="section-title">Welcome back, {user?.name}</h1>
      <p className="section-subtitle">Here's what's happening with your account.</p>
 
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon icon-pop-1"><Package size={22} /></div>
          <div><span className="stat-value">{orders.length}</span><span className="stat-label">Total Orders</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-5"><Clock size={22} /></div>
          <div><span className="stat-value">{activeOrders}</span><span className="stat-label">Active Orders</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-2"><FileText size={22} /></div>
          <div><span className="stat-value">{prescriptions.length}</span><span className="stat-label">Prescriptions</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-4"><ShoppingCart size={22} /></div>
          <div><span className="stat-value">{itemCount}</span><span className="stat-label">Cart Items</span></div>
        </div>
      </div>
 
      <div className="dashboard-grid">
        <div className="card dashboard-panel">
          <h3>Recent Orders</h3>
          {orders.slice(0, 5).map((o) => (
            <Link to={`/orders/${o._id}`} className="dashboard-list-row" key={o._id}>
              <span>#{o._id.slice(-8).toUpperCase()}</span>
              <span className="badge badge-secondary">{o.orderStatus.replace(/_/g, ' ')}</span>
            </Link>
          ))}
          {orders.length === 0 && <p className="dashboard-empty">No orders yet.</p>}
        </div>
 
        <div className="card dashboard-panel">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/medicines" className="btn btn-outline">Browse Medicines</Link>
            <Link to="/prescriptions/upload" className="btn btn-outline">Upload Prescription</Link>
            <Link to="/cart" className="btn btn-outline">View Cart</Link>
            <Link to="/profile" className="btn btn-outline">Edit Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default CustomerDashboard;
