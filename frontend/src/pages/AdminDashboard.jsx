import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, IndianRupee, Pill, AlertTriangle, FileText } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';
 
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data.stats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
 
  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
 
  return (
    <div className="container dashboard-page">
      <h1 className="section-title">Admin Dashboard</h1>
      <p className="section-subtitle">Full overview of the platform.</p>
 
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon icon-pop-2"><Users size={22} /></div>
          <div><span className="stat-value">{stats.totalUsers}</span><span className="stat-label">Total Users</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-5"><Package size={22} /></div>
          <div><span className="stat-value">{stats.totalOrders}</span><span className="stat-label">Total Orders</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-4"><IndianRupee size={22} /></div>
          <div><span className="stat-value">₹{stats.revenue}</span><span className="stat-label">Revenue</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-1"><Pill size={22} /></div>
          <div><span className="stat-value">{stats.medicines}</span><span className="stat-label">Medicines</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-3"><AlertTriangle size={22} /></div>
          <div><span className="stat-value">{stats.lowStock}</span><span className="stat-label">Low Stock</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-6"><FileText size={22} /></div>
          <div><span className="stat-value">{stats.pendingPrescriptions}</span><span className="stat-label">Pending Rx</span></div>
        </div>
      </div>
 
      <div className="dashboard-grid">
        <div className="card dashboard-panel">
          <h3>Quick Links</h3>
          <div className="quick-actions">
            <Link to="/admin/users" className="btn btn-outline">Manage Users</Link>
            <Link to="/admin/medicines" className="btn btn-outline">Manage Medicines</Link>
            <Link to="/admin/orders" className="btn btn-outline">View Orders</Link>
            <Link to="/admin/prescriptions" className="btn btn-outline">Review Prescriptions</Link>
            <Link to="/admin/analytics" className="btn btn-outline">Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default AdminDashboard;
 
