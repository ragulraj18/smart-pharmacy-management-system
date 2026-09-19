import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import prescriptionService from '../services/prescriptionService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './MyPrescriptions.css';
 
const STATUS_LABEL = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  clarification_required: 'Clarification Needed',
};
 
const STATUS_CLASS = {
  pending: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-danger',
  clarification_required: 'badge-accent',
};
 
function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await prescriptionService.getMyPrescriptions();
        setPrescriptions(data.prescriptions);
      } catch (err) {
        setError('Could not load your prescriptions.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  if (loading) return <LoadingSpinner message="Loading prescriptions..." />;
  if (error) return <ErrorMessage message={error} />;
 
  if (prescriptions.length === 0) {
    return (
      <div className="container state-box">
        <FileText size={40} />
        <h3>No prescriptions uploaded</h3>
        <p>Upload a prescription to order restricted medicines.</p>
      </div>
    );
  }
 
  return (
    <div className="container my-rx-page">
      <h1 className="section-title">My Prescriptions</h1>
      <div className="rx-list">
        {prescriptions.map((rx) => (
          <div className="rx-row card" key={rx._id}>
            <FileText size={22} />
            <div className="rx-row-info">
              <p>Uploaded {new Date(rx.uploadedAt).toLocaleDateString()}</p>
              {rx.notes && <p className="rx-row-notes">Note: {rx.notes}</p>}
            </div>
            <span className={`badge ${STATUS_CLASS[rx.status]}`}>{STATUS_LABEL[rx.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
export default MyPrescriptions;
