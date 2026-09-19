import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';
import './Analytics.css';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [forecast, setForecast] = useState(null);
  const [forecasting, setForecasting] = useState(false);
  const [forecastError, setForecastError] = useState('');

  useEffect(() => {
    const fetchInitial = async () => {
      const [statsRes, medsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/medicines', { params: { limit: 100 } }),
      ]);
      setStats(statsRes.data.stats);
      setMedicines(medsRes.data.medicines);
      setLoading(false);
    };
    fetchInitial();
  }, []);

  const handleForecast = async () => {
    if (!selectedMedicine) return;
    setForecasting(true);
    setForecastError('');
    setForecast(null);
    try {
      const { data } = await api.get(`/admin/analytics/forecast/${selectedMedicine}`);
      setForecast(data);
    } catch (err) {
      setForecastError(err.response?.data?.message || 'Could not generate a forecast.');
    } finally {
      setForecasting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  return (
    <div className="container dashboard-page">
      <h1 className="section-title">Analytics</h1>
      <p className="section-subtitle">High-level platform snapshot and AI-assisted demand forecasting.</p>

      <div className="stats-grid">
        <div className="stat-card card"><BarChart3 size={22} /><div><span className="stat-value">₹{stats.revenue}</span><span className="stat-label">Total Revenue</span></div></div>
        <div className="stat-card card"><BarChart3 size={22} /><div><span className="stat-value">{stats.totalOrders}</span><span className="stat-label">Total Orders</span></div></div>
        <div className="stat-card card"><BarChart3 size={22} /><div><span className="stat-value">{stats.medicines}</span><span className="stat-label">Active Medicines</span></div></div>
        <div className="stat-card card"><BarChart3 size={22} /><div><span className="stat-value">{stats.pendingPrescriptions}</span><span className="stat-label">Pending Reviews</span></div></div>
      </div>

      <div className="card forecast-panel">
        <h3><TrendingUp size={18} /> AI Demand Forecast</h3>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-md)' }}>
          Select a medicine to see an estimated demand for the next period, based on real order
          history. This is an estimate, not a guarantee — use it as one input among others.
        </p>

        <div className="forecast-controls">
          <select value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)}>
            <option value="">-- Select a medicine --</option>
            {medicines.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" disabled={!selectedMedicine || forecasting} onClick={handleForecast}>
            {forecasting ? 'Forecasting...' : 'Generate Forecast'}
          </button>
        </div>

        {forecastError && <div className="auth-error">{forecastError}</div>}

        {forecast && (
          <div className="forecast-result">
            <div className="forecast-stat">
              <span className="forecast-label">Current Stock</span>
              <span className="forecast-value">{forecast.currentStock}</span>
            </div>
            <div className="forecast-stat">
              <span className="forecast-label">Predicted Demand</span>
              <span className="forecast-value">{forecast.predictedDemand}</span>
            </div>
            <div className="forecast-stat">
              <span className="forecast-label">Recommendation</span>
              <span className={`badge ${forecast.recommendation === 'Reorder Recommended' ? 'badge-danger' : 'badge-success'}`}>
                {forecast.recommendation}
              </span>
            </div>
            <p className="forecast-note">
              Based on {forecast.monthsOfHistory} month(s) of order history. {forecast.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;