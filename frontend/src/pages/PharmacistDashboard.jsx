import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, AlertTriangle, FileText, Package } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';
 
function PharmacistDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/pharmacist/dashboard');
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
      <h1 className="section-title">Pharmacist Dashboard</h1>
      <p className="section-subtitle">Manage inventory, prescriptions and orders.</p>
 
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon icon-pop-1"><Pill size={22} /></div>
          <div><span className="stat-value">{stats.totalMedicines}</span><span className="stat-label">Total Medicines</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-4"><AlertTriangle size={22} /></div>
          <div><span className="stat-value">{stats.lowStock}</span><span className="stat-label">Low Stock</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-2"><FileText size={22} /></div>
          <div><span className="stat-value">{stats.pendingPrescriptions}</span><span className="stat-label">Pending Prescriptions</span></div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon icon-pop-5"><Package size={22} /></div>
          <div><span className="stat-value">{stats.pendingOrders}</span><span className="stat-label">Pending Orders</span></div>
        </div>
      </div>
 
      <div className="dashboard-grid">
        <div className="card dashboard-panel">
          <h3>Quick Links</h3>
          <div className="quick-actions">
            <Link to="/pharmacist/prescriptions" className="btn btn-outline">Review Prescriptions</Link>
            <Link to="/pharmacist/inventory" className="btn btn-outline">Manage Inventory</Link>
            <Link to="/pharmacist/medicines" className="btn btn-outline">Manage Medicines</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default PharmacistDashboard;
