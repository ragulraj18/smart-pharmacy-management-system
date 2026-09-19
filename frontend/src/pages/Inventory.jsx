import { useState, useEffect } from 'react';
import medicineService from '../services/medicineService';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminTable.css';
 
function Inventory() {
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      const data = await medicineService.getLowStock();
      setLowStock(data.medicines);
      setLoading(false);
    };
    fetchData();
  }, []);
 
  if (loading) return <LoadingSpinner message="Loading inventory..." />;
 
  return (
    <div className="container admin-table-page">
      <h1 className="section-title">Inventory — Low Stock Alerts</h1>
      <p className="section-subtitle">Medicines at or below their minimum stock threshold.</p>
 
      {lowStock.length === 0 && <p className="dashboard-empty">All stock levels look healthy.</p>}
 
      {lowStock.length > 0 && (
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Current Stock</th><th>Minimum</th><th>Status</th></tr></thead>
            <tbody>
              {lowStock.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td className="low-stock-cell">{m.stock}</td>
                  <td>{m.minimumStock}</td>
                  <td><span className="badge badge-danger">Reorder Recommended</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
 
export default Inventory;
